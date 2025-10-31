import { useState, useRef, useEffect } from "react";
import { Minimize2, Edit, Copy, MoreHorizontal, ArrowUp, FileText, Briefcase, DollarSign, FileCheck, Sparkles, Upload, File } from "lucide-react";
import { pdfjs } from 'react-pdf';

// Configure PDF.js worker to use local version
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

export function ChatArea({ messages, onSendMessage }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIsProcessingResume(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }

        // Send resume content to chatbot for analysis
        const resumeMessage = `Please analyze this resume and provide detailed feedback and improvement suggestions:\n\n${fullText}`;
        onSendMessage(resumeMessage);
        setUploadedResume(file.name);
      } catch (error) {
        console.error('Error parsing PDF:', error);
        onSendMessage("Sorry, I couldn't process your resume. Please make sure it's a valid PDF file.");
      } finally {
        setIsProcessingResume(false);
      }
    } else {
      onSendMessage("Please upload a valid PDF file.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const quickActions = [
    { icon: FileText, label: "Resume Help", color: "from-red-500 to-pink-500", iconColor: "text-red-300" },
    { icon: Briefcase, label: "Find Jobs", color: "from-blue-500 to-cyan-500", iconColor: "text-blue-300" },
    { icon: DollarSign, label: "Salary Info", color: "from-green-500 to-emerald-500", iconColor: "text-green-300" },
    { icon: FileCheck, label: "Interview Prep", color: "from-purple-500 to-pink-500", iconColor: "text-purple-300" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-white">AI Assistant</h2>
          <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">Online</span>
        </div>
        <button className="hover:bg-white/10 p-2 rounded-xl transition-all duration-300 text-gray-400 hover:text-white">
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.filter(msg => msg.content !== 'typing').map((message, index) => (
          <div
            key={message.id}
            className={`animate-in slide-in-from-bottom-4 duration-300 ${
              message.type === 'bot' ? '' : 'animate-in slide-in-from-right-4'
            }`}
          >
            {message.type === 'bot' ? (
              <div className="flex gap-4">
                <div className="w-10 h-10 flex-shrink-0 border-2 border-purple-500/50 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Grab It AI</span>
                    <div className="mt-2 text-gray-200 whitespace-pre-line leading-relaxed">{message.content}</div>
                  </div>

                  {index === 0 && (
                    <div className="mt-6 grid grid-cols-4 gap-3 animate-in fade-in-0 duration-500 delay-200">
                      {quickActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSendMessage(`Tell me about ${action.label.toLowerCase()}`)}
                          className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/10 hover:border-white/20 hover:scale-105 hover:-translate-y-1"
                        >
                          <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                            <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                          </div>
                          <span className="text-sm text-center text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button className="hover:bg-white/10 p-2 rounded-lg transition-all duration-300 h-fit">
                    <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                  <button className="hover:bg-white/10 p-2 rounded-lg transition-all duration-300 h-fit">
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                  <button className="hover:bg-white/10 p-2 rounded-lg transition-all duration-300 h-fit">
                    <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 justify-end">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-5 py-3 max-w-[70%] shadow-lg">
                  <p className="text-white">{message.content}</p>
                </div>
                <div className="w-10 h-10 flex-shrink-0 border-2 border-blue-500/50 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="w-10 h-10 flex-shrink-0 border-2 border-purple-500/50 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/5 rounded-2xl px-5 py-3 border border-white/10">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10">
        {/* Resume Upload Section */}
        {uploadedResume && (
          <div className="mb-4 flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <File className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm">Resume uploaded: {uploadedResume}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about jobs..."
            className="w-full bg-white/5 backdrop-blur-xl text-white placeholder-gray-400 rounded-2xl px-6 py-4 pr-24 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 border border-white/10 focus:border-blue-500/50"
          />

          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isProcessingResume}
            className="absolute right-14 top-1/2 -translate-y-1/2 rounded-xl bg-white/10 hover:bg-white/20 w-10 h-10 shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload Resume PDF"
          >
            {isProcessingResume ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-5 h-5 text-gray-300" />
            )}
          </button>

          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-10 h-10 shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim()}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Grab It AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
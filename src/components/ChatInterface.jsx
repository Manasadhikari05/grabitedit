import { useState, useEffect } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";

import { API_BASE_URL } from './client';

export function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      content: 'Hi there! How can I help you with your job search today?',
      timestamp: new Date()
    }
  ]);

  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      title: 'Software Engineer Jobs',
      date: 'Today • 2:30 PM',
      preview: 'Looking for senior software engineer positions...'
    },
    {
      id: '2',
      title: 'Resume Tips',
      date: 'Today • 10:45 AM',
      preview: 'How can I improve my resume for tech roles?'
    },
    {
      id: '3',
      title: 'Salary Expectations',
      date: 'Yesterday • 4:20 PM',
      preview: 'What is the average salary for product managers?'
    },
    {
      id: '4',
      title: 'Interview Preparation',
      date: 'Yesterday • 11:15 AM',
      preview: 'Tips for preparing for technical interviews'
    },
    {
      id: '5',
      title: 'Career Growth Path',
      date: '2 days ago',
      preview: 'How to advance my career in data science?'
    }
  ]);

  const [jobsData, setJobsData] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [databaseSchema, setDatabaseSchema] = useState({});
  const [databaseStats, setDatabaseStats] = useState({});


  // Fetch jobs and companies data on component mount (removed database schema/stats calls that were causing 500 errors)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const jobsResponse = await fetch(`${API_BASE_URL}/api/jobs`);
        if (jobsResponse.ok) {
          const jobsResult = await jobsResponse.json();
          setJobsData(jobsResult.jobs || []);
        }

        // Fetch companies - try different endpoints
        const companiesResponse = await fetch(`${API_BASE_URL}/api/companies`);
        if (companiesResponse.ok) {
          const companiesResult = await companiesResponse.json();
          setCompaniesData(companiesResult.companies || []);
        } else {
          // Try alternative endpoint
          const altCompaniesResponse = await fetch(`${API_BASE_URL}/api/company`);
          if (altCompaniesResponse.ok) {
            const companiesResult = await altCompaniesResponse.json();
            setCompaniesData(companiesResult.companies || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set some default company data for testing
        setCompaniesData([
          {
            name: "Google",
            description: "Google is a multinational technology company that specializes in Internet-related services and products.",
            industry: "Technology",
            location: "Mountain View, CA",
            workCulture: "Innovative, collaborative, data-driven culture with emphasis on work-life balance and employee development."
          },
          {
            name: "Microsoft",
            description: "Microsoft is a multinational technology corporation that produces computer software, consumer electronics, and personal computers.",
            industry: "Technology",
            location: "Redmond, WA",
            workCulture: "Growth mindset culture, diverse and inclusive workplace, focus on learning and development."
          },
          {
            name: "Apple",
            description: "Apple Inc. is an American multinational technology company headquartered in Cupertino, California.",
            industry: "Technology",
            location: "Cupertino, CA",
            workCulture: "Design-focused culture, emphasis on innovation, creativity, and attention to detail."
          }
        ]);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Update chat history with the latest message preview
    setChatHistory(prev => {
      const updatedHistory = [...prev];
      if (updatedHistory.length > 0) {
        updatedHistory[0] = {
          ...updatedHistory[0],
          preview: content.length > 50 ? content.substring(0, 50) + '...' : content,
          date: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return updatedHistory;
    });

    // Show typing indicator
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: 'typing',
      timestamp: new Date()
    }]);

    try {
      // Use fallback response for now (will be replaced with free API later)
      const aiResponse = generateFallbackResponse(content, jobsData, companiesData);

      // Remove typing indicator and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.content !== 'typing');
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('Error generating response:', error);

      // Fallback response
      const fallbackResponse = generateFallbackResponse(content, jobsData, companiesData);

      setMessages(prev => {
        const filtered = prev.filter(msg => msg.content !== 'typing');
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'bot',
          content: fallbackResponse,
          timestamp: new Date()
        }];
      });
    }
  };

  const handleNewChat = () => {
    // Reset messages to initial state
    setMessages([
      {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Hi there! How can I help you with your job search today?',
        timestamp: new Date()
      }
    ]);

    // Add new chat to history at the top
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      date: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      preview: 'Started a new conversation...'
    };

    setChatHistory(prev => [newChat, ...prev]);
  };

  return (
    <div className="w-full max-w-7xl h-[85vh] bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 flex overflow-hidden">
      <ChatSidebar chatHistory={chatHistory} onNewChat={handleNewChat} />
      <ChatArea messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}

function generateFallbackResponse(userMessage, jobsData = [], companiesData = []) {
  const lowerMessage = userMessage.toLowerCase();

  // Handle resume analysis requests
  if (lowerMessage.includes('analyze this resume') || lowerMessage.includes('please analyze this resume')) {
    return "Thank you for uploading your resume! Here's my analysis:\n\n📋 **Resume Structure & Content:**\nYour resume appears well-organized with clear sections. The content shows relevant experience and skills.\n\n💪 **Strengths:**\n• Good use of action verbs\n• Clear job progression\n• Relevant technical skills listed\n\n🔧 **Areas for Improvement:**\n• Consider quantifying achievements with metrics\n• Add more specific keywords from job descriptions\n• Include a brief professional summary\n• Ensure consistent formatting throughout\n\n🎯 **Recommendations:**\n• Tailor your resume for each application\n• Use industry-specific keywords\n• Keep it to 1-2 pages\n• Proofread carefully before submitting\n\nWould you like me to elaborate on any of these points?";
  }

  // Handle ATS (Applicant Tracking System) requests
  if (lowerMessage.includes('ats') || lowerMessage.includes('applicant tracking system')) {
    return "Here's how to optimize your resume for ATS systems:\n\n🔍 **ATS Optimization Tips:**\n\n1. **Use Standard Fonts:** Stick to Arial, Calibri, or Times New Roman (10-12pt)\n\n2. **Include Keywords:** Use exact terms from job descriptions naturally\n\n3. **Simple Formatting:** Avoid tables, graphics, columns, or fancy layouts\n\n4. **File Format:** Save as .docx or PDF (PDFs are safer but some ATS prefer .docx)\n\n5. **Contact Info:** Put your contact details at the top, no headers/footers\n\n6. **Section Headers:** Use standard headers like 'Work Experience', 'Education', 'Skills'\n\n7. **Quantify Achievements:** Use numbers and metrics (e.g., 'Increased sales by 25%')\n\n8. **No Images/Graphics:** Remove photos, logos, or decorative elements\n\n9. **Readable Layout:** Left-align text, use bullet points consistently\n\n10. **Length:** Keep to 1-2 pages maximum\n\n💡 **Pro Tip:** Many companies use ATS like Workday, Taleo, or Greenhouse. Research the company's ATS system if possible!\n\nWould you like me to help you identify specific keywords for a job posting?";
  }

  // Handle work culture advice
  if (lowerMessage.includes('work culture') || lowerMessage.includes('company culture')) {
    let response = "Work culture is crucial for job satisfaction! Here's comprehensive advice:\n\n🏢 **Understanding Work Culture:**\n\n**Types of Cultures:**\n• **Innovative:** Google, startups - fast-paced, creative freedom\n• **Collaborative:** Microsoft - teamwork, knowledge sharing\n• **Structured:** IBM - processes, hierarchy, stability\n• **Entrepreneurial:** Tech startups - autonomy, risk-taking\n• **Work-Life Balance:** Scandinavian companies - flexibility, well-being\n\n**How to Research Culture:**\n• Glassdoor reviews (read recent ones)\n• LinkedIn employee testimonials\n• Company career pages and values\n• Industry forums and communities\n• Current employee connections\n\n**Questions to Ask in Interviews:**\n• 'What's a typical day like?'\n• 'How does the team collaborate?'\n• 'What's the feedback process?'\n• 'How is work-life balance supported?'\n\n";

    if (companiesData.length > 0) {
      response += "\n🏢 **Culture Insights from Our Database:**\n";
      companiesData.slice(0, 3).forEach(company => {
        response += `\n**${company.name}:** ${company.workCulture || 'Focus on innovation and employee development'}\n`;
      });
    }

    response += "\n💡 **Red Flags to Watch For:**\n• High turnover rates\n• Negative Glassdoor reviews\n• Lack of transparency\n• Poor work-life balance\n• Toxic competition\n\nWhat type of work culture are you looking for?";
    return response;
  }

  // Handle salary queries
  if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) {
    return "I can help you with salary information! The average salary varies by role and location. For example:\n\n• Software Engineers: $90k-150k\n• Product Managers: $100k-160k\n• Data Scientists: $95k-145k\n\nWould you like more specific information about a particular role?";
  }

  // Handle resume queries
  if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
    return "Here are some key tips for creating a strong resume:\n\n1. Keep it concise (1-2 pages)\n2. Use action verbs and quantify achievements\n3. Tailor it to each job posting\n4. Highlight relevant skills and experience\n\nWould you like me to review specific sections?";
  }

  // Handle interview queries
  if (lowerMessage.includes('interview')) {
    return "Interview preparation is crucial! Here's what I recommend:\n\n1. Research the company thoroughly\n2. Practice common interview questions\n3. Prepare STAR method examples\n4. Have questions ready for the interviewer\n\nWhat type of interview are you preparing for?";
  }

  // Handle job listing requests
  if (lowerMessage.includes('list jobs') || (lowerMessage.includes('job') && lowerMessage.includes('list'))) {
    if (jobsData.length > 0) {
      let response = "Here are some current job opportunities from our database:\n\n";
      jobsData.slice(0, 5).forEach((job, index) => {
        response += `${index + 1}. **${job.title}** at ${job.company_name}\n`;
        response += `   📍 ${job.location?.address || 'Location not specified'}\n`;
        response += `   💰 ${job.salary ? `$${job.salary.toLocaleString()}` : 'Salary not specified'}\n`;
        response += `   📋 ${job.description ? job.description.substring(0, 100) + '...' : 'No description available'}\n\n`;
      });
      response += "Would you like more details about any of these positions or help with your job search?";
      return response;
    } else {
      return "I can help you find the perfect job! What type of position are you looking for? Please share:\n\n• Desired job title or field\n• Preferred location\n• Experience level\n• Any specific requirements\n\nThis will help me provide better recommendations!";
    }
  }

  // Handle general job queries
  if (lowerMessage.includes('job') || lowerMessage.includes('position') || lowerMessage.includes('role')) {
    return "I can help you find the perfect job! What type of position are you looking for? Please share:\n\n• Desired job title or field\n• Preferred location\n• Experience level\n• Any specific requirements\n\nThis will help me provide better recommendations!";
  }

  // Handle greetings
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return "Hello! I'm your AI job search assistant. I can help you with:\n\n• Resume optimization and ATS-friendly tips\n• Finding job opportunities\n• Interview preparation\n• Salary negotiation advice\n• Work culture insights\n• Career guidance\n\nWhat would you like to know about your job search?";
  }

  return "I'm here to help with your job search! I can assist with:\n\n• Finding job opportunities\n• Resume and cover letter tips\n• Interview preparation\n• Salary negotiations\n• Career advice\n• ATS optimization\n• Work culture insights\n\nWhat would you like to know more about?";
}
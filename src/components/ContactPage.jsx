import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Mail, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-green-800">
            GrabIt
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              Find Jobs
            </Link>
            <Link
              to="/interests"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              My Interests
            </Link>
            <Link
              to="/discussions"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              Discussion
            </Link>
            <Link
              to="/contact"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors"
              >
                Login
              </Link>
            ) : (
              <ProfileDropdown user={user} onLogout={logout} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'message') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'b3e65b8f-d450-43a5-8dcb-4212f21c1155',
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          message: formData.message,
          subject: 'New Contact Form Submission - GrabIt',
          from_name: 'GrabIt Contact Form'
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          countryCode: '+1',
          message: ''
        });
        setCharCount(0);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EBF4]">
      <Navbar />

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-12 pt-24">
        {/* Two Column Layout */}
        <div className="grid grid-cols-[1fr,auto] gap-24 pt-20 pb-16">
          {/* Left Column - Contact Info */}
          <div className="max-w-[500px]">
            <h1 className="text-[#1A1A1A] mb-6" style={{ fontSize: '60px', fontWeight: 700, lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              Contact Us
            </h1>

            <p className="text-[#64748B] mb-10" style={{ fontSize: '15px', fontWeight: 400, lineHeight: '1.6' }}>
              Email, call, or complete the form to learn how<br />GrabIt can help you find your dream job.
            </p>

            <div className="space-y-3 mb-8">
              <p className="text-[#1A1A1A]" style={{ fontSize: '15px', fontWeight: 400 }}>
                support@grabit.com
              </p>
            </div>
          </div>

          {/* Right Column - Form Card */}
          <div className="w-[480px]">
            <div className="bg-white rounded-3xl shadow-sm p-10">
              <h2 className="text-[#1A1A1A] mb-2" style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Get in Touch
              </h2>
              <p className="text-[#64748B] mb-8" style={{ fontSize: '14px', fontWeight: 400 }}>
                You can reach us anytime
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    required
                    className="w-full px-4 py-3 bg-[#F8F9FA] rounded-lg border-0 placeholder:text-[#9CA3AF] text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                    style={{ fontSize: '14px', fontWeight: 400 }}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    required
                    className="w-full px-4 py-3 bg-[#F8F9FA] rounded-lg border-0 placeholder:text-[#9CA3AF] text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                    style={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-[#F8F9FA] rounded-lg border-0 placeholder:text-[#9CA3AF] text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                    style={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </div>

                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="appearance-none pl-4 pr-9 py-3 bg-[#F8F9FA] rounded-lg border-0 text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    >
                      <option>+1</option>
                      <option>+91</option>
                      <option>+44</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A] pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="flex-1 px-4 py-3 bg-[#F8F9FA] rounded-lg border-0 placeholder:text-[#9CA3AF] text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                    style={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </div>

                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    rows={3}
                    maxLength={120}
                    required
                    className="w-full px-4 py-3 bg-[#F8F9FA] rounded-lg border-0 placeholder:text-[#9CA3AF] text-[#1A1A1A] resize-none outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                    style={{ fontSize: '14px', fontWeight: 400 }}
                  ></textarea>
                  <span className="absolute bottom-3 right-4 text-[#9CA3AF]" style={{ fontSize: '12px', fontWeight: 400 }}>
                    {charCount}/120
                  </span>
                </div>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Failed to send message. Please try again.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#4F46E5] text-white rounded-full hover:bg-[#4338CA] transition-colors mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>

                <p className="text-center text-[#9CA3AF] pt-1" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '1.5' }}>
                  By contacting us, you agree to our{' '}
                  <a href="#" className="text-[#1A1A1A]">Terms of service</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#1A1A1A]">Privacy Policy</a>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Two Column Info Section */}
        <div className="grid grid-cols-2 gap-12 pt-8 pb-20 max-w-[880px]">
          <div>
            <h3 className="text-[#1A1A1A] mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>
              Feedback and Suggestions
            </h3>
            <p className="text-[#64748B]" style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.6' }}>
              We value your feedback and are continuously working to improve GrabIt. Your input is crucial in shaping the future of our platform.
            </p>
          </div>

          <div>
            <h3 className="text-[#1A1A1A] mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>
              Business Inquiries
            </h3>
            <p className="text-[#64748B]" style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.6' }}>
              For business partnerships or employer inquiries, please contact us at business@grabit.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Global error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.log('🔧 Unhandled promise rejection detected:', event.reason);
  
  // Check if it's a browser extension error
  if (event.reason && event.reason.message && event.reason.message.includes('message channel closed')) {
    console.log('✅ Browser extension error suppressed');
    event.preventDefault(); // Prevent the error from being displayed
    return;
  }
  
  // Log other unhandled promise rejections for debugging
  console.warn('⚠️ Unhandled promise rejection:', event.reason);
});

import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { User, LogOut, Settings, Briefcase, FileText } from "lucide-react";
import Spline from '@splinetool/react-spline';
import ProfileDropdown from "./components/ProfileDropdown";
import ErrorBoundary from "./components/ErrorBoundary";

// Import components
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { JobSearchPage } from "./components/JobSearchPage";
import { MyInterestsPage } from "./components/MyInterestsPage";
import { UserProfile } from "./components/UserProfile";
import { MyProfile } from "./components/ui/MyProfile";
import { AdminLoginPage } from "./components/AdminLoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { DiscussionsPage } from "./components/DiscussionsPage";
import ContactPage from "./components/ContactPage";
import { Toaster } from "./components/ui/sonner";
import { ChatbotButton } from "./components/ChatbotButton";

// Navbar Component
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthChecked(true);
    };

    checkAuth();

    // Listen for storage changes to update auth state
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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

// SplinePlaceholder component for 3D scene placeholders
const SplinePlaceholder = ({ sceneUrl }) => {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">🎨</span>
        </div>
        <p className="text-gray-600 font-medium">3D Scene Placeholder</p>
        <p className="text-gray-400 text-sm mt-1">Spline Scene: {sceneUrl.split('/').pop()}</p>
      </div>
    </div>
  );
};

// Spline component for 3D scenes
const SplineComponent = ({ sceneUrl }) => {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden relative">
      <Spline
        scene={sceneUrl}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab'
        }}
        onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
        onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .spline-viewer .spline-watermark,
          .spline-viewer .spline-attribution,
          [class*="watermark"],
          [class*="attribution"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          .spline-viewer {
            touch-action: none;
          }
          .spline-viewer canvas {
            touch-action: none;
          }
        `
      }} />
    </div>
  );
};

// HomePage Component
const HomePage = () => {
  const features = [
    {
      icon: "🚀",
      title: "Amplify Insights",
      description: "Unlock data-driven decisions with comprehensive analytics, revealing key opportunities for strategic regional growth."
    },
    {
      icon: "🌍",
      title: "Control Your Global Presence",
      description: "Manage and track satellite offices, ensuring consistent performance and streamlined operations everywhere."
    },
    {
      icon: "💬",
      title: "Remove Language Barriers",
      description: "Adapt to diverse markets with built-in localization for clear communication and enhanced user experience."
    },
    {
      icon: "📈",
      title: "Visualize Growth",
      description: "Generate precise, visually compelling reports that illustrate your growth trajectories across all regions."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Full Height 3D Background */}
      <section className="relative h-screen overflow-hidden">
        {/* First 3D Scene - Full Height Hero Background */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center px-8">
          <div className="w-full max-w-6xl rounded-3xl overflow-hidden">
            <Spline
              scene="https://prod.spline.design/JUp2y4PLjaGwH-Qh/scene.splinecode"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.3)',
                transformOrigin: 'center'
              }}
            />
          </div>
        </div>

        {/* Hero Content Overlay - Centered on Spline Element */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10 px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl font-serif text-white text-center leading-tight drop-shadow-2xl max-w-4xl"
          >
            Browse a perfect job for you.
          </motion.h1>
        </div>
      </section>


      {/* Trusted by Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Join Thousands of Successful Job Seekers
          </motion.h2>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex items-center space-x-16"
              animate={{ x: [0, -1920] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Company Logos - duplicated multiple times for seamless infinite loop */}
              {[
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
                "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
              ].concat([
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
                "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
              ]).concat([
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
                "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
              ]).concat([
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
                "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
              ]).map((logoUrl, index) => {
                const companyNames = [
                  "Apple", "Google", "Microsoft", "Amazon", "Netflix", "Spotify"
                ];
                const companyName = companyNames[index % companyNames.length];
                return (
                  <motion.div
                    key={index}
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={logoUrl}
                      alt={`${companyName} Logo`}
                      className="h-12 w-auto max-w-[120px] object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        // Fallback to company initial if logo fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg items-center justify-center text-white font-bold text-lg shadow-lg hidden">
                      {companyName.charAt(0)}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Growth & Features Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-6xl lg:text-8xl font-playfair font-bold text-black tracking-tight mb-8 mt-4"
            >
              We've cracked the code.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg font-inter font-normal text-gray-500 max-w-3xl leading-relaxed"
            >
              Focus on the metrics that matter most to your hiring decisions.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8 mt-16">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Smart Career Insights",
                description: "Leverage AI-powered analytics to uncover trending roles, in-demand skills, and personalized job recommendations."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Empower Your Hiring Decisions",
                description: "Track application metrics and hiring performance to make data-driven recruitment choices."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Global Talent Reach",
                description: "Connect with opportunities and candidates across regions with smart filtering and multilingual access."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Visualize Career Trends",
                description: "Access interactive dashboards that showcase hiring patterns, salary trends, and growth projections."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-left"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-inter font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-base font-inter font-normal text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Second 3D Scene - Full Width */}
          <section className="py-20">
            <div className="w-full">
              <SplineComponent sceneUrl="https://prod.spline.design/B1S0bbeH3HiopcGa/scene.splinecode" />
            </div>
          </section>

          {/* New Section - See the Bigger Picture */}
          <section className="py-48 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-6xl lg:text-8xl font-playfair font-bold text-black tracking-tight mb-8 mt-4"
                >
                  See the Bigger Picture
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg font-inter font-normal text-gray-500 max-w-3xl mx-auto leading-relaxed"
                >
                  Discover insights that illuminate the path from data to decisions across your entire workflow.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    {
                      icon: (
                        <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      ),
                      title: "Career Landscape Overview",
                      description: "Get a complete view of opportunities, industries, and hiring trends."
                    },
                    {
                      icon: (
                        <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      title: "Informed Application Choices",
                      description: "Leverage data on roles, companies, and skill demands to make smarter career moves."
                    },
                    {
                      icon: (
                        <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      title: "Future-Ready Career Planning",
                      description: "Anticipate emerging job trends and prepare your skills for tomorrow's opportunities."
                    },
                    {
                      icon: (
                        <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      ),
                      title: "Integrated Talent Insights",
                      description: "Combine job postings, candidate profiles, and market data into one cohesive view."
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-left"
                    >
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-inter font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-base font-inter font-normal text-gray-500 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Right Column - Spline Element */}
                <div className="bg-purple-50 rounded-3xl p-8 h-full min-h-[500px] relative overflow-hidden">
                  <Spline scene="https://prod.spline.design/VbuqW58nrfDnsNJu/scene.splinecode" style={{ position: 'absolute', bottom: '-3rem', left: '50%', transform: 'translateX(-50%)', width: '120%', height: '120%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Spline Element */}
                <div className="bg-amber-50 rounded-3xl p-8 h-full min-h-[500px] relative overflow-hidden">
                  <Spline
                    scene="https://prod.spline.design/WQUCSNRXV9-Rdypc/scene.splinecode"
                    style={{
                      position: 'absolute',
                      bottom: '-2rem',
                      left: '50%',
                      transform: 'translateX(-50%) scale(1.5)',
                      width: '120%',
                      height: '120%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Right Column - Quote and Attribution */}
                <div className="flex flex-col justify-center">
                  <blockquote className="text-4xl font-playfair font-normal text-black leading-relaxed mb-8">
                    "True technology begins with understanding people. We design and develop with empathy to simplify lives, enhance experiences, and bridge the gap between human needs and digital innovation — because great technology doesn't replace humanity; it amplifies it."
                  </blockquote>

                </div>
              </div>
            </div>
          </section>


          {/* Footer */}
          <footer className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              {/* Footer Bottom */}
              <div className="flex justify-between items-center py-8">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">© GrabIt. 2025</span>
                </div>
                <div className="text-gray-500 text-sm">
                  All Rights Reserved
                </div>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication on app load and route changes
  useEffect(() => {
    const checkAuth = () => {
      const userToken = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");

      setIsUserAuthenticated(!!userToken);
      setIsAdminAuthenticated(!!adminToken);
      setAuthChecked(true);
    };

    // Check immediately on mount
    checkAuth();

    // Listen for storage changes (in case of logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'adminToken' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    // Don't redirect until we've checked authentication status
    if (!authChecked) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    if (!isUserAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onSwitchToSignUp={() => { window.location.href = "/signup"; }} onLogin={() => { setIsUserAuthenticated(true); window.location.href = "/jobs"; }} />} />
        <Route path="/signup" element={<SignUpPage onSwitchToLogin={() => { window.location.href = "/login"; }} />} />
        <Route path="/jobs" element={<ProtectedRoute><JobSearchPage /></ProtectedRoute>} />
        <Route path="/interests" element={<ProtectedRoute><MyInterestsPage /></ProtectedRoute>} />
        <Route path="/discussions" element={<ProtectedRoute><DiscussionsPage /></ProtectedRoute>} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />

        <Route
          path="/supersecret-admin"
          element={
            isAdminAuthenticated ? (
              <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} />
            ) : (
              <AdminLoginPage onLoginSuccess={() => setIsAdminAuthenticated(true)} />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
      <ChatbotButton />
    </ErrorBoundary>
  );
}

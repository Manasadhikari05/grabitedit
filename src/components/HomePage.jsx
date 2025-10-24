import { memo, useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const HomePage = memo(function HomePage({ onLoginClick, onSignUpClick, onNavigateToBlog }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isAuthenticated ? `Welcome Back, ${user?.name}! 👋` : "Welcome to GrabIt! 👋"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {isAuthenticated ? "Ready to find your dream job?" : "Connect with top companies and find your perfect career match."}
                </p>
              </div>

              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4"
                >
                  {(() => {
                    const avatar = createAvatar(lorelei, {
                      seed: user?.name || 'default',
                      size: 60,
                    });
                    const avatarDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
                    return (
                      <img
                        src={avatarDataUri}
                        alt={`${user?.name || "User"} avatar`}
                        className="w-15 h-15 rounded-full shadow-lg border-2 border-white"
                      />
                    );
                  })()}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{user?.name || "Mansi"}</p>
                    <p className="text-sm text-gray-600">{user?.role || "User"}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </header>

          {isAuthenticated ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Jobs</h3>
                <p className="text-gray-600 mb-4">Browse through thousands of job opportunities from top companies.</p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">My Profile</h3>
                <p className="text-gray-600 mb-4">Update your profile, skills, and preferences to get better job matches.</p>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Profile →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">My Applications</h3>
                <p className="text-gray-600 mb-4">Track your job applications and see their status.</p>
                <Link
                  to="/applications"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Applications →
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  True technology begins with understanding people. We design and develop with empathy to simplify lives, enhance experiences, and bridge the gap between human needs and digital innovation — because great technology doesn't replace humanity; it amplifies it.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={onSignUpClick}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sign Up Free
                  </button>
                  <button
                    onClick={onLoginClick}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

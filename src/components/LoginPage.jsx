import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { motion } from "framer-motion";
import { Check, Lock, Cloud } from "lucide-react";
import { Navbar } from "./Navbar";

export function LoginPage({
  onSwitchToSignUp,
  onLogin
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("user@grabit.com");
  const [password, setPassword] = useState("123456");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsLoading(false);
      if (onLogin) onLogin();
      navigate('/');
    } catch (err) {
      setIsLoading(false);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <Navbar />
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-2 h-2 bg-purple-600 rounded-full" />
            <span className="text-gray-900">GrabIt</span>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-gray-900 mb-3">
              Holla,<br />Welcome Back
            </h1>
            <p className="text-gray-400">
              Hey, welcome back to your special place
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white border-gray-200 rounded-lg"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white border-gray-200 rounded-lg"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-between pt-1"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  className="border-gray-300"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-600 transition-colors"
              >
                Forgot Password?
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-2"
            >
              <Button
                type="submit"
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Signing in...
                  </motion.div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center mt-8 text-gray-500"
          >
            Don't have an account?{" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                onSwitchToSignUp();
              }}
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Sign Up
            </button>
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600">
          {/* Animated clouds */}
          <motion.div
            className="absolute top-12 left-12 w-32 h-16"
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="w-full h-full text-white/30 fill-white/30" />
          </motion.div>
          
          <motion.div
            className="absolute top-32 right-24 w-40 h-20"
            animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="w-full h-full text-white/40 fill-white/40" />
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-20 w-36 h-18"
            animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="w-full h-full text-white/35 fill-white/35" />
          </motion.div>

          <motion.div
            className="absolute bottom-32 right-16 w-44 h-22"
            animate={{ x: [0, -20, 0], y: [0, 12, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="w-full h-full text-white/30 fill-white/30" />
          </motion.div>

          {/* Checkmark icon */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          >
            <Check className="w-10 h-10 text-purple-600" strokeWidth={3} />
          </motion.div>

          {/* Lock icon */}
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/90 rounded-2xl flex items-center justify-center shadow-xl transform rotate-12"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
          >
            <Lock className="w-12 h-12 text-purple-600" strokeWidth={2.5} />
          </motion.div>

          {/* Center illustration area */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Phone mockup */}
            <div className="relative">
              <motion.div
                className="w-64 h-[500px] bg-gradient-to-br from-purple-700 to-pink-500 rounded-[3rem] shadow-2xl p-6 relative overflow-hidden"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Phone notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-purple-900/50 rounded-full" />
                
                {/* Phone content */}
                <div className="mt-12 flex flex-col items-center justify-center h-full">
                  {/* Fingerprint icon */}
                  <motion.div
                    className="relative"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-20 h-20 text-white"
                      >
                        <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                        <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                        <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                        <path d="M2 12a10 10 0 0 1 18-6" />
                        <path d="M2 16h.01" />
                        <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                        <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                        <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                        <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                      </svg>
                    </div>
                  </motion.div>
                  
                  <p className="text-white/80 mt-6 text-center px-4">
                    Tap to scan your finger
                  </p>
                </div>

                {/* Decorative circles */}
                <motion.div
                  className="absolute top-1/4 right-4 w-16 h-16 rounded-full border-4 border-white/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-1/4 left-4 w-12 h-12 rounded-full border-4 border-white/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
              </motion.div>

              {/* Person illustration - simplified */}
              <motion.div
                className="absolute -bottom-12 -left-24 w-32 h-32"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Simple person shape */}
                <div className="relative">
                  {/* Head */}
                  <div className="w-16 h-16 bg-amber-100 rounded-full absolute top-0 left-8 border-4 border-purple-900/20" />
                  {/* Body - yellow jacket */}
                  <div className="w-24 h-32 bg-yellow-500 absolute top-12 left-4 rounded-t-3xl" />
                  {/* Pants */}
                  <div className="w-24 h-20 bg-gray-100 absolute top-40 left-4 rounded-b-2xl" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

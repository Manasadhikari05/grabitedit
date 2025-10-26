import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { motion } from "motion/react";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Star, Heart, Cloud } from "lucide-react";

export function SignUpPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Registration successful. Please sign in.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please try again.');
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Side - Sign Up Form */}
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
            <span className="text-gray-900">Finnger</span>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-gray-900 mb-3">
              Create Account
            </h1>
            <p className="text-gray-400">
              Join us today! It only takes a few seconds
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="h-12 pl-10 bg-white border-gray-200 rounded-lg"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 pl-10 bg-white border-gray-200 rounded-lg"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-12 pl-10 pr-10 bg-white border-gray-200 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="h-12 pl-10 pr-10 bg-white border-gray-200 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-2"
            >
              <label className="flex items-start gap-2 cursor-pointer">
                <Checkbox
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="border-gray-300 mt-0.5"
                />
                <span className="text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700">
                    Privacy Policy
                  </a>
                </span>
              </label>
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
                disabled={isLoading || !agreeToTerms}
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
                    Creating account...
                  </motion.div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center mt-6 text-gray-500"
          >
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Sign In
            </button>
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500">
          {/* Animated clouds */}
          <motion.div
            className="absolute top-16 left-16 w-32 h-16"
            animate={{ x: [0, 25, 0], y: [0, -12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="w-full h-full text-white/30 fill-white/30" />
          </motion.div>
          
          <motion.div
            className="absolute top-40 right-20 w-40 h-20"
            animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="w-full h-full text-white/35 fill-white/35" />
          </motion.div>

          <motion.div
            className="absolute bottom-24 left-24 w-36 h-18"
            animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="w-full h-full text-white/40 fill-white/40" />
          </motion.div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          >
            <Sparkles className="w-10 h-10 text-pink-600" strokeWidth={2} />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4 w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center shadow-xl"
            initial={{ scale: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              y: 0,
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              delay: 0.6, 
              duration: 0.8, 
              type: "spring",
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Star className="w-8 h-8 text-orange-600 fill-orange-600" />
          </motion.div>

          <motion.div
            className="absolute bottom-1/3 left-1/3 w-18 h-18 bg-pink-200 rounded-full flex items-center justify-center shadow-xl"
            initial={{ scale: 0, x: -50 }}
            animate={{ 
              scale: 1, 
              x: 0,
            }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
          >
            <Heart className="w-9 h-9 text-rose-600 fill-rose-600" />
          </motion.div>

          {/* Center illustration area */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Celebration scene */}
            <div className="relative">
              {/* Main card */}
              <motion.div
                className="w-80 h-96 bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Card header */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-12 h-12 text-white" strokeWidth={2} />
                    </motion.div>
                  </div>
                  <h2 className="text-gray-900 mb-2">Join Our Community</h2>
                  <p className="text-gray-500">
                    Start your journey with us today
                  </p>
                </div>

                {/* Progress steps */}
                <div className="space-y-4">
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600">1</span>
                    </div>
                    <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 1 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600">2</span>
                    </div>
                    <div className="flex-1 h-2 bg-pink-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-pink-600"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ delay: 1.5, duration: 1 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600">3</span>
                    </div>
                    <div className="flex-1 h-2 bg-orange-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-orange-600"
                        initial={{ width: 0 }}
                        animate={{ width: "40%" }}
                        transition={{ delay: 2, duration: 1 }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-gray-900 mb-1">10K+</div>
                    <p className="text-gray-500">Users</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-gray-900 mb-1">4.9</div>
                    <p className="text-gray-500">Rating</p>
                  </div>
                </div>

                {/* Confetti particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ["#ec4899", "#f59e0b", "#8b5cf6", "#10b981"][i % 4],
                      left: `${20 + i * 10}%`,
                      top: `${10 + (i % 3) * 10}%`,
                    }}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>

              {/* Person illustration */}
              <motion.div
                className="absolute -bottom-16 -right-20 w-32 h-32"
                animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  {/* Head */}
                  <div className="w-16 h-16 bg-amber-200 rounded-full absolute top-0 left-8 border-4 border-pink-200" />
                  {/* Body - pink/red top */}
                  <div className="w-24 h-32 bg-rose-500 absolute top-12 left-4 rounded-t-3xl" />
                  {/* Blue pants */}
                  <div className="w-24 h-20 bg-blue-400 absolute top-40 left-4 rounded-b-2xl" />
                  {/* Arm waving */}
                  <motion.div
                    className="w-6 h-16 bg-rose-500 absolute top-14 -right-2 rounded-full origin-top"
                    animate={{ rotate: [0, 20, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { Mail, Shield, Clock, CheckCircle, RefreshCw, AlertCircle, Info } from "lucide-react";
import { API_BASE_URL, verifyOTP, sendOTP, handleError } from "./client";

export function OTPVerification({ email, onOTPVerified, onBack }) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [currentOTPCode, setCurrentOTPCode] = useState('');

  // Countdown timer
  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔐 Verifying OTP for:', email);
      
      const data = await verifyOTP(email, otp);

      if (data.success) {
        setSuccess('OTP verified successfully! Email is now verified.');
        
        setTimeout(() => {
          if (onOTPVerified) {
            onOTPVerified(data);
          }
        }, 1500);
      } else {
        throw new Error(data.message || 'OTP verification failed');
      }

    } catch (error) {
      console.error('❌ OTP verification error:', error);
      
      const errorInfo = handleError(error, 'OTP Verification');
      setError(errorInfo.message);
      
      // Show helpful suggestions for specific error types
      if (errorInfo.suggestions && errorInfo.suggestions.length > 0) {
        console.log('💡 Suggestions:', errorInfo.suggestions);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    setOtp('');
    setDemoMode(false);
    setCurrentOTPCode('');

    try {
      console.log('📧 Resending OTP for:', email);
      
      const data = await sendOTP(email);

      if (data.success) {
        let successMessage = data.message || 'OTP resent successfully!';
        
        // Handle demo mode
        if (data.demoMode) {
          setDemoMode(true);
          setCurrentOTPCode(data.otp);
          successMessage = data.message || 'Demo OTP generated successfully!';
        }
        
        setSuccess(successMessage);
        setCountdown(300); // 5 minutes
        setCanResend(false);

        // Clear success message after 5 seconds for demo mode
        setTimeout(() => setSuccess(''), data.demoMode ? 8000 : 3000);
      } else {
        throw new Error(data.message || 'Failed to resend OTP');
      }

    } catch (error) {
      console.error('❌ Resend OTP error:', error);
      
      const errorInfo = handleError(error, 'OTP Resend');
      setError(errorInfo.message);
      
      // For demo mode errors, show helpful message
      if (errorInfo.type === 'EMAIL_SERVICE_ERROR') {
        setDemoMode(true);
        setSuccess('Email service unavailable - demo mode activated');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                demoMode ? 'bg-orange-100' : 'bg-blue-100'
              }`}
            >
              <Shield className={`w-8 h-8 ${demoMode ? 'text-orange-600' : 'text-blue-600'}`} />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {demoMode ? 'Demo Mode - OTP Verification' : 'Verify Your Email'}
            </h1>
            <p className="text-gray-600">
              {demoMode ? (
                <>Demo verification for <span className="font-medium text-gray-900">{email}</span></>
              ) : (
                <>Enter the 6-digit code sent to <span className="font-medium text-gray-900">{email}</span></>
              )}
            </p>
          </div>

          {/* OTP Input Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            {/* Demo Mode Alert */}
            {demoMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 mb-4"
              >
                <Info className="w-4 h-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Demo Mode Active</p>
                  <p>Use the code shown below or any 6-digit code to continue</p>
                </div>
              </motion.div>
            )}

            {/* Current Demo Code */}
            {demoMode && currentOTPCode && (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Demo Code:</p>
                <p className="text-lg font-mono font-bold text-gray-900">{currentOTPCode}</p>
                <p className="text-xs text-gray-500 mt-1">You can use this code or any 6-digit number</p>
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest h-14"
                    maxLength={6}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 p-3 border rounded-lg ${
                    demoMode 
                      ? 'bg-orange-50 border-orange-200 text-orange-700'
                      : 'bg-green-50 border-green-200 text-green-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </motion.div>
              )}

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className={`w-full h-12 font-medium ${
                  demoMode
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {demoMode ? 'Verify Demo Code' : 'Verify OTP'}
                  </div>
                )}
              </Button>

              {/* Timer and Resend */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {countdown > 0 ? (
                      <>Expires in {formatTime(countdown)}</>
                    ) : (
                      'Code expired'
                    )}
                  </span>
                </div>

                <Button
                  onClick={handleResendOTP}
                  disabled={isLoading || !canResend}
                  variant="ghost"
                  className={`hover:bg-opacity-80 ${
                    demoMode
                      ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Resend
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <div className="text-center mt-6">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Registration
            </Button>
          </div>

          {/* Help Text */}
          <div className={`text-center mt-8 p-4 rounded-lg ${
            demoMode ? 'bg-orange-50' : 'bg-blue-50'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${
              demoMode ? 'text-orange-900' : 'text-blue-900'
            }`}>
              {demoMode ? '🎭 Demo Mode Information' : '📧 Email Delivery Information'}
            </h3>
            <div className={`text-xs space-y-1 ${
              demoMode ? 'text-orange-700' : 'text-blue-700'
            }`}>
              {demoMode ? (
                <>
                  <p>• Demo mode is active due to email service unavailability</p>
                  <p>• Use any 6-digit code to continue testing</p>
                  <p>• Email delivery will be restored when service is available</p>
                  <p>• Contact support if you need assistance</p>
                </>
              ) : (
                <>
                  <p>• Check your email inbox and spam folder</p>
                  <p>• OTP expires in 5 minutes</p>
                  <p>• Code is case-sensitive</p>
                  <p>• Contact support if issues persist</p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OTPVerification;
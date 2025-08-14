import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import supabaseService from '../services/supabase';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabaseService.signUp(email, password);
        if (error) throw error;
        // Show success message for sign up
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabaseService.signIn(email, password);
        if (error) throw error;
        onAuthSuccess();
      }
    } catch (error: any) {
      console.log("helo")
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-ocean-gradient flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl border-ocean p-8 w-full max-w-md shadow-ocean-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          {/* <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="relative mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl blur opacity-75"></div>
            <div className="relative p-3 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl shadow-ocean">
              <Sparkles className="w-8 h-8 text-prussian_blue" />
            </div>
          </motion.div> */}
          <h1 className="text-3xl font-bold animate-gradient-ocean mb-2">
            FitViz AI Pro
          </h1>
          <p className="text-blue_green">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium text-prussian_blue mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue_green" />
                <input
                  type="text"
                  autoComplete="email"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-sky_blue/20 rounded-xl text-prussian_blue placeholder-blue_green/60 focus:outline-none focus:ring-2 focus:ring-blue_green/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-prussian_blue mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue_green" />
              <input
                type="email"
                autoComplete=''
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-sky_blue/20 rounded-xl text-prussian_blue placeholder-blue_green/60 focus:outline-none focus:ring-2 focus:ring-blue_green/50 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-prussian_blue mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue_green" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-sky_blue/20 rounded-xl text-prussian_blue placeholder-blue_green/60 focus:outline-none focus:ring-2 focus:ring-blue_green/50 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue_green hover:text-prussian_blue transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-selective_yellow to-ut_orange hover:from-ut_orange hover:to-selective_yellow text-prussian_blue font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-ocean disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            )}
          </motion.button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-blue_green">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="ml-2 text-selective_yellow hover:text-ut_orange font-medium transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </motion.button>
          </p>
        </div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-blue_green/10 rounded-xl border border-blue_green/20"
        >
          <h3 className="text-sm font-medium text-prussian_blue mb-2">
            What you'll get:
          </h3>
          <ul className="text-xs text-blue_green space-y-1">
            <li>• Save your try-on sessions</li>
            <li>• Personalized recommendations</li>
            <li>• Sync across devices</li>
            <li>• Advanced analytics</li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Auth; 
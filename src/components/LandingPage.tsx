import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Glasses, 
  Camera, 
  Sparkles, 
  Zap, 
  Crown, 
  Star, 
  Play, 
  ArrowRight,  
  Users, 
  Award, 
  Smartphone,
  Monitor,
  Tablet,
  Brain,
  Shield,
  Clock,
  Globe,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  ShoppingBag,
  Eye,
  Smile,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import raybanLogo from '../assets/logos/rayban.png';
import oakleyLogo from '../assets/logos/oakley.png';
import warbayparker from '../assets/logos/warbyparker.png'
import prada from '../assets/logos/prada.png'
import gucci from '../assets/logos/gucci.png'
import fitVizLogo from '../assets/logos/FitvizLogo.png';
import ModelViewer from './ModelViewer';
interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Face Detection',
      description: 'Advanced machine learning algorithms for precise facial landmark detection',
      color: 'from-professional-medium-lavender to-professional-deep-lavender'
    },
    {
      icon: Zap,
      title: 'Real-Time Tracking',
      description: 'Instant glasses overlay with 60fps performance and zero lag',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Crown,
      title: 'Premium Quality',
      description: '4K resolution support with professional-grade rendering',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens locally - your data never leaves your device',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'This is revolutionary! I can try on dozens of glasses in minutes. The AI tracking is incredibly accurate.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Tech Reviewer',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'The technology behind this is impressive. Real-time face tracking with perfect glasses alignment.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Online Shopper',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Finally, I can shop for glasses online with confidence. No more guessing how they\'ll look!',
      rating: 5
    },
    {
      name: 'David Wilson',
      role: 'Optometrist',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'My patients love being able to visualize different frames before coming in for their appointments.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'E-commerce Manager',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Our conversion rates increased by 35% after implementing this virtual try-on solution.',
      rating: 5
    }
  ];

  const stats = [
    { number: '1M+', label: 'Try-Ons Completed', icon: Users },
    { number: '99.9%', label: 'Accuracy Rate', icon: Award },
    { number: '50ms', label: 'Response Time', icon: Clock },
    { number: '150+', label: 'Countries', icon: Globe }
  ];

  const devices = [
    { icon: Smartphone, label: 'Mobile' },
    { icon: Tablet, label: 'Tablet' },
    { icon: Monitor, label: 'Desktop' }
  ];

  const brandPartners = [
    { name: 'Ray-Ban', logo: raybanLogo },
    { name: 'Oakley', logo: oakleyLogo },
    { name: 'Gucci', logo: gucci },
    { name: 'Prada', logo: prada },
    { name: 'Warby Parker', logo: warbayparker },
  ];

  const benefits = [
    { icon: ShoppingBag, title: 'Shop Smarter', description: 'Compare styles side-by-side before purchasing' },
    { icon: Eye, title: 'Perfect Fit', description: 'See exactly how frames will look on your unique face shape' },
    { icon: Smile, title: 'Confidence', description: 'Make eyewear purchases with 100% confidence' },
    { icon: TrendingUp, title: 'Save Time', description: 'Try dozens of styles in minutes instead of hours' }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-professional-gradient relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            {/* <img src={fitVizLogo} className='w-10'/> */}
            <Glasses className="w-8 h-8 text-professional-deep-lavender" />
            <span className="text-2xl font-bold bg-clip-text  text-black from-professional-medium-lavender to-professional-deep-lavender ">
              FitViz
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors font-medium">
              Features
            </a>
            <a href="#testimonials" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors font-medium">
              Testimonials
            </a>
            <a href="#how-it-works" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors font-medium">
              How It Works
            </a>
            <a href="#faq" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors font-medium">
              FAQ
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-professional-deep-lavender"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-professional-deep-lavender/95 backdrop-blur-sm flex flex-col p-6"
        >
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-2">
              <Glasses className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">VisionAI</span>
            </div>
            <button 
              className="text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col space-y-6 flex-grow">
            <a 
              href="#features" 
              className="text-white text-xl font-medium py-3 border-b border-white/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="text-white text-xl font-medium py-3 border-b border-white/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#how-it-works" 
              className="text-white text-xl font-medium py-3 border-b border-white/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#faq" 
              className="text-white text-xl font-medium py-3 border-b border-white/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
          </div>

          <button
            onClick={() => {
              onGetStarted();
              setMobileMenuOpen(false);
            }}
            className="bg-professional-button text-professional-cream px-6 py-3 rounded-xl font-bold mt-8"
          >
            Start Try-On
          </button>
        </motion.div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-professional-medium-lavender rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-professional-light-lavender rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8" id="home">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row items-start">
      {/* Text Content */}
      <div className="w-full md:w-1/2 md:pr-12 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-professional-medium-lavender/20 to-professional-deep-lavender/20 text-professional-deep-lavender rounded-full px-4 py-2 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Powered by Advanced AI</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-professional-deep-lavender mb-6 leading-tight"
        >
          <span className="block">Find Your Perfect</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-professional-deep-lavender to-professional-medium-lavender">
            Eyewear Match
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-professional-medium-lavender max-w-2xl mx-auto md:mx-0 mb-8"
        >
          Experience glasses shopping redefined with our AI-powered virtual try-on. See how any frame looks on your face in real-time with 99.9% accuracy.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center md:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
<motion.div 
  className="relative inline-block"
  whileHover="hover"
  initial="initial"
>
  {/* Tooltip-like reassurance message */}
  <motion.div
    className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg shadow-lg whitespace-nowrap"
    variants={{
      initial: { opacity: 0, y: 10 },
      hover: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.2 }}
  >
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-3 h-3 bg-white rotate-45"></div>
    <span>No downloads required • Try instantly</span>
  </motion.div>
  
  {/* Main button */}
  <motion.button
    variants={{
      initial: { scale: 1 },
      hover: { scale: 1.03 }
    }}
    whileTap={{ scale: 0.97 }}
    onClick={onGetStarted}
    className="group relative bg-gradient-to-r from-professional-button to-professional-button-hover text-professional-cream px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-professional-lg"
    style={{
      boxShadow: "0 10px 30px rgba(101, 52, 255, 0.3)"
    }}
  >
    {/* Animated border effect */}
    <motion.div 
      className="absolute inset-0 rounded-xl border-2 border-white/30"
      variants={{
        initial: { opacity: 0, scale: 1 },
        hover: { opacity: 1, scale: 1.05 }
      }}
      transition={{ duration: 0.3 }}
    />
    
    {/* Pulsing glow effect */}
    <motion.div 
      className="absolute inset-0 rounded-xl bg-gradient-to-r from-professional-button to-professional-button-hover opacity-70 blur-md"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 2,
        repeat: Infinity
      }}
    />
    
    <div className="flex items-center space-x-2 relative z-10">
      <motion.div
        variants={{
          initial: { rotate: 0 },
          hover: { rotate: -10 }
        }}
        transition={{ duration: 0.3 }}
      >
        <Camera className="w-5 h-5" />
      </motion.div>
      <span>Start Virtual Try-On</span>
      <motion.div
        variants={{
          initial: { opacity: 0, x: -10 },
          hover: { opacity: 1, x: 0 }
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="opacity-0 group-hover:opacity-100"
      >
        <ArrowRight className="w-5 h-5" />
      </motion.div>
    </div>
  </motion.button>
  
  {/* Micro-interaction reassurance */}
  <div className="text-center mt-3 text-sm text-gray-500">
    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Click to try glasses instantly in your browser
    </span>
  </div>
</motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVideo(true)}
            className="flex items-center space-x-2 glass-card border border-professional/20 text-professional-deep-lavender px-6 py-4 rounded-xl font-medium transition-professional hover:bg-professional-card/50"
          >
            <Play className="w-5 h-5" />
            <span>Watch Demo</span>
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center md:justify-start gap-4"
        >
          {[
            { 
              icon: Zap, 
              text: "Real-Time Tracking", 
              bg: "from-purple-500/10 to-purple-600/10", 
              textColor: "text-purple-600" 
            },
            { 
              icon: Star, 
              text: "99.9% Accuracy", 
              bg: "from-yellow-500/10 to-yellow-600/10", 
              textColor: "text-yellow-600" 
            },
            { 
              icon: Crown, 
              text: "Premium Frames", 
              bg: "from-indigo-500/10 to-indigo-600/10", 
              textColor: "text-indigo-600" 
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r ${feature.bg} ${feature.textColor}`}
            >
              <feature.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Visual Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full md:w-1/2 mt-16 md:mt-0 relative"
      >
        <div className="relative max-w-2xl mx-auto">
          {/* 3D Model Visualization */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-screen mx-auto w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl">
            {/* Dragon Ball Master 3D Model */}
            <div className="relative w-full h-full flex justify-start">
              <div className="w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl max-h-xs sm:max-h-sm md:max-h-md lg:max-h-2xl">
                <ModelViewer 
                  modelPath="/dragon_ball_master_roshi_pixelvoxel_art.glb"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* Brand Partners Section */}
      <section className="relative z-10 py-12 bg-professional-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-professional-medium-lavender mb-4">Trusted by leading eyewear brands</p>
          </motion.div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {brandPartners.map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-10 md:h-14 object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center glass-card rounded-2xl p-6 border-professional shadow-professional"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-professional-button rounded-xl mb-4"
                >
                  <stat.icon className="w-6 h-6 text-professional-cream" />
                </motion.div>
                <div className="text-3xl font-bold text-professional-deep-lavender mb-2">
                  {stat.number}
                </div>
                <div className="text-professional-medium-lavender text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20 bg-professional-card/20 backdrop-blur-sm" id="benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold animate-gradient-professional mb-6">
              Why Choose Our Solution
            </h2>
            <p className="text-xl text-professional-medium-lavender max-w-3xl mx-auto">
              Discover the advantages of virtual try-on technology for your eyewear shopping
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="glass-card rounded-3xl p-8 border-professional shadow-professional"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-professional-medium-lavender to-professional-deep-lavender rounded-2xl mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-professional-deep-lavender mb-4">{benefit.title}</h3>
                <p className="text-professional-medium-lavender">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold animate-gradient-professional mb-6">
              Cutting-Edge Features
            </h2>
            <p className="text-xl text-professional-medium-lavender max-w-3xl mx-auto">
              Powered by the latest AI technology for the most accurate virtual try-on experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onHoverStart={() => setActiveFeature(index)}
                className={`relative p-8 rounded-3xl border transition-professional cursor-pointer ${
                  activeFeature === index
                    ? 'border-professional-medium-lavender bg-professional-medium-lavender/10 shadow-professional-xl'
                    : 'border-professional glass-card hover:border-professional-strong'
                }`}
              >
                <motion.div
                  animate={{ rotate: activeFeature === index ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-professional-deep-lavender mb-4">{feature.title}</h3>
                <p className="text-professional-medium-lavender">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 bg-professional-card/20 backdrop-blur-sm" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold animate-gradient-professional mb-6">
              How It Works
            </h2>
            <p className="text-xl text-professional-medium-lavender max-w-3xl mx-auto">
              Get started with virtual try-on in just a few simple steps
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-professional-medium-lavender/20 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="lg:absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-professional-button rounded-full flex items-center justify-center text-professional-cream text-2xl font-bold mb-6 lg:mb-0 z-10">
                    {step}
                  </div>
                  <div className="glass-card rounded-3xl p-8 border-professional shadow-professional h-full pt-12 lg:pt-8">
                    <h3 className="text-xl font-bold text-professional-deep-lavender mb-4">
                      {index === 0 && 'Enable Camera Access'}
                      {index === 1 && 'Position Your Face'}
                      {index === 2 && 'Try On Glasses'}
                    </h3>
                    <p className="text-professional-medium-lavender">
                      {index === 0 && 'Allow camera permissions to start the virtual try-on experience.'}
                      {index === 1 && 'Center your face in the frame for optimal tracking accuracy.'}
                      {index === 2 && 'Browse our collection and see how different glasses look on you.'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold animate-gradient-professional mb-6">
              Works Everywhere
            </h2>
            <p className="text-xl text-professional-medium-lavender max-w-3xl mx-auto">
              Seamless experience across all your devices with responsive design
            </p>
          </motion.div>

          <div className="flex justify-center items-center space-x-12">
            {devices.map((device, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="text-center"
              >
                <div className="glass-card rounded-3xl p-8 border-professional mb-4 shadow-professional">
                  <device.icon className="w-16 h-16 text-professional-medium-lavender mx-auto" />
                </div>
                <p className="text-professional-deep-lavender font-medium">{device.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 bg-professional-card/20 backdrop-blur-sm" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold animate-gradient-professional mb-6">
              Loved by Users
            </h2>
            <p className="text-xl text-professional-medium-lavender max-w-3xl mx-auto">
              Join thousands of satisfied customers who've revolutionized their eyewear shopping
            </p>
          </motion.div>

          {/* Desktop Testimonials */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card rounded-3xl p-8 border-professional shadow-professional"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-professional-deep-lavender mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-professional-deep-lavender font-medium">{testimonial.name}</div>
                    <div className="text-professional-medium-lavender text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Testimonials Carousel */}
          <div className="md:hidden relative">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card rounded-3xl p-8 border-professional shadow-professional"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-professional-deep-lavender mb-6 italic">"{testimonials[activeTestimonial].content}"</p>
              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-professional-deep-lavender font-medium">{testimonials[activeTestimonial].name}</div>
                  <div className="text-professional-medium-lavender text-sm">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-professional-deep-lavender' : 'bg-professional-medium-lavender/30'}`}
                />
              ))}
            </div>

            <button 
              onClick={prevTestimonial}
              className="absolute left-2 top-1/2 -translate-y-1/2 glass-card rounded-full p-2"
            >
              <ChevronLeft className="w-5 h-5 text-professional-deep-lavender" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-2 top-1/2 -translate-y-1/2 glass-card rounded-full p-2"
            >
              <ChevronRight className="w-5 h-5 text-professional-deep-lavender" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold animate-gradient-professional mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-professional-medium-lavender max-w-3xl mx-auto">
              Find answers to common questions about our virtual try-on technology
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "How accurate is the virtual try-on?",
                answer: "Our AI technology provides 99.9% accurate facial mapping, ensuring glasses fit your face shape perfectly in the virtual try-on."
              },
              {
                question: "Is my camera data stored or shared?",
                answer: "No, all processing happens locally on your device. We never store or share your camera data or images."
              },
              {
                question: "What devices are supported?",
                answer: "Our solution works on all modern smartphones, tablets, and computers with a front-facing camera."
              },
              {
                question: "Can I try on prescription glasses?",
                answer: "Yes! You can try on both prescription and non-prescription frames to see how they look on your face."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 border-professional"
              >
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer">
                    <h3 className="text-lg font-medium text-professional-deep-lavender">{faq.question}</h3>
                    <div className="w-5 h-5 text-professional-medium-lavender group-open:rotate-180 transition-transform">
                      <ChevronRight className="w-full h-full" />
                    </div>
                  </summary>
                  <p className="mt-4 text-professional-medium-lavender">{faq.answer}</p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 border-professional shadow-professional-xl"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-professional-button rounded-full mb-8"
            >
              <Glasses className="w-10 h-10 text-professional-cream" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold animate-gradient-professional mb-6">
              Ready to Transform Your Shopping?
            </h2>
            <p className="text-xl text-professional-medium-lavender mb-8 max-w-2xl mx-auto">
              Join the revolution in eyewear shopping. Try on any glasses virtually with our advanced AI technology.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="group relative bg-professional-button hover:bg-professional-button-hover text-professional-cream px-10 py-5 rounded-2xl font-bold text-xl transition-professional shadow-professional-xl hover:shadow-glow-professional"
            >
              <div className="absolute inset-0 bg-professional-button rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>Start Your Virtual Try-On</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 bg-professional-card/30 backdrop-blur-sm border-t border-professional">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Glasses className="w-8 h-8 text-professional-deep-lavender" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-professional-medium-lavender to-professional-deep-lavender">
                  VisionAI
                </span>
              </div>
              <p className="text-professional-medium-lavender mb-6">
                Revolutionizing eyewear shopping with AI-powered virtual try-on technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">
                  <Heart className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-professional-deep-lavender mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">About Us</a></li>
                <li><a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">Careers</a></li>
                <li><a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">Press</a></li>
                <li><a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-professional-deep-lavender mb-6">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">Help Center</a></li>
                <li><a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-professional-deep-lavender mb-6">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-professional-medium-lavender">
                  <Mail className="w-5 h-5" />
                  <span>support@visionai.com</span>
                </li>
                <li className="flex items-center space-x-2 text-professional-medium-lavender">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2 text-professional-medium-lavender">
                  <MapPin className="w-5 h-5" />
                  <span>123 Tech Street, San Francisco</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-professional mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-professional-medium-lavender mb-4 md:mb-0">
              © 2023 VisionAI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowVideo(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative glass-card rounded-3xl p-8 max-w-4xl w-full border-professional"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 text-professional-medium-lavender hover:text-professional-deep-lavender transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="aspect-video bg-professional-card rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-20 h-20 text-professional-medium-lavender mx-auto mb-4" />
                  <p className="text-professional-medium-lavender">Demo video would play here</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
import React, { useState, useCallback, useEffect } from 'react';
import { Glasses, Camera, ShoppingBag, Sparkles, Zap, Crown, Settings, Home, Brain, Share2, MessageCircle, User, LogOut } from 'lucide-react';
import VirtualTryOn from './components/VirtualTryOn';
import ProductSelector from './components/ProductSelector';
import GlassesControls from './components/GlassesControls';
import ShoppingCart from './components/ShoppingCart';
import ScreenshotModal from './components/ScreenshotModal';
import AdvancedFeatures from './components/AdvancedFeatures';
import PremiumFeatures from './components/PremiumFeatures';
import LandingPage from './components/LandingPage';
import SocialFeatures from './components/SocialFeatures';
import AIInsights from './components/AIInsights';
import Chatbot from './components/Chatbot';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { glassesProducts } from './data/products';
import { GlassesProduct, CartItem, GlassesAdjustments } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import supabaseService from './services/supabase';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<GlassesProduct | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customGlasses, setCustomGlasses] = useState<GlassesProduct[]>([]);
  const [adjustments, setAdjustments] = useState<GlassesAdjustments>({
    scale: 1.0,
    offsetX: 0.0,
    offsetY: 0.0,
    rotation: 0.0,
  });
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'landing' | 'tryOn' | 'features' | 'premium' | 'social' | 'insights' | 'profile'>('landing');
  const [previousTab, setPreviousTab] = useState<'landing' | 'tryOn' | 'features' | 'premium' | 'social' | 'insights' | 'profile'>('landing');
  const [isPremium, setIsPremium] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await supabaseService.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    checkUser();
  };

  const handleSignOut = () => {
    setUser(null);
    setActiveTab('landing');
  };

  // Combine default products with custom uploaded glasses
  const allProducts = [...glassesProducts, ...customGlasses];

  const handleSelectProduct = useCallback((product: GlassesProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleAddToCart = useCallback((product: GlassesProduct) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleAddCustomGlasses = useCallback((imageUrl: string, name: string) => {
    const newCustomGlasses: GlassesProduct = {
      id: `custom-${Date.now()}`,
      name: name,
      price: 0, // Custom glasses are free
      image: imageUrl,
      description: 'Your custom uploaded glasses',
      category: 'Custom',
      color: 'Custom'
    };
    
    setCustomGlasses(prev => [...prev, newCustomGlasses]);
    
    // Automatically select the newly uploaded glasses
    setSelectedProduct(newCustomGlasses);
    
    // Switch to try-on tab if not already there
    if (activeTab !== 'tryOn') {
      setActiveTab('tryOn');
    }
  }, [activeTab]);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleAdjustmentChange = useCallback((newAdjustments: GlassesAdjustments) => {
    setAdjustments(newAdjustments);
  }, []);

  const handleResetAdjustments = useCallback(() => {
    setAdjustments({
      scale: 1.0,
      offsetX: 0.0,
      offsetY: 0.0,
      rotation: 0.0,
    });
  }, []);

  const handleScreenshot = useCallback(async (imageData: string) => {
    setScreenshotData(imageData);
    setShowScreenshotModal(true);

    // Save try-on session to Supabase if user is logged in
    if (user && selectedProduct) {
      try {
        // Convert base64 to file for upload
        const base64Response = await fetch(imageData);
        const blob = await base64Response.blob();
        const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });

        // Upload screenshot
        const { data: uploadData } = await supabaseService.uploadScreenshot(file, user.id);
        
        if (uploadData) {
          // Save session data
          await supabaseService.saveTryOnSession({
            user_id: user.id,
            glasses_id: selectedProduct.id,
            screenshot_url: uploadData.path,
            adjustments: adjustments,
          });

          // Track analytics event
          await supabaseService.trackEvent('screenshot_taken', {
            product_id: selectedProduct.id,
            adjustments: adjustments,
          });
        }
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  }, [user, selectedProduct, adjustments]);

  const handleUpgrade = useCallback(() => {
    setIsPremium(true);
    setActiveTab('premium');
  }, []);

  const handleGetStarted = useCallback(() => {
    setActiveTab('tryOn');
  }, []);

  const handleShareFromModal = useCallback(() => {
    setShowScreenshotModal(false);
    setShowSocialModal(true);
  }, []);

  const handleGlassesRecommendation = useCallback((recommendations: any[]) => {
    // Handle glasses recommendations from chatbot
    console.log('Glasses recommendations:', recommendations);
  }, []);

  const tabs = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'tryOn', label: 'Virtual Try-On', icon: Camera },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'social', label: 'Social', icon: Share2 },
    { id: 'features', label: 'Pro Features', icon: Zap },
    { id: 'premium', label: 'Premium', icon: Crown },
    ...(user ? [{ id: 'profile', label: 'Profile', icon: User }] : []),
  ];

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-gradient flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue_green/30 rounded-full mx-auto mb-4"
          >
            <div className="w-16 h-16 border-4 border-transparent border-t-blue_green rounded-full animate-spin"></div>
          </motion.div>
          <p className="text-blue_green text-lg">Loading VirtualSpecs AI Pro...</p>
        </div>
      </div>
    );
  }

  // Show authentication if user is not logged in
  // if (!user) {
  //   return <Auth onAuthSuccess={handleAuthSuccess} />;
  // }

  return (
    <div className="min-h-screen bg-ocean-gradient relative overflow-hidden">
      {/* Animated Ocean Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-sky_blue rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue_green rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.1, 1.2, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 left-1/2 w-80 h-80 bg-prussian_blue rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
      </div>

      {/* Header */}
      {activeTab !== 'landing' && activeTab !== 'profile' && (
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 glass-card border-b border-ocean sticky top-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-4"
              >
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-button-primary rounded-xl blur opacity-75"></div>
                  <div className="relative p-3 bg-button-primary rounded-xl shadow-ocean">
                    <Glasses className="w-8 h-8 text-prussian_blue" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold animate-gradient-ocean">
                    VirtualSpecs AI Pro
                  </h1>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4 text-blue_green" />
                    </motion.div>
                    <p className="text-sm text-prussian_blue">Enterprise Virtual Try-On Platform</p>
                    {isPremium && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-selective_yellow/20 to-ut_orange/20 rounded-full border border-selective_yellow/30"
                      >
                        <Crown className="w-3 h-3 text-selective_yellow" />
                        <span className="text-xs text-ut_orange font-medium">PRO</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Tab Navigation */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (tab.id !== 'profile') {
                        setPreviousTab(activeTab);
                      }
                      setActiveTab(tab.id as any);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-ocean ${
                      activeTab === tab.id
                        ? 'bg-button-primary text-prussian_blue shadow-ocean'
                        : 'glass-card text-prussian_blue hover:bg-ocean-card hover:text-blue_green'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:block">{tab.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.header>
      )}

      <div className="relative z-10">
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage onGetStarted={handleGetStarted} />
            </motion.div>
          )}

          {activeTab === 'tryOn' && (
            <motion.div
              key="tryOn"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              {/* Hero Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-12"
              >
                <motion.h2 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-6xl font-bold animate-gradient-ocean mb-6"
                >
                  Professional Virtual Try-On
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-prussian_blue max-w-3xl mx-auto"
                >
                  Enterprise-grade AI-powered virtual try-on technology with custom upload support
                </motion.p>
              </motion.div>

              {/* Stack camera, controls, and product listing vertically */}
              <div className="flex flex-col gap-8 items-center">
                <div className="w-full">
                  {selectedProduct ? (
                    <VirtualTryOn
                      glassesImage={selectedProduct.image}
                      adjustments={adjustments}
                      onScreenshot={handleScreenshot}
                    />
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-card rounded-3xl border-ocean p-16 text-center shadow-ocean-lg"
                    >
                      <motion.div 
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="relative mb-8"
                      >
                        <div className="absolute inset-0 bg-blue_green/20 rounded-full blur-xl"></div>
                        <ShoppingBag className="relative w-32 h-32 mx-auto text-blue_green" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-prussian_blue mb-4">
                        Select or Upload Glasses to Begin
                      </h3>
                      <p className="text-blue_green text-xl">
                        Choose from our premium collection or upload your own glasses
                      </p>
                    </motion.div>
                  )}
                </div>
                <div className="w-full">
                  <GlassesControls
                    adjustments={adjustments}
                    onAdjustmentChange={handleAdjustmentChange}
                    onReset={handleResetAdjustments}
                  />
                </div>
                <div className="w-full">
                  <ProductSelector
                    products={allProducts}
                    selectedProduct={selectedProduct}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                    onAddCustomGlasses={handleAddCustomGlasses}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <AIInsights selectedProduct={selectedProduct} />
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <SocialFeatures imageData={screenshotData} />
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <AdvancedFeatures />
            </motion.div>
          )}

          {activeTab === 'premium' && (
            <motion.div
              key="premium"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <PremiumFeatures 
                isPremium={isPremium}
                onUpgrade={handleUpgrade}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <UserProfile 
                onSignOut={handleSignOut} 
                onBack={() => setActiveTab(previousTab)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chatbot Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 left-6 z-40 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-gradient-to-r from-selective_yellow to-ut_orange hover:from-ut_orange hover:to-selective_yellow text-prussian_blue p-4 rounded-full shadow-ocean-xl transition-all duration-200">
          <MessageCircle className="w-6 h-6" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
        />
      </motion.button>

      {/* Shopping Cart */}
      <ShoppingCart
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Screenshot Modal */}
      <ScreenshotModal
        isOpen={showScreenshotModal}
        imageData={screenshotData}
        onClose={() => setShowScreenshotModal(false)}
        onShare={handleShareFromModal}
      />

      {/* Social Modal */}
      <AnimatePresence>
        {showSocialModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSocialModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SocialFeatures 
                imageData={screenshotData} 
                onClose={() => setShowSocialModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot */}
      <AnimatePresence>
        {showChatbot && (
          <Chatbot
            isOpen={showChatbot}
            onClose={() => setShowChatbot(false)}
            onGlassesRecommendation={handleGlassesRecommendation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

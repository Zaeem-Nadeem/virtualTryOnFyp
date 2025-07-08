import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  Shield, 
  Cloud, 
  Users, 
  BarChart3, 
  Palette,
  Download,
  Star,
  Check,
  X,
  Sparkles
} from 'lucide-react';

interface PremiumFeaturesProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ 
  isPremium = false, 
  onUpgrade 
}) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic virtual try-on',
        '5 screenshots per day',
        'Standard quality',
        'Basic filters',
        'Community support'
      ],
      limitations: [
        'No video recording',
        'No advanced analytics',
        'No custom branding',
        'Limited export formats'
      ],
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: 'per month',
      features: [
        'Unlimited screenshots',
        '4K video recording',
        'Advanced AI filters',
        'Custom color palettes',
        'Priority support',
        'Analytics dashboard',
        'Multiple export formats',
        'Social media integration'
      ],
      limitations: [],
      color: 'from-blue-500 to-purple-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Custom branding',
        'API access',
        'White-label solution',
        'Advanced analytics',
        'Team collaboration',
        'Custom integrations',
        'Dedicated support'
      ],
      limitations: [],
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const premiumFeatures = [
    {
      icon: Zap,
      title: 'AI-Powered Enhancement',
      description: 'Advanced machine learning for perfect fit detection',
      premium: true
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'Unlimited cloud storage for your try-on sessions',
      premium: true
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed insights and usage statistics',
      premium: true
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'White-label solution with your brand colors',
      premium: true
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share and collaborate with team members',
      premium: true
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Advanced security and compliance features',
      premium: true
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Premium Status Banner */}
      <motion.div 
        className={`p-6 rounded-3xl border ${
          isPremium 
            ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20' 
            : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${
                isPremium ? 'from-yellow-500 to-orange-600' : 'from-blue-500 to-purple-600'
              } rounded-xl blur opacity-75`}></div>
              <div className={`relative p-3 bg-gradient-to-r ${
                isPremium ? 'from-yellow-500 to-orange-600' : 'from-blue-500 to-purple-600'
              } rounded-xl`}>
                <Crown className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <div>
              <h2 className={`text-2xl font-bold bg-gradient-to-r ${
                isPremium 
                  ? 'from-yellow-400 to-orange-400' 
                  : 'from-blue-400 to-purple-400'
              } bg-clip-text text-transparent`}>
                {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
              </h2>
              <p className="text-sm text-gray-300">
                {isPremium 
                  ? 'Enjoy unlimited access to all premium features' 
                  : 'Unlock advanced features and unlimited usage'
                }
              </p>
            </div>
          </div>
          
          {!isPremium && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUpgrade}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Upgrade Now
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Pricing Plans */}
      {!isPremium && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h3>
            <p className="text-gray-400">Select the perfect plan for your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative p-6 rounded-2xl border transition-all cursor-pointer ${
                  selectedPlan === plan.id
                    ? 'border-blue-400 bg-blue-500/10 shadow-2xl shadow-blue-500/25'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                } ${plan.popular ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className={`text-4xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-sm">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + featureIndex * 0.05 }}
                      className="flex items-center space-x-3"
                    >
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitIndex) => (
                    <motion.div
                      key={limitIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (plan.features.length + limitIndex) * 0.05 }}
                      className="flex items-center space-x-3"
                    >
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    plan.id === 'free'
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                      : `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl`
                  }`}
                >
                  {plan.id === 'free' ? 'Current Plan' : 'Get Started'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Premium Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8"
      >
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-4">
            Premium Features
          </h3>
          <p className="text-gray-400">Unlock the full potential of virtual try-on technology</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-6 rounded-2xl border transition-all ${
                isPremium || !feature.premium
                  ? 'border-green-400/30 bg-green-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-xl ${
                    isPremium || !feature.premium
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">{feature.title}</h4>
                  {feature.premium && !isPremium && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center space-x-1"
                    >
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-medium">Premium</span>
                    </motion.div>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Success Stories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8"
      >
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent mb-4">
            Success Stories
          </h3>
          <p className="text-gray-400">See how businesses are transforming with our platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              company: 'EyeWear Pro',
              metric: '300%',
              description: 'Increase in online sales',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              company: 'Vision Store',
              metric: '85%',
              description: 'Reduction in returns',
              color: 'from-green-500 to-emerald-500'
            },
            {
              company: 'Specs & Co',
              metric: '4.9★',
              description: 'Customer satisfaction',
              color: 'from-yellow-500 to-orange-500'
            }
          ].map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${story.color}/10 border border-white/10`}
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`text-4xl font-bold bg-gradient-to-r ${story.color} bg-clip-text text-transparent mb-2`}
                >
                  {story.metric}
                </motion.div>
                <div className="text-white font-medium mb-2">{story.description}</div>
                <div className="text-gray-400 text-sm">{story.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PremiumFeatures;
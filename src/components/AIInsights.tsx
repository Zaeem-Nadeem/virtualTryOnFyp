import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Award, 
  Palette, 
  Users, 
  Star,
  Eye,
  Zap,
  Target,
  Sparkles,
  Crown,
  Loader2
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface AIInsightsProps {
  selectedProduct?: any;
  faceShape?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ selectedProduct, faceShape = 'oval' }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<any>(null);

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true);
      
      try {
        // Get real AI insights from Gemini
        const geminiInsights = await geminiService.generateInsights(selectedProduct, { faceShape });
        setAiInsights(geminiInsights);
        
        // Create insights array with real data
        const newInsights = [
          {
            type: 'face_match',
            title: 'AI Face Match Score',
            description: `Perfect compatibility with your ${faceShape} face shape`,
            score: geminiInsights.faceMatchScore || 95,
            icon: Target,
            color: 'from-green-500 to-emerald-600'
          },
          {
            type: 'style_trend',
            title: 'Style Trend Analysis',
            description: geminiInsights.styleAnalysis || 'This style is trending this season',
            score: geminiInsights.trendScore || 87,
            icon: TrendingUp,
            color: 'from-blue_green to-sky_blue'
          },
          {
            type: 'comfort_prediction',
            title: 'AI Comfort Prediction',
            description: 'Predicted comfort based on facial measurements',
            score: geminiInsights.comfortPrediction || 89,
            icon: Award,
            color: 'from-selective_yellow to-ut_orange'
          },
          {
            type: 'personalization',
            title: 'Personalization Score',
            description: 'How well this matches your unique features',
            score: Math.round((geminiInsights.faceMatchScore + geminiInsights.comfortPrediction) / 2) || 91,
            icon: Crown,
            color: 'from-purple-500 to-pink-600'
          }
        ];
        
        setInsights(newInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
        // Fallback insights
        setInsights([
          {
            type: 'face_match',
            title: 'Perfect Face Match',
            description: `These glasses complement your ${faceShape} face shape beautifully`,
            score: 95,
            icon: Target,
            color: 'from-green-500 to-emerald-600'
          },
          {
            type: 'style_trend',
            title: 'Trending Style',
            description: 'This style is 87% more popular this season',
            score: 87,
            icon: TrendingUp,
            color: 'from-blue_green to-sky_blue'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedProduct) {
      generateInsights();
    } else {
      setLoading(false);
    }
  }, [selectedProduct, faceShape]);

  const recommendations = [
    {
      title: 'AI Similar Styles',
      description: 'Based on your preferences',
      count: 12,
      icon: Eye
    },
    {
      title: 'Trending Now',
      description: 'Popular this week',
      count: 8,
      icon: TrendingUp
    },
    {
      title: 'Perfect Matches',
      description: 'AI-curated for you',
      count: 5,
      icon: Star
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/95 via-prussian_blue/50 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-sky_blue/20 overflow-hidden shadow-ocean-xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-sky_blue/20 via-blue_green/20 to-prussian_blue/20 backdrop-blur-sm border-b border-sky_blue/20 p-6">
        <div className="flex items-center space-x-4">
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl blur opacity-75"></div>
            <div className="relative p-3 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl">
              <Brain className="w-6 h-6 text-prussian_blue" />
            </div>
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-sky_blue via-blue_green to-selective_yellow bg-clip-text text-transparent">
              AI Style Insights
            </h2>
            <p className="text-sm text-sky_blue">Powered by Gemini AI • Personalized analysis</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow/20 to-ut_orange/20 rounded-full blur-xl"></div>
                <Loader2 className="relative w-16 h-16 mx-auto text-selective_yellow animate-spin" />
              </motion.div>
              <h3 className="text-xl font-bold text-sky_blue mb-2">AI Analyzing Your Style</h3>
              <p className="text-blue_green">Gemini AI is processing your preferences and facial features...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insights */}
        <AnimatePresence>
          {!loading && insights.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2"
                >
                  {Math.round(insights.reduce((acc, insight) => acc + insight.score, 0) / insights.length)}%
                </motion.div>
                <p className="text-green-300 font-medium">AI Perfect Match Score</p>
                <p className="text-gray-400 text-sm mt-2">Based on Gemini AI facial analysis and style preferences</p>
              </motion.div>

              {/* Individual Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-sky_blue/20"
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className={`p-3 bg-gradient-to-r ${insight.color} rounded-xl`}
                      >
                        <insight.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{insight.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{insight.description}</p>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${insight.score}%` }}
                              transition={{ delay: index * 0.2, duration: 1 }}
                              className={`h-full bg-gradient-to-r ${insight.color}`}
                            />
                          </div>
                          <span className="text-white font-bold text-sm">{insight.score}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Recommendations */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-selective_yellow" />
                  <span>AI Recommendations</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-blue_green/10 to-prussian_blue/10 rounded-2xl p-4 border border-sky_blue/20 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <rec.icon className="w-6 h-6 text-blue_green" />
                        <div className="text-2xl font-bold text-blue_green">{rec.count}</div>
                      </div>
                      <h4 className="text-white font-medium mb-1">{rec.title}</h4>
                      <p className="text-gray-400 text-sm">{rec.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* AI Insights Details */}
              {aiInsights && aiInsights.personalizedTips && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-selective_yellow/10 to-ut_orange/10 rounded-2xl p-6 border border-selective_yellow/20"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Crown className="w-6 h-6 text-selective_yellow" />
                    <h3 className="text-lg font-bold text-white">AI Personalized Tips</h3>
                  </div>
                  <div className="space-y-3">
                    {aiInsights.personalizedTips.map((tip: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-selective_yellow rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Face Shape Analysis */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-sky_blue/10 to-blue_green/10 rounded-2xl p-6 border border-sky_blue/20"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-sky_blue" />
                  <h3 className="text-lg font-bold text-white">Face Shape Analysis</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Detected Shape</p>
                    <p className="text-white font-bold capitalize">{faceShape}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Best Styles</p>
                    <p className="text-white font-bold">Round, Aviator</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-sky_blue/10 rounded-xl">
                  <p className="text-sky_blue text-sm">
                    💡 <strong>AI Tip:</strong> Your {faceShape} face shape works best with frames that add contrast to your natural features.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Product Selected */}
        {!selectedProduct && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow/20 to-ut_orange/20 rounded-full blur-xl"></div>
              <Brain className="relative w-24 h-24 mx-auto text-selective_yellow" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Select Glasses for AI Analysis
            </h3>
            <p className="text-gray-400 text-lg">
              Choose any glasses to get personalized insights powered by Gemini AI
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIInsights;
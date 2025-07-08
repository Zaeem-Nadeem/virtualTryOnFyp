import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Camera, 
  Upload, 
  Bot, 
  User, 
  Image as ImageIcon,
  Sparkles,
  Brain,
  Eye,
  Loader2,
  RefreshCw,
  Star,
  Crown,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { geminiService, FaceAnalysis, GlassesRecommendation } from '../services/geminiService';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  image?: string;
  faceAnalysis?: FaceAnalysis;
  glassesRecommendations?: GlassesRecommendation[];
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onGlassesRecommendation?: (recommendations: GlassesRecommendation[]) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, onGlassesRecommendation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your AI glasses consultant powered by Gemini AI. I can analyze your face shape from photos and provide personalized glasses recommendations. Upload a photo or ask me any questions about eyewear!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        handleImageAnalysis(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAnalysis = async (imageData: string) => {
    setIsLoading(true);
    
    // Add user message with image
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Please analyze my face shape and recommend glasses',
      timestamp: new Date(),
      image: imageData
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Use real Gemini AI for face analysis
      const analysis = await geminiService.analyzeImage(imageData);
      
      // Add bot response with analysis
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I've analyzed your photo using AI! You have a ${analysis.faceShape} face shape with ${(analysis.confidence * 100).toFixed(0)}% confidence. Here are my personalized recommendations:`,
        timestamp: new Date(),
        faceAnalysis: analysis,
        glassesRecommendations: analysis.recommendations
      };
      
      setMessages(prev => [...prev, botMessage]);
      onGlassesRecommendation?.(analysis.recommendations);
      
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I had trouble analyzing your image. Please try uploading a clear, well-lit photo of your face.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setUploadedImage(null);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use real Gemini AI for chat
      const response = await geminiService.chatWithGemini(currentMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 z-50 flex items-end justify-end"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          height: isMinimized ? 'auto' : undefined
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`bg-gradient-to-br from-slate-900/95 via-prussian_blue/50 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-sky_blue/20 shadow-ocean-xl w-[95vw] max-w-md ${
          isMinimized ? 'h-auto' : 'h-[400px]'
        } flex flex-col overflow-hidden overflow-y-auto`}
      >
        {/* Header */}
        <div className="p-4 border-b border-sky_blue/20 bg-gradient-to-r from-sky_blue/10 to-blue_green/10 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl blur opacity-75"></div>
                <div className="relative p-2 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl">
                  <Bot className="w-5 h-5 text-prussian_blue" />
                </div>
              </motion.div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-sky_blue to-blue_green bg-clip-text text-transparent">
                  AI Glasses Consultant
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-sky_blue">Powered by Gemini AI</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-sky_blue" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-sky_blue" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-4 h-4 text-sky_blue" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messages - Hidden when minimized */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-blue_green to-prussian_blue' 
                            : 'bg-gradient-to-r from-selective_yellow to-ut_orange'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-prussian_blue" />
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`rounded-2xl p-4 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue_green/20 to-prussian_blue/20 border border-blue_green/30'
                            : 'bg-gradient-to-r from-sky_blue/10 to-blue_green/10 border border-sky_blue/20'
                        }`}>
                          {/* Image */}
                          {message.image && (
                            <div className="mb-3">
                              <img
                                src={message.image}
                                alt="Uploaded"
                                className="w-full max-w-48 rounded-xl"
                              />
                            </div>
                          )}

                          {/* Text Content */}
                          <p className="text-white text-sm leading-relaxed">{message.content}</p>

                          {/* Face Analysis */}
                          {message.faceAnalysis && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-4 p-4 bg-gradient-to-r from-selective_yellow/10 to-ut_orange/10 rounded-xl border border-selective_yellow/20"
                            >
                              <div className="flex items-center space-x-2 mb-3">
                                <Brain className="w-5 h-5 text-selective_yellow" />
                                <span className="text-sm font-bold text-selective_yellow">AI Face Analysis</span>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Face Shape:</span>
                                  <span className="text-white font-medium capitalize">{message.faceAnalysis.faceShape}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Confidence:</span>
                                  <span className="text-green-400 font-medium">
                                    {(message.faceAnalysis.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                  <div>
                                    <span className="text-gray-400">Eyes:</span>
                                    <span className="text-sky_blue ml-1">{message.faceAnalysis.features.eyeDistance}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Width:</span>
                                    <span className="text-sky_blue ml-1">{message.faceAnalysis.features.faceWidth}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Jawline:</span>
                                    <span className="text-sky_blue ml-1">{message.faceAnalysis.features.jawline}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Cheeks:</span>
                                    <span className="text-sky_blue ml-1">{message.faceAnalysis.features.cheekbones}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Glasses Recommendations */}
                          {message.glassesRecommendations && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-4 space-y-3"
                            >
                              <div className="flex items-center space-x-2 mb-3">
                                <Crown className="w-4 h-4 text-selective_yellow" />
                                <span className="text-sm font-bold text-selective_yellow">AI Recommendations</span>
                              </div>
                              {message.glassesRecommendations.map((rec, index) => (
                                <div 
                                  key={index}
                                  className="p-3 bg-gradient-to-r from-blue_green/10 to-prussian_blue/10 rounded-xl border border-blue_green/20"
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Eye className="w-4 h-4 text-blue_green" />
                                    <span className="text-sm font-bold text-blue_green">{rec.style}</span>
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-3 h-3 text-selective_yellow fill-current" />
                                      <span className="text-xs text-selective_yellow">
                                        {(rec.confidence * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-300 mb-2">{rec.reason}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {rec.examples.map((example, i) => (
                                      <span 
                                        key={i}
                                        className="text-xs px-2 py-1 bg-sky_blue/20 text-sky_blue rounded-full"
                                      >
                                        {example}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}

                          {/* Timestamp */}
                          <div className="mt-2 text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-selective_yellow to-ut_orange flex items-center justify-center">
                        <Bot className="w-4 h-4 text-prussian_blue" />
                      </div>
                      <div className="bg-gradient-to-r from-sky_blue/10 to-blue_green/10 border border-sky_blue/20 rounded-2xl p-4">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 text-blue_green animate-spin" />
                          <span className="text-sm text-blue_green">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-sky_blue/20 bg-gradient-to-r from-sky_blue/5 to-blue_green/5">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-gradient-to-r from-selective_yellow/20 to-ut_orange/20 hover:from-selective_yellow/30 hover:to-ut_orange/30 rounded-xl border border-selective_yellow/30 transition-all"
                    >
                      <ImageIcon className="w-4 h-4 text-selective_yellow" />
                    </motion.button>
                    <span className="text-xs text-gray-400">Upload photo for AI analysis</span>
                  </div>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about glasses or upload a photo..."
                    className="w-full bg-white/10 border border-sky_blue/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue_green focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-blue_green to-prussian_blue hover:from-prussian_blue hover:to-blue_green disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-ocean"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;
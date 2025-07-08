import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Sliders, 
  Share2, 
  Download, 
  FileText, 
  Zap, 
  Star,
  Users,
  BarChart3,
  Settings,
  Crown,
  Sparkles
} from 'lucide-react';

interface AdvancedFeaturesProps {
  onColorChange?: (color: string) => void;
  onFilterChange?: (filter: string) => void;
  onExport?: (format: string) => void;
}

const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({
  onColorChange,
  onFilterChange,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState('filters');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedFilter, setSelectedFilter] = useState('none');

  const tabs = [
    { id: 'filters', label: 'Filters', icon: Sliders },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const filters = [
    { id: 'none', name: 'Original', preview: 'brightness(1)' },
    { id: 'vintage', name: 'Vintage', preview: 'sepia(0.8) contrast(1.2)' },
    { id: 'cool', name: 'Cool', preview: 'hue-rotate(180deg) saturate(1.2)' },
    { id: 'warm', name: 'Warm', preview: 'hue-rotate(30deg) saturate(1.1)' },
    { id: 'dramatic', name: 'Dramatic', preview: 'contrast(1.5) brightness(0.9)' },
    { id: 'soft', name: 'Soft', preview: 'blur(0.5px) brightness(1.1)' },
  ];

  const colors = [
    '#000000', '#8B4513', '#FF6B6B', '#4ECDC4', 
    '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FF69B4', '#32CD32', '#FF4500', '#9370DB'
  ];

  const exportFormats = [
    { id: 'png', name: 'PNG', description: 'High quality with transparency' },
    { id: 'jpg', name: 'JPEG', description: 'Compressed for sharing' },
    { id: 'pdf', name: 'PDF', description: 'Professional document' },
    { id: 'gif', name: 'GIF', description: 'Animated sequence' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="flex items-center space-x-4">
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-75"></div>
            <div className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              Pro Studio Features
            </h2>
            <p className="text-sm text-gray-300">Advanced editing and analytics tools</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex space-x-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'filters' && (
            <motion.div
              key="filters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Photo Filters</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filters.map((filter, index) => (
                  <motion.button
                    key={filter.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedFilter(filter.id);
                      onFilterChange?.(filter.preview);
                    }}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedFilter === filter.id
                        ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div 
                      className="w-full h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg mb-3"
                      style={{ filter: filter.preview }}
                    />
                    <div className="text-sm font-medium text-white">{filter.name}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Frame Colors</h3>
              <div className="grid grid-cols-6 gap-4">
                {colors.map((color, index) => (
                  <motion.button
                    key={color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedColor(color);
                      onColorChange?.(color);
                    }}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color
                        ? 'border-white shadow-lg scale-110'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Custom Color</h4>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    onColorChange?.(e.target.value);
                  }}
                  className="w-full h-12 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Export Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportFormats.map((format, index) => (
                  <motion.button
                    key={format.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onExport?.(format.id)}
                    className="p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all text-left"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <FileText className="w-6 h-6 text-blue-400" />
                      <span className="text-lg font-bold text-white">{format.name}</span>
                    </div>
                    <p className="text-sm text-gray-400">{format.description}</p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Share2 className="w-6 h-6 text-blue-400" />
                  <h4 className="text-lg font-bold text-white">Share Options</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors"
                  >
                    Social Media
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 text-green-300 hover:bg-green-500/30 transition-colors"
                  >
                    Email
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Usage Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">1,247</div>
                      <div className="text-sm text-gray-400">Try-ons Today</div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-300">+23% from yesterday</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Star className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">4.9</div>
                      <div className="text-sm text-gray-400">Avg Rating</div>
                    </div>
                  </div>
                  <div className="text-xs text-green-300">Based on 892 reviews</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">99.2%</div>
                      <div className="text-sm text-gray-400">Accuracy</div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-300">AI Detection Rate</div>
                </motion.div>
              </div>

              <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-lg font-bold text-white">Popular Styles</h4>
                </div>
                <div className="space-y-3">
                  {['Classic Round', 'Modern Aviator', 'Vintage Square'].map((style, index) => (
                    <div key={style} className="flex items-center justify-between">
                      <span className="text-gray-300">{style}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${85 - index * 15}%` }}
                            transition={{ delay: index * 0.2, duration: 1 }}
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                          />
                        </div>
                        <span className="text-sm text-gray-400">{85 - index * 15}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdvancedFeatures;
import React from 'react';
import { X, Download, Share2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScreenshotModalProps {
  isOpen: boolean;
  imageData: string | null;
  onClose: () => void;
  onShare?: () => void;
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({ isOpen, imageData, onClose, onShare }) => {
  const downloadImage = () => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.download = `virtualspecs-tryOn-${Date.now()}.png`;
    link.href = imageData;
    link.click();
  };

  const shareImage = async () => {
    if (!imageData || !navigator.share) {
      // Fallback to custom share modal
      onShare?.();
      return;
    }
    
    try {
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], 'virtualspecs-tryOn.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'My VirtualSpecs Try-On',
        text: 'Check out how I look in these glasses from VirtualSpecs AI!',
        files: [file],
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to custom share modal
      onShare?.();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && imageData && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/50 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-8">
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-8"
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75"></div>
                    <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      Your Virtual Try-On
                    </h2>
                    <p className="text-sm text-gray-400">Looking great! Share or save your photo</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </motion.button>
              </motion.div>
              
              {/* Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                  <img
                    src={imageData}
                    alt="Virtual try-on screenshot"
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>
              </motion.div>
              
              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadImage}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-blue-500/25"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareImage}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/25"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </motion.button>
              </motion.div>

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 pt-6 border-t border-white/10 text-center"
              >
                <p className="text-xs text-gray-500">
                  Powered by VirtualSpecs AI • Next-generation virtual try-on technology
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenshotModal;
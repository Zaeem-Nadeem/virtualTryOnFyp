import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  X, 
  Check, 
  Image as ImageIcon, 
  Sparkles,
  AlertCircle,
  RotateCcw,
  Crop,
  Palette,
  Wand2,
  Crown,
  Zap,
  Settings
} from 'lucide-react';

interface CustomGlassesUploadProps {
  onGlassesUploaded: (imageUrl: string, name: string) => void;
  onClose: () => void;
}

const CustomGlassesUpload: React.FC<CustomGlassesUploadProps> = ({ 
  onGlassesUploaded, 
  onClose 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [glassesName, setGlassesName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'customize'>('upload');
  const [processingStep, setProcessingStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, JPEG, GIF)');
      setIsProcessing(false);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setIsProcessing(false);
      return;
    }

    try {
      setProcessingStep('Loading image...');
      const imageUrl = await processImage(file);
      setUploadedImage(imageUrl);
      
      setProcessingStep('Enhancing quality...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProcessingStep('Optimizing for virtual try-on...');
      const enhanced = await enhanceImage(imageUrl);
      setProcessedImage(enhanced);
      
      setProcessingStep('Finalizing...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGlassesName(file.name.replace(/\.[^/.]+$/, '') || 'My Custom Glasses');
      setStep('preview');
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const processImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) {
            reject(new Error('Canvas not available'));
            return;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Set canvas size to maintain aspect ratio
          const maxWidth = 800;
          const maxHeight = 400;
          let { width, height } = img;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and process the image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to data URL
          const processedImageUrl = canvas.toDataURL('image/png', 0.9);
          resolve(processedImageUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const enhanceImage = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve(imageUrl);
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Apply professional image enhancements
        ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
        ctx.drawImage(img, 0, 0);

        // Add subtle glow effect for custom glasses
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(2px)';
        ctx.globalAlpha = 0.1;
        ctx.drawImage(img, 0, 0);

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.filter = 'none';

        const enhancedImageUrl = canvas.toDataURL('image/png', 0.95);
        resolve(enhancedImageUrl);
      };
      img.src = imageUrl;
    });
  };

  const handleConfirm = () => {
    if ((processedImage || uploadedImage) && glassesName.trim()) {
      onGlassesUploaded(processedImage || uploadedImage!, glassesName.trim());
      onClose();
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setGlassesName('');
    setStep('upload');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/50 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent">
                  Upload Custom Glasses
                </h2>
                <p className="text-sm text-gray-400">Professional AI-enhanced processing</p>
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
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Upload Step */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    dragActive
                      ? 'border-green-400 bg-green-500/10 shadow-2xl shadow-green-500/25'
                      : 'border-white/20 hover:border-green-400/50 hover:bg-green-500/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <motion.div 
                    animate={{ 
                      y: dragActive ? -10 : [0, -5, 0],
                      scale: dragActive ? 1.1 : 1,
                      rotate: dragActive ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: dragActive ? 0 : Infinity }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl"></div>
                    <div className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full p-6 border border-green-500/20">
                      <ImageIcon className="w-20 h-20 mx-auto text-green-400" />
                    </div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {dragActive ? 'Drop your glasses image here' : 'Upload Custom Glasses'}
                  </h3>
                  <p className="text-gray-400 mb-6 text-lg">
                    Professional AI processing for perfect virtual try-on
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center space-x-3">
                      <Upload className="w-5 h-5" />
                      <span>Choose File</span>
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </motion.button>
                </div>

                {/* Professional Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <Wand2 className="w-6 h-6 text-blue-400" />
                      <h4 className="text-lg font-bold text-white">AI Enhancement</h4>
                    </div>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>Automatic quality enhancement</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-blue-400" />
                        <span>Optimal sizing for face tracking</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Professional glow effects</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <Crown className="w-6 h-6 text-green-400" />
                      <h4 className="text-lg font-bold text-white">Premium Features</h4>
                    </div>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Custom badge & styling</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Priority in collection</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Enhanced visual effects</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span>Tips for Best Results</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>High-resolution images (400x200px+)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Centered and clearly visible glasses</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Transparent background (PNG preferred)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Sharp, non-blurry images</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Processing State */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-3xl"
                    >
                      <div className="text-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="relative mb-6"
                        >
                          <div className="w-20 h-20 border-4 border-green-500/30 rounded-full"></div>
                          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
                        </motion.div>
                        <motion.p 
                          key={processingStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-white font-medium text-lg mb-2"
                        >
                          {processingStep}
                        </motion.p>
                        <p className="text-gray-400">AI is enhancing your glasses...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Preview Step */}
            {step === 'preview' && (uploadedImage || processedImage) && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <span>Your Premium Custom Glasses</span>
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </h3>
                  <p className="text-gray-400">AI-enhanced and ready for virtual try-on</p>
                </div>

                {/* Before/After Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uploadedImage && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300 text-center">Original</h4>
                      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <img
                          src={uploadedImage}
                          alt="Original glasses"
                          className="w-full max-h-48 object-contain rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                  
                  {processedImage && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-green-300 text-center flex items-center justify-center space-x-2">
                        <Wand2 className="w-4 h-4" />
                        <span>AI Enhanced</span>
                        <Sparkles className="w-4 h-4" />
                      </h4>
                      <div className="relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-4 border border-green-500/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
                        <img
                          src={processedImage}
                          alt="Enhanced glasses"
                          className="relative w-full max-h-48 object-contain rounded-xl"
                          style={{
                            filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhancement Features */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Applied Enhancements</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Settings, label: 'Quality Boost', color: 'text-blue-400' },
                      { icon: Sparkles, label: 'Glow Effect', color: 'text-purple-400' },
                      { icon: Palette, label: 'Color Enhance', color: 'text-pink-400' },
                      { icon: Crown, label: 'Premium Style', color: 'text-yellow-400' }
                    ].map((enhancement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                          className={`${enhancement.color} mb-2`}
                        >
                          <enhancement.icon className="w-6 h-6 mx-auto" />
                        </motion.div>
                        <p className="text-xs text-gray-300">{enhancement.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300 flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>Custom Glasses Name</span>
                  </label>
                  <input
                    type="text"
                    value={glassesName}
                    onChange={(e) => setGlassesName(e.target.value)}
                    placeholder="Enter a name for your premium glasses"
                    className="w-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetUpload}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Upload Different</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirm}
                    disabled={!glassesName.trim()}
                    className="group relative flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      <Crown className="w-5 h-5" />
                      <span>Add to Premium Collection</span>
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </motion.div>
    </motion.div>
  );
};

export default CustomGlassesUpload;
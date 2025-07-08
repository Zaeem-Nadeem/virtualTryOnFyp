import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  Star, 
  Camera, 
  Download,
  Instagram,
  Facebook,
  Twitter,
  Copy,
  Check
} from 'lucide-react';

interface SocialFeaturesProps {
  imageData?: string | null;
  onClose?: () => void;
}

const SocialFeatures: React.FC<SocialFeaturesProps> = ({ imageData, onClose }) => {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 50);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'Sarah M.', text: 'Those glasses look amazing on you! 😍', time: '2m ago' },
    { id: 2, user: 'Mike R.', text: 'Perfect fit! Where did you get them?', time: '5m ago' },
    { id: 3, user: 'Emma L.', text: 'Love the style! 🔥', time: '8m ago' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setComments(prev => [{
        id: Date.now(),
        user: 'You',
        text: newComment,
        time: 'now'
      }, ...prev]);
      setNewComment('');
    }
  };

  const handleShare = async (platform: string) => {
    const text = "Check out how I look in these glasses! 👓 #VirtualTryOn #Glasses";
    const url = window.location.href;

    switch (platform) {
      case 'instagram':
        // Instagram doesn't support direct sharing, so we'll copy to clipboard
        await copyToClipboard(text);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await copyToClipboard(`${text} ${url}`);
        break;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadImage = () => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.download = `virtual-tryOn-${Date.now()}.png`;
    link.href = imageData;
    link.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/95 via-purple-900/50 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl max-w-2xl mx-auto"
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
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-75"></div>
              <div className="relative p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">
                Share Your Look
              </h2>
              <p className="text-sm text-gray-400">Show off your virtual try-on</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {imageData && (
        <div className="p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden mb-6"
          >
            <img
              src={imageData}
              alt="Virtual try-on"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </motion.div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likes}</span>
              </motion.button>
              
              <div className="flex items-center space-x-2 text-gray-400">
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium">{comments.length}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-6 h-6" />
                <span className="font-medium">247</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadImage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Save</span>
            </motion.button>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('instagram')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Instagram className="w-5 h-5" />
              <span className="hidden sm:block">Instagram</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('facebook')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Facebook className="w-5 h-5" />
              <span className="hidden sm:block">Facebook</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('twitter')}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Twitter className="w-5 h-5" />
              <span className="hidden sm:block">Twitter</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('copy')}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="hidden sm:block">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Comments</h3>
            
            {/* Add Comment */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">Y</span>
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  Post
                </motion.button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {comment.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium text-sm">{comment.user}</span>
                          <span className="text-gray-400 text-xs">{comment.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SocialFeatures;
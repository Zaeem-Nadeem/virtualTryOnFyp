import React, { useState } from 'react';
import { GlassesProduct } from '../types';
import { ShoppingCart, Eye, Star, Zap, Sparkles, Filter, Grid, List, Plus, Upload, Crown, Badge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomGlassesUpload from './CustomGlassesUpload';

interface ProductSelectorProps {
  products: GlassesProduct[];
  selectedProduct: GlassesProduct | null;
  onSelectProduct: (product: GlassesProduct) => void;
  onAddToCart: (product: GlassesProduct) => void;
  onAddCustomGlasses?: (imageUrl: string, name: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onAddToCart,
  onAddCustomGlasses,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products
    .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Glasses': 'from-professional-medium-lavender to-professional-deep-lavender',
      'Sunglasses': 'from-orange-400 to-red-500',
      'Gaming': 'from-purple-500 to-pink-500',
      'Custom': 'from-green-500 to-emerald-500',
      'All': 'from-professional-light-lavender to-professional-medium-lavender'
    };
    return colors[category as keyof typeof colors] || 'from-professional-light-lavender to-professional-medium-lavender';
  };

  const handleCustomGlassesUpload = (imageUrl: string, name: string) => {
    if (onAddCustomGlasses) {
      onAddCustomGlasses(imageUrl, name);
    }
    setShowUploadModal(false);
  };

  const getProductDisplayImage = (product: GlassesProduct) => {
    if (product.category === 'Custom') {
      return product.image; // Custom images are already processed
    }
    return product.image;
  };

  const isCustomProduct = (product: GlassesProduct) => {
    return product.category === 'Custom';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card rounded-3xl border-professional p-6 shadow-professional-xl"
      >
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-professional-button rounded-xl blur opacity-75"></div>
              <div className="relative p-3 bg-professional-button rounded-xl shadow-professional">
                <Zap className="w-6 h-6 text-professional-cream" />
              </div>
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-professional-deep-lavender">
                Premium Collection
              </h2>
              <p className="text-sm text-professional-medium-lavender">Handpicked designer frames & custom uploads</p>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-professional hover:shadow-professional-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
                <span>Upload Custom</span>
                <Upload className="w-4 h-4" />
              </div>
            </motion.button>

            <div className="flex items-center glass-card rounded-xl p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-professional ${
                  viewMode === 'grid' 
                    ? 'bg-professional-button text-professional-cream shadow-professional' 
                    : 'text-professional-medium-lavender hover:text-professional-deep-lavender'
                }`}
              >
                <Grid className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-professional ${
                  viewMode === 'list' 
                    ? 'bg-professional-button text-professional-cream shadow-professional' 
                    : 'text-professional-medium-lavender hover:text-professional-deep-lavender'
                }`}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-4"
        >
          {/* Category Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-professional-medium-lavender" />
              <span className="text-sm font-medium text-professional-deep-lavender">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-professional ${
                    selectedCategory === category
                      ? `bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-professional`
                      : 'glass-card text-professional-medium-lavender hover:bg-professional-card hover:text-professional-deep-lavender'
                  }`}
                >
                  {category === 'Custom' && (
                    <Crown className="w-4 h-4" />
                  )}
                  <span>{category}</span>
                  {category === 'Custom' && (
                    <Badge className="w-3 h-3" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-professional-medium-lavender">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'category')}
                className="glass-card border border-professional rounded-lg px-3 py-1 text-sm text-professional-deep-lavender focus:outline-none focus:ring-2 focus:ring-professional-medium-lavender"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="category">Category</option>
              </select>
            </div>
            <div className="text-sm text-professional-medium-lavender">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Products Grid/List */}
      <motion.div 
        layout
        className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group relative ${
                isCustomProduct(product) 
                  ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20' 
                  : 'glass-card border-professional'
              } rounded-2xl border transition-professional cursor-pointer overflow-hidden shadow-professional ${
                selectedProduct?.id === product.id
                  ? 'border-professional-medium-lavender bg-professional-medium-lavender/10 shadow-professional-lg'
                  : 'hover:border-professional-strong hover:shadow-professional-lg'
              } ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}`}
              onClick={() => onSelectProduct(product)}
            >
              {/* Selection Indicator */}
              {selectedProduct?.id === product.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 z-10"
                >
                  <div className="bg-professional-button rounded-full p-2 shadow-professional">
                    <Star className="w-5 h-5 text-professional-cream fill-current" />
                  </div>
                </motion.div>
              )}

              {/* Custom Badge */}
              {isCustomProduct(product) && (
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-3 left-3 z-10"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full px-3 py-1 text-xs font-bold text-white shadow-professional flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Custom</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </motion.div>
              )}

              {/* Premium Badge for Custom */}
              {isCustomProduct(product) && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-3 right-3 z-10"
                >
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-2 shadow-professional">
                    <Badge className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              )}

              {/* Glow Effect */}
              {selectedProduct?.id === product.id && (
                <div className="absolute inset-0 bg-professional-medium-lavender/10 rounded-2xl blur-xl"></div>
              )}

              {/* Custom Glow for Custom Products */}
              {isCustomProduct(product) && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
              )}

              <div className={`relative ${viewMode === 'list' ? 'flex items-center space-x-4 w-full' : ''}`}>
                {/* Product Image */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`relative overflow-hidden rounded-xl ${
                    isCustomProduct(product) 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30' 
                      : 'bg-professional-card'
                  } ${
                    viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'mb-6 h-40'
                  }`}
                >
                  <img
                    src={getProductDisplayImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      filter: isCustomProduct(product) 
                        ? 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))' 
                        : 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Floating Sparkles */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-3 right-3"
                  >
                    <Sparkles className={`w-5 h-5 ${
                      isCustomProduct(product) ? 'text-green-400' : 'text-professional-medium-lavender'
                    }`} />
                  </motion.div>

                  {/* Custom Product Overlay */}
                  {isCustomProduct(product) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-green-500/20 via-transparent to-emerald-500/20"
                    />
                  )}
                </motion.div>
                
                {/* Product Info */}
                <div className={`space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex items-start justify-between' : 'flex items-start justify-between'}`}>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-professional-deep-lavender group-hover:text-professional-medium-lavender transition-colors text-lg">
                          {product.name}
                        </h3>
                        {isCustomProduct(product) && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Crown className="w-4 h-4 text-yellow-500" />
                          </motion.div>
                        )}
                      </div>
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className={`text-xl font-bold ${
                          isCustomProduct(product)
                            ? 'text-green-600'
                            : 'text-professional-deep-lavender'
                        }`}
                      >
                        {product.price === 0 ? 'FREE' : `$${product.price}`}
                      </motion.span>
                    </div>
                  </div>
                  
                  <p className={`text-sm text-professional-medium-lavender ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'}`}>
                    {product.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex items-center space-x-3">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`text-xs px-3 py-1 bg-gradient-to-r ${getCategoryColor(product.category)}/20 text-professional-deep-lavender rounded-full border ${
                        isCustomProduct(product) ? 'border-green-500/30' : 'border-professional'
                      }`}
                    >
                      {product.category}
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`text-xs px-3 py-1 ${
                        isCustomProduct(product) 
                          ? 'bg-green-500/20 text-green-600 border-green-500/30' 
                          : 'bg-professional-medium-lavender/20 text-professional-deep-lavender border-professional'
                      } rounded-full border`}
                    >
                      {product.color}
                    </motion.span>
                    {isCustomProduct(product) && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-600 rounded-full border border-yellow-500/30 flex items-center space-x-1"
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>Yours</span>
                      </motion.span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className={`flex items-center space-x-3 pt-4 ${viewMode === 'list' ? 'pt-2' : ''}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className={`flex-1 ${
                        isCustomProduct(product)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/25'
                          : 'bg-professional-button hover:bg-professional-button-hover shadow-professional'
                      } text-professional-cream py-3 px-4 rounded-xl text-sm font-medium transition-professional flex items-center justify-center space-x-2 shadow-professional hover:shadow-professional-lg`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Try On</span>
                      {isCustomProduct(product) && <Sparkles className="w-4 h-4" />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className={`${
                        isCustomProduct(product)
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-yellow-500/25'
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/25'
                      } text-white p-3 rounded-xl transition-professional shadow-professional hover:shadow-professional-lg`}
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Collection Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-card rounded-3xl border-professional p-6 shadow-professional-xl"
      >
        <div className="text-center">
          <p className="text-xs text-professional-medium-lavender mb-4">Premium Collection Stats</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-professional-deep-lavender">
                {products.filter(p => p.category !== 'Custom').length}
              </div>
              <div className="text-xs text-professional-medium-lavender">Premium Styles</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.category === 'Custom').length}
              </div>
              <div className="text-xs text-professional-medium-lavender">Custom Uploads</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-professional-medium-lavender">
                AI
              </div>
              <div className="text-xs text-professional-medium-lavender">Powered</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-professional-deep-lavender">
                4K
              </div>
              <div className="text-xs text-professional-medium-lavender">Quality</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Custom Glasses Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <CustomGlassesUpload
            onGlassesUploaded={handleCustomGlassesUpload}
            onClose={() => setShowUploadModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductSelector;
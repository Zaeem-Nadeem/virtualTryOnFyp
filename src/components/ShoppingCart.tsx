import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Cart Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-gradient-to-r from-selective_yellow to-ut_orange hover:from-ut_orange hover:to-selective_yellow text-prussian_blue p-4 rounded-full shadow-ocean-xl transition-all duration-200">
          <ShoppingCartIcon className="w-6 h-6" />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white"
              >
                {totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900/95 via-prussian_blue/50 to-slate-900/95 backdrop-blur-2xl border-l border-sky_blue/20 shadow-ocean-xl z-50"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-6 border-b border-sky_blue/20"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl blur opacity-75"></div>
                      <div className="relative p-3 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl">
                        <ShoppingBag className="w-6 h-6 text-prussian_blue" />
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-sky_blue via-blue_green to-selective_yellow bg-clip-text text-transparent">
                        Shopping Cart
                      </h2>
                      <p className="text-sm text-sky_blue">Your selected items</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-sky_blue" />
                  </motion.button>
                </motion.div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence>
                    {cartItems.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-400 mt-16"
                      >
                        <motion.div 
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="relative mb-8"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-sky_blue/20 to-blue_green/20 rounded-full blur-xl"></div>
                          <ShoppingCartIcon className="relative w-24 h-24 mx-auto text-sky_blue" />
                        </motion.div>
                        <p className="text-xl font-medium text-sky_blue mb-3">Your cart is empty</p>
                        <p className="text-sm text-blue_green">Add some glasses to get started!</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-6">
                        {cartItems.map((item, index) => (
                          <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-sky_blue/20 shadow-lg"
                          >
                            <div className="flex items-start space-x-4">
                              <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="relative"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-24 h-24 object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                              </motion.div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white truncate mb-2 text-lg">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-sky_blue mb-4">
                                  ${item.price.toFixed(2)} each
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                      <Minus className="w-4 h-4 text-sky_blue" />
                                    </motion.button>
                                    <motion.span 
                                      key={item.quantity}
                                      initial={{ scale: 1.2 }}
                                      animate={{ scale: 1 }}
                                      className="px-4 py-2 bg-white/10 rounded-xl border border-sky_blue/20 font-bold text-white min-w-[4rem] text-center"
                                    >
                                      {item.quantity}
                                    </motion.span>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                      <Plus className="w-4 h-4 text-sky_blue" />
                                    </motion.button>
                                  </div>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onRemoveItem(item.id)}
                                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                  >
                                    <X className="w-5 h-5" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                            
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="mt-4 pt-4 border-t border-sky_blue/20"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-sky_blue">Subtotal:</span>
                                <span className="font-bold text-lg bg-gradient-to-r from-selective_yellow to-ut_orange bg-clip-text text-transparent">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <AnimatePresence>
                  {cartItems.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="border-t border-sky_blue/20 p-6 space-y-6 bg-gradient-to-r from-slate-900/50 to-prussian_blue/30"
                    >
                      <div className="flex justify-between items-center text-2xl font-bold">
                        <span className="text-white">Total:</span>
                        <motion.span 
                          key={totalPrice}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="bg-gradient-to-r from-selective_yellow to-ut_orange bg-clip-text text-transparent"
                        >
                          ${totalPrice.toFixed(2)}
                        </motion.span>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-selective_yellow to-ut_orange hover:from-ut_orange hover:to-selective_yellow text-prussian_blue py-4 rounded-2xl font-bold transition-all duration-200 shadow-ocean-xl hover:shadow-selective_yellow/25 flex items-center justify-center space-x-3"
                      >
                        <Sparkles className="w-6 h-6" />
                        <span>Checkout ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShoppingCart;
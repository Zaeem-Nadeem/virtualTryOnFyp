import React, { useState } from 'react';
import { GlassesAdjustments } from '../types';
import { Settings, RotateCcw, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';

interface GlassesControlsProps {
  adjustments: GlassesAdjustments;
  onAdjustmentChange: (adjustments: GlassesAdjustments) => void;
  onReset: () => void;
}

const GlassesControls: React.FC<GlassesControlsProps> = ({
  adjustments,
  onAdjustmentChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof GlassesAdjustments, value: number) => {
    onAdjustmentChange({
      ...adjustments,
      [key]: value,
    });
  };

  const controls = [
    {
      key: 'scale' as keyof GlassesAdjustments,
      label: 'Size',
      icon: '⚡',
      min: 0.5,
      max: 2.0,
      step: 0.1,
      value: adjustments.scale,
      color: 'from-blue_green to-sky_blue',
    },
    {
      key: 'offsetX' as keyof GlassesAdjustments,
      label: 'Horizontal',
      icon: '↔️',
      min: -0.5,
      max: 0.5,
      step: 0.01,
      value: adjustments.offsetX,
      color: 'from-selective_yellow to-ut_orange',
    },
    {
      key: 'offsetY' as keyof GlassesAdjustments,
      label: 'Vertical',
      icon: '↕️',
      min: -0.5,
      max: 0.5,
      step: 0.01,
      value: adjustments.offsetY,
      color: 'from-purple-500 to-violet-500',
    },
    {
      key: 'rotation' as keyof GlassesAdjustments,
      label: 'Rotation',
      icon: '🔄',
      min: -0.5,
      max: 0.5,
      step: 0.01,
      value: adjustments.rotation,
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-slate-900/95 via-prussian_blue/50 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-sky_blue/20 overflow-hidden shadow-ocean-xl"
    >
      {/* Toggle Header */}
      <motion.div 
        className="p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: 'rgba(142, 202, 230, 0.05)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl blur opacity-75"></div>
              <div className="relative p-3 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl">
                <Sliders className="w-6 h-6 text-prussian_blue" />
              </div>
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-sky_blue via-blue_green to-selective_yellow bg-clip-text text-transparent">
                Perfect Fit Controls
              </h2>
              <p className="text-sm text-sky_blue">Fine-tune your glasses position</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Switch
              checked={isOpen}
              onChange={setIsOpen}
              className={clsx(
                isOpen ? 'bg-gradient-to-r from-blue_green to-prussian_blue' : 'bg-gray-600',
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue_green focus:ring-offset-2 focus:ring-offset-gray-900'
              )}
            >
              <motion.span
                layout
                className={clsx(
                  isOpen ? 'translate-x-6' : 'translate-x-1',
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
                )}
              />
            </Switch>
            
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-sky_blue" />
              ) : (
                <ChevronDown className="w-5 h-5 text-sky_blue" />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Controls Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="border-t border-sky_blue/20 pt-6">
                <div className="flex justify-end mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    className="bg-white/10 hover:bg-white/20 text-sky_blue hover:text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 border border-sky_blue/20 hover:border-sky_blue/40"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset All</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {controls.map((control, index) => (
                    <motion.div 
                      key={control.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <motion.span 
                            whileHover={{ scale: 1.2 }}
                            className="text-2xl"
                          >
                            {control.icon}
                          </motion.span>
                          <label className="text-sm font-medium text-sky_blue">
                            {control.label}
                          </label>
                        </div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-sky_blue/20"
                        >
                          <span className="text-sm text-white font-mono">
                            {control.value.toFixed(2)}
                          </span>
                        </motion.div>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min={control.min}
                          max={control.max}
                          step={control.step}
                          value={control.value}
                          onChange={(e) => handleChange(control.key, parseFloat(e.target.value))}
                          className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider backdrop-blur-sm border border-sky_blue/20"
                        />
                        <motion.div
                          className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${control.color} rounded-lg pointer-events-none shadow-lg`}
                          style={{
                            width: `${((control.value - control.min) / (control.max - control.min)) * 100}%`,
                          }}
                          animate={{
                            boxShadow: [
                              '0 0 10px rgba(33, 158, 188, 0.3)',
                              '0 0 20px rgba(33, 158, 188, 0.6)',
                              '0 0 10px rgba(33, 158, 188, 0.3)',
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Presets */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-sky_blue/20"
                >
                  <h3 className="text-sm font-medium text-sky_blue mb-4 flex items-center space-x-2">
                    <span>⚡</span>
                    <span>Quick Adjustments</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Small Fit', preset: { scale: 0.8, offsetX: 0, offsetY: 0, rotation: 0 }, color: 'from-blue_green to-sky_blue' },
                      { label: 'Normal Fit', preset: { scale: 1.0, offsetX: 0, offsetY: 0, rotation: 0 }, color: 'from-selective_yellow to-ut_orange' },
                      { label: 'Large Fit', preset: { scale: 1.2, offsetX: 0, offsetY: 0, rotation: 0 }, color: 'from-purple-500 to-violet-500' },
                    ].map((preset, index) => (
                      <motion.button
                        key={preset.label}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onClick={() => onAdjustmentChange(preset.preset)}
                        className={`bg-gradient-to-r ${preset.color} hover:shadow-lg hover:shadow-blue_green/25 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border border-sky_blue/20`}
                      >
                        {preset.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GlassesControls;
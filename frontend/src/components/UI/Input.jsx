import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ label, type = "text", className, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  const labelVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <motion.label
          className="block text-sm font-bold mb-2 transition-colors duration-200"
          variants={labelVariants}
          initial="initial"
          animate="animate"
          style={{
            color: isFocused ? '#39ff14' : 'rgb(156, 163, 175)'
          }}
        >
          {label}
        </motion.label>
      )}
      
      <motion.div className="relative">
        <motion.input
          type={type}
          className={`w-full bg-black border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-gym-green focus:ring-1 focus:ring-gym-green transition duration-200 ${className}`}
          animate={isFocused ? {
            boxShadow: '0 0 12px rgba(57, 255, 20, 0.3)',
            borderColor: '#39ff14'
          } : {
            boxShadow: '0 0 0px rgba(57, 255, 20, 0)',
            borderColor: 'rgb(55, 65, 81)'
          }}
          transition={{ duration: 0.2 }}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gym-green to-transparent rounded-full"
          animate={isFocused ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ originX: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Input;
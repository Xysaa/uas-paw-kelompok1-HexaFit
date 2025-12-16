import React from 'react';
import { motion } from 'framer-motion';

const ContohComponent = ({ children }) => {
  return (
    <motion.div className="contoh-component" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.24 }}>
      {children || <p className="text-sm text-gray-300">ContohComponent: tempat menaruh konten contoh.</p>}
    </motion.div>
  );
};

export default ContohComponent;

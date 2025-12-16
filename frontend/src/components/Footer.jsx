import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer className="footer" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <div className="footer-container">
        <p>&copy; 2025 HexaFit System.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      className="hero-section"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero-gradient"></div>
      
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            NO PAIN <br />
            <span className="hero-title-accent">
              NO GAIN
            </span>
          </h1>
          <p className="hero-description">
            Bergabunglah dengan komunitas kebugaran terbaik. Fasilitas lengkap, pelatih ahli, dan lingkungan yang mendukung transformasi Anda.
          </p>
          <div className="hero-buttons">
            {/*  TOMBOL DAFTAR - Navigasi ke /register */}
            <motion.button 
              onClick={() => navigate('/register')}
              className="hero-btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              DAFTAR SEKARANG
            </motion.button>
            
            {/*  TOMBOL LIHAT JADWAL - Scroll ke #classes */}
            <motion.button 
              onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })}
              className="hero-btn-secondary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              LIHAT JADWAL
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
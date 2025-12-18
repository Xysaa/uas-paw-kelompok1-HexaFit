import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClassCard from '../../components/ClassCard';
import { useAuth } from '../../context/authContext';
import { initialClasses } from "./ClassesData";
import LoadingSpinner from '../../components/LoadingSpinner'; 

const MemberClasses = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulasi fetch data
    setTimeout(() => {
      setClasses(initialClasses);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const categories = ['all', 'cardio', 'strength', 'flexibility', 'yoga'];

  const filteredClasses = selectedCategory === 'all' 
    ? classes 
    : classes.filter(cls => cls.category?.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-gym-black py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          className="mb-10 border-b border-zinc-800 pb-6"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-black text-white mb-2 uppercase"
            variants={itemVariants}
          >
            Kelas <motion.span
              className="text-gym-green"
              animate={{ color: ['#39ff14', '#2ed612', '#39ff14'] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              Tersedia
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-gray-400"
            variants={itemVariants}
          >
            Pilih kelas favoritmu dan mulai latihan hari ini.
          </motion.p>
        </motion.div>

        {/* Filter Categories */}
        <motion.div
          className="mb-12 flex flex-wrap gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-gym-green text-black'
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
              custom={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={selectedCategory === category ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {category === 'all' ? 'Semua Kelas' : category}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid Classes */}
        {filteredClasses.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredClasses.map((cls) => (
              <motion.div
                key={cls.id}
                variants={gridItemVariants}
                layout
              >
                <ClassCard cls={cls} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center text-gray-500 py-20"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.svg
              className="w-16 h-16 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </motion.svg>
            <motion.p
              className="text-lg font-semibold"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Belum ada kelas untuk kategori ini.
            </motion.p>
            <motion.p
              className="text-sm text-gray-600 mt-2"
              variants={itemVariants}
            >
              Coba kategori lain atau kembali lagi nanti.
            </motion.p>
          </motion.div>
        )}

        {/* Results Count */}
        {filteredClasses.length > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <p className="text-gray-400">
              Menampilkan <span className="text-gym-green font-bold">{filteredClasses.length}</span> kelas
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MemberClasses;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/authContext';
import { initialClasses } from './ClassesData';

const TrainerClasses = () => {
  // --- STATE ---
  const [classes, setClasses] = useState(initialClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', schedule: '', instructor: '', capacity: '', description: ''
  });

  // --- HANDLERS ---
  
  const handleAddNew = () => {
    setCurrentClass(null);
    setFormData({ name: '', schedule: '', instructor: '', capacity: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (cls) => {
    setCurrentClass(cls);
    setFormData(cls);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus kelas ini?')) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentClass) {
      setClasses(classes.map((c) => 
        c.id === currentClass.id ? { ...formData, id: currentClass.id } : c
      ));
    } else {
      const newId = classes.length + 1;
      setClasses([...classes, { ...formData, id: newId }]);
    }
    setIsModalOpen(false);
  };

  // --- FRAMER MOTION VARIANTS ---
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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -5,
      boxShadow: '0 20px 40px rgba(57, 255, 20, 0.2)',
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const formFieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gym-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8 border-b border-zinc-800 pb-6"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={headerVariants}>
            <motion.h1
              className="text-4xl font-black text-white mb-2 uppercase italic"
              variants={headerVariants}
            >
              Management <motion.span
                className="text-gym-green"
                animate={{ color: ['#39ff14', '#2ed612', '#39ff14'] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                Kelas
              </motion.span>
            </motion.h1>
            <motion.p className="text-gray-400" variants={headerVariants}>
              Kelola jadwal, kapasitas, dan detail kelas latihan.
            </motion.p>
          </motion.div>
          
          <motion.button
            onClick={handleAddNew}
            className="bg-gym-green hover:bg-white text-black font-bold py-3 px-6 rounded transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center gap-2"
            variants={buttonVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 25px rgba(57, 255, 20, 0.6)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: [0, 90, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </motion.svg>
            TAMBAH KELAS
          </motion.button>
        </motion.div>

        {/* GRID CLASSES */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {classes.map((cls, index) => (
              <motion.div
                key={cls.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative group hover:border-gym-green transition-all duration-300 flex flex-col h-full"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
                custom={index}
              >
                <motion.div variants={cardHoverVariants}>
                  {/* Jadwal */}
                  <motion.div
                    className="flex items-center gap-2 text-gym-green font-bold text-sm mb-4 uppercase tracking-wide"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </motion.svg>
                    {cls.schedule}
                  </motion.div>

                  {/* Judul & Info */}
                  <motion.h3
                    className="text-2xl font-black text-white mb-2 uppercase italic"
                    whileHover={{ color: '#39ff14' }}
                  >
                    {cls.name}
                  </motion.h3>
                  <motion.p className="text-sm text-gray-400 mb-4">
                    Instructor: <span className="text-white">{cls.instructor}</span>
                  </motion.p>
                  
                  {/* Deskripsi */}
                  <motion.p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">
                    {cls.description}
                  </motion.p>

                  {/* Action Buttons */}
                  <motion.div
                    className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-zinc-800"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <motion.button
                      onClick={() => handleEdit(cls)}
                      className="py-2 rounded font-bold text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-colors border border-zinc-700"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(100, 116, 139, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      EDIT
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(cls.id)}
                      className="py-2 rounded font-bold text-sm bg-transparent text-red-500 hover:bg-red-900/20 transition-colors border border-red-900/50"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      HAPUS
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* MODAL FORM */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 w-full max-w-lg shadow-2xl relative"
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.h2
                  className="text-2xl font-bold mb-6 text-white border-l-4 border-gym-green pl-3"
                  variants={formFieldVariants}
                  custom={0}
                >
                  {currentClass ? 'Edit Kelas' : 'Buat Kelas Baru'}
                </motion.h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nama Kelas */}
                  <motion.div variants={formFieldVariants} custom={1}>
                    <label className="text-gray-400 text-sm block mb-1">Nama Kelas</label>
                    <motion.input
                      className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-gym-green focus:outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      whileFocus={{ borderColor: '#39ff14' }}
                    />
                  </motion.div>
                  
                  {/* Jadwal & Kapasitas */}
                  <motion.div
                    className="grid grid-cols-2 gap-4"
                    variants={formFieldVariants}
                    custom={2}
                  >
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Jadwal</label>
                      <motion.input
                        className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-gym-green focus:outline-none"
                        value={formData.schedule}
                        onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                        required
                        whileFocus={{ borderColor: '#39ff14' }}
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Kapasitas</label>
                      <motion.input
                        type="number"
                        className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-gym-green focus:outline-none"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                        required
                        whileFocus={{ borderColor: '#39ff14' }}
                      />
                    </div>
                  </motion.div>

                  {/* Instructor */}
                  <motion.div variants={formFieldVariants} custom={3}>
                    <label className="text-gray-400 text-sm block mb-1">Instructor</label>
                    <motion.input
                      className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-gym-green focus:outline-none"
                      value={formData.instructor}
                      onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                      whileFocus={{ borderColor: '#39ff14' }}
                    />
                  </motion.div>

                  {/* Deskripsi */}
                  <motion.div variants={formFieldVariants} custom={4}>
                    <label className="text-gray-400 text-sm block mb-1">Deskripsi</label>
                    <motion.textarea
                      className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-gym-green focus:outline-none h-24 resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      whileFocus={{ borderColor: '#39ff14' }}
                    />
                  </motion.div>

                  {/* Buttons */}
                  <motion.div
                    className="flex gap-3 mt-6 pt-4"
                    variants={formFieldVariants}
                    custom={5}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 text-gray-400 font-bold hover:text-white transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      BATAL
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 py-3 bg-gym-green text-black font-bold rounded hover:bg-white transition-colors"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 20px rgba(57, 255, 20, 0.6)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      SIMPAN
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default TrainerClasses;
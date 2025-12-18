import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      setSuccess('Pesan Anda berhasil dikirim! Tim kami akan segera merespons.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsLoading(false);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -5,
      boxShadow: '0 15px 30px rgba(57, 255, 20, 0.15)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gym-black">
      
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-b from-zinc-900 to-gym-black border-b border-zinc-800 py-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6"
              variants={itemVariants}
            >
              GET IN <motion.span
                className="text-gym-green"
                animate={{ textShadow: ['0 0 10px rgba(57, 255, 20, 0.3)', '0 0 20px rgba(57, 255, 20, 0.6)', '0 0 10px rgba(57, 255, 20, 0.3)'] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                TOUCH
              </motion.span>
            </motion.h1>
            <motion.p className="text-xl text-gray-400 max-w-3xl mx-auto" variants={itemVariants}>
              Ada pertanyaan? Ingin bergabung? Tim kami siap membantu Anda!
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Contact Information */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2 className="text-3xl font-black text-white mb-8" variants={itemVariants}>
              CONTACT <span className="text-gym-green">INFO</span>
            </motion.h2>

            {/* Location */}
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 hover:border-gym-green transition group"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <div className="flex items-start space-x-4">
                <motion.div
                  className="w-12 h-12 bg-gym-green/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gym-green/20 transition"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <motion.svg
                    className="w-6 h-6 text-gym-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </motion.svg>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Location</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Jl. Terusan Ryacudu<br/>
                    Lampung Selatan 35365<br/>
                    Indonesia
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 hover:border-gym-green transition group"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <div className="flex items-start space-x-4">
                <motion.div
                  className="w-12 h-12 bg-gym-green/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gym-green/20 transition"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <svg className="w-6 h-6 text-gym-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Phone</h3>
                  <p className="text-gray-400 text-sm">+62 812-3456-7890</p>
                  <p className="text-gray-500 text-xs mt-1">Mon - Sun: 06:00 - 22:00</p>
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 hover:border-gym-green transition group"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <div className="flex items-start space-x-4">
                <motion.div
                  className="w-12 h-12 bg-gym-green/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gym-green/20 transition"
                  animate={{ x: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <svg className="w-6 h-6 text-gym-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Email</h3>
                  <p className="text-gray-400 text-sm">info@hexafit.com</p>
                  <p className="text-gray-400 text-sm">support@hexafit.com</p>
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-gym-green transition group"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
              <motion.div
                className="flex space-x-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[0, 1, 2].map((i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-gym-green/10 rounded-lg flex items-center justify-center hover:bg-gym-green hover:text-black transition"
                    variants={itemVariants}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 className="text-3xl font-black text-white mb-8" variants={itemVariants}>
              SEND US A <span className="text-gym-green">MESSAGE</span>
            </motion.h2>

            {success && (
              <motion.div
                className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded text-green-200 text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {success}
              </motion.div>
            )}

            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded text-red-200 text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Input 
                  label="Full Name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input 
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input 
                  label="Subject"
                  type="text"
                  name="subject"
                  placeholder="Membership Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Message
                </label>
                <motion.textarea
                  name="message"
                  rows="5"
                  placeholder="Tulis pesan Anda disini..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-gym-green focus:ring-1 focus:ring-gym-green transition duration-200 resize-none"
                  whileFocus={{ borderColor: '#39ff14' }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button type="submit" isLoading={isLoading} variant="primary">
                  KIRIM PESAN
                </Button>
              </motion.div>
            </motion.form>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
};

export default Contact;
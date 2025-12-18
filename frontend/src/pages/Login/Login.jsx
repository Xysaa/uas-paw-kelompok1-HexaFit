import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/authContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      try {
        if (!email || !password) {
          throw new Error('Email dan password harus diisi');
        }

        if (password.length < 6) {
          throw new Error('Password minimal 6 karakter');
        }

        const userData = {
          id: Date.now(),
          name: email.split('@')[0],
          email: email,
          role: selectedRole
        };

        const fakeToken = 'fake-jwt-token-' + Date.now();

        login(userData, fakeToken);

        if (selectedRole === 'trainer') {
          navigate('/trainer/dashboard');
        } else {
          navigate('/member/dashboard');
        }

      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }, 1000);
  };

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

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gym-black flex items-center justify-center px-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      {/* Animated gradient background */}
      <motion.div
        className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-gym-green/5 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 4 }}
      />

      <motion.div
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-[0_0_20px_rgba(57,255,20,0.1)] relative z-10"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        
        <motion.div
          className="text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-3xl font-black text-white italic tracking-tighter"
            variants={itemVariants}
          >
            Sign In <motion.span
              className="text-gym-green"
              animate={{ textShadow: ['0 0 10px rgba(57, 255, 20, 0.3)', '0 0 20px rgba(57, 255, 20, 0.6)', '0 0 10px rgba(57, 255, 20, 0.3)'] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              HexaFit
            </motion.span>
          </motion.h2>
          <motion.p className="text-gray-500 text-sm mt-2" variants={itemVariants}>
            Welcome back, Warrior!
          </motion.p>
        </motion.div>

        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-200 text-sm text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [1, 0.6, 1], scale: 1 }}
            transition={{ opacity: { repeat: Infinity, duration: 1.5 }, scale: { duration: 0.3 } }}
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
          
          {/* Role Selection */}
          <motion.div variants={itemVariants}>
            <label className="block text-gray-400 text-sm font-bold mb-3">
              Login Sebagai
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => setSelectedRole('member')}
                className={`py-3 px-4 rounded-lg border-2 font-bold transition-all ${
                  selectedRole === 'member'
                    ? 'bg-gym-green text-black border-gym-green'
                    : 'bg-zinc-800 text-white border-zinc-700 hover:border-gym-green'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={selectedRole === 'member' ? { boxShadow: '0 0 15px rgba(57, 255, 20, 0.5)' } : { boxShadow: '0 0 0px rgba(57, 255, 20, 0)' }}
              >
                <motion.svg
                  className="w-6 h-6 mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={selectedRole === 'member' ? { scale: 1.1 } : { scale: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </motion.svg>
                Member
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => setSelectedRole('trainer')}
                className={`py-3 px-4 rounded-lg border-2 font-bold transition-all ${
                  selectedRole === 'trainer'
                    ? 'bg-gym-green text-black border-gym-green'
                    : 'bg-zinc-800 text-white border-zinc-700 hover:border-gym-green'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={selectedRole === 'trainer' ? { boxShadow: '0 0 15px rgba(57, 255, 20, 0.5)' } : { boxShadow: '0 0 0px rgba(57, 255, 20, 0)' }}
              >
                <motion.svg
                  className="w-6 h-6 mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={selectedRole === 'trainer' ? { scale: 1.1 } : { scale: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </motion.svg>
                Trainer
              </motion.button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input 
              label="Email Address"
              type="email" 
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Input 
              label="Password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button type="submit" isLoading={isLoading} variant="primary">
              MASUK SEKARANG
            </Button>
          </motion.div>
        </motion.form>

        <motion.p
          className="mt-6 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Belum punya akun?{' '}
          <motion.span
            whileHover={{ color: '#39ff14' }}
          >
            <Link to="/register" className="text-gym-green font-bold hover:underline transition">
              Daftar Member Baru
            </Link>
          </motion.span>
        </motion.p>

        {/* Demo Credentials Info */}
        <motion.div
          className="mt-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.p
            className="text-xs text-gray-500 text-center mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            💡 Demo Mode - Pilih role dan login dengan email/password apa saja
          </motion.p>
          <p className="text-xs text-gray-400 text-center">Password minimal 6 karakter</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
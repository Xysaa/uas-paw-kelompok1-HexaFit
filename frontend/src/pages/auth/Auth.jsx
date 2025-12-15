import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Untuk pindah halaman setelah login
import { authApi } from '../../api/authApi'; // Import service yg kita buat

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  // State untuk menyimpan input user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // State untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle perubahan input ketikan
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle saat tombol ditekan
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Logika Login
        await authApi.login(formData.email, formData.password);
        alert("Login Berhasil!");
        navigate('/'); // Pindah ke Home setelah sukses
      } else {
        // Logika Register
        await authApi.register(formData.name, formData.email, formData.password);
        alert("Register Berhasil! Silakan Login.");
        setIsLogin(true); // Pindah ke mode login
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background blobs tetap sama... */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-secondary/50 backdrop-blur-lg border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {isLogin ? 'Welcome Back' : 'Join HexaFit'}
        </h2>
        
        {/* Tampilkan Error jika ada */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
             <div className="space-y-1">
               <label className="text-sm text-gray-400">Full Name</label>
               <input 
                 type="text" 
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 className="w-full bg-dark border border-gray-700 rounded p-3 text-white focus:border-primary outline-none transition" 
                 required
               />
             </div>
          )}
          
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-dark border border-gray-700 rounded p-3 text-white focus:border-primary outline-none transition" 
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-dark border border-gray-700 rounded p-3 text-white focus:border-primary outline-none transition" 
              required
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full font-bold py-3 rounded mt-6 transition ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-lime-400 text-black'}`}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(''); // Reset error saat ganti mode
            }} 
            className="text-primary hover:underline font-semibold"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
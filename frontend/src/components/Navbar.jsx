import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/hexafit2.png';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-dark/90 backdrop-blur-md border-b border-gray-800 z-50 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <img 
            src={logo} 
            alt="Hexafit Logo" 
            className="h-12 w-auto object-contain" // <-- Atur tinggi logo di sini (h-10, h-12, h-14 sesuai selera)
          />
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <Link to="/classes" className="hover:text-primary transition">Classes</Link>
          <Link to="/schedule" className="hover:text-primary transition">Schedule</Link>
        </div>

        <Link to="/login">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-black px-5 py-2 rounded-full font-semibold hover:bg-lime-400 transition"
          >
            Sign In
          </motion.button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

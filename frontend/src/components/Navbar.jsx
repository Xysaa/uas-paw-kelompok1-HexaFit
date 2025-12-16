import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-gym-black border-b border-gray-800 sticky top-0 z-50 shadow-lg shadow-green-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-black italic tracking-wider text-white">
              Hexa<span className="text-gym-green">Fit</span>
            </span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link to="/" className="text-white hover:text-gym-green px-3 py-2 text-sm font-bold transition uppercase">
                Home
              </Link>
              
              {/* Show Dashboard link jika sudah login */}
              {isAuthenticated && (
                <Link 
                  to={user?.role === 'trainer' ? '/trainer/dashboard' : '/member/dashboard'} 
                  className="text-white hover:text-gym-green px-3 py-2 text-sm font-bold transition uppercase"
                >
                  Dashboard
                </Link>
              )}
              
              <a href="#classes" className="text-white hover:text-gym-green px-3 py-2 text-sm font-bold transition uppercase">
                Classes
              </a>
              
              {/* Show Login atau User Menu */}
              {!isAuthenticated ? (
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-transparent border-2 border-gym-green text-gym-green hover:bg-gym-green hover:text-black px-6 py-2 rounded-full text-sm font-extrabold transition-all duration-300 transform hover:scale-105"
                >
                  LOGIN
                </button>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition"
                  >
                    <div className="w-8 h-8 bg-gym-green rounded-full flex items-center justify-center font-bold text-black">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-bold text-sm">{user?.name}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg py-2">
                      <div className="px-4 py-2 border-b border-zinc-700">
                        <p className="text-xs text-gray-500 uppercase">Role</p>
                        <p className="text-sm font-bold text-gym-green capitalize">{user?.role}</p>
                      </div>
                      
                      <Link 
                        to={user?.role === 'trainer' ? '/trainer/dashboard' : '/member/dashboard'}
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-white hover:bg-zinc-800 transition"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Dashboard
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
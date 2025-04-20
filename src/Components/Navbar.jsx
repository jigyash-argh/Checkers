import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Start entrance animation after component mounts
    setIsVisible(true);
    
    // Check if user is logged in
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    setUser(storedUser);
    
    // Listen for login/logout events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Handle storage changes (login/logout)
  const handleStorageChange = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    setUser(storedUser);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      console.log('Starting logout process');
      
      // Clear local tokens and user data first to ensure UI updates
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Update user state
      setUser(null);
      
      // Then attempt server logout (even if this fails, user is logged out locally)
      try {
        await logoutUser();
        console.log('Server logout successful');
      } catch (error) {
        console.warn('Server logout failed, but local logout completed:', error);
      }
      
      // Navigate to home
      navigate('/home');
      console.log('Redirected to home page after logout');
    } catch (error) {
      console.error('Logout process error:', error);
      
      // Force logout if there's any error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setUser(null);
      navigate('/home');
    }
  };
  
  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Play', path: '/landing' },
    { name: 'Rules', path: '/rules' },
    { name: 'About', path: '/about-us' }
  ];

  return (
    <div 
      style={{backgroundColor: 'transparent', boxShadow: 'none'}} 
      className={`flex justify-between items-center absolute w-full h-16 bg-transparent px-2 sm:px-6 select-none z-[9999] transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
      }`}
    >
      <div
        className={`mx-2 sm:mx-8 flex items-center text-xl sm:text-2xl font-bold cursor-pointer transform transition-all duration-700 hover:scale-110 hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] rounded-lg ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
        style={{ transitionDelay: '300ms' }}
        onClick={() => navigate('/home')}
      >
        <span className="bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1 rounded-lg text-white animate-pulse">
          P
        </span>
        <h1 className="ml-3 text-white">CheckGate</h1>
      </div>

      <div className={`hidden md:flex flex-1 justify-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`} style={{ transitionDelay: '500ms' }}>
        <div className="flex items-center md:gap-4 lg:gap-10 text-lg md:text-xl lg:text-2xl">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              onClick={() => navigate(item.path)}
              className="relative flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 rounded-lg border-4 border-transparent hover:border-amber-500 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] w-[80px] sm:w-[100px] h-[45px] sm:h-[50px] text-white cursor-pointer group transition-all duration-300"
              style={{ 
                transitionDelay: `${600 + (index * 100)}ms`,
                animation: `fadeSlideIn 0.5s ease forwards ${600 + (index * 150)}ms`,
                transitionProperty: 'transform, background-color, color, box-shadow'
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      <div className={`flex items-center gap-2 sm:gap-5 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
      }`} style={{ transitionDelay: '800ms' }}>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block text-white font-medium">
              <span className="mr-2 text-amber-400 text-2xl">Welcome,</span>
              <span className="text-2xl">{user.username}</span>
            </div>
            <button
              className="h-10 sm:h-12 px-3 sm:px-6 py-1 sm:py-3 w-30 rounded-lg transition-all duration-300 
                      hover:text-white hover:bg-red-600 hover:shadow-[0_0_15px_rgba(220,38,38,0.7)] bg-transparent border-2  border-red-500 text-white mr-2 sm:mr-4 text-lg sm:text-xl hover:scale-105"
              style={{ transitionProperty: 'transform, background-color, color, box-shadow' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="h-10 sm:h-12 px-3 sm:px-6 py-1 sm:py-3 rounded-lg transition-all duration-300 
                      hover:text-white hover:bg-amber-600 hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] bg-transparent border-2 w-25 border-amber-500 text-white mr-2 sm:mr-4 text-lg sm:text-2xl hover:scale-105"
            style={{ transitionProperty: 'transform, background-color, color, box-shadow' }}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
        
        <div className="md:hidden relative text-align-center">
          <button 
            onClick={toggleMenu} 
            className="text-3xl sm:text-4xl focus:outline-none text-white transition-all duration-300 hover:scale-110 hover:text-amber-400 hover:shadow-[0_0_10px_rgba(251,191,36,0.7)] p-1 rounded-full"
            style={{ transitionProperty: 'transform, color, box-shadow' }}
          >
            ☰
          </button>
          
          <div
            className={`absolute top-12 sm:top-16 right-0 border-4 rounded-2xl bg-black/50 backdrop-blur-sm border-amber-500 gap-3 justify-center w-48 sm:w-60 flex flex-col items-center text-lg sm:text-xl font-medium transition-all duration-500 shadow-[0_0_20px_rgba(251,191,36,0.3)] ${
              isMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-5 pointer-events-none'
            }`}
          >
            {user && (
              <div className="w-full px-4 py-2 text-center text-amber-400 border-b border-amber-500/30">
                {user.username}
              </div>
            )}
            
            {navItems.map((item, index) => (
              <a
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className="h-14 sm:h-16 align-middle relative w-full text-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300
                        hover:text-white hover:bg-amber-600 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] group block cursor-pointer text-white"
                style={{ 
                  animation: isMenuOpen ? `fadeIn 0.3s ease forwards ${100 * index}ms` : 'none',
                  transitionProperty: 'background-color, color, transform, box-shadow'
                }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-amber-600 group-hover:w-full transition-all duration-300 shadow-amber-500/50" 
                      style={{ transitionProperty: 'width, box-shadow' }}></span>
              </a>
            ))}
            
            {user && (
              <a
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="h-14 sm:h-16 align-middle relative w-full text-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300
                        hover:text-white hover:bg-red-600 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] group block cursor-pointer text-white"
                style={{ 
                  animation: isMenuOpen ? `fadeIn 0.3s ease forwards ${100 * navItems.length}ms` : 'none',
                  transitionProperty: 'background-color, color, transform, box-shadow'
                }}
              >
                Logout
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-300 shadow-red-500/50" 
                      style={{ transitionProperty: 'width, box-shadow' }}></span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

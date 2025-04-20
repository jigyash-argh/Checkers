import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import checkerimage from '../assets/checkerimage.jpg';

const Homepage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // Start animations after a short delay
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handlePlay = () => {
    if (name.trim() === '') {
      setError('Please enter your name.');
    } else {
      setError('');
      // Save name in localStorage (Alternative: use state in navigate)
      localStorage.setItem('playerName', name);
      navigate('/landing'); // Navigates to AI component
    }
  }; 

  return (
    <div className="flex">
      <div className="fixed gap-20 h-screen w-screen bg-[#23211e] flex flex-col md:flex-row items-center justify-center overflow-hidden">
        
        {/* Left Side - Image with animation */}
        <div 
          className={`w-full md:h-170 md:w-1/2 flex justify-center items-center p-4 transition-all duration-1000 ${
            animationStarted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <img 
            className="h-80 md:h-4/5 w-auto rounded-lg shadow-2xl hover:scale-105 transition-all duration-500" 
            src={checkerimage} 
            alt="Checkers Game"
            style={{ 
              animation: animationStarted ? 'rotateIn 1.2s ease-out forwards' : 'none',
              boxShadow: '0 0 30px rgba(217, 119, 6, 0.6)'
            }}
          />
        </div>

        {/* Right Side - Text & Button with animations */}
        <div className="w-full md:gap-20 gap-10 md:w-1/2 text-white flex flex-col justify-center items-center md:items-start px-6 md:px-12 text-center md:text-left space-y-6">

          {/* Enter Your Name Input with animation */}
          <div 
            className={`w-full transition-all duration-700 ${
              animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <label className="text-xl text-amber-400 font-semibold">Enter Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-10 text-white p-3 w-4/5 md:w-3/4 text-xl rounded-lg border-2 border-amber-400 focus:outline-none focus:border-amber-500 bg-transparent hover:border-amber-300 transition-all duration-300"
              placeholder="Your Name"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Title with animation */}
          <h1 
            className={`text-4xl md:text-5xl font-bold text-amber-500 transition-all duration-1000 ${
              animationStarted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-20 scale-90'
            }`}
            style={{ 
              transitionDelay: '900ms',
              textShadow: '0 0 15px rgba(217, 119, 6, 0.5)'
            }}
          >
            Welcome to CheckGate
          </h1>
          
          {/* Subtitle with animation */}
          <p 
            className={`text-xl md:text-2xl text-gray-300 transition-all duration-700 ${
              animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            Experience the classic game of checkers with smooth gameplay and an interactive UI.
          </p>

          {/* Button with animation */}
          <div 
            className={`w-full flex justify-center items-center transition-all duration-700 ${
              animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: '1500ms' }}
          >
            <button
              onClick={handlePlay}
              className="h-15 w-55 px-6 py-3 text-lg font-semibold rounded-xl border-2 border-amber-500 bg-transparent hover:bg-amber-600 transition-all duration-500 transform hover:scale-110 hover:shadow-xl"
              style={{ 
                animation: animationStarted ? 'bounce 2s ease-in-out 2s' : 'none',
                boxShadow: '0 0 15px rgba(217, 119, 6, 0.3)'
              }}
            >
              Play Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Homepage;

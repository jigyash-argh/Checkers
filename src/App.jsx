import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Homepage from './Pages/Homepage';
import Gamepage from './Components/Gamepage';
import Landingpage from './Pages/Landingpage';
import Ai from './Pages/Ai';
import PlayOffline from './Pages/PlayOffline';
import Rules from './Pages/Rules';
import AboutUs from './Pages/AboutUs';

// Custom Cursor Component
const CustomCursor = () => {
  const cursorGlowRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${clientX}px`;
        cursorGlowRef.current.style.top = `${clientY}px`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${clientX}px`;
        cursorDotRef.current.style.top = `${clientY}px`;
      }
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);
    
    // Detect when hovering over clickable elements
    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'A' || 
          e.target.tagName === 'INPUT' ||
          e.target.onclick ||
          e.target.closest('button') ||
          e.target.closest('a')) {
        setIsActive(true);
      }
    };
    
    const handleMouseOut = (e) => {
      if (e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'A' || 
          e.target.tagName === 'INPUT' ||
          e.target.onclick ||
          e.target.closest('button') ||
          e.target.closest('a')) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorGlowRef} 
        className={`cursor-glow ${isActive ? 'active' : ''}`} 
      />
      <div 
        ref={cursorDotRef} 
        className={`cursor-dot ${isActive ? 'active' : ''}`} 
      />
    </>
  );
};

// Animated page wrapper component
const AnimatedPage = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={`transition-all duration-1000 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </div>
  );
};

AnimatedPage.propTypes = {
  children: PropTypes.node.isRequired
};

const App = () => {
  return (
    <Router>
      <div className="h-full w-full bg-transparent overflow-hidden">
        <CustomCursor />
        <Navbar />
      
        <Routes>
          {/* Redirect "/" to "/home" */}
          <Route path="/" element={<Navigate to="/home" />} />
          
          {/* Page Routes with animations */}
          <Route path="/home" element={<AnimatedPage><Homepage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/game" element={<AnimatedPage><Gamepage /></AnimatedPage>} />
          <Route path="/landing" element={<AnimatedPage><Landingpage /></AnimatedPage>} />
          <Route path="/play-ai" element={<AnimatedPage><Ai /></AnimatedPage>} />
          <Route path="/play-offline" element={<AnimatedPage><PlayOffline /></AnimatedPage>} />
          <Route path="/rules" element={<AnimatedPage><Rules /></AnimatedPage>} />
          <Route path="/about-us" element={<AnimatedPage><AboutUs /></AnimatedPage>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

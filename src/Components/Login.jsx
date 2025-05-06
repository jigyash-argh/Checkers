import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignup && !formData.email) {
      newErrors.email = 'Email is required';
    } else if (isSignup && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    console.log('Form submission started for:', isSignup ? 'signup' : 'login');
    console.log('Form data:', formData);
    
    try {
      let response;
      
      if (isSignup) {
        // Register new user
        console.log('Attempting to register with:', formData);
        response = await registerUser(formData);
        console.log('Register response:', response);
      } else {
        // Login existing user
        console.log('Attempting to login with:', { username: formData.username });
        response = await loginUser({
          username: formData.username,
          password: formData.password
        });
        console.log('Login response:', response);
      }
      
      if (response && response.success && response.token) {
        console.log('Authentication successful, storing token:', response.token);
        // Store token based on "Remember Me" choice
        if (rememberMe) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('Stored in localStorage for persistent session');
        } else {
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('user', JSON.stringify(response.user));
          console.log('Stored in sessionStorage for this session only');
        }
        
        // For demo mode, append 'demo-' prefix to tokens if they don't have it
        if (response.token.includes('demo-token')) {
          console.log('Demo mode detected, ensuring token format is correct');
        }
        
        // Show success message and redirect
        showSuccessMessage();
      } else {
        console.error('Authentication response missing token or success flag:', response);
        setErrors({
          form: 'Server returned invalid response. Please try again.'
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({
        form: error.message || 'Authentication failed. Please try again.'
      });
      setIsLoading(false);
    }
  };
  
  const showSuccessMessage = () => {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50';
    successMessage.innerHTML = `
      <div class="bg-[#1A1814] rounded-lg p-8 flex flex-col items-center shadow-2xl transform scale-0 transition-transform duration-500 border-2 border-red-800">
        <div class="w-16 h-16 rounded-full bg-red-800 flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-red-100">${isSignup ? 'Signup Successful!' : 'Login Successful!'}</h2>
        <p class="text-gray-400 mt-2">Redirecting to homepage...</p>
      </div>
    `;
    document.body.appendChild(successMessage);
    
    // Trigger animation
    setTimeout(() => {
      const messageBox = successMessage.querySelector('div');
      messageBox.classList.remove('scale-0');
      messageBox.classList.add('scale-100');
    }, 10);
    
    // Force redirect after animation
    setTimeout(() => {
      window.location.href = '/home';
    }, 1500);
  };

  // For demo purposes - simulate a successful login when MongoDB is not available
  const handleDemoLogin = (e) => {
    e.preventDefault();
    
    console.log('Using demo login mode (for development without MongoDB)');
    
    // Create a mock user and token
    const mockUser = {
      username: formData.username || 'DemoUser',
      email: formData.email || 'demo@example.com',
      _id: 'demo123456789'
    };
    
    const mockToken = 'demo-token-123456789';
    
    // Store mock data
    if (rememberMe) {
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      console.log('Stored in localStorage for persistent session', { mockToken, mockUser });
    } else {
      sessionStorage.setItem('token', mockToken);
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      console.log('Stored in sessionStorage for this session only', { mockToken, mockUser });
    }
    
    // Show success message
    showSuccessMessage();
  };

  // Checkerboard pattern
  const renderCheckerboard = () => {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const isBlack = (row + col) % 2 === 1;
      squares.push(
        <div 
          key={i} 
          className={`absolute ${isBlack ? 'bg-red-900/20' : 'bg-gray-200/5'}`}
          style={{
            width: '12.5%',
            height: '12.5%',
            top: `${Math.floor(i / 8) * 12.5}%`,
            left: `${(i % 8) * 12.5}%`,
            transition: 'all 0.3s ease',
          }}
        />
      );
    }
    return squares;
  };

  return (
    <div className="h-screen w-screen fixed select-none">
      {/* Background with subtle animated gradient */}
      <div className="fixed bg-gradient-to-br from-[#1A1814] via-[#2C1B18] to-[#0E0A08] h-full w-full flex justify-center items-center overflow-hidden">
        {/* Checkerboard background pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
          <div className="relative w-full h-full">
            {renderCheckerboard()}
          </div>
        </div>
        
        {/* Chess piece decoration top */}
        <div className="absolute top-10 left-1/4 w-32 h-32 opacity-20">
          <div className="w-full h-full rounded-full border-2 border-red-800 flex items-center justify-center">
            <div className="text-red-800 text-6xl transform -translate-y-1">♞</div>
          </div>
        </div>
        
        {/* Chess piece decoration bottom */}
        <div className="absolute bottom-10 right-1/4 w-32 h-32 opacity-20">
          <div className="w-full h-full rounded-full border-2 border-red-800 flex items-center justify-center">
            <div className="text-red-800 text-6xl transform -translate-y-1">♜</div>
          </div>
        </div>

        {/* Login/Signup Form */}
        <div 
          className="relative z-10 shadow-2xl backdrop-blur-sm bg-black/30 border-2 border-red-800 
          w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-lg h-auto
          hover:shadow-red-900/30 hover:shadow-2xl transition-all duration-300 rounded-lg 
          overflow-hidden"
        >
          {/* Top bar */}
          <div className="bg-gradient-to-r from-red-900 to-red-800 h-2 w-full" />
          
          <form 
            onSubmit={handleSubmit}
            className="px-6 py-8 md:p-8 flex flex-col gap-5"
          >
            {/* Form header */}
            <div className="text-center mb-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-800">
                {isSignup ? 'SIGN UP' : 'LOGIN'}
              </h1>
              <div className="mt-2 w-1/3 h-1 bg-red-800 mx-auto rounded-full" />
            </div>
            
            {/* Error message */}
            {errors.form && (
              <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-md text-center text-sm animate-pulse">
                {errors.form}
              </div>
            )}
            
            {/* Email field (signup only) */}
            {isSignup && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="EMAIL" className="text-red-200 text-base md:text-lg font-medium ml-1">Email</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    id="EMAIL" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full bg-black/30 text-gray-100 border px-10 py-2.5 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-red-700 transition-all
                    ${errors.email ? 'border-red-600' : 'border-red-900/50'}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs ml-1 mt-0.5">{errors.email}</p>
                )}
              </div>
            )}

            {/* Username field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="USERNAME" className="text-red-200 text-base md:text-lg font-medium ml-1">Username</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-red-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  id="USERNAME" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your username"
                  className={`w-full bg-black/30 text-gray-100 border px-10 py-2.5 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-red-700 transition-all
                  ${errors.username ? 'border-red-600' : 'border-red-900/50'}`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs ml-1 mt-0.5">{errors.username}</p>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="PASSWORD" className="text-red-200 text-base md:text-lg font-medium ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-red-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  id="PASSWORD" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-black/30 text-gray-100 border px-10 py-2.5 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-red-700 transition-all
                  ${errors.password ? 'border-red-600' : 'border-red-900/50'}`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs ml-1 mt-0.5">{errors.password}</p>
              )}
            </div>
            
            {/* Remember me checkbox */}
            <div className="flex items-center mt-1">
              <div 
                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer mr-3
                  ${rememberMe ? 'bg-red-800 border-red-800' : 'border-gray-500 bg-transparent'}`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <label 
                className="text-gray-300 cursor-pointer text-sm"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember me
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 py-2.5 w-full rounded-md font-semibold text-gray-100
                ${isLoading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>
            
            {/* Alternate login option for demo mode */}
            <div className="flex items-center my-3">
              <div className="flex-grow h-px bg-gray-700"></div>
              <div className="px-4 text-xs text-gray-500">or</div>
              <div className="flex-grow h-px bg-gray-700"></div>
            </div>
            
            <button
              onClick={handleDemoLogin}
              className="py-2 w-full rounded-md font-medium text-gray-300 border border-gray-700 
              hover:border-red-800 hover:text-red-200 transition-all duration-300"
            >
              Demo {isSignup ? 'Signup' : 'Login'} (No MongoDB)
            </button>
            
            {/* Switch between login and signup */}
            <div className="text-center mt-3">
              <p className="text-gray-400 text-sm">
                {isSignup ? 'Already have an account?' : "Don't have an account?"} 
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setErrors({});
                  }}
                  className="ml-2 text-red-400 hover:text-red-300 focus:outline-none font-medium"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

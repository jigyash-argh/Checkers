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
        console.log('Authentication successful, storing token');
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
    successMessage.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    successMessage.innerHTML = `
      <div class="bg-white rounded-lg p-8 flex flex-col items-center shadow-2xl transform scale-0 transition-transform duration-500">
        <div class="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">${isSignup ? 'Signup Successful!' : 'Login Successful!'}</h2>
        <p class="text-gray-600 mt-2">Redirecting to homepage...</p>
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
    } else {
      sessionStorage.setItem('token', mockToken);
      sessionStorage.setItem('user', JSON.stringify(mockUser));
    }
    
    // Show success message
    showSuccessMessage();
  };

  return (
    <div className="h-screen w-screen fixed select-none">
      <div className="fixed bg-gradient-to-tr from-amber-700 to-[#302E2B] h-full w-full flex justify-center items-center">
        <form 
          onSubmit={handleSubmit}
          className="shadow-2xl bg-transparent bg-opacity-50 border-2 border-amber-400 
          w-2/3 lg:w-1/3 xl:w-1/3 h-auto hover:scale-105 hover:shadow-2xl 
          hover:bg-opacity-75 transition-all duration-300 rounded-lg p-6 flex flex-col gap-5"
        >
          
          <h1 className="select-none text-4xl text-center md:text-5xl text-amber-400 font-bold">{isSignup ? 'SIGNUP' : 'LOGIN'}</h1>
          
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
              {errors.form}
            </div>
          )}
          
          {isSignup && (
            <div className="flex flex-col h-30 gap-2">
              <label htmlFor="EMAIL" className="text-gray-700 text-3xl flex items-center justify-center"><b>Email</b></label>
              <div className='flex justify-center flex-col items-center'>
                <input 
                  type="email" 
                  id="EMAIL" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border text-2xl bg-white text-black border-amber-300 rounded-md h-15 w-4/5 px-3 py-2 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 w-4/5">{errors.email}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col h-30 gap-2">
            <label htmlFor="USERNAME" className="text-gray-700 text-3xl flex items-center justify-center"><b>Username</b></label>
            <div className='flex justify-center flex-col items-center'>
              <input 
                type="text" 
                id="USERNAME" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`border text-2xl bg-white text-black border-amber-300 rounded-md h-15 w-4/5 px-3 py-2 ${
                  errors.username ? 'border-red-500' : ''
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1 w-4/5">{errors.username}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col h-30 gap-2">
            <label htmlFor="PASSWORD" className="text-gray-700 text-3xl justify-center flex font-medium"><b>Password</b></label>
            <div className='flex justify-center flex-col items-center'>
              <input 
                type="password" 
                id="PASSWORD" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`border text-2xl bg-white text-black border-amber-300 rounded-md h-15 w-4/5 px-3 py-2 ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 w-4/5">{errors.password}</p>
              )}
            </div>
          </div>

          <label className="flex items-center space-x-2 mt-4 justify-center">
            <input 
              type="checkbox" 
              className="w-5 h-5 text-amber-600" 
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <span className="text-gray-700 text-lg"><b>Remember Me</b></span>
          </label>

          <div className="flex justify-center gap-8 mt-6 h-20">
            <button 
              type="submit"
              disabled={isLoading}
              className={`hover:text-white border-2 rounded-2xl h-10 w-32 border-amber-400 
                hover:bg-gradient-to-tl hover:from-amber-300 hover:to-amber-600 
                hover:scale-110 transition-all duration-300 font-bold relative
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                hover:shadow-[0_0_15px_rgba(251,191,36,0.7)]`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading
                </span>
              ) : (
                isSignup ? 'SIGNUP' : 'LOGIN'
              )}
            </button>

            <button 
              type="button"
              className="hover:text-white border-2 rounded-2xl h-10 w-32 border-blue-400 
              hover:bg-gradient-to-tl hover:from-blue-300 hover:to-blue-600 
              hover:scale-110 transition-transform duration-300 font-bold
              hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
              onClick={() => {
                setIsSignup(!isSignup);
                setErrors({});
              }}
            >
              {isSignup ? 'LOGIN' : 'SIGNUP'}
            </button>
          </div>
          
          {/* Demo login button for development without MongoDB */}
          <div className="mt-4 flex justify-center">
            <button 
              type="button"
              onClick={handleDemoLogin}
              className="text-sm text-amber-700 hover:text-amber-500 hover:underline"
            >
              Use Demo Mode (No MongoDB)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

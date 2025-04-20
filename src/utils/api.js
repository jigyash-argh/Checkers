import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor to attach token to every request
api.interceptors.request.use(
    (config) => {
        // Get token from storage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        // If token exists, add it to request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API calls
export const registerUser = async(userData) => {
    try {
        console.log('Registering user with data:', userData);
        const response = await api.post('/auth/register', userData);
        console.log('Registration successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response && error.response.data && error.response.data.message;
        console.error('Error message:', errorMessage || 'Registration failed');
        throw new Error(errorMessage || 'Registration failed');
    }
};

export const loginUser = async(userData) => {
    try {
        console.log('Logging in user with:', userData);
        const response = await api.post('/auth/login', userData);
        console.log('Login successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response && error.response.data && error.response.data.message;
        console.error('Error message:', errorMessage || 'Login failed');
        throw new Error(errorMessage || 'Login failed');
    }
};

export const getCurrentUser = async() => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to get user details');
    }
};

export const logoutUser = async() => {
    try {
        console.log('Sending logout request to server');
        const response = await api.get('/auth/logout');
        console.log('Logout response from server:', response.data);
        return response.data;
    } catch (error) {
        console.error('Logout API error:', error);
        // Even if server logout fails, clear tokens locally
        console.log('Clearing local storage tokens regardless of server response');
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Logout failed');
    }
};

// Game API calls
export const createGame = async(isPublic = false) => {
    try {
        const response = await api.post('/games', { isPublic });
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to create game');
    }
};

export const joinGame = async(gameCode) => {
    try {
        const response = await api.put(`/games/join/${gameCode}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to join game');
    }
};

export const getPublicGames = async() => {
    try {
        const response = await api.get('/games/public');
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to get public games');
    }
};

export const getMyGames = async() => {
    try {
        const response = await api.get('/games/my-games');
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to get your games');
    }
};

export const getGameById = async(gameId) => {
    try {
        const response = await api.get(`/games/${gameId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to get game details');
    }
};

export const makeMove = async(gameId, moveData) => {
    try {
        const response = await api.put(`/games/${gameId}/move`, moveData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to make move');
    }
};

export const forfeitGame = async(gameId) => {
    try {
        const response = await api.put(`/games/${gameId}/forfeit`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to forfeit game');
    }
};

export default api;
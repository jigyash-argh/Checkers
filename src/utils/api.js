import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Debug function to validate token
export const checkAuthToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    console.log('Current token:', token);
    console.log('Current user:', user);
    return { token, user };
};

// Add interceptor to attach token to every request
api.interceptors.request.use(
    (config) => {
        // Get token from storage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        // If token exists, add it to request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Adding authorization header:', `Bearer ${token}`);
        } else {
            console.warn('No token found in storage');
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
        // Check auth token before making the request
        const { token } = checkAuthToken();
        if (!token) {
            throw new Error('Authentication token is missing. Please log in again.');
        }

        console.log('Creating game with isPublic:', isPublic);
        const response = await api.post('/games', { isPublic });
        console.log('Create game response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Create game error:', error);
        const status = error.response ? error.response.status : null;
        const errorMessage = error.response && error.response.data && error.response.data.message;

        if (status === 401) {
            console.error('Authentication error (401):', errorMessage);
            // Clear tokens if authentication fails
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            throw new Error('Your session has expired. Please log in again.');
        }

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

export const deleteGame = async(gameId) => {
    try {
        const response = await api.delete(`/games/${gameId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message;
        throw new Error(errorMessage || 'Failed to delete game');
    }
};

export default api;
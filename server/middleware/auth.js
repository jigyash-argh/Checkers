import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/default.js';

// Default MongoDB connection status
let isMongoConnected = false;

// Function to get MongoDB connection status
const getMongoStatus = () => {
    return isMongoConnected;
};

// Update MongoDB status (will be called from server.js)
export const setMongoStatus = (status) => {
    isMongoConnected = status;
};

// Protect routes
export const protect = async(req, res, next) => {
    let token;

    // Check if token exists in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Special handling for demo mode
        if (token.startsWith('demo-token')) {
            console.log('Using demo token for authentication');
            // Set a mock user for demo mode
            req.user = {
                id: decoded.id || 'demo123456789',
                username: 'DemoUser',
                email: 'demo@example.com',
                lastActive: new Date()
            };
            return next();
        }

        // Regular authentication with database
        try {
            // Set user on request
            req.user = await User.findById(decoded.id);

            // Update last active time if user exists
            if (req.user) {
                req.user.lastActive = Date.now();
                await req.user.save({ validateBeforeSave: false });
                return next();
            }

            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        } catch (dbError) {
            console.error('Database error in auth middleware:', dbError);

            // If MongoDB is not connected, use a demo user
            if (!getMongoStatus()) {
                console.log('MongoDB not connected - using demo user for authentication');
                req.user = {
                    id: 'demo123456789',
                    username: 'DemoUser',
                    email: 'demo@example.com',
                    lastActive: new Date()
                };
                return next();
            }

            throw dbError; // Re-throw to be caught by outer catch
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};
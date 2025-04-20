import User from '../models/User.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: userExists.email === email ?
                    'Email already registered' : 'Username already taken'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        // Validate email & password
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        // Check for user
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last active time
        user.lastActive = Date.now();
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async(req, res) => {
    console.log('Logout request received for user:', req.user ? req.user.id : 'unknown');
    try {
        // If the user is using a demo token, add special handling
        const authHeader = req.headers.authorization || '';
        if (authHeader.includes('demo-token')) {
            console.log('Logging out demo user');
        }

        // Always return successful logout response
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
            token: null
        });
    } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, send success to client
        // as the frontend will clear tokens anyway
        res.status(200).json({
            success: true,
            message: 'Logged out on client',
            token: null
        });
    }
};

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        user
    });
};
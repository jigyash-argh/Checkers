import mongoose from 'mongoose';
import config from './default.js';

const connectDB = async() => {
    // Use config value but allow override through environment variable
    const mongoURI = process.env.MONGO_URI || config.MONGO_URI;
    console.log(`Attempting MongoDB connection to: ${mongoURI}`);

    // Connect with robust options
    const conn = await mongoose.connect(mongoURI, {
        // These options help with connection stability
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    return conn;
};

export default connectDB;
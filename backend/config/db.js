const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity';
        await mongoose.connect(uri);
        console.log(`[Database] MongoDB connected successfully to ${uri}`);
    } catch (error) {
        console.error(`[Database] Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

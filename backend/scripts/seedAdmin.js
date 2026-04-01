const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../src/modules/auth/schema');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity');
        console.log("Connected to DB...");

        const existing = await User.findOne({ email: 'admin@golfcharity.com' });
        if (existing) {
            console.log('Admin user already exists. Skipping.');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        await User.create({
            name: 'Super Admin',
            email: 'admin@golfcharity.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin user created successfully!');
        console.log('  Email: admin@golfcharity.com');
        console.log('  Password: Admin@123');
        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();

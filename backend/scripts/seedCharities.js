const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Charity = require('../src/modules/charity/schema');

dotenv.config();

const defaultCharities = [
    {
        name: "First Tee",
        description: "Impacts the lives of young people by providing educational programs that build character, instill life-enhancing values and promote healthy choices through the game of golf.",
        image: "https://via.placeholder.com/150/22c55e/ffffff?text=First+Tee"
    },
    {
        name: "Youth on Course",
        description: "Provides youth with access to life-changing opportunities through golf, including $5 rounds of golf and college scholarships.",
        image: "https://via.placeholder.com/150/16a34a/ffffff?text=YoC"
    },
    {
        name: "PGA HOPE",
        description: "Introduces golf to Veterans with disabilities to enhance their physical, mental, social and emotional well-being.",
        image: "https://via.placeholder.com/150/15803d/ffffff?text=PGA+HOPE"
    }
];

const seedCharities = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity');
        console.log("Connected to DB...");

        await Charity.deleteMany({});
        console.log("Cleared existing charities...");

        await Charity.insertMany(defaultCharities);
        console.log("Successfully seeded default charities!");

        process.exit();
    } catch (error) {
        console.error("Error seeding charities:", error);
        process.exit(1);
    }
};

seedCharities();

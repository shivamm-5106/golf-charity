const mongoose = require('mongoose');

const CharitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Charity', CharitySchema);

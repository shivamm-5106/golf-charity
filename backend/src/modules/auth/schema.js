const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    selectedCharity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Charity'
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;

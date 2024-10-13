// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    age: {type: String, default: 0},
    gender: {type: String, default: 0},
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // Role defaults to "user"
});

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;

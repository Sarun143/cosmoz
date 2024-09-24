    // routes/auth.js
    const express = require('express');
    const bcrypt = require('bcrypt');
    const User = require('../model/user')


    const router = express.Router();

    // User Registration
    router.post('/register', async (req, res) => {
        const { name, email, phone, password } = req.body;
        console.log(name, email, phone, password)

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, phone, password: hashedPassword });

        try {
            const savedUser = await newUser.save();
            res.status(201).json({ message: "User registered successfully", user: savedUser });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");  // 🔹 Import JWT
const User = require("../models/User");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";  

// 🔹 User Registration
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in registration:", error); // Debugging
        res.status(500).json({ message: "Server error", error });
    }
});

// 🔹 User Login (Authentication)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        // Generate a JWT Token
        const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in login:", error); // Debugging
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;

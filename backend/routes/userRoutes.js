const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/save', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const newUser = new User({ name, email, role });
      await newUser.save();
      return res.status(201).json({ message: "User saved successfully", user: newUser });
    }

    res.status(200).json({ message: "User already exists", user: existingUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;

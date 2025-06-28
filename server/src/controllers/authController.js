const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.userSignup = async (req, res) => {
  try {
    const { username, password, instrument } = req.body;

    if (!username || !password || !instrument) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await User.create({ username, password, instrument });
    res.status(201).json({ id: newUser._id, username: newUser.username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.adminSignup = async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== process.env.ADMIN_SIGNUP_KEY)
    return res.status(401).json({ message: "Invalid admin key" });

  const { username, password, instrument } = req.body;
  if (!username || !password || !instrument)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const newAdmin = await User.create({
      username,
      password,
      instrument,
      role: "admin",
    });
    res.status(201).json({ id: newAdmin._id, username: newAdmin.username });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Username already exists" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username & password required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
      instrument: user.instrument,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "1d",
    });

    res.json({
      token,
      role: user.role,
      instrument: user.instrument,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const express = require("express");
const router = express.Router();
const {
  userSignup,
  adminSignup,
  login,
} = require("../controllers/authController");

router.get("/ping", (_req, res) => res.json({ message: "pong" }));
router.post("/signup", userSignup);
router.post("/signup/admin", adminSignup);
router.post("/login", login);

module.exports = router;

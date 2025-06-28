const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createSession,
  joinSession,
} = require("../controllers/sessionController");

router.post("/", auth, createSession);
router.post("/:sessionId/join", auth, joinSession);

module.exports = router;

const Session = require("../models/session");

exports.createSession = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  const session = await Session.create({ admin: req.user.id });
  req.app.get("io").to("lobby").emit("sessionStarted", {
    sessionId: session._id.toString(),
  });
  res.status(201).json({ id: session._id });
};
exports.joinSession = async (req, res) => {
  const { sessionId } = req.params;
  const session = await Session.findById(sessionId);
  if (!session || !session.active) {
    return res.status(404).json({ message: "Session not found / inactive" });
  }

  if (!session.participants.includes(req.user.id)) {
    session.participants.push(req.user.id);
    await session.save();
  }
  res.json({ joined: true });
};

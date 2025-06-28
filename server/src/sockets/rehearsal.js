const Session = require("../models/session");

module.exports = (io, socket) => {
  socket.on("joinLobby", () => {
    socket.join("lobby");
    console.log(`User ${socket.user.username} joined lobby`);
  });

  socket.on("joinSession", async ({ sessionId }) => {
    try {
      const session = await Session.findById(sessionId);
      if (!session || !session.active) {
        return socket.emit("error", { message: "Session not found" });
      }

      if (!session.participants.includes(socket.user.id)) {
        session.participants.push(socket.user.id);
        await session.save();
      }

      socket.join(sessionId);
      socket.emit("joined", { ok: true });

      console.log(
        `On Socket [${socket.id}] the User [${socket.user.id}] User Name [${socket.user.username}] joined room ${sessionId}`
      );

      // 🟢 NEW: שליחת שיר נוכחי אם קיים
      if (session.currentSong) {
        socket.emit("songSelected", { song: session.currentSong });
        console.log(
          `Sent existing song '${session.currentSong.title}' to user ${socket.user.username}`
        );
      }
    } catch (err) {
      console.error(err);
      socket.emit("error", { message: "Server Error" });
    }
  });

  socket.on("selectSong", async ({ sessionId, song }) => {
    try {
      if (socket.user.role !== "admin")
        return socket.emit("error", { message: "Admin Only" });

      const session = await Session.findById(sessionId);
      if (!session)
        return socket.emit("error", { message: "Session not found" });

      session.currentSong = song;
      await session.save();

      io.to(sessionId).emit("songSelected", { song });
      console.log(`Song selected for room ${sessionId}: ${song.title}`);
    } catch (err) {
      console.error(err);
      socket.emit("error", { message: "Server Error" });
    }
  });

  socket.on("toggleScroll", ({ sessionId, isScrolling }) => {
    io.to(sessionId).emit("scrollToggled", { isScrolling });
    console.log(`scroll ${isScrolling ? "▶" : "⏸"} in room ${sessionId}`);
  });

  async function closeSession(io, sessionId) {
    const session = await Session.findById(sessionId);
    if (!session || !session.active) return false;

    session.active = false;
    await session.save();

    io.to(sessionId).emit("sessionEnded");
    io.in(sessionId).socketsLeave(sessionId);
    console.log(`Session ${sessionId} closed`);
    return true;
  }

  socket.on("quitSession", async ({ sessionId }) => {
    try {
      console.log("📥 quitSession received:", sessionId);
      console.log(
        "By user:",
        socket.user?.username,
        "role:",
        socket.user?.role
      );

      if (socket.user.role !== "admin") {
        console.log("⛔ Not admin – skipping session close");
        return socket.emit("error", { message: "Admin Only" });
      }

      const ok = await closeSession(io, sessionId);
      if (!ok) {
        console.log("⚠️ Could not close session", sessionId);
        socket.emit("error", { message: "Session not found" });
      }
    } catch (err) {
      console.error(err);
      socket.emit("error", { message: "Server Error" });
    }
  });

  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);

    if (socket.user.role === "admin") {
      const active = await Session.findOne({
        admin: socket.user.id,
        active: true,
      });
      if (active) await closeSession(io, active._id.toString());
    }
  });
};

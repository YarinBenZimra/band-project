/***************************************
 * src/index.js  –  HTTP + Socket.IO
 ***************************************/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // ← שרת HTTP “גולמי”
const { Server } = require("socket.io"); // ← Socket.IO
const jwt = require("jsonwebtoken");
const path = require("path");

const connectDB = require("./config/db");
connectDB();

/* ---------- Express ---------- */
const app = express();
app.use(express.json());
app.use(cors());

/*   REST routes   */
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/session");
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use(
  "/songs",
  express.static(path.join(__dirname, "..", "songs")) // server/songs/veech_shelo.json …
);
app.get("/", (_req, res) => res.send("Server is alive"));

/* ---------- Socket.IO ---------- */
const server = http.createServer(app); // משתפים את אותו פורט
const io = new Server(server, {
  cors: { origin: "*" }, // בפיתוח; בהמשך נצמצם
});
app.set("io", io);
/* 1) Handshake auth – JWT */
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

/* 2) אירועי חזרה (Rehearsal) */
io.on("connection", (socket) => {
  socket.join("lobby");
  console.log("Socket connected", socket.id, "user:", socket.user.username);
  require("./sockets/rehearsal")(io, socket);
});

/* ---------- run ---------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`HTTP + WS listening on ${PORT}`));

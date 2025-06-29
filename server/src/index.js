require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const path = require("path");

const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/session");
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/songs", express.static(path.join(__dirname, "..", "songs")));
app.get("/", (_req, res) => res.send("Server is alive"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
app.set("io", io);
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

io.on("connection", (socket) => {
  socket.join("lobby");
  require("./sockets/rehearsal")(io, socket);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

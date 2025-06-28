// client-user.js  (משתמש יחיד)
const io = require("socket.io-client");
const fetch = (...a) => import("node-fetch").then(({ default: f }) => f(...a));

/* --- נתונים קבועים --- */
const sessionId = "685e83df58c688a9080c3ba1"; // ← id של ה-Session
const USER = {
  // ← המשתמש היחיד
  username: "eden",
  password: "eden123",
};

(async () => {
  /* 1. LOGIN */
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(USER),
  });
  const { token } = await res.json();

  /* 2. socket connect */
  const socket = io("ws://localhost:5000", { auth: { token } });

  socket.on("connect", () => {
    console.log(`${USER.username} connected`);
    socket.emit("joinSession", { sessionId });
  });

  socket.on("joined", () => console.log(`${USER.username} joined room`));
  socket.on("songSelected", (d) =>
    console.log(`${USER.username} received ►`, d.song)
  );
  socket.on("error", (msg) => console.log(`${USER.username} error:`, msg));
})();

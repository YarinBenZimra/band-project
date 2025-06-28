const io = require("socket.io-client");
const fetch = (...a) => import("node-fetch").then(({ default: f }) => f(...a));
const song = require("./src/songs/veech_shelo.json"); // או שיר אחר
const sessionId = "685e83df58c688a9080c3ba1";

(async () => {
  /* 1. LOGIN לקבלת token */
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "yarin", password: "yarin123" }),
  });
  const { token } = await res.json();

  /* 2. חיבור Socket עם token */
  const socket = io("ws://localhost:5000", { auth: { token } });

  socket.on("connect", () => {
    console.log("Admin connected");

    // 3. מצטרף לחזרה (רצוי שגם האדמין יהיה בחדר)
    socket.emit("joinSession", { sessionId });

    // 4. אחרי 2 שניות בוחר שיר
    setTimeout(() => {
      socket.emit("selectSong", { sessionId, song });
      console.log("Admin selected song:", song);
    }, 2000);
  });

  socket.on("joined", () => console.log("Admin joined room"));
  socket.on("error", (msg) => console.log("Admin error:", msg));
})();

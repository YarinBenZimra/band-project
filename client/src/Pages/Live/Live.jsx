import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSocket from "../../hooks/useSocket";
import styles from "./Live.module.css";

export default function Live() {
  /* ====== props from router ====== */
  const { state } = useLocation();
  const navigate = useNavigate();
  const song = state?.song;
  // חשוב: לקחת sessionId גם מ-sessionStorage אם אין ב-state
  const sessionId = state?.sessionId || sessionStorage.getItem("sessionId");
  const role = sessionStorage.getItem("role");
  const instrument = sessionStorage.getItem("instrument");

  /* ====== scrolling ====== */
  const [scrollOn, setScrollOn] = useState(false);
  const contentRef = useRef(null);
  const scrollInt = useRef(null);

  /* ====== socket ====== */
  const socket = useSocket({ sessionId, onSong: () => {} });

  /* מאזינים לאירועים */
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket is null in Live page!");
      return;
    }

    console.log("✅ Socket connected in Live page:", socket.id);

    const toggleHandler = ({ isScrolling }) => setScrollOn(isScrolling);
    socket.on("scrollToggled", toggleHandler);

    const sessionEndedHandler = () => {
      sessionStorage.removeItem("sessionId");
      sessionStorage.removeItem("joinedSession");

      const userRole = sessionStorage.getItem("role");
      if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/player", { replace: true });
      }
    };

    socket.on("sessionEnded", sessionEndedHandler);

    return () => {
      socket.off("scrollToggled", toggleHandler);
      socket.off("sessionEnded", sessionEndedHandler);
    };
  }, [socket, navigate]);

  /* הפעלת / כיבוי סקרול מקומי */
  useEffect(() => {
    clearInterval(scrollInt.current);
    if (scrollOn) {
      scrollInt.current = setInterval(() => {
        contentRef.current?.scrollBy({ top: 1, behavior: "smooth" });
      }, 40);
    }
    return () => clearInterval(scrollInt.current);
  }, [scrollOn]);

  /* ====== פונקציה לסגירת סשן ====== */
  const handleQuitSession = () => {
    if (socket && sessionId) {
      console.log(
        "📤 Quit button clicked, socket:",
        socket.id,
        "sessionId:",
        sessionId
      );
      socket.emit("quitSession", { sessionId });
    } else {
      console.log("❌ Cannot quit - socket or sessionId missing", {
        socket,
        sessionId,
      });
    }
  };

  /* ====== guard ====== */
  if (!song) return <p>No song data</p>;

  /* ====== helpers ====== */
  const renderChunk = (chunk, idx) => {
    /* לזמרים מציגים רק מילים, בלי אקורדים */
    if (instrument === "vocals")
      return (
        <span key={idx} className={styles.wordChunk}>
          <span className={styles.chord} style={{ visibility: "hidden" }}>
            -
          </span>
          <span className={styles.lyric}>{chunk.lyrics}</span>
        </span>
      );

    /* שאר הנגנים - מציגים אקורד אם יש */
    return (
      <span key={idx} className={styles.wordChunk}>
        <span
          className={styles.chord}
          style={{ visibility: chunk.chords ? "visible" : "hidden" }}
        >
          {chunk.chords || "-"}
        </span>
        <span className={styles.lyric}>{chunk.lyrics}</span>
      </span>
    );
  };

  /* ====== JSX ====== */
  return (
    <div className={styles.wrapper}>
      <h1>{song.title}</h1>
      <h3>{song.artist}</h3>

      <div className={styles.content} ref={contentRef}>
        {song.lyrics.map((line, i) => (
          <p key={i}>{line.map(renderChunk)}</p>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          className={styles.toggle}
          onClick={() => {
            if (socket) {
              socket.emit("toggleScroll", {
                sessionId,
                isScrolling: !scrollOn,
              });
              setScrollOn(!scrollOn);
            }
          }}
        >
          {scrollOn ? "⏸ Stop Scroll" : "▶ Start Scroll"}
        </button>

        {role === "admin" && (
          <button className={styles.quit} onClick={handleQuitSession}>
            Quit Session
          </button>
        )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSocket from "../../hooks/useSocket";
import styles from "./Live.module.css";

export default function Live() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const song =
    state?.song || JSON.parse(sessionStorage.getItem("song") || "null");
  const sessionId = state?.sessionId || sessionStorage.getItem("sessionId");
  const role = sessionStorage.getItem("role");
  const instrument = sessionStorage.getItem("instrument");

  const [scrollOn, setScrollOn] = useState(false);
  const contentRef = useRef(null);
  const scrollInt = useRef(null);

  const socket = useSocket({ sessionId, onSong: () => {} });

  const sessionEndedHandler = useCallback(() => {
    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("joinedSession");
    sessionStorage.removeItem("song");
    const userRole = sessionStorage.getItem("role");
    if (userRole === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/player", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!song) {
      navigate(role === "admin" ? "/admin" : "/player", { replace: true });
    }
  }, [song, role, navigate]);

  useEffect(() => {
    if (!socket) return;
    const toggleHandler = ({ isScrolling }) => setScrollOn(isScrolling);
    socket.on("scrollToggled", toggleHandler);
    socket.on("sessionEnded", sessionEndedHandler);

    return () => {
      socket.off("scrollToggled", toggleHandler);
      socket.off("sessionEnded", sessionEndedHandler);
    };
  }, [socket, sessionEndedHandler]);

  useEffect(() => {
    clearInterval(scrollInt.current);
    if (scrollOn) {
      scrollInt.current = setInterval(() => {
        contentRef.current?.scrollBy({ top: 1, behavior: "smooth" });
      }, 40);
    }
    return () => clearInterval(scrollInt.current);
  }, [scrollOn]);

  const handleQuitSession = () => {
    if (socket && sessionId) {
      socket.emit("quitSession", { sessionId });
    }
  };

  const renderChunk = (chunk, idx) => {
    if (instrument === "vocals") {
      return (
        <span key={idx} className={styles.wordChunk}>
          <span className={styles.chord} style={{ visibility: "hidden" }}>
            -
          </span>
          <span className={styles.lyric}>{chunk.lyrics}</span>
        </span>
      );
    }

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

  return (
    <div className={styles.wrapper}>
      <h1>{song?.title}</h1>
      <h3>{song?.artist}</h3>

      <div className={styles.content} ref={contentRef}>
        {song?.lyrics.map((line, i) => (
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

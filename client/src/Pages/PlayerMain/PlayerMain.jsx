import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingNotes from "../../components/FloatingNotes/FloatingNotes";
import useSocket from "../../hooks/useSocket";
import styles from "./PlayerMain.module.css";

export default function PlayerMain() {
  const navigate = useNavigate();

  const storedSessionId = sessionStorage.getItem("sessionId");
  const [sessionId, setSessionId] = useState(storedSessionId || null);

  // מעבר ל־Live כשהתקבל שיר
  const handleSong = (song) => {
    const id = sessionId || sessionStorage.getItem("sessionId");
    navigate("/live", { state: { sessionId: id, song } });
  };

  // הוספת handler ל-sessionStarted
  const handleSessionStarted = (newSessionId) => {
    setSessionId(newSessionId);
  };

  useSocket({
    sessionId,
    onSong: handleSong,
    onSessionStarted: handleSessionStarted,
  });

  return (
    <div className={styles.wrapper}>
      <FloatingNotes />
      <div className={styles.userName}>
        {sessionStorage.getItem("username") || "Player"}
      </div>
      <h1>Waiting for next song…</h1>
      <div className={styles.spinner} />
    </div>
  );
}

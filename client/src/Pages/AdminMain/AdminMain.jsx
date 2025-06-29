import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import useSocket from "../../hooks/useSocket";
import { searchSongs } from "../../services/songService";
import styles from "./AdminMain.module.css";

export default function AdminMain() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const storedSessionId = sessionStorage.getItem("sessionId");
  const [sessionId, setSessionId] = useState(
    state?.sessionId || storedSessionId || null
  );
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const username = sessionStorage.getItem("username") || "Admin";
  const debounceRef = useRef(null);
  const isNavigatingToLive = useRef(false);

  const handleSong = useCallback(
    (song) => {
      isNavigatingToLive.current = true;
      navigate("/live", { state: { sessionId, song } });
    },
    [navigate, sessionId]
  );
  const socket = useSocket({ sessionId, onSong: handleSong });

  useEffect(() => {
    if (storedSessionId && !state?.sessionId) {
      setSessionId(storedSessionId);
    }
  }, [storedSessionId, state]);

  useEffect(() => {
    return () => {
      if (!isNavigatingToLive.current) {
        const activeSessionId = sessionStorage.getItem("sessionId");
        if (activeSessionId && socket) {
          socket.emit("quitSession", { sessionId: activeSessionId });
          sessionStorage.removeItem("sessionId");
          sessionStorage.removeItem("joinedSession");
        }
      }
      isNavigatingToLive.current = false;
    };
  }, [socket]);

  const handleStart = async () => {
    setError("");
    try {
      const res = await api.post("/session");
      setSessionId(res.data.id);
      sessionStorage.setItem("sessionId", res.data.id);
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  const handleBack = () => {
    if (socket && sessionId) {
      socket.emit("quitSession", { sessionId });
    }

    setSessionId(null);
    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("joinedSession");
    setQuery("");
    setResults([]);
    setError("");
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchSongs(val);
        setResults(res);
      } catch {
        setError("Song search failed");
      }
    }, 300);
  };

  const handleSelect = (song) => {
    socket?.emit("selectSong", { sessionId, song });
  };

  return (
    <div className={styles.wrapper}>
      {!sessionId ? (
        <>
          <h1>Welcome, {username}</h1>
          {error && <p className={styles.error}>{error}</p>}
          <button onClick={handleStart}>Start New Rehearsal</button>
        </>
      ) : (
        <>
          <button
            className={styles.backButton}
            onClick={handleBack}
            type="button"
          >
            End Session & Back
          </button>

          <h2>Search any song…</h2>

          <input
            className={styles.search}
            placeholder="Search song title or artist"
            value={query}
            onChange={handleChange}
          />

          {results.length > 0 && (
            <ul className={styles.list}>
              {results.map((s) => (
                <li key={s.file} onClick={() => handleSelect(s)}>
                  <img
                    src={s.image ? `/songs_images/${s.image}` : ""}
                    alt={s.title}
                  />
                  <div>
                    <strong>{s.title}</strong>
                    <span>{s.artist}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

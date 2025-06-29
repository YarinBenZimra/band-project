import { useEffect, useRef } from "react";
import { getSocket } from "../components/SocketInstance/SocketInstance";

export default function useSocket({ sessionId, onSong, onSessionStarted }) {
  const socketRef = useRef(null);
  const handlerRef = useRef(onSong);
  const sessionHandlerRef = useRef(onSessionStarted);

  useEffect(() => {
    handlerRef.current = onSong;
    sessionHandlerRef.current = onSessionStarted;
  }, [onSong, onSessionStarted]);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = getSocket();
    if (!socket) return;

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinLobby");
    });

    socket.on("disconnect", () => {});

    socket.on("songSelected", ({ song }) => {
      sessionStorage.setItem("song", JSON.stringify(song));
      handlerRef.current?.(song);
    });

    socket.on("sessionStarted", ({ sessionId }) => {
      sessionStorage.setItem("sessionId", sessionId);
      sessionHandlerRef.current?.(sessionId);
    });

    socket.on("error", (msg) => console.warn("Socket error:", msg));
  }, []);

  useEffect(() => {
    const s = socketRef.current;
    if (!sessionId || !s) return;

    const joined = sessionStorage.getItem("joinedSession");
    if (joined === sessionId) return;

    const emitJoin = () => {
      s.emit("joinSession", { sessionId });
      sessionStorage.setItem("joinedSession", sessionId);
    };

    if (s.connected) {
      emitJoin();
    } else {
      const onConnect = () => {
        emitJoin();
        s.off("connect", onConnect);
      };
      s.on("connect", onConnect);
      return () => s.off("connect", onConnect);
    }
  }, [sessionId]);

  return socketRef.current || getSocket();
}

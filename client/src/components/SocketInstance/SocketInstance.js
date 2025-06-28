import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const token = sessionStorage.getItem("token");
    if (token) {
      socket = io("http://localhost:5000", { auth: { token } });
    }
  }
  return socket;
};

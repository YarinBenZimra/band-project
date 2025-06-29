import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  if (!socket) {
    const token = sessionStorage.getItem("token");
    if (token) {
      socket = io(BASE_URL, { auth: { token } });
    }
  }
  return socket;
};

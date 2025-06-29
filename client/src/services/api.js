import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", //url
});

api.interceptors.request.use((cfg) => {
  const token = sessionStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;

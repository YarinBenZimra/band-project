import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL + "/api";
console.log("API Base URL:", BASE_URL);
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((cfg) => {
  const token = sessionStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;

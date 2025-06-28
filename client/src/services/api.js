import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", //url
});

// בצד ה-client נשמור את ה-token ב-sessionStorage
api.interceptors.request.use((cfg) => {
  const token = sessionStorage.getItem("token");
  console.log(sessionStorage.getItem("token"));
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;

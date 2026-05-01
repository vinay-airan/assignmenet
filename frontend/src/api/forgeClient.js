import axios from "axios";

 const BASE_URL = import.meta.env.VITE_API_URL ;
//const BASE_URL = "http://localhost:5000/api";
const forgeClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach stored token to every outgoing request
forgeClient.interceptors.request.use(
  (cfg) => {
    const stored = localStorage.getItem("forge_token");
    if (stored) cfg.headers.Authorization = `Bearer ${stored}`;
    return cfg;
  },
  (err) => Promise.reject(err)
);

// On 401 → clear session and redirect to login
forgeClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("forge_token");
      localStorage.removeItem("forge_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default forgeClient;

import axios from "axios";

// Base URL
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api" // JSON Server servido pelo mesmo server no Render
    : "http://localhost:3000/api"; // Local: server.js roda na porta 3000

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

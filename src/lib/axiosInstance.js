import axios from "axios";
// @ts-expect-error - store module is authored in plain JS
import { store } from "../store";
// @ts-expect-error - user slice is authored in plain JS
import { logOut } from "../store/userSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Automatically attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {  
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚨 Redirect to sign-in when token is invalid/expired
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      store.dispatch(logOut());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

// develop: http://localhost:5000/api
// production: https://psrockola-backend-develop.onrender.com/api

const apiFormData = axios.create({
  baseURL: "https://psrockola-backend-develop.onrender.com/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

apiFormData.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiFormData;

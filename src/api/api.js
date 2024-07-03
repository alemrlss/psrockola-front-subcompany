import axios from "axios";

// Crear instancia de Axios
//https://psrockola-backend-develop.onrender.com/api
//http://localhost:5000/api
const api = axios.create({
  baseURL: "https://psrockola-backend-develop.onrender.com/api", // Reemplaza con la URL de tu servidor NestJS
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada solicitud
api.interceptors.request.use(
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



export default api;

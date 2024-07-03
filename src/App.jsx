import { useState } from "react";
import api from "./api/api";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PublicRoute from "./components/Routes/PublicRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Login from "./views/Login/Login";

function App() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionBanned, setSessionBanned] = useState(false);

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token"); // Elimina el token del localStorage
        localStorage.removeItem("user"); // Elimina el usuario del localStorage
        localStorage.removeItem("tokenExpiration"); // Elimina el tiempo de expiración del localStorage
        setSessionExpired(true);
      }
      if (error.response && error.response.status === 403) {
        localStorage.removeItem("token"); // Elimina el token del localStorage
        localStorage.removeItem("user"); // Elimina el usuario del localStorage
        localStorage.removeItem("tokenExpiration"); // Elimina el tiempo de expiración del localStorage
        setSessionBanned(true);
      }
      return Promise.reject(error);
    }
  );

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route index element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route
                path="dashboard"
                element={<h2> Dashboard Subcompany</h2>}
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />{" "}
            </Route>
          </Route>

          <Route path="unauthorized" element={<h2>Acceso no Autorizado</h2>} />
          <Route
            path="*"
            element={
              <h2 className="flex justify-center text-4xl">
                Te has perdido? Pagina para cuando un usuario tipee algo
                diferente a employees, companies o distributors. Recomiendo
                poner un boton de volver a inicio, o en su defecto un boton de
                volver atras. distributor
              </h2>
            }
          />
        </Routes>
      </Router>

      {sessionExpired && (
        <div
          className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-red-500 text-lg mb-4">
              Tu sesion ha expirado, por favor inicia sesion de nuevo
            </h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Ir al Login
            </button>
          </div>
        </div>
      )}
      {sessionBanned && (
        <div
          className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-red-500 text-lg mb-4">
              Oh! Tu cuenta esta baneada. Por favor contacta a soporte para mas
              informacion
            </h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Ir al Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

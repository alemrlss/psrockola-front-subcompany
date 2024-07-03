import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  if (user) {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  } else {
    return <Navigate to="/login" />;
  }

  // Verifica si el rol del usuario está en la lista de roles permitidos
  if (user.type) {
    return <Outlet />;
  }
}

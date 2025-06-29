import { Navigate, useLocation } from "react-router-dom";
const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireSession = false,
  requireSong = false,
}) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const sessionId = sessionStorage.getItem("sessionId");
  const song = sessionStorage.getItem("song");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/player" replace />;
  }

  if (requireSession && !sessionId) {
    return <Navigate to={role === "admin" ? "/admin" : "/player"} replace />;
  }

  if (requireSong && !song) {
    return <Navigate to={role === "admin" ? "/admin" : "/player"} replace />;
  }

  return children;
};

export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  // אם אין טוקן - הפנה ללוגין
  if (!token) {
    // שמירת הנתיב הנוכחי לחזרה אחרי הלוגין
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // אם צריך אדמין אבל המשתמש לא אדמין
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/player" replace />;
  }

  // אם הכל בסדר - הצג את הקומפוננטה
  return children;
};

export default ProtectedRoute;

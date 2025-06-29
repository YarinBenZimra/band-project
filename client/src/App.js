import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import PlayerMain from "./Pages/PlayerMain/PlayerMain";
import AdminMain from "./Pages/AdminMain/AdminMain";
import Live from "./Pages/Live/Live";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/admin" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/player"
          element={
            <ProtectedRoute>
              <PlayerMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live"
          element={
            <ProtectedRoute requireSession requireSong>
              <Live />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

function RootRedirect() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={role === "admin" ? "/admin" : "/player"} replace />;
}

export default App;

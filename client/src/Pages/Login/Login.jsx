import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./Login.module.css";
import FloatingNotes from "../../components/FloatingNotes/FloatingNotes";
import avatar from "../../assets/login/loginAvatar.png";
import musicBg from "../../assets/signup/signupBG.jpg";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      sessionStorage.setItem("instrument", res.data.instrument);
      sessionStorage.setItem("username", form.username);

      if (res.data.role === "admin") navigate("/admin");
      else navigate("/player");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.left}
        style={{ backgroundImage: `url(${musicBg})` }}
      >
        <h1>JaMoveo</h1>
        <p>Keep the rhythm alive 🎧</p>
        <FloatingNotes />
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <img src={avatar} alt="avatar" className={styles.avatar} />

          <h2>Log In</h2>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Enter</button>
          </form>

          <p className={styles.loginLink}>
            New here?{" "}
            <span onClick={() => navigate("/signup")}>Create account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./Signup.module.css";
import avatar from "../../assets/signup/avatar.png"; // צייר/הורד SVG אנונימי קטן
import musicBg from "../../assets/signup/signupBG.jpg"; // תמונת רקע לחצי השמאלי
import bandBg from "../../assets/signup/band.png"; // כלי-נגינה מתחת לטופס
import FloatingNotes from "../../components/FloatingNotes/FloatingNotes"; // אייקונים צפים

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    instrument: "guitar",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className={styles.container}>
      {/* --- חצי שמאלי --- */}
      <div
        className={styles.left}
        style={{ backgroundImage: `url(${musicBg})` }}
      >
        <h1>JaMoveo</h1>
        <p>Jam - Connect - Play 🎶</p>
        <FloatingNotes />
      </div>

      {/* --- חצי ימני --- */}
      <div className={styles.right}>
        <img src={bandBg} alt="" className={styles.sideImg} />

        <div className={styles.card}>
          <img src={avatar} alt="avatar" className={styles.avatar} />

          <h2>Sign Up</h2>

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

            <select
              name="instrument"
              value={form.instrument}
              onChange={handleChange}
            >
              <option value="guitar">🎸 Guitar</option>
              <option value="drums">🥁 Drums</option>
              <option value="bass">🎻 Bass</option>
              <option value="sax">🎷 Sax</option>
              <option value="keyboard">🎹 Keyboard</option>
              <option value="vocals">🎤 Vocals</option>
            </select>

            <button type="submit">Create Account</button>
          </form>

          <p className={styles.loginLink}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

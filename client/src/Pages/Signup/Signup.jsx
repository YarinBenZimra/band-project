import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./Signup.module.css";
import avatar from "../../assets/signup/avatar.png";
import musicBg from "../../assets/signup/signupBG.jpg";
import bandBg from "../../assets/signup/band.png";
import FloatingNotes from "../../components/FloatingNotes/FloatingNotes";
import SuccessPopup from "../../components/Popup/signPopup";

export default function Signup() {
  const isAdminSignup = window.location.pathname.includes("/admin");

  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    instrument: "guitar",
    adminKey: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isAdminSignup) {
        await api.post(
          "/auth/signup/admin",
          {
            username: form.username,
            password: form.password,
            instrument: form.instrument,
          },
          {
            headers: { "X-ADMIN-KEY": form.adminKey },
          }
        );
      } else {
        await api.post("/auth/signup", form);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <>
      {success && <SuccessPopup onClose={() => navigate("/login")} />}
      <div className={styles.container}>
        <div
          className={styles.left}
          style={{ backgroundImage: `url(${musicBg})` }}
        >
          <h1>JaMoveo</h1>
          <p>Jam - Connect - Play 🎶</p>
          <FloatingNotes />
        </div>

        <div className={styles.right}>
          <img src={bandBg} alt="" className={styles.sideImg} />

          <div className={styles.card}>
            <img src={avatar} alt="avatar" className={styles.avatar} />
            <h2>{isAdminSignup ? "Admin Sign Up" : "Sign Up"}</h2>

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

              {isAdminSignup && (
                <input
                  type="password"
                  name="adminKey"
                  placeholder="Admin Code"
                  value={form.adminKey}
                  onChange={handleChange}
                  required
                />
              )}

              <button type="submit">
                {isAdminSignup ? "Create Admin Account" : "Create Account"}
              </button>
            </form>

            <p className={styles.signupLink}>
              {isAdminSignup ? (
                <>
                  Not an admin?{" "}
                  <span onClick={() => navigate("/signup")}>User Signup</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span onClick={() => navigate("/login")}>Log in</span>
                  <br />
                  <br />
                  Are you an admin?{" "}
                  <span onClick={() => navigate("/signup/admin")}>
                    Admin Signup
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

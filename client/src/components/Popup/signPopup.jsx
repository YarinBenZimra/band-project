import styles from "./signPopup.module.css";

export default function SuccessPopup({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Registration Successful!</h2>
        <p>You can now log in to your account.</p>
        <button onClick={onClose}>Log In</button>
      </div>
    </div>
  );
}

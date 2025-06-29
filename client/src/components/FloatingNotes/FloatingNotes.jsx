import { useRef } from "react";
import styles from "./FloatingNotes.module.css";

export default function FloatingNotes() {
  const icons = ["♪", "♫", "♬", "♩", "♭", "♮"];

  const notesRef = useRef(
    Array.from({ length: icons.length }).map((_, i) => {
      const icon = icons[i % icons.length];
      const left = Math.random() * 100; // %
      const duration = 10 + Math.random() * 10; // שניות
      const delay = Math.random() * -10; // התחלה שלילית
      return { icon, left, duration, delay, key: i };
    })
  );

  return (
    <div className={styles.wrapper}>
      {notesRef.current.map(({ icon, left, duration, delay, key }) => (
        <span
          key={key}
          className={styles.note}
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          {icon}
        </span>
      ))}
    </div>
  );
}

import styles from "./FloatingNotes.module.css";

const icons = ["♪", "♫", "♬", "♩", "♭", "♮"];

export default function FloatingNotes() {
  // יוצרים מערך באורך amount, עם אייקונים רנדומליים
  return (
    <div className={styles.wrapper}>
      {Array.from({ length: icons.length }).map((_, i) => {
        const icon = icons[i % icons.length];
        const left = Math.random() * 100; // %
        const duration = 10 + Math.random() * 10; // שניות
        const delay = Math.random() * -10; // התחלת אנימציה שלילית
        return (
          <span
            key={i}
            className={styles.note}
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}

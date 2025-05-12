'use client';
import styles from "./page.module.css";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    window.location.href = '/login';
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
      </main>
    </div>
  );
}

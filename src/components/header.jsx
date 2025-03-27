import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "../styles/header.module.css";

const Header = () => {
  const navigate = useNavigate(); // Initialize navigation hook

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src="/images/mdfc-logo4.png" alt="Logo" className={styles.logo} />
        <div className={styles.navContainer}>
          <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>Home</a>
            <a href="/aboutus" className={styles.navLink}>About</a>
            <a href="/contacts" className={styles.navLink}>Contacts</a>
          </nav>
          {/* Use navigate function on click */}
          <button className={styles.signUp} onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

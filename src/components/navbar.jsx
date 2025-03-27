import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, Users, Archive, MessageSquare, UserCheck, UserX, UserMinus, LogOut } from "lucide-react";
import styles from "../styles/navbar.module.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [archivedUsersCount, setArchivedUsersCount] = useState(0);
  const [deactivatedUsersCount, setDeactivatedUsersCount] = useState(0);
  const [feedbacksCount, setFeedbacksCount] = useState(0);
  const [lastLoggedInAdmin, setLastLoggedInAdmin] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCounts();
    // Retrieve the last logged-in admin from localStorage
    const adminEmail = localStorage.getItem("lastLoggedInAdmin");
    if (adminEmail) {
      setLastLoggedInAdmin(adminEmail);
    }
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await fetch("http://localhost:8000/users");
      const data = await response.json();

      // Filter out users with the role of "admin"
      const filteredUsers = data.users.filter((user) => user.role !== "admin");

      // Count active, archived, and deactivated users (excluding admins)
      const activeUsers = filteredUsers.filter((user) => user.status === "active").length;
      const archivedUsers = filteredUsers.filter((user) => user.status === "archived").length;
      const deactivatedUsers = filteredUsers.filter((user) => user.status === "deactivated").length;

      setActiveUsersCount(activeUsers);
      setArchivedUsersCount(archivedUsers);
      setDeactivatedUsersCount(deactivatedUsers);
    } catch (error) {
      console.error("Error fetching user counts:", error);
    }

    try {
      const feedbackResponse = await fetch("http://localhost:8000/feedbacks");
      const feedbackData = await feedbackResponse.json();
      setFeedbacksCount(feedbackData.feedbacks.length);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleLogout = () => {
    // Clear localStorage for admin and normal users
    localStorage.removeItem("lastLoggedInAdmin");
    localStorage.removeItem("lastLoggedInUser");
    // Redirect to the home page
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navHeader}>
        <button onClick={() => setIsOpen(!isOpen)} className={styles.menuBtn}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <img src="/images/mdfc-logo4.png" alt="MDFC Logo" className={styles.logoImg} />
        <h1 className={styles.logo}>MediFaceCare Panel</h1>
      </div>

      <div className={styles.statusPanel}>
        <div className={styles.statusItem}>
          <UserCheck size={20} className={styles.icon} />
          <span>Active: {activeUsersCount}</span>
        </div>
        <div className={styles.statusItem}>
          <UserMinus size={20} className={styles.icon} />
          <span>Archived: {archivedUsersCount}</span>
        </div>
        <div className={styles.statusItem}>
          <UserX size={20} className={styles.icon} />
          <span>Deactivated: {deactivatedUsersCount}</span>
        </div>
      </div>

      {/* Display Last Logged-In Admin */}
      {lastLoggedInAdmin && (
        <div className={styles.adminInfo}>
          <span>Admin: {lastLoggedInAdmin}</span>
        </div>
      )}

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>
              <LayoutDashboard size={20} className={styles.icon} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/users" onClick={() => setIsOpen(false)}>
              <Users size={20} className={styles.icon} />
              Registered Users <span className={styles.count}>{activeUsersCount}</span>
            </Link>
          </li>
          <li>
            <Link to="/archive" onClick={() => setIsOpen(false)}>
              <Archive size={20} className={styles.icon} />
              Archived Users <span className={styles.count}>{archivedUsersCount}</span>
            </Link>
          </li>
          <li>
            <Link to="/feedbacks" onClick={() => setIsOpen(false)}>
              <MessageSquare size={20} className={styles.icon} />
              Feedbacks <span className={styles.count}>{feedbacksCount}</span>
            </Link>
          </li>
          {/* Logout Button inside Sidebar */}
          <li>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={20} className={styles.icon} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
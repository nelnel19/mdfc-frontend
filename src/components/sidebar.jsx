import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserCog,
  FaHandPeace,
  FaUserMd,
  FaCommentDots, // Feedback Icon
  FaFlask,       // Analyze Icon
  FaPills,       // Medication Icon
  FaSpa,         // Skincare Icon
  FaGlobe,       // Map Icon
  FaClock,       // History Icon
  FaGraduationCap // Learn More Icon
} from "react-icons/fa";

import styles from "../styles/sidebar.module.css";

const Sidebar = () => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("/images/prof.png");
  const location = useLocation();
  const imageError = useRef(false); // Prevent infinite loop

  useEffect(() => {
    const fetchUserProfile = async () => {
      const savedUser = localStorage.getItem("lastLoggedInUser");

      if (!savedUser) return;

      try {
        const parsedUser = savedUser.startsWith("{") ? JSON.parse(savedUser) : { email: savedUser };
        setUsername(parsedUser.username || parsedUser.email.split("@")[0]);

        // Fetch user details (Cloudinary image URL)
        const response = await fetch(`https://medifacecare.onrender.com/users/${parsedUser.email}`);
        if (!response.ok) throw new Error("User not found");

        const userData = await response.json();
        
        if (userData.profile_image && userData.profile_image.startsWith("http")) {
          setProfileImage(userData.profile_image); // ✅ Use Cloudinary image
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <img src="/images/mdfc-logo4.png" alt="Logo" className={styles.logo} />
        </div>

        {/* User Info */}
        <div className={styles.userInfo}>
          {/* Moving Welcome Icon */}
          <div className={styles.welcomeIcon}>
            <FaHandPeace /> Welcome
          </div>
          <img 
            src={profileImage} 
            alt="Profile" 
            className={styles.profileImage} 
            onError={(e) => { 
              if (!imageError.current) {
                console.warn("Image failed to load:", e.target.src);
                imageError.current = true;
                e.target.src = "/images/default-profile.png"; 
              }
            }} 
          />
          <h3 className={styles.username}>
            <FaUserMd /> {username || "Guest"}
          </h3>
        </div>

        {/* Navigation */}
        <nav>
          <ul className={styles.navList}>
            <li className={location.pathname === "/analyze" ? styles.active : ""}>
              <Link to="/analyze">
                <FaFlask /> Analyzing Tools
              </Link>
            </li>
            <li className={location.pathname === "/generateskincare" ? styles.active : ""}>
              <Link to="/generateskincare">
                <FaSpa /> Skincare Tools
              </Link>
            </li>
            <li className={location.pathname === "/map" ? styles.active : ""}>
              <Link to="/map">
                <FaGlobe /> Map
              </Link>
            </li>
            <li className={location.pathname === "/history" ? styles.active : ""}>
              <Link to="/history">
                <FaClock /> History
              </Link>
            </li>
            <li className={location.pathname === "/learn" ? styles.active : ""}>
              <Link to="/learn">
                <FaGraduationCap /> Learn More
              </Link>
            </li>
            <li className={location.pathname === "/comments" ? styles.active : ""}>
              <Link to="/comments">
                <FaCommentDots /> Feedback
              </Link>
            </li>
          </ul>
        </nav>

        {/* My Account */}
        <div className={styles.accountNav}>
          <ul>
            <li className={location.pathname === "/account" ? styles.active : ""}>
              <Link to="/account">
                <FaUserCog /> My Account
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

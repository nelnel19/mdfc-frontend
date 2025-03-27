import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Camera, Droplet, Pill } from "lucide-react"; 
import styles from "../styles/startpage.module.css";
import Header from "./header";

const StartPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Function to smoothly scroll to video section
  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.transparentBox}>
          <div className={styles.textContent}>
            <h2 className={styles.heading}>WELCOME TO MEDIFACECARE</h2>
            <p className={styles.motto}>We Care, and We Judge.</p>
            <p className={styles.description}>
              MediFaceCare helps you achieve healthy, radiant skin with <strong>AI-powered skin analysis</strong>.  
              Simply upload a photo or enter your skin concerns, and our system will assess your <strong>skin tone</strong>,  
              <strong>skin condition</strong>, and recommend the best <strong>skincare routine</strong> and <strong>medications</strong> tailored to your needs.
            </p>

            <motion.button 
              className={styles.ctaButton} 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/login")}
            >
              Get Started →
            </motion.button>

            <motion.button 
              className={styles.ctaButton} 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/analyze")}
              style={{ marginTop: "10px", background: "#4CAF50" }} // Optional: Custom styling
            >
              Try as Guest →
            </motion.button>

            <motion.button 
              className={styles.videoButton}
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={scrollToVideo}
            >
              Watch Video ↓
            </motion.button>

            <div className={styles.features}>
              <motion.div 
                className={styles.feature} 
                whileHover={{ scale: 1.2 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span className={styles.icon} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Camera size={40} color="white" strokeWidth={1.5} />
                </motion.span>
                <p className={styles.featureText}>Advanced AI Skin Analysis</p>
              </motion.div>

              <motion.div 
                className={styles.feature} 
                whileHover={{ scale: 1.2 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span className={styles.icon} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}>
                  <Droplet size={40} color="white" strokeWidth={1.5} />
                </motion.span>
                <p className={styles.featureText}>Personalized Skincare Routine</p>
              </motion.div>

              <motion.div 
                className={styles.feature} 
                whileHover={{ scale: 1.2 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span className={styles.icon} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}>
                  <Pill size={40} color="white" strokeWidth={1.5} />
                </motion.span>
                <p className={styles.featureText}>Recommended Skin Medications</p>
              </motion.div>
            </div>

            <div className={styles.socialIcons}>
              <motion.a 
                whileHover={{ scale: 1.3, rotate: 10 }} 
                whileTap={{ scale: 0.9 }} 
                href="https://www.facebook.com/share/1B2GzDcpuf/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.3, rotate: -10 }} 
                whileTap={{ scale: 0.9 }} 
                href="#" 
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.3, rotate: 10 }} 
                whileTap={{ scale: 0.9 }} 
                href="#" 
              >
                <FaTwitter />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Section */}
      <div className={styles.videoSection} ref={videoRef}>
        <h2 className={styles.videoHeading}>Discover More About MediFaceCare</h2>
        <video className={styles.video} controls>
          <source src="/videos/vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
};

export default StartPage;

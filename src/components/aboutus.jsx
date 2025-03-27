import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaFacebook, FaCameraRetro, FaFlask, FaMapMarkedAlt, FaChartLine } from "react-icons/fa"; // Import icons
import Header from "./header";
import styles from "../styles/aboutus.module.css";

const teamMembers = [
  { name: "Arnel Bullo", role: "Team Leader and Full Stack Developer", facebook: "https://www.facebook.com/share/1EpqV1tg66/", image: "/images/nel.jpg" },
  { name: "Crisha Arlene Antonio", role: "UI Developer", facebook: "https://www.facebook.com/share/15wC7Gy4U7/", image: "/images/fb1.jpg" },
  { name: "Hanna Mae Bernolia", role: "UI Developer", facebook: "https://www.facebook.com/share/1EE9cxKRdE/?mibextid=wwXIfr", image: "/images/fb3.jpg" },
  { name: "Jeremiah Estillore", role: "Frontend Developer", facebook: "https://www.facebook.com/share/1F19aXUNWM/", image: "/images/fb2.jpg" },
];

// Add professor details
const professor = {
  name: "Prof. Pops V. Madriaga",
  role: "Mentor & Advisor",
  image: "/images/pops.jpg", // Add the path to the professor's image
};

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  const xMovement = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <div className={styles.pageBackground}>
      <Header />

      {/* About Us Section */}
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className={styles.transparentBox}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.textContent}>
            <motion.h1
              className={styles.heading}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              AI-Powered Skin Analysis for You
            </motion.h1>
            <motion.p
              className={styles.description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Unlock the secrets of your skin with our <strong>AI-driven analysis tool</strong>. Simply <strong>capture or upload a photo</strong>, and our advanced system will identify your <strong>skin tone, condition, and potential diseases</strong> while offering tailored <strong>skincare and medication recommendations</strong>.
            </motion.p>

            {/* Features with Icons */}
            <motion.div className={styles.features} style={{ x: xMovement }}>
              <div className={styles.feature}>
                <FaCameraRetro className={styles.icon} />
                <p className={styles.featureText}>Capture & Analyze</p>
              </div>
              <div className={styles.feature}>
                <FaFlask className={styles.icon} />
                <p className={styles.featureText}>Personalized Skincare</p>
              </div>
              <div className={styles.feature}>
                <FaMapMarkedAlt className={styles.icon} />
                <p className={styles.featureText}>Skin Health Mapping</p>
              </div>
              <div className={styles.feature}>
                <FaChartLine className={styles.icon} />
                <p className={styles.featureText}>AI Insights & Reports</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mission & Vision Section */}
      <motion.div
        className={styles.missionVisionContainer}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        <motion.div
          className={styles.missionVisionBox}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className={styles.missionHeading}>Our Mission</h2>
          <p className={styles.missionText}>
            To develop an AI-driven skincare analysis system that provides personalized recommendations, tracks skin health progress, and connects users with local dermatological services for improved skincare management.
          </p>
          <h2 className={styles.visionHeading}>Our Vision</h2>
          <p className={styles.visionText}>
            To revolutionize skincare by leveraging artificial intelligence to offer accurate, data-driven, and accessible solutions, ensuring healthier skin for individuals worldwide.
          </p>
          <h2 className={styles.commitmentHeading}>Our Commitment</h2>
          <p className={styles.commitmentText}>
            We are committed to continuous innovation, working with dermatology experts, and making skin health solutions available to people of all backgrounds.
          </p>
        </motion.div>
      </motion.div>

      {/* Meet Our Team Section */}
      <motion.div
        className={styles.teamContainer}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        <h2 className={styles.teamHeading}>Meet Our Team</h2>
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className={styles.teamMember}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: false }}
            >
              <img src={member.image} alt={member.name} className={styles.memberImage} />
              <div className={styles.teamInfo}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
                <a href={member.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className={styles.facebookIcon} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Section for Professor */}
        <motion.div
          className={styles.professorContainer}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <div className={styles.professorBox}>
            <img src={professor.image} alt={professor.name} className={styles.professorImage} />
            <div className={styles.professorInfo}>
              <h3 className={styles.professorName}>{professor.name}</h3>
              <p className={styles.professorRole}>{professor.role}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
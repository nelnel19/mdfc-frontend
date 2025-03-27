import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./header";
import styles from "../styles/contacts.module.css";
import axios from "axios";

const Contacts = () => {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [status, setStatus] = useState({ success: false, message: "" });
  const [replies, setReplies] = useState({}); // To store admin replies

  // Pre-fill email from localStorage
  useEffect(() => {
    const lastLoggedInUser = localStorage.getItem("lastLoggedInUser");
    if (lastLoggedInUser) {
      setFormData((prev) => ({ ...prev, email: lastLoggedInUser }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: false, message: "" });

    try {
      await axios.post("http://localhost:8000/feedback", formData);
      setStatus({ success: true, message: "Thank you for your feedback!" });
      setFormData((prev) => ({ ...prev, message: "" })); // Clear only the message field
    } catch (error) {
      setStatus({ success: false, message: "Something went wrong. Please try again." });
    }
  };

  // Admin reply function
  const handleReply = async (feedbackId, replyMessage) => {
    try {
      // Send the reply to the backend (you need to implement this endpoint)
      await axios.post(`http://localhost:8000/feedback/${feedbackId}/reply`, {
        reply: replyMessage,
      });
      setReplies((prev) => ({ ...prev, [feedbackId]: replyMessage }));
      setStatus({ success: true, message: "Reply sent successfully!" });
    } catch (error) {
      setStatus({ success: false, message: "Failed to send reply. Please try again." });
    }
  };

  return (
    <div>
      <Header />
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
              Get in Touch
            </motion.h1>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Have questions or need skincare advice? Feel free to reach out to us.
              We're here to help you achieve healthy, glowing skin!
            </motion.p>

            <motion.div
              className={styles.contactDetails}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
              }}
            >
              {[
                { icon: "📍", text: "123 Roldan Avenue, Bonifacio Global City, Taguig, Philippines" },
                { icon: "📞", text: "63 912 345 6789" },
                { icon: "✉️", text: "medifacecare@gmail.com" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={styles.detail}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5 }}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <p style={{ color: "#ffffff", fontWeight: "500" }}>{item.text}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.h2
              className={styles.subHeading}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Send Us a Message
            </motion.h2>

            <motion.form
              className={styles.contactForm}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              onSubmit={handleSubmit}
            >
              <motion.input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Your Email"
                required
                whileFocus={{ scale: 1.05 }}
              />
              <motion.textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Your Message"
                required
                whileFocus={{ scale: 1.05 }}
              />
              <motion.button
                type="submit"
                className={styles.ctaButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </motion.form>

            {status.message && (
              <motion.div
                className={status.success ? styles.successMessage : styles.errorMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {status.message}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contacts;
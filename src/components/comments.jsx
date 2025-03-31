import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./sidebar"; // Replaced Header with Sidebar
import styles from "../styles/comments.module.css"; // Import CSS Module
import axios from "axios";

const Comments = () => {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [status, setStatus] = useState({ success: false, message: "" });
  const [replies, setReplies] = useState([]); // To store admin replies

  // Pre-fill email from localStorage
  useEffect(() => {
    const lastLoggedInUser = localStorage.getItem("lastLoggedInUser");
    if (lastLoggedInUser) {
      setFormData((prev) => ({ ...prev, email: lastLoggedInUser }));
      fetchReplies(lastLoggedInUser);
    }
  }, []);

  const fetchReplies = async (email) => {
    try {
      const response = await axios.get(`https://medifacecare.onrender.com/feedbacks?email=${email}`);
      const userFeedbacks = response.data.feedbacks.filter((feedback) => feedback.reply);
      setReplies(userFeedbacks);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: false, message: "" });

    try {
      await axios.post("https://medifacecare.onrender.com/feedback", formData);
      setStatus({ success: true, message: "Thank you for your feedback!" });
      setFormData((prev) => ({ ...prev, message: "" })); // Clear only the message field
      fetchReplies(formData.email);
    } catch (error) {
      setStatus({ success: false, message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Replaced Header with Sidebar */}
      <motion.div
        className={styles.transparentBox}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
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
              Send Us Your Feedback
            </motion.h1>

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

            {/* Display Replies */}
            {replies.length > 0 && (
              <motion.div
                className={styles.repliesSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3>Your Replies</h3>
                {replies.map((feedback) => (
                  <div key={feedback.id} className={styles.reply}>
                    <p><strong>Your Message:</strong> {feedback.message}</p>
                    <p><strong>Admin Reply:</strong> {feedback.reply}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Comments;
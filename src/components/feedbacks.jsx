import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./navbar"; // Import Navbar
import styles from "../styles/feedbacks.module.css";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyMessage, setReplyMessage] = useState(""); // State for reply input
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null); // Track which feedback is selected for reply

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/feedbacks");
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleReply = async (feedbackId) => {
    if (!replyMessage.trim()) {
      alert("Reply cannot be empty");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8000/feedback/${feedbackId}/reply`, // Corrected API URL
        { reply: replyMessage }, // Correct payload format
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setReplyMessage(""); // Clear the reply input
      setSelectedFeedbackId(null); // Reset selected feedback
      fetchFeedbacks(); // Refresh the feedback list
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };
  

  return (
    <div>
      <Navbar /> {/* Add Navbar here */}
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Message</th>
                <th>Reply</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.email}</td>
                  <td>{feedback.message}</td>
                  <td>{feedback.reply || "No reply yet"}</td>
                  <td>
                    {selectedFeedbackId === feedback.id ? (
                      <div>
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <button onClick={() => handleReply(feedback.id)}>Send Reply</button>
                        <button onClick={() => setSelectedFeedbackId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedFeedbackId(feedback.id)}>Reply</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
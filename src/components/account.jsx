import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/account.module.css";
import { FaUser, FaEnvelope, FaCamera, FaSave, FaSignOutAlt } from "react-icons/fa";
import Sidebar from "./sidebar";

const Account = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    gender: "",
    profileImage: null,
  });

  const navigate = useNavigate();
  const loggedInUserEmail = localStorage.getItem("lastLoggedInUser");

  useEffect(() => {
    if (!loggedInUserEmail) {
      console.error("No logged-in user found.");
      return;
    }

    axios
      .get(`https://mdfc.onrender.com/users/${loggedInUserEmail}`)
      .then((response) => {
        setUser(response.data);
        setFormData({
          username: response.data.username || "",
          age: response.data.age || "",
          gender: response.data.gender || "",
        });
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [loggedInUserEmail]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("gender", formData.gender);
    if (formData.profileImage) {
      formDataToSend.append("file", formData.profileImage);
    }

    try {
      const response = await axios.put(
        `https://mdfc.onrender.com/users/${loggedInUserEmail}`,
        formDataToSend
      );
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("lastLoggedInUser");
    navigate("/");
  };

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className={styles.accountMainContainer}>
      <Sidebar />

      <div className={styles.accountContainer}>
        <h2>
          <FaUser className={styles.icon} /> My Account
        </h2>

        <div className={styles.profileSection}>
          <img
            src={user.profile_image || "default-profile.png"}
            alt="Profile"
            className={styles.profileImage}
          />
          <label className={styles.uploadButton}>
            <FaCamera />
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>
        </div>

        <p className={styles.email}>
          <FaEnvelope /> {user.email}
        </p>

        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />

          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />

          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit" className={styles.saveButton}>
            <FaSave /> Update Profile
          </button>
        </form>

        <button onClick={handleSignOut} className={styles.signOutButton}>
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Account;

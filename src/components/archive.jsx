import React, { useEffect, useState } from "react";
import Navbar from "./navbar"; // Import the Navbar
import styles from "../styles/archive.module.css"; // Import the CSS file

const Archive = () => {
  const [archivedUsers, setArchivedUsers] = useState([]);

  useEffect(() => {
    fetchArchivedUsers();
  }, []);

  const fetchArchivedUsers = async () => {
    try {
      const response = await fetch("https://medifacecare.onrender.com/users");
      const data = await response.json();
      const archived = data.users.filter((user) => user.status === "archived");
      setArchivedUsers(archived);
    } catch (error) {
      console.error("Error fetching archived users:", error);
    }
  };

  const handleUnarchive = async (email) => {
    try {
      const response = await fetch(
        `https://medifacecare.onrender.com/users/${email}/unarchive`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert("User unarchived successfully!");
        fetchArchivedUsers();
      } else {
        const data = await response.json();
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error unarchiving user:", error);
    }
  };

  return (
    <div>
      <Navbar /> {/* Added Navbar here */}
      <div className={styles.container}>
        <h2>Archived Users</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Email</th>
                <th>Username</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {archivedUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.profile_image || "https://via.placeholder.com/50"}
                      alt="Profile"
                      className={styles.profileImage}
                    />
                  </td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.age}</td>
                  <td>{user.gender}</td>
                  <td>
                    <button
                      onClick={() => handleUnarchive(user.email)}
                      className={styles.unarchiveBtn}
                    >
                      Unarchive
                    </button>
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

export default Archive;
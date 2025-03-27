import React, { useEffect, useState } from "react";
import Navbar from "./navbar"; // Import Navbar component
import styles from "../styles/users.module.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import jsPDF autotable plugin

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    gender: "",
    profileImage: null,
  });
  const [filterStatus, setFilterStatus] = useState("active"); // Filter for active/deactivated users

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/users");
      const data = await response.json();
      console.log("API Response:", data); // Debugging: Log the API response

      // Filter out users with the role of "admin"
      const filteredUsers = data.users.filter((user) => user.role !== "admin");
      console.log("Filtered Users:", filteredUsers); // Debugging: Log the filtered users

      setUsers(filteredUsers); // Set filtered users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Calculate remaining time for deactivated users
  const calculateRemainingTime = (deactivatedAt) => {
    const deactivatedTime = new Date(deactivatedAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = deactivatedTime + 24 * 60 * 60 * 1000 - currentTime; // 24 hours in milliseconds

    if (timeDifference <= 0) {
      return "Reactivated";
    }

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.status === "deactivated" && user.deactivated_at) {
            return {
              ...user,
              remainingTime: calculateRemainingTime(user.deactivated_at),
            };
          }
          return user;
        })
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Handle editing a user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      age: user.age,
      gender: user.gender,
      profileImage: null,
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  // Update user details
  const handleUpdate = async () => {
    if (!editingUser) return;

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("gender", formData.gender);
    if (formData.profileImage) {
      formDataToSend.append("file", formData.profileImage);
    }

    try {
      const response = await fetch(
        `http://localhost:8000/users/${editingUser.email}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        alert("User updated successfully!");
        fetchUsers();
        setEditingUser(null);
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Archive a user
  const handleArchive = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8000/users/${email}/archive`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert("User archived successfully!");
        fetchUsers();
      } else {
        const data = await response.json();
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error archiving user:", error);
    }
  };

  // Deactivate a user
  const handleDeactivate = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8000/users/${email}/deactivate`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert("User deactivated successfully!");
        fetchUsers();
      } else {
        const data = await response.json();
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  // Reactivate a user
  const handleReactivate = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8000/users/${email}/reactivate`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert("User reactivated successfully!");
        fetchUsers();
      } else {
        const data = await response.json();
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error reactivating user:", error);
    }
  };

  // Generate PDF report
  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add product logo
    const productLogo = "/images/tup_logo.png";
    const productLogoBase64 = await toBase64(productLogo);
    doc.addImage(productLogoBase64, "PNG", 10, 10, 20, 20);

    // Add school logo
    const schoolLogo = "/images/mdfc-logo4.png";
    const schoolLogoBase64 = await toBase64(schoolLogo);
    doc.addImage(schoolLogoBase64, "PNG", 165, 10, 48, 23);

    // Add system name
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("MediFaceCare", 105, 20, null, null, "center");

    // Add report title
    doc.setFontSize(18);
    doc.text("Active Users Report", 105, 30, null, null, "center");

    // Add subtitle with date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 40, null, null, "center");

    // Add admin names
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("Prepared by:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text("Arnel V. Bullo Jr.", 20, 55);
    doc.text("Hanna Mae Bernolia", 20, 60);
    doc.text("Crisha Arlene Antonio", 20, 65);
    doc.text("Jeremiah Estillore", 20, 70);

    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(10, 75, 200, 75);

    // Table headers
    const headers = ["Email", "Username", "Age", "Gender", "Last Login"];
    const rows = users
      .filter((user) => user.status === "active") // Only include active users in the report
      .map((user) => [
        user.email,
        user.username,
        user.age,
        user.gender,
        user.last_login ? new Date(user.last_login).toLocaleString() : "Never",
      ]);

    // Add table to PDF
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 80,
      theme: "striped",
      styles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 40 },
      },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Generated by MediFaceCare Analytics", 105, 285, null, null, "center");
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, null, null, "center");
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(10, 280, 200, 280);
    }

    // Save the PDF
    doc.save("users-list.pdf");
  };

  // Helper function to convert image to Base64
  const toBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  // Filter users based on status
  const filteredUsers = users.filter((user) => user.status === filterStatus);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <div>
            <button onClick={() => setFilterStatus("active")}>Show Active Users</button>
            <button onClick={() => setFilterStatus("deactivated")}>Show Deactivated Users</button>
          </div>
          <div>
            <button onClick={generatePDF} className={styles.exportBtn}>
              Export to PDF
            </button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Email</th>
                <th>Username</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
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
                    {user.last_login && !isNaN(new Date(user.last_login))
                      ? new Date(user.last_login).toLocaleString()
                      : "Never"}
                  </td>
                  <td>
                    {user.status === "deactivated" && user.deactivated_at
                      ? `Deactivated (${calculateRemainingTime(user.deactivated_at)})`
                      : user.status}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditClick(user)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchive(user.email)}
                      className={styles.archiveBtn}
                    >
                      Archive
                    </button>
                    {user.status === "active" ? (
                      <button
                        onClick={() => handleDeactivate(user.email)}
                        className={styles.deactivateBtn}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(user.email)}
                        className={styles.reactivateBtn}
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Edit User</h3>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label>Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button onClick={handleUpdate} className={styles.updateBtn}>
                Update
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
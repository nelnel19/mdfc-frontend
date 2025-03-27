import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/medication.module.css";

const Medication = () => {
  const [disease, setDisease] = useState("");
  const [description, setDescription] = useState("");
  const [tips, setTips] = useState([]);
  const [products, setProducts] = useState([]);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("disease", disease);
    formData.append("description", description);

    // Append tips as multiple fields
    tips.forEach((tip, index) => formData.append(`tips`, tip));
    products.forEach((product, index) => formData.append(`products`, product));

    // Append images
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/medications/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Medication added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading medication:", error);
      alert("Failed to upload medication.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Medication</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Disease:</label>
        <input type="text" value={disease} onChange={(e) => setDisease(e.target.value)} required />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Tips (comma separated):</label>
        <input type="text" onChange={(e) => setTips(e.target.value.split(","))} placeholder="Tip1, Tip2, Tip3" />

        <label>Products (comma separated):</label>
        <input type="text" onChange={(e) => setProducts(e.target.value.split(","))} placeholder="Product1, Product2" />

        <label>Upload Images:</label>
        <input type="file" multiple onChange={handleFileChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Medication;

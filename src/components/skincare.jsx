import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/skincare.module.css"; // Import CSS module

const Skincare = () => {
    const [gender, setGender] = useState("");
    const [condition, setCondition] = useState("");
    const [tips, setTips] = useState(["", "", ""]); // Ensure at least 3 tips
    const [products, setProducts] = useState(["", "", ""]); // Ensure at least 3 products
    const [files, setFiles] = useState([]);

    const handleTipChange = (index, value) => {
        const updatedTips = [...tips];
        updatedTips[index] = value;
        setTips(updatedTips);
    };

    const handleProductChange = (index, value) => {
        const updatedProducts = [...products];
        updatedProducts[index] = value;
        setProducts(updatedProducts);
    };

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (tips.length < 3 || tips.some(tip => tip.trim() === "")) {
            alert("Please provide at least 3 skincare tips.");
            return;
        }

        if (products.length < 3 || products.some(product => product.trim() === "")) {
            alert("Please provide at least 3 skincare products.");
            return;
        }

        if (files.length < 3) {
            alert("Please upload at least 3 images.");
            return;
        }

        const formData = new FormData();
        formData.append("gender", gender);
        formData.append("condition", condition);
        tips.forEach((tip) => formData.append("tips", tip));
        products.forEach((product) => formData.append("products", product));
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/skincare/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Skincare recommendation added successfully!");
            console.log(response.data);

            // Reset form after successful submission
            setGender("");
            setCondition("");
            setTips(["", "", ""]);
            setProducts(["", "", ""]);
            setFiles([]);
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.detail || "Something went wrong");
        }
    };

    return (
        <div className={styles.container}>
            <h2>Submit Skincare Recommendation</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label>Gender:</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                </select>

                <label>Skin Condition:</label>
                <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} required />

                <label>Skincare Tips (At least 3):</label>
                {tips.map((tip, index) => (
                    <input
                        key={index}
                        type="text"
                        value={tip}
                        onChange={(e) => handleTipChange(index, e.target.value)}
                        required
                    />
                ))}

                <label>Recommended Products (At least 3):</label>
                {products.map((product, index) => (
                    <input
                        key={index}
                        type="text"
                        value={product}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        required
                    />
                ))}

                <label>Upload Images (3 or more):</label>
                <input type="file" multiple onChange={handleFileChange} required accept="image/*" />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Skincare;

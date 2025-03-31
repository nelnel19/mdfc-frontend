import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose, AiFillSkin } from "react-icons/ai";
import { FaUser, FaRegSmileBeam, FaSpinner } from "react-icons/fa";
import Sidebar from "./sidebar"; // ✅ Import Sidebar
import styles from "../styles/skincares.module.css";

const SkincareForm = () => {
  const [gender, setGender] = useState("");
  const [skinType, setSkinType] = useState("");
  const [conditions, setConditions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const skinConditions = [
    "Acne",
    "Wrinkles",
    "Dark Spots or Hyperpigmentation",
    "Redness or Rosacea",
    "Sensitivity",
  ];

  const handleConditionChange = (condition) => {
    setConditions((prevConditions) =>
      prevConditions.includes(condition)
        ? prevConditions.filter((c) => c !== condition)
        : [...prevConditions, condition]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);

    try {
      const response = await fetch("https://mdfc.onrender.com/skincares/");
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      if (!data.skincare_recommendations || !Array.isArray(data.skincare_recommendations)) {
        throw new Error("Invalid data format");
      }

      const matchedSkinType = data.skincare_recommendations.filter(
        (rec) =>
          rec.gender?.toLowerCase() === gender.toLowerCase() &&
          rec.condition?.toLowerCase() === skinType.toLowerCase()
      );

      const matchedConditions = data.skincare_recommendations.filter(
        (rec) =>
          rec.gender?.toLowerCase() === gender.toLowerCase() &&
          conditions.includes(rec.condition)
      );

      const finalRecommendations = [...matchedSkinType, ...matchedConditions.slice(0, 3)];

      if (finalRecommendations.length > 0) {
        setRecommendations(finalRecommendations);
        setShowModal(true);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoutine = async () => {
    const lastLoggedInUser = localStorage.getItem("lastLoggedInUser");

    // Prepare the data to save
    const skincareData = {
      email: lastLoggedInUser,
      gender,
      skin_type: skinType,
      conditions,
      recommendations,
      images: recommendations.flatMap((rec) => rec.images || []), // Collect images from recommendations
    };

    try {
      const response = await fetch("https://mdfc.onrender.com/save_skincare/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skincareData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Skincare routine saved successfully!");
        setShowModal(false); // Close modal after saving
      } else {
        throw new Error("Failed to save skincare routine");
      }
    } catch (error) {
      console.error("Error saving skincare routine:", error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar /> {/* ✅ Sidebar Added */}

      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <h2>
          <AiFillSkin style={{ color: "#d76a03", marginRight: "10px" }} />
          Find Your Skincare Routine
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            <FaUser style={{ marginRight: "8px" }} />
            Gender:
          </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label>
            <FaRegSmileBeam style={{ marginRight: "8px" }} />
            Skin Type:
          </label>
          <select value={skinType} onChange={(e) => setSkinType(e.target.value)} required>
            <option value="">Select</option>
            <option value="Oily Skin">Oily Skin</option>
            <option value="Dry Skin">Dry Skin</option>
            <option value="Combination Skin">Combination Skin</option>
            <option value="Sensitive Skin">Sensitive Skin</option>
            <option value="Normal Skin">Normal Skin</option>
          </select>

          <label>Skin Conditions:</label>
          <div className={styles.checkboxGroup}>
            {skinConditions.map((condition) => (
              <div key={condition}>
                <input
                  type="checkbox"
                  id={condition}
                  value={condition}
                  checked={conditions.includes(condition)}
                  onChange={() => handleConditionChange(condition)}
                />
                <label htmlFor={condition}>{condition}</label>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <FaSpinner className={styles.spinner} /> : "Generate Skincare"}
          </button>
        </form>

        {/* MODAL */}
        <AnimatePresence>
          {showModal && recommendations.length > 0 && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={styles.modal}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <AiOutlineClose className={styles.closeButton} onClick={() => setShowModal(false)} />
                <h3>Recommended Skincare Routine</h3>
                {recommendations.map((rec, index) => (
                  <div key={index}>
                    <h4>{rec.condition}</h4>
                    {rec.tips && (
                      <div>
                        <h4>Skincare Tips:</h4>
                        <ul>
                          {rec.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {rec.products && (
                      <div>
                        <h4>Recommended Products:</h4>
                        <ul>
                          {rec.products.map((product, idx) => (
                            <li key={idx}>{product}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {rec.images && (
                      <div className={styles.images}>
                        {rec.images.map((image, idx) => (
                          <img key={idx} src={image} alt={`Skincare ${idx + 1}`} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={handleSaveRoutine} className={styles.saveButton}>
                  Save Skincare Routine
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SkincareForm;

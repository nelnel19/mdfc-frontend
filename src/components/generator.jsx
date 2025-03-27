import { useEffect, useState } from "react";
import styles from "../styles/generator.module.css";
import medModalStyles from "../styles/medmodal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes, faPills, faSave } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./sidebar";

const Generator = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [medLoading, setMedLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // Trigger animation when component mounts
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const predictRes = await fetch("http://localhost:8001/predict/", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      // Add a 3-second delay before showing the result
      setTimeout(() => {
        setResult(predictRes);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error predicting image:", error);
      setLoading(false);
    }
  };

  const fetchMedications = async () => {
    if (!result || !result.prediction) {
      alert("No skin condition detected.");
      return;
    }

    setMedLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/medications/${result.prediction}`);
      const data = await response.json();

      if (!data.length) {
        alert("No information found for this condition.");
        setMedLoading(false);
        return;
      }

      setDiseaseInfo(data[0]);

      setTimeout(() => {
        setMedicationModalOpen(true);
        setMedLoading(false);
      }, 5000);
    } catch (error) {
      console.error("Error fetching disease details:", error);
      alert("Failed to fetch disease information.");
      setMedLoading(false);
    }
  };

  const saveMedication = async () => {
    if (!diseaseInfo) {
      alert("No medication data to save.");
      return;
    }

    const savedUser = localStorage.getItem("lastLoggedInUser");
    if (!savedUser) {
      alert("Please log in to save medications.");
      return;
    }

    const parsedUser = savedUser.startsWith("{") ? JSON.parse(savedUser) : { email: savedUser };

    const medicationData = {
      email: parsedUser.email,
      disease: diseaseInfo.disease,
      tips: diseaseInfo.tips,
      products: diseaseInfo.products,
      images: diseaseInfo.images,
    };

    try {
      const response = await fetch("http://localhost:8000/save_medication/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicationData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Medication saved successfully!");
      } else {
        alert(`Error saving medication: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error saving medication:", error);
      alert("Failed to save medication.");
    }
  };

  return (
    <div className={`${styles.wrapper} ${animate ? "fadeInUp" : ""}`}>
      <div className={styles.bgImage}></div> {/* Background image outside container */}
      <Sidebar />

      <div className={styles.container}>
        <div className={styles.uploadOptions}>
          <label className={styles.uploadBox}>
            <div className={styles.uploadText}>Upload an Image</div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        {/* Image Preview */}
        {image && (
          <div className={styles.previewContainer}>
            <img src={URL.createObjectURL(image)} alt="Preview" className={styles.preview} />
            <button onClick={handleUpload} disabled={loading} className={styles.analyzeBtn}>
              {loading ? "Predicting..." : "Predict Skin Condition"}
            </button>
          </div>
        )}

        {/* Instructions Section */}
        <div className={styles.instructions}>
          <h4>How to Use</h4>
          <ul>
            <li>Select an image of the skin condition.</li>
            <li>Click on "Predict Skin Condition" to analyze.</li>
            <li>View the prediction result in the modal.</li>
            <li>Click on "Generate Medication Tips" for suggestions.</li>
          </ul>
        </div>
      </div>

      {/* Prediction Result Modal */}
      {result && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setResult(null)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Prediction Result</h2>
            <div className={styles.resultsContainer}>
              {Object.entries(result).map(([key, value]) => (
                <div key={key} className={styles.resultItem}>
                  <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                  <strong>{key.replace("_", " ")}:</strong> {value}
                </div>
              ))}
            </div>

            {result.prediction && (
              <button onClick={fetchMedications} className={styles.medicationBtn} disabled={medLoading}>
                <FontAwesomeIcon icon={faPills} className={styles.pillIcon} />
                {medLoading ? "Fetching Tips..." : "Generate Medication Tips"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Disease Information Modal */}
      {medicationModalOpen && diseaseInfo && (
        <div className={medModalStyles.modalOverlay}>
          <div className={medModalStyles.modal}>
            <button className={medModalStyles.closeBtn} onClick={() => setMedicationModalOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>{diseaseInfo.disease}</h2>
            <p className={medModalStyles.diseaseDescription}>{diseaseInfo.description}</p>

            <h3>Recommended Tips</h3>
            <ul className={medModalStyles.tipsList}>
              {diseaseInfo.tips.map((tip, index) => (
                <li key={index} className={medModalStyles.tipItem}>
                  {tip}
                </li>
              ))}
            </ul>

            <h3>Recommended Products</h3>
            <ul className={medModalStyles.productList}>
              {diseaseInfo.products.map((product, index) => (
                <li key={index} className={medModalStyles.productItem}>
                  {product}
                </li>
              ))}
            </ul>

            <h3>Reference Images</h3>
            <div className={medModalStyles.imageGrid}>
              {diseaseInfo.images.map((img, index) => (
                <img key={index} src={img} alt={`Disease Example ${index}`} className={medModalStyles.diseaseImage} />
              ))}
            </div>

            {/* Save Medication Button */}
            <button onClick={saveMedication} className={medModalStyles.saveBtn}>
              <FontAwesomeIcon icon={faSave} /> Save Medication
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;

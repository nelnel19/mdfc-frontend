import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import styles from "../styles/history.module.css";
import { 
  FiEye, FiDroplet, FiCalendar, FiX,
  FiActivity, FiAward, FiClock, FiHeart,
  FiSun, FiMoon, FiCloudRain, FiWind,
  FiUser
} from "react-icons/fi";
import { GiDrop, GiFlowerPot, GiSpray } from "react-icons/gi";
import { BiCheckShield } from "react-icons/bi";

const History = () => {
  const [results, setResults] = useState([]);
  const [medications, setMedications] = useState([]);
  const [skincareRoutine, setSkincareRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const userEmail = localStorage.getItem("lastLoggedInUser");
        if (!userEmail) {
          setError("No logged-in user found.");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://medifacecare.onrender.com/results");
        const userResults = response.data.results.filter(res => res.email === userEmail);

        if (userResults.length === 0) {
          setError("No analysis results found for this user.");
        } else {
          setResults(userResults);
        }
      } catch (err) {
        setError("Failed to fetch results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMedications = async () => {
      try {
        const userEmail = localStorage.getItem("lastLoggedInUser");
        if (!userEmail) return;

        const response = await axios.get(`https://medifacecare.onrender.com/user_medications/${userEmail}`);
        setMedications(response.data.length > 0 ? response.data : []);
      } catch (error) {
        console.error("Error fetching medications:", error);
        setMedications([]);
      }
    };

    const fetchSkincareRoutine = async () => {
      try {
        const userEmail = localStorage.getItem("lastLoggedInUser");
        if (!userEmail) return;
    
        const response = await axios.get(`https://medifacecare.onrender.com/get_skincare/${userEmail}`);
        setSkincareRoutine(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching skincare routine:", error);
        setSkincareRoutine([]);
      }
    };

    fetchResults();
    fetchMedications();
    fetchSkincareRoutine();
  }, []);

  const openResultModal = (result) => setSelectedResult(result);
  const openMedicationModal = (medication) => setSelectedMedication(medication);
  const openRoutineModal = (routine) => setSelectedRoutine(routine);
  const closeModal = () => {
    setSelectedResult(null);
    setSelectedMedication(null);
    setSelectedRoutine(null);
  };

  return (
    <div className={styles.historyPage}>
      <Sidebar />
      <div className={styles.container}>
        {/* Analysis History Container */}
        <div className={styles.historyContainer}>
          <div className={styles.sectionHeader}>
            <FiActivity className={styles.sectionIcon} />
            <h2>Skin Analysis History</h2>
            <div className={styles.decorativeLine}></div>
          </div>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading your skin data...</p>
            </div>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <div className={styles.imageGrid}>
              {results.map((result) => (
                <div key={result.id} className={styles.card}>
                  <img src={result.image} alt="Analysis" className={styles.image} />
                  <button onClick={() => openResultModal(result)} className={styles.viewButton}>
                    <FiEye className={styles.buttonIcon} /> View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medications Container */}
        <div className={styles.medicationsContainer}>
          <div className={styles.sectionHeader}>
            <GiDrop className={styles.sectionIcon} />
            <h2>Recommended Treatments</h2>
            <div className={styles.decorativeLine}></div>
          </div>
          <div className={styles.medicationsGrid}>
            {medications.length > 0 ? (
              medications.map((med, index) => (
                <div key={index} className={styles.medicationCard}>
                  <div className={styles.medicationIcon}>
                    {med.disease.toLowerCase().includes('acne') ? <FiCloudRain /> : 
                     med.disease.toLowerCase().includes('dry') ? <GiFlowerPot /> : 
                     med.disease.toLowerCase().includes('wrinkle') ? <FiWind /> : 
                     <BiCheckShield />}
                  </div>
                  <p className={styles.diseaseName}>{med.disease}</p>
                  <button onClick={() => openMedicationModal(med)} className={styles.viewButton}>
                    <FiEye className={styles.buttonIcon} /> View Options
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <GiSpray className={styles.emptyIcon} />
                <p>No treatments recommended yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Skincare Routine Container */}
        <div className={styles.routineContainer}>
          <div className={styles.sectionHeader}>
            <FiClock className={styles.sectionIcon} />
            <h2>Your Personalized Routine</h2>
            <div className={styles.decorativeLine}></div>
          </div>
          {Array.isArray(skincareRoutine) && skincareRoutine.length > 0 ? (
            <div className={styles.routineGrid}>
              {skincareRoutine.map((routine, index) => (
                <div key={index} className={styles.routineBox}>
                  <div className={styles.routineHeader}>
                    <FiDroplet className={styles.routineIcon} />
                    <h3>{routine.skin_type} Skin Care</h3>
                  </div>
                  <button onClick={() => openRoutineModal(routine)} className={styles.viewButton}>
                    <FiEye className={styles.buttonIcon} /> Full Routine
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiAward className={styles.emptyIcon} />
              <p>No skincare routines created yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedResult && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={closeModal}><FiX /></span>
            <div className={styles.modalHeader}>
              <FiActivity className={styles.modalTitleIcon} />
              <h2>Analysis Details</h2>
            </div>
            <img src={selectedResult.image} alt="Analysis" className={styles.modalImage} />
            <div className={styles.analysisDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><FiDroplet /> Skin Tone:</span>
                <span>{selectedResult.analysis.skin_tone}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><FiDroplet /> Undertone:</span>
                <span>{selectedResult.analysis.undertone}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><FiUser /> Gender:</span>
                <span>{selectedResult.analysis.gender}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><FiCloudRain /> Acne:</span>
                <span>{selectedResult.analysis.acne}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><FiAward /> Dark Circles:</span>
                <span>{selectedResult.analysis.dark_circles}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><FiAward /> Stain:</span>
                <span>{selectedResult.analysis.stain}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMedication && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={closeModal}><FiX /></span>
            <div className={styles.modalHeader}>
              <GiDrop className={styles.modalTitleIcon} />
              <h2>Treatment Plan</h2>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.diseaseHeader}>
                <h3>{selectedMedication.disease}</h3>
              </div>
              
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}><FiAward /> Care Tips</h4>
                <ul className={styles.tipsList}>
                  {selectedMedication.tips.map((tip, idx) => (
                    <li key={idx} className={styles.tipItem}>
                      <span className={styles.tipBullet}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}><FiDroplet /> Recommended Products</h4>
                <ul className={styles.productsList}>
                  {selectedMedication.products.map((product, idx) => (
                    <li key={idx} className={styles.productItem}>
                      <span className={styles.productBullet}>→</span>
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedMedication.images && selectedMedication.images.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}><FiEye /> Product Visuals</h4>
                  <div className={styles.productImages}>
                    {selectedMedication.images.map((img, idx) => (
                      <img key={idx} src={img} alt="Product" className={styles.productImage} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedRoutine && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={closeModal}><FiX /></span>
            <div className={styles.modalHeader}>
              <FiClock className={styles.modalTitleIcon} />
              <h2>Skincare Routine</h2>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.skinTypeHeader}>
                <FiDroplet className={styles.skinTypeIcon} />
                <h3>{selectedRoutine.skin_type} Skin Care</h3>
              </div>
              
              {selectedRoutine.recommendations && selectedRoutine.recommendations.length > 0 ? (
                selectedRoutine.recommendations.map((rec, idx) => (
                  <div key={idx} className={styles.recommendationSection}>
                    <div className={styles.conditionHeader}>
                      <h4>{rec.condition}</h4>
                    </div>
                    
                    <div className={styles.routineColumns}>
                      <div className={styles.routineColumn}>
                        <h5 className={styles.routineTime}><FiSun /> Morning</h5>
                        <ul className={styles.routineSteps}>
                          {rec.tips.filter((_, i) => i % 2 === 0).map((tip, tipIdx) => (
                            <li key={tipIdx} className={styles.routineStep}>
                              <span className={styles.stepNumber}>{tipIdx + 1}</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className={styles.routineColumn}>
                        <h5 className={styles.routineTime}><FiMoon /> Evening</h5>
                        <ul className={styles.routineSteps}>
                          {rec.tips.filter((_, i) => i % 2 !== 0).map((tip, tipIdx) => (
                            <li key={tipIdx} className={styles.routineStep}>
                              <span className={styles.stepNumber}>{tipIdx + 1}</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {rec.products && rec.products.length > 0 && (
                      <div className={styles.productsSection}>
                        <h5 className={styles.productsTitle}><FiDroplet /> Recommended Products</h5>
                        <ul className={styles.productsList}>
                          {rec.products.map((product, prodIdx) => (
                            <li key={prodIdx} className={styles.productItem}>
                              <span className={styles.productBullet}>•</span>
                              {product}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {rec.images && rec.images.length > 0 && (
                      <div className={styles.productImages}>
                        {rec.images.map((img, imgIdx) => (
                          <img key={imgIdx} src={img} alt="Product" className={styles.productImage} />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <FiAward className={styles.emptyIcon} />
                  <p>No detailed skincare recommendations available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
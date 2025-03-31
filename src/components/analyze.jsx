import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import styles from "../styles/analyze.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faCamera, faCheckCircle, faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./sidebar";

const Analyze = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [highlightCircle, setHighlightCircle] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isBlurred, setIsBlurred] = useState(false);

  // For webcam functionality
  const [useWebcam, setUseWebcam] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectIntervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Add keydown event listener for Enter key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && image && !loading) {
        handleUpload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, loading]); // Dependencies to ensure the latest state is used

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setResult(null);
      setUseWebcam(false);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setUseWebcam(false);
      setHighlightCircle(true);
      setTimeout(() => setHighlightCircle(false), 1000);
    }
  };

  // Clear detection interval when component unmounts
  const clearDetectionInterval = useCallback(() => {
    if (detectIntervalRef.current) {
      clearInterval(detectIntervalRef.current);
      detectIntervalRef.current = null;
    }
  }, []);

  // Clear countdown when component unmounts
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const setupObjectDetection = useCallback(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    // Start the detection loop
    clearDetectionInterval();
    detectIntervalRef.current = setInterval(() => {
      detectObject();
    }, 200); // Check every 200ms
  }, [clearDetectionInterval]);

  const detectObject = () => {
    if (!webcamRef.current || !webcamRef.current.video) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const centerWidth = canvas.width * 0.6;
    const centerHeight = canvas.height * 0.6;
    const x = (canvas.width - centerWidth) / 2;
    const y = (canvas.height - centerHeight) / 2;

    try {
      const imageData = ctx.getImageData(x, y, centerWidth, centerHeight);
      const data = imageData.data;

      let sum = 0;
      let samples = 0;
      const sampleRate = 20;

      for (let i = 0; i < data.length; i += 4 * sampleRate) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        sum += brightness;
        samples++;
      }

      const avgBrightness = sum / samples;
      let variance = 0;

      for (let i = 0; i < data.length; i += 4 * sampleRate) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        variance += Math.pow(brightness - avgBrightness, 2);
      }
      variance /= samples;

      const detectionThreshold = 2300;
      const isDetected = variance > detectionThreshold;

      setHighlightCircle(isDetected);

      // Start countdown if consistently detected
      if (isDetected && !countdownRef.current) {
        setIsBlurred(true); // Blur the background
        setCountdown(5); // Start countdown from 5 seconds
        countdownRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
              captureImage(); // Automatically capture image
              setIsBlurred(false); // Remove blur
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (!isDetected && countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        setCountdown(null);
        setIsBlurred(false); // Remove blur
      }

      // Debugging
      console.log("Brightness Variance:", variance, "Detection:", isDetected);
    } catch (error) {
      console.error("Error processing image data:", error);
    }
  };

  // Initialize object detection when webcam is active
  useEffect(() => {
    if (useWebcam) {
      setupObjectDetection();
    } else {
      clearDetectionInterval();
    }
  }, [useWebcam, setupObjectDetection, clearDetectionInterval]);

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();

    // Check if the image is from webcam (base64) or file upload (File object)
    if (typeof image === "string") {
      const blob = await fetch(image).then((res) => res.blob());
      formData.append("file", blob, "captured_image.png");
    } else {
      formData.append("file", image);
    }

    try {
      const analyzeRes = await fetch("https://mdfc.onrender.com/analyze/", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      const detectRes = await fetch("https://mdfc.onrender.com/detect/", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      const combinedResults = { ...analyzeRes, ...detectRes };
      setResult(combinedResults);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
    setLoading(false);
  };

  const handleSaveResult = async () => {
    if (!result || !image) return;
    const email = localStorage.getItem("lastLoggedInUser");
    if (!email) {
      alert("Please Log in to save your record.");
      return;
    }

    try {
      const formattedResult = Object.fromEntries(
        Object.entries(result).map(([key, value]) => [key, String(value)])
      );

      const formData = new FormData();
      formData.append("image", typeof image === "string" ? await fetch(image).then(res => res.blob()) : image);
      formData.append("analysis", JSON.stringify(formattedResult));
      formData.append("email", email);

      const response = await fetch("https://mdfc.onrender.com/save-result", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Result saved successfully with image in Cloudinary!");
      } else {
        const errorData = await response.json();
        console.error("Error saving result:", errorData);
        alert("Failed to save result: " + errorData.detail);
      }
    } catch (error) {
      console.error("Error saving result:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.wrapper}>
        <Sidebar />

        <div className={styles.container}>
          <div className={styles.uploadOptions}>
            <label className={styles.uploadBox}>
              <FontAwesomeIcon icon={faUpload} className={styles.uploadIcon} />
              <div className={styles.uploadText}>Upload an Image</div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            <label className={styles.uploadBox} onClick={() => setUseWebcam((prev) => !prev)}>
              <FontAwesomeIcon icon={faCamera} className={styles.uploadIcon} />
              <div className={styles.uploadText}>{useWebcam ? "Close Camera" : "Take a Photo"}</div>
            </label>
          </div>

          {useWebcam && (
            <div className={styles.previewContainer}>
              <div className={`${styles.webcamWrapper} ${isBlurred ? styles.blurred : ''}`}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  className={styles.preview}
                  videoConstraints={{ facingMode: "user" }}
                  mirrored={true}
                />
                <div className={`${styles.circleOverlay} ${highlightCircle ? styles.highlight : ''}`}></div>
                {countdown !== null && (
                  <div className={styles.countdown}>
                    {countdown}
                  </div>
                )}
              </div>
              <button onClick={captureImage} className={styles.analyzeBtn}>
                Capture Photo
              </button>
            </div>
          )}

          {image && (
            <div className={styles.previewContainer}>
              <img src={typeof image === "string" ? image : URL.createObjectURL(image)} alt="Preview" className={styles.preview} />
              <button onClick={handleUpload} disabled={loading} className={styles.analyzeBtn}>
                {loading ? "Analyzing..." : "Analyze Skin"}
              </button>
            </div>
          )}

          <div className={styles.instructions}>
            <hr className={styles.divider} />
            <p>
              <strong>How to Use:</strong> Upload an image or take a photo using the camera. Click <em>"Analyze Skin"</em> to process the image.  
              Results will be displayed in a popup.
            </p>
            <p>
              <strong>Tips for Best Results:</strong>
              <ul>
                <li>Ensure your face is well-lit. Natural daylight is best.</li>
                <li>Avoid harsh shadows or overexposed areas.</li>
                <li>Keep your face centered and move closer if needed.</li>
                <li>Remove makeup for a more accurate skin analysis.</li>
                <li>Stay still and keep the camera steady when capturing.</li>
              </ul>
            </p>
          </div>
        </div>

        {result && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.closeBtn} onClick={() => setResult(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2>Analysis Results</h2>
              <div className={styles.resultsContainer}>
                {Object.entries(result).map(([key, value]) => (
                  <div key={key} className={styles.resultItem}>
                    <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                    <strong>{key.replace("_", " ")}:</strong> {value}
                  </div>
                ))}
              </div>

              <button onClick={handleSaveResult} className={styles.analyzeBtn}>
                <FontAwesomeIcon icon={faSave} /> Save Result
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
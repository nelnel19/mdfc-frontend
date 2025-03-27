import React from "react";
import Sidebar from "./sidebar";
import { FaCheckCircle, FaUserAlt, FaSun, FaShieldAlt, FaSmileBeam } from "react-icons/fa";
import styles from "../styles/learnmore.module.css";
import "@fontsource/poppins";

const skinTones = [
  { 
    label: "Very Fair", 
    description: "Very fair skin tends to burn easily and requires high SPF protection.",
    images: ["/images/veryFair1.jpg", "/images/veryFair2.jpg"] 
  },
  { 
    label: "Light-Medium", 
    description: "Light-medium skin has warm undertones and may tan with sun exposure.",
    images: ["/images/light-medium1.jpg", "/images/light-medium2.jpg"] 
  },
  { 
    label: "Medium", 
    description: "Medium skin tones are more resistant to sunburn but still require sun protection.",
    images: ["/images/Medium1.jpg", "/images/Medium2.jpg"] 
  },
  { 
    label: "Tan", 
    description: "Tan skin develops a golden brown color and requires hydration to maintain its glow.",
    images: ["/images/Tan1.jpg", "/images/Tan2.jpg"] 
  },
  { 
    label: "Deep Tan", 
    description: "Deep tan skin tones are rich in melanin and require even moisturizing and SPF protection.",
    images: ["/images/DeepTan1.jpg", "/images/DeepTan2.jpg"] 
  },
  { 
    label: "Deep", 
    description: "Deep skin tones have high melanin content and benefit from brightening and hydrating skincare.",
    images: ["/images/Deep1.jpg", "/images/Deep2.jpg"] 
  },
];

const LearnMore = () => {
  return (
    <div
      className={styles.layout}
      style={{
        backgroundImage: "url('/images/bbgg3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh", 
        width: "100%",
      }}
    >
      <Sidebar />
      <div className={styles.container}>
        <h1 className={styles.title}>Why Skincare Matters</h1>
        <p className={styles.subtitle}>Unlock healthy, glowing skin with a consistent skincare routine.</p>

        <ul className={styles.list}>
          <li>
            <FaCheckCircle className={styles.icon} />
            <strong>Prevents Skin Problems –</strong> Regular cleansing and moisturizing help prevent acne, dryness, and sensitivity.
          </li>
          <li>
            <FaSun className={styles.icon} />
            <strong>Slows Down Aging –</strong> Using sunscreen and anti-aging products reduces fine lines, wrinkles, and sunspots.
          </li>
          <li>
            <FaShieldAlt className={styles.icon} />
            <strong>Protects Against Damage –</strong> Skincare shields the skin from pollution, UV rays, and harsh weather.
          </li>
          <li>
            <FaUserAlt className={styles.icon} />
            <strong>Maintains Hydration & Balance –</strong> Proper skincare keeps the skin hydrated and prevents excessive oiliness or dryness.
          </li>
          <li>
            <FaSmileBeam className={styles.icon} />
            <strong>Boosts Confidence –</strong> Healthy, glowing skin enhances self-esteem and well-being.
          </li>
        </ul>

        <p className={styles.text}>Consistent skincare brings long-term benefits, helping your skin stay fresh, youthful, and healthy.</p>

        {/* Different Skin Tones Section */}
        <div className={styles.skinTonesSection}>
          <h2 className={styles.skinToneTitle}>Explore Different Skin Tones</h2>
          <div className={styles.skinToneGrid}>
            {skinTones.map((tone, index) => (
              <div key={index} className={styles.skinToneGroup}>
                <div className={styles.skinToneLabel}>{tone.label}</div>
                <p className={styles.skinToneDescription}>{tone.description}</p>
                <div className={styles.skinToneImages}>
                  {tone.images.map((image, imgIndex) => (
                    <div key={imgIndex} className={styles.skinToneCard}>
                      <img src={image} alt={tone.label} className={styles.skinToneImage} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;

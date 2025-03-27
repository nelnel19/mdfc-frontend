// components/Register.js
import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/register.module.css'; // Scoped styles

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!email || !username || !password || !age || !gender) {
      setError('All fields are required.');
      return;
    }

    // Open the modal instead of directly submitting the form
    setIsModalOpen(true);
  };

  const handleAgree = async () => {
    // User agreed to terms and conditions
    if (!hasAgreed) {
      setError('You must agree to the terms and conditions to proceed.');
      return;
    }

    setIsModalOpen(false);

    // Prepare user data for registration
    const userData = { email, username, password, age: Number(age), gender };

    try {
      // Call the API to register the user
      const response = await registerUser(userData);
      console.log(response);

      // Redirect to the login page after successful registration
      navigate('/login');
    } catch (err) {
      // Handle errors from the API
      setError(err.detail || 'Something went wrong');
    }
  };

  const handleCancel = () => {
    // User canceled the terms and conditions modal
    setIsModalOpen(false);
    setHasAgreed(false);
  };

  // Modal component for terms and conditions
  const TermsAndConditionsModal = ({ isOpen, onAgree, onCancel }) => {
    if (!isOpen) return null;

    return (
      <div className={styles['modal-overlay']}>
        <div className={styles['modal-content']}>
          <h2>Terms and Conditions & Data Privacy</h2>
          <div className={styles['terms-content']}>
            <p>
              Welcome to our platform! By registering, you agree to the following terms and conditions:
            </p>
            <ol>
              <li>
                <strong>Acceptance of Terms:</strong> By using this platform, you agree to comply with and be bound by these terms and conditions. If you do not agree, please do not use our services.
              </li>
              <li>
                <strong>Data Privacy:</strong> We are committed to protecting your privacy. Your personal data will be used in accordance with our Data Privacy Policy. We will not share your information with third parties without your consent.
              </li>
              <li>
                <strong>User Responsibilities:</strong> You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.
              </li>
              <li>
                <strong>Prohibited Activities:</strong> You may not use our platform for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction.
              </li>
              <li>
                <strong>Termination:</strong> We reserve the right to terminate or suspend your account at any time for violations of these terms.
              </li>
              <li>
                <strong>Changes to Terms:</strong> We may modify these terms at any time. Your continued use of the platform constitutes acceptance of the updated terms.
              </li>
            </ol>
            <p>
              Please read these terms carefully before proceeding. By checking the box below, you agree to these terms and conditions.
            </p>
          </div>
          <div className={styles['terms-agreement']}>
            <label>
              <input
                type="checkbox"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
              />
              I agree to the terms and conditions
            </label>
          </div>
          <div className={styles['modal-buttons']}>
            <button onClick={onAgree} disabled={!hasAgreed}>Proceed</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles['register-container']}>
      <div className={styles['auth-wrapper']}>
        {/* Left Section: Form */}
        <div className={styles['auth-box']}>
          <h2>SIGN UP</h2>
          <p>Create an account to discover glow up possibilities!</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-envelope"></i></span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-user"></i></span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-lock"></i></span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-birthday-cake"></i></span>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            {/* Gender Dropdown */}
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-venus-mars"></i></span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            <button type="submit">Register</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <div className={styles['signup-link']}>
            Already have an account? <a href="/login">Sign In</a>
          </div>  
        </div>

        {/* Right Section: Image and Gradient */}
        <div className={styles['auth-image']}>
          <div className={styles['auth-image-content']}>
            <h1>MEDIFACECARE</h1>
            <p>Join our platform and unlock a world of opportunities. Experience seamless communication and stay connected with what matters most.</p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal 
        isOpen={isModalOpen} 
        onAgree={handleAgree} 
        onCancel={handleCancel} 
      />
    </div>
  );
};

export default Register;
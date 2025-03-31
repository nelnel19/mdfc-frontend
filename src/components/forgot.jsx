import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/forgot.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://mdfc.onrender.com/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
     // Expecting backend to return the token
        setMessage('Reset token received. Redirecting to reset page...');
        setTimeout(() => {
          navigate(`/resetpassword`);
        }, 2000);
      } else {
        setError(data.detail || 'Failed to send reset email.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset token.</p>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Token</button>
        </form>

        <p>
          Back to <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

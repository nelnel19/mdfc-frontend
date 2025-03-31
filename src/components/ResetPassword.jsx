import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../styles/reset.module.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!email || !token) {
      setError('Invalid reset link or missing token.');
    }
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Both fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('https://mdfc.onrender.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, new_password: password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password successfully reset! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setError(data.detail || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Reset Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>

        <p>
          Back to <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

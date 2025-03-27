import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/login.module.css';

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem('lastLoggedInUser') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('lastLoggedInUser');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await loginUser({ email, password });

      // Check if the user is an admin
      if (response.role === 'admin') {
        // Save last logged-in admin email to localStorage
        localStorage.setItem('lastLoggedInAdmin', email);
        // Navigate to the dashboard for admin users
        navigate('/dashboard');
      } else {
        // Save last logged-in email to localStorage for non-admin users
        localStorage.setItem('lastLoggedInUser', email);
        navigate('/learn');
      }

      console.log(response);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Your account is archived or deactivated. Please contact support.');
      } else {
        setError(err.detail || 'Something went wrong');
      }
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['auth-wrapper']}>
        <div className={styles['auth-box']}>
          <h2>WELCOME BACK TOL</h2>
          <p>Log in to get the most recent updates on the things that interest you</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-user"></i></span>
              <input
                type="email"
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <button type="submit">Sign In</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <div className={styles['links']}>
            <a href="/forgotpassword" className={styles['forgot-password']}>Forgot Password?</a>
          </div>

          <div className={styles['signup-link']}>
            Don’t have an account? <a href="/register">Sign Up Now</a>
          </div>

          <div className={styles['social-icons']}>
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-google"></i>
          </div>
        </div>

        <div className={styles['auth-image']}>
          <div className={styles['auth-image-content']}>
            <h1>MEDIFACECARE</h1>
            <p>Join our platform and unlock a world of opportunities. Experience seamless communication and stay connected with what matters most.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
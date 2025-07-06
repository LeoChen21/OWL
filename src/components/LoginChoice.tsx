import React from 'react';
import { useGuestAuth } from '../contexts/GuestAuthContext';
import '../styles/LoginChoice.css';

interface LoginChoiceProps {
  onShowAuthenticator: () => void;
}

const LoginChoice: React.FC<LoginChoiceProps> = ({ onShowAuthenticator }) => {
  const { loginAsGuest } = useGuestAuth();

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  const handleUserLogin = () => {
    onShowAuthenticator();
  };

  return (
    <div className="login-choice-container">
      <div className="login-choice-card">
        <h1 className="app-title">🦉 OWL - Online Web Library</h1>
        <p className="app-description">
          Organize and manage your online resources with ease
        </p>
        
        <div className="login-options">
          <button 
            className="login-button guest-button"
            onClick={handleGuestLogin}
          >
            <div className="button-content">
              <span className="button-icon">👤</span>
              <div className="button-text">
                <h3>Continue as Guest</h3>
                <p>Try the app without signing up. Data stored temporarily.</p>
              </div>
            </div>
          </button>
          
          <button 
            className="login-button auth-button"
            onClick={handleUserLogin}
          >
            <div className="button-content">
              <span className="button-icon">🔐</span>
              <div className="button-text">
                <h3>Sign In / Sign Up</h3>
                <p>Create an account to save your data permanently.</p>
              </div>
            </div>
          </button>
        </div>
        
        <div className="guest-notice">
          <p>
            <strong>Guest Mode:</strong> Your data will be stored locally and deleted after 24 hours 
            or when you clear your browser data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginChoice;
import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-card">
            <div className="auth-logo">
              <h1>Dayflow</h1>
              <p>HR Management System</p>
            </div>
            <div className="auth-illustration">
              {/* Placeholder for illustration */}
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

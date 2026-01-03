import React, { useState } from 'react';
import { Bell, Lock, Eye, Smartphone, Mail } from 'lucide-react';
import '../../styles/Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    twoFactorAuth: false,
    profileVisibility: 'public',
    themeMode: 'light',
  });

  const [savedMessage, setSavedMessage] = useState('');

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="settings-page">
      <header className="section-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Account Settings</h1>
          <p className="muted">Manage your account preferences and security options.</p>
        </div>
      </header>

      {savedMessage && <div className="success-message">{savedMessage}</div>}

      <div className="settings-container">
        {/* Notifications Section */}
        <section className="settings-card">
          <div className="card-header">
            <Bell size={24} />
            <h2>Notifications</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive notifications via email about important updates</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Push Notifications</h3>
                <p>Get instant alerts directly on your browser</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>SMS Notifications</h3>
                <p>Receive important alerts via text message</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="settings-card">
          <div className="card-header">
            <Eye size={24} />
            <h2>Privacy</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Profile Visibility</h3>
                <p>Control who can see your profile information</p>
              </div>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
                className="setting-select"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="internal">Internal Only</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Theme Mode</h3>
                <p>Choose your preferred display theme</p>
              </div>
              <select
                value={settings.themeMode}
                onChange={(e) => handleSelectChange('themeMode', e.target.value)}
                className="setting-select"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="settings-card">
          <div className="card-header">
            <Lock size={24} />
            <h2>Security</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={() => handleToggle('twoFactorAuth')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item button-item">
              <div className="setting-info">
                <h3>Change Password</h3>
                <p>Update your account password regularly</p>
              </div>
              <button className="btn-secondary">Change</button>
            </div>

            <div className="setting-item button-item">
              <div className="setting-info">
                <h3>Active Sessions</h3>
                <p>Manage devices accessing your account</p>
              </div>
              <button className="btn-secondary">Manage</button>
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section className="settings-card danger">
          <div className="card-header">
            <Mail size={24} />
            <h2>Account</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item button-item">
              <div className="setting-info">
                <h3>Download Your Data</h3>
                <p>Get a copy of all your data in your account</p>
              </div>
              <button className="btn-secondary">Download</button>
            </div>

            <div className="setting-item button-item danger">
              <div className="setting-info">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all data</p>
              </div>
              <button className="btn-danger">Delete</button>
            </div>
          </div>
        </section>

        <div className="settings-actions">
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn-secondary">Reset to Default</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

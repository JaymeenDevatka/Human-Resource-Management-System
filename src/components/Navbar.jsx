import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && !event.target.closest('.search-input')) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current page title from route
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        <div className={`search-container ${isSearchOpen ? 'active' : ''}`} ref={searchRef}>
          <button 
            className="search-toggle" 
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (!isSearchOpen) {
                setTimeout(() => document.querySelector('.search-input')?.focus(), 100);
              }
            }}
          >
            <Search size={18} />
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: isSearchOpen ? '200px' : '0' }}
          />
        </div>

        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-dropdown" ref={dropdownRef}>
          <button 
            className="user-btn" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="user-avatar">{(user?.name || 'U').slice(0, 2).toUpperCase()}</div>
            <span className="user-name">{user?.name || user?.email || 'User'}</span>
            <ChevronDown size={16} className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="user-avatar large">{(user?.name || 'U').slice(0, 2).toUpperCase()}</div>
                <div className="user-info">
                  <div className="user-name">{user?.name || 'User'}</div>
                  <div className="user-email">{user?.email || 'user@example.com'}</div>
                  <div className="user-role">{isAdmin ? 'Admin / HR' : 'Employee'}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <a href="/profile" className="dropdown-item">
                <User size={16} />
                <span>My Profile</span>
              </a>
              <a href="/settings" className="dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </a>
              <a href="/help" className="dropdown-item">
                <HelpCircle size={16} />
                <span>Help</span>
              </a>
              <div className="dropdown-divider"></div>
              <button type="button" onClick={handleLogout} className="dropdown-item logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Clock, 
  CalendarDays, 
  DollarSign, 
  LogOut 
} from 'lucide-react';
import { FaUsers } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  
  const baseMenuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/profile', name: 'Profile', icon: <User size={18} /> },
    { path: '/attendance', name: 'Attendance', icon: <Clock size={18} /> },
    { path: '/leaves/apply', name: 'Leave', icon: <CalendarDays size={18} /> },
  ];

  const adminMenuItems = [
    ...baseMenuItems,
    { path: '/admin/attendance', name: 'Attendance Mgmt', icon: <Clock size={18} /> },
    { path: '/admin/payroll', name: 'Payroll', icon: <DollarSign size={18} /> },
    { path: '/admin/leaves/approvals', name: 'Approvals', icon: <CalendarDays size={18} /> },
    { path: '/admin/employees', name: 'Employees', icon: <FaUsers size={18} /> },
  ];

  const employeeMenuItems = [
    ...baseMenuItems,
    { path: '/payroll', name: 'Payroll', icon: <DollarSign size={18} /> },
  ];

  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems;

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dayflow</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="menu-items">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className={`menu-item ${isActive ? 'active' : ''}`}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-text">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
          
          <li className="menu-item logout-item">
            <a href="#logout" onClick={handleLogout}>
              <span className="menu-icon"><LogOut size={18} /></span>
              <span className="menu-text">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{(user?.name || 'U').slice(0, 2).toUpperCase()}</div>
          <div className="user-details">
            <div className="user-name">{user?.name || user?.email || 'User'}</div>
            <div className="user-role">{isAdmin ? 'Admin / HR' : 'Employee'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
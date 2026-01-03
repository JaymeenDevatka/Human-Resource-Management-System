import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaBell,
  FaMoneyBillWave,
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaUser,
} from 'react-icons/fa';
import { ChevronRight, TrendingUp } from 'lucide-react';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split('@')[0] || 'Admin';
  
  const [activeTab, setActiveTab] = useState('overview');

  const adminStats = [
    {
      id: 1,
      title: 'Pending approvals',
      value: '8',
      icon: <FaBell size={20} />,
      color: '#f59e0b',
      trend: 'up',
      change: '5 leave • 3 payroll',
      link: '/admin/leaves/approvals',
    },
    {
      id: 2,
      title: 'Payroll in queue',
      value: '2 cycles',
      icon: <FaMoneyBillWave size={20} />,
      color: '#2563eb',
      trend: 'up',
      change: 'Next run: Feb 1',
      link: '/admin/payroll',
    },
    {
      id: 3,
      title: 'Active employees',
      value: '142',
      icon: <FaUsers size={20} />,
      color: '#10b981',
      trend: 'up',
      change: '5 new this month',
      link: '/admin/employees',
    },
    {
      id: 4,
      title: 'Attendance rate',
      value: '94%',
      icon: <FaCheckCircle size={20} />,
      color: '#6366f1',
      trend: 'up',
      change: '2.1% from last month',
      link: '/admin/attendance',
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      name: 'Sarah Johnson',
      type: 'Leave Request',
      date: '2 days ago',
      status: 'pending',
      details: 'Annual Leave - Jan 15-20',
    },
    {
      id: 2,
      name: 'Mike Chen',
      type: 'Leave Request',
      date: '5 hours ago',
      status: 'pending',
      details: 'Sick Leave - Jan 10',
    },
    {
      id: 3,
      name: 'Emma Davis',
      type: 'Leave Request',
      date: '1 hour ago',
      status: 'pending',
      details: 'Personal Leave - Jan 12-14',
    },
    {
      id: 4,
      name: 'James Wilson',
      type: 'Attendance',
      date: '3 hours ago',
      status: 'pending',
      details: 'Missing check-out record',
    },
  ];

  const recentEmployees = [
    {
      id: 1,
      name: 'Alex Rodriguez',
      role: 'Senior Developer',
      joinDate: '2 days ago',
      avatar: 'AR',
    },
    {
      id: 2,
      name: 'Nina Patel',
      role: 'UX Designer',
      joinDate: '5 days ago',
      avatar: 'NP',
    },
    {
      id: 3,
      name: 'Marcus Thompson',
      role: 'Product Manager',
      joinDate: '1 week ago',
      avatar: 'MT',
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {displayName}! 👋</h1>
          <p className="subtitle">Here's your HR management overview</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Generate Report</button>
          <button className="btn-primary">Add Employee</button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          {adminStats.map((stat) => (
            <Link key={stat.id} to={stat.link} className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-trend">
                  <TrendingUp size={14} className="trend-icon" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-change">{stat.change}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="admin-content-grid">
        {/* Pending Approvals */}
        <section className="card pending-approvals">
          <div className="card-header">
            <h2>
              <FaBell size={18} />
              Pending Approvals
            </h2>
            <Link to="/admin/leaves/approvals" className="view-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="approvals-list">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="approval-item">
                <div className="approval-avatar">
                  <FaUser size={16} />
                </div>
                <div className="approval-content">
                  <div className="approval-name">{approval.name}</div>
                  <div className="approval-type">{approval.type}</div>
                  <div className="approval-details">{approval.details}</div>
                </div>
                <div className="approval-meta">
                  <span className="approval-time">{approval.date}</span>
                  <span className={`approval-status ${approval.status}`}>
                    {approval.status}
                  </span>
                </div>
                <div className="approval-actions">
                  <button className="btn-icon approve">✓</button>
                  <button className="btn-icon reject">✕</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent New Employees */}
        <section className="card recent-employees">
          <div className="card-header">
            <h2>
              <FaUsers size={18} />
              New Employees
            </h2>
            <Link to="/admin/employees" className="view-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="employees-list">
            {recentEmployees.map((emp) => (
              <div key={emp.id} className="employee-item">
                <div className="employee-avatar">{emp.avatar}</div>
                <div className="employee-info">
                  <div className="employee-name">{emp.name}</div>
                  <div className="employee-role">{emp.role}</div>
                  <div className="employee-date">Joined {emp.joinDate}</div>
                </div>
                <div className="employee-actions">
                  <button className="btn-icon">→</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="card quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/employees" className="action-btn">
              <FaUsers size={20} />
              <span>Manage Employees</span>
            </Link>
            <Link to="/admin/attendance" className="action-btn">
              <FaCheckCircle size={20} />
              <span>View Attendance</span>
            </Link>
            <Link to="/admin/leaves/approvals" className="action-btn">
              <FaCalendarAlt size={20} />
              <span>Approve Leaves</span>
            </Link>
            <Link to="/admin/payroll" className="action-btn">
              <FaMoneyBillWave size={20} />
              <span>Manage Payroll</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;

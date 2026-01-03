import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaBell,
  FaUsers,
  FaFileAlt,
} from 'react-icons/fa';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  // Show admin dashboard if user is admin
  if (isAdmin) {
    return <AdminDashboard />;
  }
  const displayName = user?.name || user?.email?.split('@')[0] || 'there';
  const employeeStats = [
    {
      id: 1,
      title: 'Leave balance',
      value: '12 days',
      icon: <FaCalendarAlt size={18} />,
      color: '#6e48aa',
      trend: 'up',
      change: '2.5% from last month',
    },
    {
      id: 2,
      title: 'Attendance',
      value: '90%',
      icon: <FaCheckCircle size={18} />,
      color: '#10b981',
      trend: 'up',
      change: '1.2% from last month',
    },
    {
      id: 3,
      title: 'Pending approvals',
      value: '3',
      icon: <FaBell size={18} />,
      color: '#f59e0b',
      trend: 'neutral',
      change: '1 from yesterday',
    },
    {
      id: 4,
      title: 'Upcoming holidays',
      value: '2',
      icon: '🎉',
      color: '#6366f1',
      trend: 'neutral',
      change: 'Next: New Year\'s Day',
    },
  ];

  const adminStats = [
    {
      id: 1,
      title: 'Pending approvals',
      value: '8',
      icon: <FaBell size={18} />,
      color: '#f59e0b',
      trend: 'neutral',
      change: '5 leave • 3 payroll',
    },
    {
      id: 2,
      title: 'Payroll in queue',
      value: '2 cycles',
      icon: <FaMoneyBillWave size={18} />,
      color: '#2563eb',
      trend: 'up',
      change: 'Next run: Feb 1',
    },
    {
      id: 3,
      title: 'Active employees',
      value: '142',
      icon: <FaUsers size={18} />,
      color: '#10b981',
      trend: 'up',
      change: '3 new this month',
    },
    {
      id: 4,
      title: 'Attendance compliance',
      value: '96%',
      icon: <FaCheckCircle size={18} />,
      color: '#6e48aa',
      trend: 'up',
      change: 'vs 94% last month',
    },
  ];

  const stats = isAdmin ? adminStats : employeeStats;

  const quickActions = [
    {
      id: 1,
      title: 'Apply leave',
      icon: <FaCalendarAlt size={16} />,
      path: '/leaves/apply',
      description: 'Request time off or check your balance.',
      color: '#6e48aa',
      role: 'all',
    },
    {
      id: 2,
      title: isAdmin ? 'Run payroll' : 'View payslips',
      icon: <FaMoneyBillWave size={16} />,
      path: isAdmin ? '/admin/payroll' : '/payroll',
      description: isAdmin ? 'Review and process payroll cycles.' : 'Access salary slips and tax docs.',
      color: '#2563eb',
      role: isAdmin ? 'admin' : 'employee',
    },
    {
      id: 3,
      title: isAdmin ? 'Approve leaves' : 'Attendance',
      icon: <FaCheckCircle size={16} />,
      path: isAdmin ? '/admin/leaves/approvals' : '/attendance',
      description: isAdmin ? 'Handle incoming leave requests.' : 'Review check-ins and timesheets.',
      color: '#10b981',
      role: isAdmin ? 'admin' : 'employee',
    },
    {
      id: 4,
      title: isAdmin ? 'Team overview' : 'Profile',
      icon: <FaUsers size={16} />,
      path: isAdmin ? '/profile' : '/profile',
      description: isAdmin ? 'View team details and updates.' : 'Manage your personal details.',
      color: '#8b5cf6',
      role: 'all',
    },
  ];

  const visibleQuickActions = quickActions.filter((action) => action.role === 'all' || (isAdmin ? action.role === 'admin' : action.role === 'employee'));

  const recentActivities = [
    {
      id: 1,
      type: 'success',
      title: 'Leave approved',
      description: 'Annual leave request approved.',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'New payslip',
      description: 'December payslip is available.',
      time: '1 day ago',
    },
    {
      id: 3,
      type: 'success',
      title: 'Checked in',
      description: 'You checked in at 09:00 AM.',
      time: 'Today',
    },
  ];

  const events = [
    { id: 1, day: '15', month: 'JAN', title: 'Team meeting', meta: '10:00 - 11:30 • Room A', type: 'meeting' },
    { id: 2, day: '26', month: 'JAN', title: 'Republic Day', meta: 'Public holiday', type: 'holiday' },
  ];

  return (
    <div className="page-section dashboard-page">
      <header className="section-header dashboard-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {displayName}!</h1>
          <p className="muted">Here\'s what\'s happening today.</p>
        </div>
        <div className="action-row">
          <button className="btn-primary">
            <FaCalendarAlt size={15} />
            <span>Request time off</span>
          </button>
          <button className="btn-ghost">
            <FaFileAlt size={15} />
            <span>Generate report</span>
          </button>
        </div>
      </header>

      <div className="card dashboard-hero">
        <div className="stats-grid dashboard-stats">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-top">
                  <span className="stat-value">{stat.value}</span>
                  <span className={`trend-badge ${stat.trend}`}>
                    {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <p className="stat-label">{stat.title}</p>
                <p className="stat-change">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="section-header">
            <h2>Quick actions</h2>
            <Link to="/quick-actions" className="view-all">View all</Link>
          </div>
          <div className="action-grid">
            {visibleQuickActions.map((action) => (
              <Link key={action.id} to={action.path} className="action-card">
                <div className="action-icon" style={{ backgroundColor: `${action.color}1a`, color: action.color }}>
                  {action.icon}
                </div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <span className="action-link">Go to {action.title} →</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <h2>Recent activities</h2>
            <Link to="/activities" className="view-all">View all</Link>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <div className="activity-icon">
                  {activity.type === 'success' ? '✓' : '!'}
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-desc">{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <h2>Upcoming events</h2>
          <Link to="/calendar" className="view-all">View calendar</Link>
        </div>
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className={`event-item ${event.type}`}>
              <div className="event-date">
                <span className="day">{event.day}</span>
                <span className="month">{event.month}</span>
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>{event.meta}</p>
              </div>
              {event.type === 'meeting' && <button className="btn-ghost">Join</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Plus } from 'lucide-react';
import '../../styles/EmployeeDirectory.css';

const EmployeeDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  const employees = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Product Manager',
      email: 'alex.johnson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Product',
      status: 'Active',
      joinDate: 'Jan 15, 2023',
      avatar: 'AJ',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Senior Developer',
      email: 'sarah.williams@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Engineering',
      status: 'Active',
      joinDate: 'Mar 22, 2022',
      avatar: 'SW',
    },
    {
      id: 3,
      name: 'Mike Chen',
      role: 'UX/UI Designer',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Design',
      status: 'Active',
      joinDate: 'Jun 10, 2023',
      avatar: 'MC',
    },
    {
      id: 4,
      name: 'Emma Davis',
      role: 'HR Specialist',
      email: 'emma.davis@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Human Resources',
      status: 'Active',
      joinDate: 'Feb 01, 2023',
      avatar: 'ED',
    },
    {
      id: 5,
      name: 'James Wilson',
      role: 'Junior Developer',
      email: 'james.wilson@company.com',
      phone: '+1 (555) 567-8901',
      department: 'Engineering',
      status: 'Active',
      joinDate: 'Aug 05, 2023',
      avatar: 'JW',
    },
    {
      id: 6,
      name: 'Olivia Martinez',
      role: 'Marketing Manager',
      email: 'olivia.martinez@company.com',
      phone: '+1 (555) 678-9012',
      department: 'Marketing',
      status: 'On Leave',
      joinDate: 'Apr 18, 2023',
      avatar: 'OM',
    },
    {
      id: 7,
      name: 'David Brown',
      role: 'DevOps Engineer',
      email: 'david.brown@company.com',
      phone: '+1 (555) 789-0123',
      department: 'Engineering',
      status: 'Active',
      joinDate: 'May 30, 2022',
      avatar: 'DB',
    },
    {
      id: 8,
      name: 'Nina Patel',
      role: 'Data Analyst',
      email: 'nina.patel@company.com',
      phone: '+1 (555) 890-1234',
      department: 'Analytics',
      status: 'Active',
      joinDate: 'Sep 12, 2023',
      avatar: 'NP',
    },
  ];

  const departments = ['all', 'Engineering', 'Product', 'Design', 'Human Resources', 'Marketing', 'Analytics'];
  const statuses = ['all', 'Active', 'On Leave', 'Inactive'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="employee-directory">
      <header className="section-header">
        <div>
          <p className="eyebrow">Employee Management</p>
          <h1>Employee Directory</h1>
          <p className="muted">Manage and view all employee information and details.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </header>

      <div className="directory-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Department</label>
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-secondary">
            <Filter size={18} />
            <span>More Filters</span>
          </button>

          <button className="btn-secondary">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            ≡ Table
          </button>
          <button
            className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => setViewMode('card')}
          >
            ▦ Cards
          </button>
        </div>
      </div>

      <div className={`results-info ${filteredEmployees.length === 0 ? 'empty' : ''}`}>
        <span>{filteredEmployees.length} employees found</span>
      </div>

      {viewMode === 'table' ? (
        <div className="card table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-name-cell">
                      <div className="emp-avatar">{emp.avatar}</div>
                      <div>{emp.name}</div>
                    </div>
                  </td>
                  <td>{emp.role}</td>
                  <td>{emp.department}</td>
                  <td className="email">{emp.email}</td>
                  <td>
                    <span className={`status-badge ${emp.status.toLowerCase().replace(' ', '-')}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>{emp.joinDate}</td>
                  <td className="actions">
                    <button
                      className="action-link"
                      onClick={() => navigate(`/admin/employees/${emp.id}`)}
                    >
                      View
                    </button>
                    <button className="action-link">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card card-grid">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="emp-card">
              <div className="emp-card-header">
                <div className="emp-avatar-large">{emp.avatar}</div>
                <span className={`status-badge ${emp.status.toLowerCase().replace(' ', '-')}`}>
                  {emp.status}
                </span>
              </div>
              <div className="emp-card-body">
                <h3>{emp.name}</h3>
                <p className="role">{emp.role}</p>
                <p className="department">{emp.department}</p>
                <p className="email">{emp.email}</p>
                <p className="phone">{emp.phone}</p>
                <p className="join-date">Joined {emp.joinDate}</p>
              </div>
              <div className="emp-card-footer">
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/admin/employees/${emp.id}`)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="empty-state">
          <p>No employees found matching your filters.</p>
          <button className="btn-primary">Add Employee</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectory;

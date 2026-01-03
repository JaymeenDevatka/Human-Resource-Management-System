import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import '../../styles/AdminAttendance.css';

const AdminAttendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-10');

  const attendanceData = [
    {
      id: 1,
      name: 'Alex Johnson',
      department: 'Product',
      status: 'Present',
      checkIn: '09:00',
      checkOut: '17:30',
      workHours: '8h 30m',
      remarks: '',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      department: 'Engineering',
      status: 'Present',
      checkIn: '09:15',
      checkOut: '17:45',
      workHours: '8h 30m',
      remarks: 'Late arrival',
    },
    {
      id: 3,
      name: 'Mike Chen',
      department: 'Design',
      status: 'Half-day',
      checkIn: '09:00',
      checkOut: '13:00',
      workHours: '4h',
      remarks: 'Doctor appointment',
    },
    {
      id: 4,
      name: 'Emma Davis',
      department: 'HR',
      status: 'Absent',
      checkIn: '-',
      checkOut: '-',
      workHours: '-',
      remarks: 'On leave',
    },
    {
      id: 5,
      name: 'James Wilson',
      department: 'Engineering',
      status: 'Present',
      checkIn: '09:30',
      checkOut: '18:00',
      workHours: '8h 30m',
      remarks: 'No check-out recorded',
    },
  ];

  const filteredData = attendanceData.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    present: attendanceData.filter((e) => e.status === 'Present').length,
    halfDay: attendanceData.filter((e) => e.status === 'Half-day').length,
    absent: attendanceData.filter((e) => e.status === 'Absent').length,
    total: attendanceData.length,
  };

  return (
    <div className="admin-attendance">
      <header className="section-header">
        <div>
          <p className="eyebrow">Attendance Management</p>
          <h1>Team Attendance</h1>
          <p className="muted">Monitor and manage employee attendance records.</p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card present">
          <div className="stat-number">{stats.present}</div>
          <div className="stat-label">Present</div>
          <div className="stat-percent">
            {((stats.present / stats.total) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="stat-card half">
          <div className="stat-number">{stats.halfDay}</div>
          <div className="stat-label">Half-day</div>
          <div className="stat-percent">
            {((stats.halfDay / stats.total) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="stat-card absent">
          <div className="stat-number">{stats.absent}</div>
          <div className="stat-label">Absent</div>
          <div className="stat-percent">
            {((stats.absent / stats.total) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Employees</div>
          <div className="stat-percent">100%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card filters-card">
        <div className="filters-content">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <label className="date-filter">
              <span>Select Date</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>

            <select className="status-filter">
              <option>All Status</option>
              <option>Present</option>
              <option>Half-day</option>
              <option>Absent</option>
            </select>

            <button className="btn-secondary">
              <Filter size={18} />
              <span>More Filters</span>
            </button>

            <button className="btn-secondary">
              <span>📥 Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card table-card">
        <div className="table-header">
          <h3>Attendance Records - {selectedDate}</h3>
          <span className="record-count">{filteredData.length} records</span>
        </div>

        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Work Hours</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.id} className={`status-${record.status.toLowerCase().replace('-', '')}`}>
                  <td className="emp-name">{record.name}</td>
                  <td>{record.department}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase().replace('-', '')}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="time">{record.checkIn}</td>
                  <td className="time">{record.checkOut}</td>
                  <td className="work-hours">{record.workHours}</td>
                  <td className="remarks">{record.remarks || '-'}</td>
                  <td className="actions">
                    <button className="action-btn">Edit</button>
                    <button className="action-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Issues */}
      <div className="card issues-card">
        <h3>Attendance Issues to Review</h3>
        <div className="issues-list">
          <div className="issue-item warning">
            <div className="issue-icon">⚠️</div>
            <div className="issue-content">
              <div className="issue-title">Missing Check-out</div>
              <div className="issue-desc">James Wilson - Check-out not recorded for 2024-01-10</div>
            </div>
            <button className="resolve-btn">Resolve</button>
          </div>

          <div className="issue-item warning">
            <div className="issue-icon">⚠️</div>
            <div className="issue-content">
              <div className="issue-title">Late Arrival</div>
              <div className="issue-desc">Sarah Williams - Checked in at 09:15 (15 mins late)</div>
            </div>
            <button className="resolve-btn">Mark OK</button>
          </div>

          <div className="issue-item critical">
            <div className="issue-icon">❌</div>
            <div className="issue-content">
              <div className="issue-title">Unauthorized Absence</div>
              <div className="issue-desc">Emma Davis - No check-in or leave record for 2024-01-10</div>
            </div>
            <button className="resolve-btn">Investigate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;

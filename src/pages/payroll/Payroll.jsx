import React from 'react';
import { Navigate } from 'react-router-dom';
import '../../styles/Payroll.css';
import { useAuth } from '../../context/AuthContext';

const teamPayroll = [
  { id: 1, name: 'Alex Johnson', role: 'Product Manager', salary: '$6,500', status: 'Processed' },
  { id: 2, name: 'Taylor Smith', role: 'Designer', salary: '$5,100', status: 'Processing' },
  { id: 3, name: 'Jamie Fox', role: 'Engineer', salary: '$7,200', status: 'Processed' },
];

const selfPayroll = [
  { month: 'December', status: 'Processed', netPay: '$3,850' },
  { month: 'November', status: 'Processed', netPay: '$3,820' },
  { month: 'October', status: 'Processed', netPay: '$3,820' },
];

const Payroll = ({ isAdmin = false }) => {
  const { isAdmin: authAdmin } = useAuth();
  const canEdit = isAdmin || authAdmin;

  // If a non-admin hits the admin payroll route directly, redirect them
  if (isAdmin && !authAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page-section">
      <header className="section-header">
        <p className="eyebrow">Payroll</p>
        <h1>{canEdit ? 'Payroll control' : 'Your payslips'}</h1>
        <p className="muted">{canEdit ? 'View and manage payroll across the team.' : 'Read-only view of your salary breakdown.'}</p>
      </header>

      <div className="card">
        <div className="table payroll-table">
          <div className="table-head">
            {canEdit ? (
              <>
                <span>Employee</span>
                <span>Role</span>
                <span>Salary</span>
                <span>Status</span>
                <span>Actions</span>
              </>
            ) : (
              <>
                <span>Month</span>
                <span>Status</span>
                <span>Net pay</span>
              </>
            )}
          </div>

          {canEdit
            ? teamPayroll.map((row) => (
                <div className="table-row" key={row.id}>
                  <span>{row.name}</span>
                  <span>{row.role}</span>
                  <span>{row.salary}</span>
                  <span className={`pill ${row.status === 'Processed' ? 'approved' : 'pending'}`}>{row.status}</span>
                  <span className="table-actions">
                    <button className="btn-link">Edit</button>
                    <button className="btn-link">Mark processed</button>
                  </span>
                </div>
              ))
            : selfPayroll.map((item) => (
                <div className="table-row" key={item.month}>
                  <span>{item.month}</span>
                  <span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span>
                  <span>{item.netPay}</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Payroll;

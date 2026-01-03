import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/LeaveApproval.css';

const mockRequests = [
	{ id: 1, employee: 'Jane Cooper', type: 'Annual', dates: 'Jan 10 - Jan 14', status: 'Pending' },
	{ id: 2, employee: 'Wade Warren', type: 'Sick', dates: 'Jan 3 - Jan 4', status: 'Pending' },
	{ id: 3, employee: 'Devon Lane', type: 'Annual', dates: 'Feb 2 - Feb 6', status: 'Approved' },
];

const LeaveApproval = () => {
	const { isAdmin } = useAuth();

	if (!isAdmin) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="page-section">
			<header className="section-header">
				<p className="eyebrow">Approvals</p>
				<h1>Leave approvals</h1>
				<p className="muted">Review and respond to pending requests.</p>
			</header>

			<div className="card">
				<div className="table">
					<div className="table-head">
						<span>Employee</span>
						<span>Type</span>
						<span>Dates</span>
						<span>Status</span>
						<span>Actions</span>
					</div>
					{mockRequests.map((req) => (
						<div className="table-row" key={req.id}>
							<span>{req.employee}</span>
							<span>{req.type}</span>
							<span>{req.dates}</span>
							<span className={`pill ${req.status.toLowerCase()}`}>{req.status}</span>
							<span className="table-actions">
								<button className="btn-link">Approve</button>
								<button className="btn-link">Reject</button>
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default LeaveApproval;

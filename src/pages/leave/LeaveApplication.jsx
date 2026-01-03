import React, { useState } from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import '../../styles/LeaveApplication.css';

const LeaveApplication = () => {
	const [activeTab, setActiveTab] = useState('apply');
	const [formData, setFormData] = useState({
		leaveType: 'annual',
		fromDate: '',
		toDate: '',
		reason: '',
	});

	const leaveBalance = {
		annual: { total: 20, used: 8, pending: 2, available: 10 },
		sick: { total: 10, used: 2, pending: 0, available: 8 },
		casual: { total: 6, used: 1, pending: 1, available: 4 },
		unpaid: { total: 'Unlimited', used: 0, pending: 0, available: 'Unlimited' },
	};

	const leaveHistory = [
		{
			id: 1,
			type: 'Annual leave',
			fromDate: 'Jan 10, 2024',
			toDate: 'Jan 12, 2024',
			duration: '3 days',
			status: 'approved',
			approvedBy: 'HR Manager',
			appliedOn: 'Dec 28, 2023',
		},
		{
			id: 2,
			type: 'Sick leave',
			fromDate: 'Jan 5, 2024',
			toDate: 'Jan 5, 2024',
			duration: '1 day',
			status: 'approved',
			approvedBy: 'Manager',
			appliedOn: 'Jan 5, 2024',
		},
		{
			id: 3,
			type: 'Annual leave',
			fromDate: 'Feb 1, 2024',
			toDate: 'Feb 3, 2024',
			duration: '3 days',
			status: 'pending',
			approvedBy: 'Pending approval',
			appliedOn: 'Jan 15, 2024',
		},
		{
			id: 4,
			type: 'Casual leave',
			fromDate: 'Dec 29, 2023',
			toDate: 'Dec 29, 2023',
			duration: '1 day',
			status: 'rejected',
			approvedBy: 'Manager',
			appliedOn: 'Dec 28, 2023',
		},
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		alert('Leave request submitted successfully!');
		setFormData({
			leaveType: 'annual',
			fromDate: '',
			toDate: '',
			reason: '',
		});
	};

	const current = leaveBalance[formData.leaveType];

	return (
		<div className="page-section">
			<header className="section-header">
				<p className="eyebrow">Leaves</p>
				<h1>Leave Management</h1>
				<p className="muted">Apply for leave and track your requests.</p>
			</header>

			<div className="tabs-container">
				<div className="tabs-header">
					<button
						className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
						onClick={() => setActiveTab('apply')}
					>
						Apply for Leave
					</button>
					<button
						className={`tab-btn ${activeTab === 'balance' ? 'active' : ''}`}
						onClick={() => setActiveTab('balance')}
					>
						Leave Balance
					</button>
					<button
						className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
						onClick={() => setActiveTab('history')}
					>
						Leave History
					</button>
				</div>

				{activeTab === 'apply' && (
					<div className="tab-content">
						<div className="card">
							<h2>Apply for Leave</h2>
							<form onSubmit={handleSubmit} className="form-grid">
								<label className="form-field">
									<span>Leave type</span>
									<select
										name="leaveType"
										value={formData.leaveType}
										onChange={handleInputChange}
									>
										<option value="annual">Annual Leave</option>
										<option value="sick">Sick Leave</option>
										<option value="casual">Casual Leave</option>
										<option value="unpaid">Unpaid Leave</option>
									</select>
									<p className="field-hint">
										Available: {current.available} {typeof current.available === 'number' ? 'days' : ''}
									</p>
								</label>

								<label className="form-field">
									<span>From</span>
									<input
										type="date"
										name="fromDate"
										value={formData.fromDate}
										onChange={handleInputChange}
										required
									/>
								</label>

								<label className="form-field">
									<span>To</span>
									<input
										type="date"
										name="toDate"
										value={formData.toDate}
										onChange={handleInputChange}
										required
									/>
								</label>

								<label className="form-field full">
									<span>Reason / Remarks</span>
									<textarea
										rows="4"
										name="reason"
										value={formData.reason}
										onChange={handleInputChange}
										placeholder="Explain why you need this leave"
										required
									/>
								</label>

								<div className="form-actions">
									<button type="submit" className="btn-primary">
										Submit Request
									</button>
									<button type="reset" className="btn-secondary">
										Clear
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{activeTab === 'balance' && (
					<div className="tab-content">
						<div className="leave-balance-grid">
							{Object.entries(leaveBalance).map(([type, data]) => (
								<div key={type} className="balance-card">
									<div className="balance-header">
										<h3>
											{type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
										</h3>
										<span className={`badge ${type}`}>
											{typeof data.available === 'number' ? data.available : '∞'}
										</span>
									</div>
									<div className="balance-content">
										<div className="balance-item">
											<span>Total Allocated</span>
											<span className="value">{typeof data.total === 'number' ? data.total : data.total} days</span>
										</div>
										<div className="balance-item">
											<span>Used</span>
											<span className="value used">{data.used} days</span>
										</div>
										<div className="balance-item">
											<span>Pending</span>
											<span className="value pending">{data.pending} days</span>
										</div>
										<div className="balance-bar">
											<div className="bar-background">
												<div
													className="bar-used"
													style={{
														width:
															typeof data.total === 'number'
																? `${(data.used / data.total) * 100}%`
																: '0%',
													}}
												></div>
											</div>
										</div>
										<div className="balance-footer">
											<strong>
												Available:{' '}
												{typeof data.available === 'number' ? data.available : data.available} days
											</strong>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === 'history' && (
					<div className="tab-content">
						<div className="card">
							<div className="history-filters">
								<select>
									<option>All Status</option>
									<option>Pending</option>
									<option>Approved</option>
									<option>Rejected</option>
								</select>
								<input type="search" placeholder="Search leave requests..." />
							</div>

							<div className="history-table">
								{leaveHistory.length > 0 ? (
									<table>
										<thead>
											<tr>
												<th>Type</th>
												<th>Duration</th>
												<th>Date Range</th>
												<th>Status</th>
												<th>Applied On</th>
												<th>Approved By</th>
											</tr>
										</thead>
										<tbody>
											{leaveHistory.map((leave) => (
												<tr key={leave.id}>
													<td>{leave.type}</td>
													<td>{leave.duration}</td>
													<td>
														{leave.fromDate} - {leave.toDate}
													</td>
													<td>
														<span className={`status-badge ${leave.status}`}>
															{leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
														</span>
													</td>
													<td>{leave.appliedOn}</td>
													<td>{leave.approvedBy}</td>
												</tr>
											))}
										</tbody>
									</table>
								) : (
									<div className="empty-state">
										<p>No leave requests yet.</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaveApplication;

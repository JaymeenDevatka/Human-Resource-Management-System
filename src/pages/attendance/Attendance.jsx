import React, { useState } from 'react';
import { Clock, LogIn, LogOut } from 'lucide-react';
import '../../styles/Attendance.css';

const dailyData = [
	{ date: 'Jan 02', status: 'Present', checkIn: '09:00', checkOut: '17:30' },
	{ date: 'Jan 03', status: 'Present', checkIn: '09:05', checkOut: '17:20' },
	{ date: 'Jan 04', status: 'Absent', checkIn: '-', checkOut: '-' },
	{ date: 'Jan 05', status: 'Half-day', checkIn: '09:30', checkOut: '13:00' },
	{ date: 'Jan 06', status: 'Leave', checkIn: '-', checkOut: '-' },
];

const weeklyData = [
	{ week: 'Week 1', present: 4, absent: 1, leave: 0 },
	{ week: 'Week 2', present: 5, absent: 0, leave: 0 },
	{ week: 'Week 3', present: 4, absent: 0, leave: 1 },
	{ week: 'Week 4', present: 3, absent: 1, leave: 1 },
];

const Attendance = () => {
	const [view, setView] = useState('daily');
	const [isCheckedIn, setIsCheckedIn] = useState(false);
	const [checkInTime, setCheckInTime] = useState(null);
	const [checkOutTime, setCheckOutTime] = useState(null);

	const handleCheckIn = () => {
		const now = new Date();
		const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
		setCheckInTime(timeString);
		setIsCheckedIn(true);
	};

	const handleCheckOut = () => {
		const now = new Date();
		const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
		setCheckOutTime(timeString);
		setIsCheckedIn(false);
	};

	const getTodayStats = () => {
		if (checkInTime && checkOutTime) {
			return {
				status: 'Present',
				duration: 'Full day',
				icon: '✓',
				color: '#10b981',
			};
		} else if (checkInTime) {
			return {
				status: 'Checked In',
				duration: `Since ${checkInTime}`,
				icon: '→',
				color: '#3b82f6',
			};
		}
		return {
			status: 'Not started',
			duration: 'Not checked in',
			icon: '-',
			color: '#9ca3af',
		};
	};

	const today = getTodayStats();

	return (
		<div className="page-section">
			<header className="section-header">
				<div>
					<p className="eyebrow">Attendance</p>
					<h1>{view === 'daily' ? 'Daily attendance' : 'Weekly attendance'}</h1>
					<p className="muted">Track check-ins, absences, and leave usage.</p>
				</div>
				<div className="pill-switch">
					<button className={view === 'daily' ? 'active' : ''} onClick={() => setView('daily')}>Daily</button>
					<button className={view === 'weekly' ? 'active' : ''} onClick={() => setView('weekly')}>Weekly</button>
				</div>
			</header>

			{/* Today's Attendance Card */}
			<div className="today-card card">
				<div className="today-header">
					<div>
						<p className="label">Today's Status</p>
						<h2 style={{ color: today.color }}>{today.status}</h2>
						<p className="muted">{today.duration}</p>
					</div>
					<div className="check-buttons">
						{!isCheckedIn ? (
							<button className="btn-check-in" onClick={handleCheckIn}>
								<LogIn size={18} />
								<span>Check In</span>
							</button>
						) : (
							<>
								<button className="btn-checked" disabled>
									<LogIn size={18} />
									<span>Checked in at {checkInTime}</span>
								</button>
								<button className="btn-check-out" onClick={handleCheckOut}>
									<LogOut size={18} />
									<span>Check Out</span>
								</button>
							</>
						)}
					</div>
				</div>
				{checkInTime && (
					<div className="check-info">
						<div className="check-item">
							<span className="label">Check-in</span>
							<span className="time">{checkInTime}</span>
						</div>
						{checkOutTime && (
							<div className="check-item">
								<span className="label">Check-out</span>
								<span className="time">{checkOutTime}</span>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="card-grid">
				<div className="stat-card">
					<p className="label">Presence rate</p>
					<h2>92%</h2>
					<p className="muted">Current month</p>
				</div>
				<div className="stat-card">
					<p className="label">Absences</p>
					<h2>2 days</h2>
					<p className="muted">Includes sick days</p>
				</div>
				<div className="stat-card">
					<p className="label">Late check-ins</p>
					<h2>3</h2>
					<p className="muted">Past 30 days</p>
				</div>
			</div>

			<div className="card">
				{view === 'daily' ? (
					<div className="table">
						<div className="table-head">
							<span>Date</span>
							<span>Status</span>
							<span>Check-in</span>
							<span>Check-out</span>
						</div>
						{dailyData.map((row) => (
							<div className="table-row" key={row.date}>
								<span>{row.date}</span>
								<span className={`pill ${row.status.toLowerCase().replace(/\s/g, '-')}`}>{row.status}</span>
								<span>{row.checkIn}</span>
								<span>{row.checkOut}</span>
							</div>
						))}
					</div>
				) : (
					<div className="table">
						<div className="table-head">
							<span>Week</span>
							<span>Present</span>
							<span>Absent</span>
							<span>Leave</span>
						</div>
						{weeklyData.map((row) => (
							<div className="table-row" key={row.week}>
								<span>{row.week}</span>
								<span>{row.present}</span>
								<span>{row.absent}</span>
								<span>{row.leave}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Attendance;

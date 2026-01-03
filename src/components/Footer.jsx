import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer__grid">
				<div className="footer__brand">
					<h3 className="footer__logo">Dayflow</h3>
					<p className="footer__text">Simple tools for attendance, leave, payroll, and employee profiles.</p>
				</div>

				<div className="footer__section">
					<h4>Product</h4>
					<a href="/dashboard">Dashboard</a>
					<a href="/attendance">Attendance</a>
					<a href="/leaves/apply">Leave requests</a>
					<a href="/payroll">Payroll</a>
				</div>

				<div className="footer__section">
					<h4>Company</h4>
					<a href="/profile">Profile</a>
					<a href="/admin/payroll">Admin payroll</a>
					<a href="/help">Help center</a>
					<a href="/settings">Settings</a>
				</div>

				<div className="footer__section">
					<h4>Stay updated</h4>
					<p className="footer__text">Get release notes and HR ops tips.</p>
					<form className="footer__form" onSubmit={(e) => e.preventDefault()}>
						<input type="email" placeholder="work email" aria-label="Email" />
						<button type="submit">Subscribe</button>
					</form>
				</div>
			</div>

			<div className="footer__bottom">
				<span>© {new Date().getFullYear()} Dayflow. All rights reserved.</span>
				<div className="footer__links">
					<a href="/terms">Terms</a>
					<a href="/privacy">Privacy</a>
					<a href="/status">Status</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

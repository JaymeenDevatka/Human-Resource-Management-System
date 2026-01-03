import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Login.css';

const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();
	const [form, setForm] = useState({ email: '', password: '', role: 'employee' });
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.email || !form.password) {
			setError('Email and password are required');
			return;
		}
		login({ email: form.email, role: form.role, name: form.email.split('@')[0] });
		const redirect = location.state?.from?.pathname || '/dashboard';
		navigate(redirect, { replace: true });
	};

	return (
		<div className="auth-card">
			<h2 className="auth-title">Welcome back</h2>
			<p className="auth-subtitle">Sign in to access your HR tools.</p>
			<form className="auth-form" onSubmit={handleSubmit}>
				<label className="auth-label">
					Email
					<input
						className="auth-input"
						type="email"
						name="email"
						value={form.email}
						onChange={handleChange}
						placeholder="you@example.com"
						required
					/>
				</label>
				<label className="auth-label">
					Password
					<input
						className="auth-input"
						type="password"
						name="password"
						value={form.password}
						onChange={handleChange}
						placeholder="••••••••"
						required
					/>
				</label>
				<label className="auth-label">
					Role
					<select name="role" className="auth-input" value={form.role} onChange={handleChange}>
						<option value="employee">Employee</option>
						<option value="admin">Admin / HR</option>
					</select>
				</label>
				{error && <div className="auth-error">{error}</div>}
				<button type="submit" className="auth-button">Sign in</button>
			</form>
			<p className="auth-footer">
				New here? <Link to="/auth/register">Create an account</Link>
			</p>
		</div>
	);
};

export default Login;

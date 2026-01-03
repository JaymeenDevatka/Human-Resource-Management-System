import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Register.css';

const Register = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		login({ email: form.email, name: form.name || form.email, role: form.role });
		navigate('/dashboard', { replace: true });
	};

	return (
		<div className="auth-card">
			<h2 className="auth-title">Create your account</h2>
			<p className="auth-subtitle">Join the HR portal in seconds.</p>
			<form className="auth-form" onSubmit={handleSubmit}>
				<label className="auth-label">
					Full name
					<input
						className="auth-input"
						type="text"
						name="name"
						value={form.name}
						onChange={handleChange}
						placeholder="Jane Doe"
						required
					/>
				</label>
				<label className="auth-label">
					Work email
					<input
						className="auth-input"
						type="email"
						name="email"
						value={form.email}
						onChange={handleChange}
						placeholder="you@company.com"
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
				<button type="submit" className="auth-button">Create account</button>
			</form>
			<p className="auth-footer">
				Already have an account? <Link to="/auth/login">Sign in</Link>
			</p>
		</div>
	);
};

export default Register;

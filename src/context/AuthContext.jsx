import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const saved = localStorage.getItem('auth:user');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setUser(parsed && typeof parsed === 'object' ? parsed : null);
			} catch (error) {
				console.warn('Failed to parse stored user', error);
				localStorage.removeItem('auth:user');
			}
		}
	}, []);

	const login = ({ email, name = 'User', role = 'employee' }) => {
		const nextUser = { email, name, role };
		setUser(nextUser);
		localStorage.setItem('auth:user', JSON.stringify(nextUser));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('auth:user');
	};

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: Boolean(user),
			isAdmin: user?.role === 'admin' || user?.role === 'hr',
			login,
			logout,
		}),
		[user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return ctx;
};

export default AuthContext;

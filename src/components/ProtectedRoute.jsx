import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ redirectTo = '/auth/login' }) => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default ProtectedRoute;

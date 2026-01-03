import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import Attendance from '../pages/attendance/Attendance';
import EmployeeProfile from '../pages/profile/EmployeeProfile';
import LeaveApplication from '../pages/leave/LeaveApplication';
import LeaveApproval from '../pages/leave/LeaveApproval';
import Payroll from '../pages/payroll/Payroll';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Layout from '../components/Layout';
import AuthLayout from '../components/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import EmployeeDirectory from '../pages/admin/EmployeeDirectory';
import AdminAttendance from '../pages/admin/AdminAttendance';
import Settings from '../pages/settings/Settings';
import Help from '../pages/help/Help';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'profile',
            element: <EmployeeProfile isSelf={true} />,
          },
          {
            path: 'attendance',
            element: <Attendance />,
          },
          {
            path: 'leaves',
            children: [
              {
                path: 'apply',
                element: <LeaveApplication />,
              },
            ],
          },
          {
            path: 'payroll',
            element: <Payroll isAdmin={false} />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'help',
            element: <Help />,
          },
          {
            path: 'admin',
            element: <AdminRoute />,
            children: [
              {
                path: 'payroll',
                element: <Payroll isAdmin={true} />,
              },
              {
                path: 'leaves/approvals',
                element: <LeaveApproval />,
              },
              {
                path: 'employees',
                element: <EmployeeDirectory />,
              },
              {
                path: 'employees/:id',
                element: <EmployeeProfile isAdmin={true} />,
              },
              {
                path: 'attendance',
                element: <AdminAttendance />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;

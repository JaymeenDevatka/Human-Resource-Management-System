# Dayflow - Human Resource Management System Backend

A comprehensive backend API for managing HR operations including employee management, attendance tracking, leave management, and payroll processing.

## Features

- **Authentication & Authorization**

  - Secure user registration and login
  - JWT-based authentication
  - Role-based access control (Admin, HR, Employee)
  - Password reset functionality

- **User Management**

  - Employee profile management
  - Job details and salary structure
  - Document management
  - User activation/deactivation

- **Attendance Tracking**

  - Daily check-in/check-out
  - Weekly and monthly attendance reports
  - Attendance history
  - Status types: Present, Absent, Half-day, Leave

- **Leave Management**

  - Leave request submission
  - Leave approval/rejection workflow
  - Leave balance tracking
  - Leave types: Paid, Sick, Unpaid

- **Payroll Management**
  - Automated payroll generation
  - Salary structure management
  - Payroll approval workflow
  - Payment tracking
  - Payroll reports and analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: Express CORS

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file with your configuration:

   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/hrms
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

5. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user profile (Protected)
- `GET /logout` - Logout user (Protected)
- `POST /forgot-password` - Request password reset
- `PUT /reset-password/:token` - Reset password

### User Routes (`/api/users`)

- `GET /profile/me` - Get current user profile (Protected)
- `GET /` - Get all users (Admin only)
- `GET /:id` - Get user by ID (Protected)
- `PUT /:id` - Update user profile (Protected)
- `PUT /:id/password` - Change password (Protected)
- `PUT /:id/activate` - Activate user (Admin only)
- `PUT /:id/deactivate` - Deactivate user (Admin only)
- `DELETE /:id` - Delete user (Admin only)
- `POST /:id/documents` - Add document (Protected)
- `DELETE /:id/documents/:docId` - Delete document (Protected)

### Attendance Routes (`/api/attendance`)

- `POST /check-in` - Check in (Protected/Employee)
- `POST /check-out` - Check out (Protected/Employee)
- `GET /my-attendance` - Get own attendance (Protected/Employee)
- `GET /` - Get all attendance (Admin/HR)
- `GET /:id` - Get attendance by ID (Protected)
- `POST /add` - Add attendance manually (Admin/HR)
- `GET /report` - Get attendance report (Protected)

### Leave Routes (`/api/leave`)

- `POST /apply` - Apply for leave (Protected/Employee)
- `GET /my-requests` - Get own leave requests (Protected/Employee)
- `PUT /:id/cancel` - Cancel leave request (Protected)
- `GET /balance/:userId` - Get leave balance (Protected)
- `GET /` - Get all leaves (Admin/HR)
- `GET /:id` - Get leave by ID (Protected)
- `PUT /:id/approve` - Approve leave (Admin/HR)
- `PUT /:id/reject` - Reject leave (Admin/HR)

### Payroll Routes (`/api/payroll`)

- `GET /my-payroll` - Get own payroll (Protected/Employee)
- `GET /:id` - Get payroll by ID (Protected)
- `POST /generate` - Generate payroll (Admin only)
- `GET /` - Get all payroll (Admin)
- `PUT /:id` - Update payroll (Admin)
- `PUT /:id/approve` - Approve payroll (Admin)
- `PUT /:id/mark-paid` - Mark as paid (Admin)
- `DELETE /:id` - Delete payroll (Admin)
- `GET /report` - Get payroll report (Admin)

## Request/Response Format

### Standard Response Format

```json
{
  "success": true/false,
  "message": "Operation message",
  "data": {}
}
```

### Example - User Registration

**Request:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "employee"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49c1234567890abcde",
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "employee"
  }
}
```

### Example - Check In

**Request:**

```bash
POST /api/attendance/check-in
Content-Type: application/json
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Checked in successfully",
  "attendance": {
    "_id": "60d5ec49c1234567890abcde",
    "user": "60d5ec49c1234567890abc00",
    "date": "2024-01-03T00:00:00Z",
    "checkInTime": "2024-01-03T09:00:00Z",
    "status": "present"
  }
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained from the login or register endpoints and expire after 7 days (configurable via `JWT_EXPIRES_IN`).

## Error Handling

Standard HTTP status codes are used:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Database Schema

### User Schema

- employeeId (String, unique)
- firstName, lastName (String)
- email (String, unique)
- password (String, hashed)
- phone, address (String)
- profilePicture (String)
- role (admin, hr, employee)
- jobDetails (department, designation, joiningDate)
- salaryStructure (baseSalary, allowances, deductions)
- leaveBalance (paidLeave, sickLeave, unpaidLeave)
- documents (Array)
- isActive (Boolean)

### Attendance Schema

- user (Reference to User)
- date (Date)
- checkInTime, checkOutTime (Date)
- status (present, absent, half-day, leave)
- workingHours (Number)
- remarks (String)
- approvedBy (Reference to User)

### Leave Schema

- user (Reference to User)
- leaveType (paid, sick, unpaid, casual)
- startDate, endDate (Date)
- numberOfDays (Number)
- reason (String)
- status (pending, approved, rejected)
- approvedBy (Reference to User)
- comments (String)

### Payroll Schema

- user (Reference to User)
- month, year (String/Number)
- baseSalary, allowances, deductions (Number)
- grossSalary, netSalary (Number)
- workingDays, presentDays, absentDays (Number)
- taxDeduction, providentFund (Number)
- status (pending, approved, paid)
- paymentDate, paymentMethod (Date/String)

## Development

### Available Scripts

```bash
npm start      # Run production server
npm run dev    # Run development server with nodemon
npm test       # Run tests (if configured)
```

### Project Structure

```
backend/
├── config/          # Database and JWT configuration
├── controllers/     # Route controllers
├── middleware/      # Auth and role-based middleware
├── models/          # MongoDB schemas
├── routes/          # API routes
├── utils/           # Utility functions
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env.example     # Environment variables template
```

## Security Considerations

1. **Password Security**: Passwords are hashed using bcryptjs with salt rounds
2. **JWT Tokens**: Tokens expire after 7 days and require re-authentication
3. **Role-Based Access**: Different endpoints restricted to admin, hr, and employee roles
4. **Input Validation**: All user inputs are validated before processing
5. **CORS**: Cross-Origin Resource Sharing is configured

## Future Enhancements

- [ ] Email notifications for leave approvals
- [ ] File upload for documents
- [ ] SMS notifications
- [ ] Advanced reporting and analytics
- [ ] Performance metrics and dashboards
- [ ] Bulk user import (CSV)
- [ ] Audit logs
- [ ] Two-factor authentication

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

Solution: Ensure MongoDB is running locally or update `MONGO_URI` in `.env`

### JWT Token Expired

```
Error: Token expired
```

Solution: Login again to get a new token

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

Solution: Change PORT in `.env` or kill the process using port 5000

## Support

For issues and questions, please create an issue in the repository.

## License

This project is licensed under the ISC License.

## Version

v1.0.0 - Initial release with core HRMS functionality

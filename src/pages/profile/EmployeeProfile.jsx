import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import '../../styles/EmployeeProfile.css';

const EmployeeProfile = ({ isAdmin = false, isSelf = false }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [profileData, setProfileData] = useState({
		firstName: 'Alex',
		lastName: 'Johnson',
		email: 'alex.johnson@company.com',
		phone: '+1 (555) 123-4567',
		role: 'Product Manager',
		department: 'Product',
		location: 'Remote',
		manager: 'Taylor Smith',
		dateOfBirth: '1990-05-15',
		address: '123 Main St, Anytown, ST 12345',
		emergencyContact: 'Jane Johnson',
		emergencyPhone: '+1 (555) 987-6543',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProfileData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = () => {
		setIsEditing(false);
		alert('Profile updated successfully!');
	};

	const canEdit = isAdmin || isSelf;

	return (
		<div className="page-section">
			<header className="section-header profile-header">
				<div>
					<p className="eyebrow">Profile</p>
					<h1>{isAdmin && !isSelf ? 'Employee Profile' : 'Your Profile'}</h1>
					<p className="muted">Contact details, role, and personal information.</p>
				</div>
				{canEdit && (
					<button
						className={`btn-edit ${isEditing ? 'cancel' : ''}`}
						onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
					>
						{isEditing ? (
							<>
								<X size={18} />
								<span>Cancel</span>
							</>
						) : (
							<>
								<Edit size={18} />
								<span>Edit Profile</span>
							</>
						)}
					</button>
				)}
			</header>

			{/* Profile Picture Section */}
			<div className="profile-picture-card">
				<div className="profile-pic-container">
					<div className="profile-pic">{profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}</div>
					{isEditing && canEdit && (
						<button className="pic-upload">
							<span>Change Photo</span>
						</button>
					)}
				</div>
				<div className="profile-pic-info">
					<h2>{profileData.firstName} {profileData.lastName}</h2>
					<p>{profileData.role}</p>
					<p className="muted">{profileData.department} • {profileData.location}</p>
				</div>
			</div>

			{/* Basic Information */}
			<div className="profile-card">
				<div className="card-title">
					<h3>Basic Information</h3>
				</div>

				{!isEditing ? (
					<div className="profile-content">
						<div className="profile-row">
							<div className="profile-field">
								<p className="label">First Name</p>
								<p className="value">{profileData.firstName}</p>
							</div>
							<div className="profile-field">
								<p className="label">Last Name</p>
								<p className="value">{profileData.lastName}</p>
							</div>
							<div className="profile-field">
								<p className="label">Email</p>
								<p className="value">{profileData.email}</p>
							</div>
						</div>
						<div className="profile-row">
							<div className="profile-field">
								<p className="label">Phone</p>
								<p className="value">{profileData.phone}</p>
							</div>
							<div className="profile-field">
								<p className="label">Date of Birth</p>
								<p className="value">{profileData.dateOfBirth}</p>
							</div>
							<div className="profile-field">
								<p className="label">Address</p>
								<p className="value">{profileData.address}</p>
							</div>
						</div>
					</div>
				) : (
					<form className="profile-form">
						<div className="form-row">
							<label className="form-field">
								<span>First Name</span>
								<input
									type="text"
									name="firstName"
									value={profileData.firstName}
									onChange={handleInputChange}
								/>
							</label>
							<label className="form-field">
								<span>Last Name</span>
								<input
									type="text"
									name="lastName"
									value={profileData.lastName}
									onChange={handleInputChange}
								/>
							</label>
							<label className="form-field">
								<span>Email</span>
								<input
									type="email"
									name="email"
									value={profileData.email}
									onChange={handleInputChange}
									disabled={!isAdmin}
								/>
							</label>
						</div>
						<div className="form-row">
							<label className="form-field">
								<span>Phone</span>
								<input
									type="tel"
									name="phone"
									value={profileData.phone}
									onChange={handleInputChange}
								/>
							</label>
							<label className="form-field">
								<span>Date of Birth</span>
								<input
									type="date"
									name="dateOfBirth"
									value={profileData.dateOfBirth}
									onChange={handleInputChange}
								/>
							</label>
							<label className="form-field">
								<span>Address</span>
								<input
									type="text"
									name="address"
									value={profileData.address}
									onChange={handleInputChange}
								/>
							</label>
						</div>
					</form>
				)}
			</div>

			{/* Job Information */}
			<div className="profile-card">
				<div className="card-title">
					<h3>Job Information</h3>
				</div>

				{!isEditing ? (
					<div className="profile-content">
						<div className="profile-row">
							<div className="profile-field">
								<p className="label">Job Title / Role</p>
								<p className="value">{profileData.role}</p>
							</div>
							<div className="profile-field">
								<p className="label">Department</p>
								<p className="value">{profileData.department}</p>
							</div>
							<div className="profile-field">
								<p className="label">Location</p>
								<p className="value">{profileData.location}</p>
							</div>
						</div>
						<div className="profile-row">
							<div className="profile-field">
								<p className="label">Manager</p>
								<p className="value">{profileData.manager}</p>
							</div>
						</div>
					</div>
				) : (
					isAdmin && (
						<form className="profile-form">
							<div className="form-row">
								<label className="form-field">
									<span>Job Title / Role</span>
									<input
										type="text"
										name="role"
										value={profileData.role}
										onChange={handleInputChange}
									/>
								</label>
								<label className="form-field">
									<span>Department</span>
									<input
										type="text"
										name="department"
										value={profileData.department}
										onChange={handleInputChange}
									/>
								</label>
								<label className="form-field">
									<span>Location</span>
									<input
										type="text"
										name="location"
										value={profileData.location}
										onChange={handleInputChange}
									/>
								</label>
							</div>
							<div className="form-row">
								<label className="form-field">
									<span>Manager</span>
									<input
										type="text"
										name="manager"
										value={profileData.manager}
										onChange={handleInputChange}
									/>
								</label>
							</div>
						</form>
					)
				)}
			</div>

			{/* Emergency Contact */}
			<div className="profile-card">
				<div className="card-title">
					<h3>Emergency Contact</h3>
				</div>

				{!isEditing ? (
					<div className="profile-content">
						<div className="profile-row">
							<div className="profile-field">
								<p className="label">Emergency Contact Name</p>
								<p className="value">{profileData.emergencyContact}</p>
							</div>
							<div className="profile-field">
								<p className="label">Emergency Contact Phone</p>
								<p className="value">{profileData.emergencyPhone}</p>
							</div>
						</div>
					</div>
				) : (
					<form className="profile-form">
						<div className="form-row">
							<label className="form-field">
								<span>Emergency Contact Name</span>
								<input
									type="text"
									name="emergencyContact"
									value={profileData.emergencyContact}
									onChange={handleInputChange}
								/>
							</label>
							<label className="form-field">
								<span>Emergency Contact Phone</span>
								<input
									type="tel"
									name="emergencyPhone"
									value={profileData.emergencyPhone}
									onChange={handleInputChange}
								/>
							</label>
						</div>
					</form>
				)}
			</div>

			{isEditing && canEdit && (
				<div className="profile-actions">
					<button className="btn-primary" onClick={handleSave}>
						<Save size={18} />
						<span>Save Changes</span>
					</button>
					<button className="btn-secondary" onClick={() => setIsEditing(false)}>
						<X size={18} />
						<span>Cancel</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default EmployeeProfile;

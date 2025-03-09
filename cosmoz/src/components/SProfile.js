import React, { useState, useEffect, useRef } from 'react';
import SHeader from './SHeader';
import SSidebar from './SSidebar';
import './SProfile.css';

const StaffProfile = () => {
  // Parse the user data from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    staffId: '',
    aadhaarNumber: '',
    drivingLicense: '',
    aadhaarPhoto: '',
    drivingLicensePhoto: '',
    profilePhoto: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Create refs for file inputs
  const profilePhotoInputRef = useRef(null);
  const aadhaarPhotoInputRef = useRef(null);
  const drivingLicensePhotoInputRef = useRef(null);

  useEffect(() => {
    if (user && user.email) {
      fetchProfile();
    } else {
      setErrorMessage('User not logged in or missing email');
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Use the user's email to fetch their profile
      const response = await fetch(`http://localhost:5000/api/vstaff/profile-by-email/${user.email}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Error fetching profile data: ' + error.message);
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSuccessMessage('');
      setErrorMessage('');
      
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      
      // Check if we have new files to upload
      if (profilePhotoInputRef.current?.files[0]) {
        formData.append('profilePhoto', profilePhotoInputRef.current.files[0]);
      }
      
      if (aadhaarPhotoInputRef.current?.files[0]) {
        formData.append('aadhaarPhoto', aadhaarPhotoInputRef.current.files[0]);
      }
      
      if (drivingLicensePhotoInputRef.current?.files[0]) {
        formData.append('drivingLicensePhoto', drivingLicensePhotoInputRef.current.files[0]);
      }
      
      const response = await fetch(`http://localhost:5000/api/vstaff/update-profile/${profile._id}`, {
        method: 'PUT',
        body: formData, // No Content-Type header for multipart/form-data
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      setSuccessMessage('Profile updated successfully!');
      
      // Clear file inputs
      if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = "";
      if (aadhaarPhotoInputRef.current) aadhaarPhotoInputRef.current.value = "";
      if (drivingLicensePhotoInputRef.current) drivingLicensePhotoInputRef.current.value = "";
      
      // Refresh the profile data
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error updating profile: ' + error.message);
    }
  };

  // Get initials for profile picture placeholder
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2);
  };
  
  // Trigger file input click
  const triggerFileInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  // Handle file selection preview
  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      
      setProfile({
        ...profile,
        [field]: tempUrl, // This will be used for preview only
      });
    }
  };

  if (loading) {
    return (
      <div>
        <SHeader />
        <SSidebar />
        <div className="staff-profile">
          <div className="loading">Loading profile data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SHeader />
      <SSidebar />
      <div className="staff-profile">
        {(errorMessage || successMessage) && (
          <div className="message-container">
            {errorMessage && <div className="error">{errorMessage}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
          </div>
        )}
        
        <div className="profile-header">
          <div className="profile-picture-container">
            <div className="profile-picture">
              {profile.profilePhoto ? (
                <img 
                  src={profile.profilePhoto.startsWith('blob:') 
                    ? profile.profilePhoto 
                    : `http://localhost:5000/${profile.profilePhoto}`} 
                  alt="Profile" 
                />
              ) : (
                <span className="profile-picture-text">{getInitials(profile.name)}</span>
              )}
            </div>
            <div 
              className="upload-overlay" 
              onClick={() => triggerFileInput(profilePhotoInputRef)}
            >
              Change Photo
            </div>
            <input 
              type="file" 
              ref={profilePhotoInputRef}
              onChange={(e) => handleFileChange(e, 'profilePhoto')}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="profile-info">
            <div className="profile-name">{profile.name || 'Staff Member'}</div>
            <div className="profile-email">{profile.email}</div>
            <div className="profile-role">{profile.role || 'Staff'}</div>
            {profile.staffId && <div className="staff-id">Staff ID: {profile.staffId}</div>}
          </div>
        </div>
        
        <form onSubmit={handleUpdate}>
          <div className="form-section">
            <div className="section-title">Personal Information</div>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Identification</div>
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={profile.role || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  value={profile.aadhaarNumber || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Driving License</label>
                <input
                  type="text"
                  value={profile.drivingLicense || ''}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Documents</div>
            <div className="documents-container">
              <div className="document-row">
                <div className="document-container">
                  <div className="document-title">Aadhaar Card</div>
                  <div className="document-upload-container">
                    {profile.aadhaarPhoto ? (
                      <img 
                        src={profile.aadhaarPhoto.startsWith('blob:') 
                          ? profile.aadhaarPhoto 
                          : `http://localhost:5000/${profile.aadhaarPhoto}`} 
                        alt="Aadhaar" 
                        className="document-image"
                      />
                    ) : (
                      <div className="document-placeholder">No image uploaded</div>
                    )}
                    <div 
                      className="document-upload-overlay" 
                      onClick={() => triggerFileInput(aadhaarPhotoInputRef)}
                    >
                      Change Image
                    </div>
                    <input 
                      type="file" 
                      ref={aadhaarPhotoInputRef}
                      onChange={(e) => handleFileChange(e, 'aadhaarPhoto')}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div className="document-container">
                  <div className="document-title">Driving License</div>
                  <div className="document-upload-container">
                    {profile.drivingLicensePhoto ? (
                      <img 
                        src={profile.drivingLicensePhoto.startsWith('blob:') 
                          ? profile.drivingLicensePhoto 
                          : `http://localhost:5000/${profile.drivingLicensePhoto}`} 
                        alt="License" 
                        className="document-image"
                      />
                    ) : (
                      <div className="document-placeholder">No image uploaded</div>
                    )}
                    <div 
                      className="document-upload-overlay" 
                      onClick={() => triggerFileInput(drivingLicensePhotoInputRef)}
                    >
                      Change Image
                    </div>
                    <input 
                      type="file" 
                      ref={drivingLicensePhotoInputRef}
                      onChange={(e) => handleFileChange(e, 'drivingLicensePhoto')}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="button-container">
            <button type="submit">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffProfile;
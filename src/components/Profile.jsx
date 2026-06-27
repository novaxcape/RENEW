// File: src/Pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { LuSave } from 'react-icons/lu';
import {
  updateClientProfile,
  updateVendorProfile,
  getVendorDetails,
  clearClientError,
  clearClientSuccess,
  clearVendorError,
  clearVendorSuccess
} from '../redox/apiSlice';
import './css/Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Tab control state
  const [activeTab, setActiveTab] = useState('account');
  
  // Get auth state to determine if user is client or vendor
  const { loggedInUser, vendorDetails, isVendor } = useSelector((state) => state.auth);
  
  // Get API state
  const {
    clientProfile,
    clientLoading,
    clientError,
    clientSuccessMessage,
    vendorProfile,
    vendorLoading,
    vendorError,
    vendorSuccessMessage
  } = useSelector((state) => state.api);

  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    nickname: '',
    phoneNumber: '',
    gender: '',
    email: '',
    city: '',
    state: ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('/novaxcape/avatar.png');
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

  // Load profile data when component mounts
  useEffect(() => {
    if (isVendor && !vendorProfile) {
      dispatch(getVendorDetails());
    }
  }, [isVendor, dispatch, vendorProfile]);

  // Populate form when profile data is available
  useEffect(() => {
    const profileData = isVendor ? vendorProfile : clientProfile;
    
    if (profileData) {
      setFormData({
        userName: profileData.userName || profileData.username || '',
        firstName: profileData.firstName || profileData.first_name || '',
        lastName: profileData.lastName || profileData.last_name || '',
        nickname: profileData.nickname || profileData.userName || profileData.username || '',
        phoneNumber: profileData.phoneNumber || profileData.phone || '',
        gender: profileData.gender || '',
        email: profileData.email || (isVendor ? vendorDetails?.email : loggedInUser?.email) || '',
        city: profileData.city || '',
        state: profileData.state || ''
      });
      
      const avatarUrl = profileData.profilePicture || profileData.avatar || profileData.avatarUrl;
      if (avatarUrl && !avatarFile && !isAvatarRemoved) {
        setAvatarPreview(avatarUrl);
      }
    } else if (!isVendor && loggedInUser) {
      setFormData(prev => ({
        ...prev,
        userName: loggedInUser.userName || loggedInUser.username || '',
        firstName: loggedInUser.firstName || loggedInUser.first_name || '',
        lastName: loggedInUser.lastName || loggedInUser.last_name || '',
        email: loggedInUser.email || '',
        phoneNumber: loggedInUser.phoneNumber || loggedInUser.phone || ''
      }));
    }
  }, [clientProfile, vendorProfile, isVendor, loggedInUser, vendorDetails, avatarFile, isAvatarRemoved]);

  // Handle success/error messages
  useEffect(() => {
    if (clientSuccessMessage || vendorSuccessMessage) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: clientSuccessMessage || vendorSuccessMessage,
        timer: 3000,
        showConfirmButton: false
      });
      dispatch(isVendor ? clearVendorSuccess() : clearClientSuccess());
    }
  }, [clientSuccessMessage, vendorSuccessMessage, dispatch, isVendor]);

  useEffect(() => {
    if (clientError || vendorError) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: clientError || vendorError,
        confirmButtonColor: '#ff6b35'
      });
      dispatch(isVendor ? clearVendorError() : clearClientError());
    }
  }, [clientError, vendorError, dispatch, isVendor]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (20MB max)
      if (file.size > 20 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please upload an image under 20MB',
          confirmButtonColor: '#ff6b35'
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please upload PNG, JPEG, GIF, or WEBP images only',
          confirmButtonColor: '#ff6b35'
        });
        return;
      }
      
      setAvatarFile(file);
      setIsAvatarRemoved(false);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setIsAvatarRemoved(true);
    setAvatarPreview('/novaxcape/avatar.png');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.userName && !formData.firstName) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please provide at least a username or first name',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    // Create FormData for multipart/form-data upload
    const profileData = new FormData();
    
    // 1. Add userName (required by API)
    const userName = formData.userName.trim() || 
                     formData.nickname.trim() || 
                     `${formData.firstName} ${formData.lastName}`.trim();
    
    if (userName) {
      profileData.append('userName', userName);
    }

    // 2. Add profilePicture (binary file)
    if (avatarFile) {
      profileData.append('profilePicture', avatarFile);
    }

    // 3. Add other fields if needed (API only accepts userName and profilePicture)
    // Note: According to the API spec, only userName and profilePicture are accepted
    // Additional fields like firstName, lastName, etc. are not in the API schema
    
    try {
      console.log('📤 Submitting profile update...');
      console.log('📤 userName:', userName);
      console.log('📤 profilePicture:', avatarFile ? avatarFile.name : 'No change');
      
      if (isVendor) {
        await dispatch(updateVendorProfile(profileData)).unwrap();
      } else {
        await dispatch(updateClientProfile(profileData)).unwrap();
      }
      
      // Refresh vendor details if vendor
      if (isVendor) {
        dispatch(getVendorDetails());
      }
      
      // Show success message (handled by useEffect)
      console.log('✅ Profile updated successfully');
      
    } catch (error) {
      console.error('❌ Profile update error:', error);
      // Error is handled by useEffect
    }
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone. Your account and all associated data will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete my account',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'info',
          title: 'Feature Coming Soon',
          text: 'Account deletion will be available soon. Please contact support for assistance.',
          confirmButtonColor: '#ff6b35'
        });
      }
    });
  };

  const isLoading = isVendor ? vendorLoading : clientLoading;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-settings-container">
        
        <header className="settings-header">
          <h1 className="settings-title">Profile Settings</h1>
          <p className="settings-subtitle">Manage your account information and preferences</p>
        </header>

        <section className="profile-photo-section">
          <div className="avatar-wrapper">
            <img 
              src={avatarPreview} 
              alt="User avatar" 
              className="avatar-image" 
              onError={(e) => { e.target.src = '/novaxcape/avatar.png'; }}
            />
          </div>
          <div className="photo-controls">
            <h2 className="profile-label">Profile</h2>
            <div className="photo-actions">
              <label className="btn-upload" style={{ cursor: 'pointer' }}>
                <FiUpload className="react-icon" />
                Upload Image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
              <button type="button" className="btn-remove" onClick={handleRemoveAvatar}>
                Remove
              </button>
            </div>
            <p className="photo-hint">We support PNGs, JPEGs, GIFs, and WEBP under 20MB.</p>
          </div>
        </section>

        <div className="settings-tabs-wrapper">
          <nav className="settings-tabs-nav">
            <button 
              type="button" 
              className={activeTab === 'account' ? 'tab-pill-blue' : 'tab-pill-white'}
              onClick={() => setActiveTab('account')}
            >
              Account Setting
            </button>
            <button 
              type="button" 
              className={activeTab === 'general' ? 'tab-pill-blue' : 'tab-pill-white'}
              onClick={() => setActiveTab('general')}
            >
              Setting
            </button>
          </nav>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            
            {/* ✅ userName - Required by API */}
            <div className="form-group">
              <label htmlFor="userName">Username *</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="userName" 
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your username" 
                  required
                />
                <small className="field-hint">This is your display name. Required for API.</small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name" 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name" 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nickname">Nickname</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="nickname" 
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="Your display name" 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-wrapper">
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Input phone number" 
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <div className="input-wrapper select-wrapper">
                <select 
                  id="gender" 
                  value={formData.gender}
                  onChange={handleChange}
                  disabled
                >
                  <option value="" disabled>Select Option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your Email" 
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="city" 
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city" 
                  disabled
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="state" 
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state" 
                  disabled
                />
              </div>
            </div>
            
          </div>

          <div className="form-actions-footer">
            <button type="submit" className="btn-save" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
              <LuSave className="react-icon" />
            </button>
            <button type="button" className="btn-delete" onClick={handleDeleteAccount}>
              Delete Account
              <FiTrash2 className="react-icon" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import TopNavbar2 from "../components/TopNavbar2";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaEyeSlash, FaSave, FaEye } from "react-icons/fa";
import "../Styles/Setting.css";
import {
  updateVendorProfile,
  getVendorDetails,
  changeVendorPassword,
  clearVendorError,
  clearVendorSuccess
} from "../redox/apiSlice";

const SettingsPage = () => {
  const { openMobileMenu = () => {} } = useOutletContext() || {};
  const dispatch = useDispatch();
  const { vendorProfile, vendorLoading, vendorError, vendorSuccessMessage } = useSelector((state) => state.api);
  const { vendorDetails } = useSelector((state) => state.auth);

  const [businessData, setBusinessData] = useState({
    businessName: "",
    address: "",
    phoneNumber: "",
    email: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Load vendor profile data
  useEffect(() => {
    if (!vendorProfile) {
      dispatch(getVendorDetails());
    }
  }, [dispatch, vendorProfile]);

  // Populate form when profile data is available
  useEffect(() => {
    if (vendorProfile) {
      setBusinessData({
        businessName: vendorProfile.businessName || vendorProfile.business_name || vendorProfile.name || "",
        address: vendorProfile.address || vendorProfile.businessAddress || "",
        phoneNumber: vendorProfile.phoneNumber || vendorProfile.phone || vendorDetails?.phone || "",
        email: vendorProfile.email || vendorDetails?.email || ""
      });
    } else if (vendorDetails) {
      setBusinessData({
        businessName: vendorDetails.businessName || vendorDetails.business_name || vendorDetails.name || "",
        address: vendorDetails.address || vendorDetails.businessAddress || "",
        phoneNumber: vendorDetails.phoneNumber || vendorDetails.phone || "",
        email: vendorDetails.email || ""
      });
    }
  }, [vendorProfile, vendorDetails]);

  // Handle success/error messages
  useEffect(() => {
    if (vendorSuccessMessage) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: vendorSuccessMessage,
        timer: 3000,
        showConfirmButton: false
      });
      dispatch(clearVendorSuccess());
    }
  }, [vendorSuccessMessage, dispatch]);

  useEffect(() => {
    if (vendorError) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: vendorError,
        confirmButtonColor: '#ff6b35'
      });
      dispatch(clearVendorError());
    }
  }, [vendorError, dispatch]);

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('businessName', businessData.businessName);
    formData.append('address', businessData.address);
    formData.append('phoneNumber', businessData.phoneNumber);
    formData.append('email', businessData.email);

    try {
      await dispatch(updateVendorProfile(formData)).unwrap();
      dispatch(getVendorDetails()); // Refresh data
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (!passwordData.currentPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Password',
        text: 'Please enter your current password',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'New password must be at least 6 characters long',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'New password and confirmation do not match',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    try {
      await dispatch(changeVendorPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  const handleSaveAllChanges = async () => {
    // Save business info
    const formData = new FormData();
    formData.append('businessName', businessData.businessName);
    formData.append('address', businessData.address);
    formData.append('phoneNumber', businessData.phoneNumber);
    // formData.append('email', businessData.email);

    try {
      await dispatch(updateVendorProfile(formData)).unwrap();
      dispatch(getVendorDetails());

      Swal.fire({
        icon: 'success',
        title: 'All Changes Saved!',
        text: 'Your settings have been updated successfully.',
        confirmButtonColor: '#ff6b35'
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <>
    <div className="sticky-wrapper">
        <TopNavbar2 onMenuOpen={openMobileMenu} />
      </div>
    <div className="settings-page">
      {/* Business Information */}
      <form className="settings-card" onSubmit={handleBusinessSubmit}>
        <h2>Business Information</h2>
        <p className="sub-text">
          Update your business details and contact information
        </p>

        <div className="form-group">
          <label>Business Name</label>
          <input
            type="text"
            name="businessName"
            value={businessData.businessName}
            onChange={handleBusinessChange}
            placeholder="Lekki Conservation Centre"
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={businessData.address}
            onChange={handleBusinessChange}
            placeholder="Lekki Peninsula, Lagos Nigeria"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={businessData.phoneNumber}
            onChange={handleBusinessChange}
            placeholder="+234 706 394 1359"
            required
          />
        </div>

        {/* <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={businessData.email}
            onChange={handleBusinessChange}
            placeholder="lekkiconservationcenter688@gmail.com"
            required
          />
        </div> */}

        <button type="submit" className="orange-btn" disabled={vendorLoading}>
          {vendorLoading ? "Saving..." : "Update Business Info"}
        </button>
      </form>

      {/* Password */}
      <form className="settings-card password-card" onSubmit={handlePasswordSubmit}>
        <h2>Change Password</h2>

        <div className="form-group">
          <label>Current Password</label>
          <div className="password-field">
            <input 
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Input current password"
              required
            />
            <button 
              type="button"
              className="toggle-password-btn"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>New Password</label>
          <div className="password-field">
            <input 
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Input new password"
              required
            />
            <button 
              type="button"
              className="toggle-password-btn"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <small className="password-hint">Password must be at least 6 characters</small>
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <div className="password-field">
            <input 
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              required
            />
            <button 
              type="button"
              className="toggle-password-btn"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <button type="submit" className="orange-btn" disabled={vendorLoading}>
          {vendorLoading ? "Changing..." : "Change Password"}
        </button>
      </form>

      
    </div>
    </>

  );
};

export default SettingsPage;
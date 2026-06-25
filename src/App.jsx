import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Import your header and layout tool
import Header from "./components/Header";
import PaymentHeader from "./components/PaymentHeader";

// Import your route guard pages
import PrivateRoute from "./Pages/PrivateRoute";
import PublicRoute from "./Pages/PublicRoute";
import RootLayout from "./Outlet/RootLayout";

// ========== CLIENT PAGES ==========
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ResetPassword from "./Pages/ResetPassword";

import LandingPage from "./Pages/LandingPage";
import About from "./Pages/Aboutpage";
import ForCentrePage from "./Pages/ForCentrePage";
import Support from "./Pages/Supportpage";
import Discover from "./Pages/Discoverpage";
import ProductDetails from "./Pages/ProductDetails";

import WishList from "./Pages/WishList";
import PaymentOptionPage from "./Pages/PaymentOptionPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import PaymentConfirmationPage from "./Pages/PaymentConfirmationPage";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard  from "./Pages/Dashboard";
import SettingsPage from "./Pages/SettingPage";
import ProfileSettingPage from "./Pages/ProfileSettingPage";
import AddCentre from "./Pages/Addcentre";
import KycPage from "./Pages/KycPage";
import DashboardBookingPage from "./Pages/DashboardBookingPage";
import WalletPage from "./Pages/WalletPage";
import PackagePage from "./Pages/PackagePage";
import ReviewPage from "./Pages/ReviewPage";
import VerifyPage from "./Pages/VerifyPage.jsx";

import SignupScreen from "./Pages/SignUpScreen";
import SignInScreen from "./Pages/SignInScreen";

import PaymentCheckout from "./components/PaymentCheckout";
import BookingSummaryPage from "./Pages/BookingSummaryPage";
import BookingConfirmation from "./components/BookingConfirmation";

// ========== VENDOR PAGES ==========
import SignUpVendor from "./Pages/SignUpVendor";
import VendorVerifyOtp from "./Pages/VendorVerifyOtp";
import VendorLogin from "./Pages/VendorLogin";
import VendorForgotPassword from "./Pages/VendorForgotPassword";
import VendorResetPassword from "./Pages/VendorResetPassword";
import VendorChangePassword from "./Pages/VendorChangePassword";
import DashboardPackageActive from "./Pages/DashboardPackageActive";
import DashboardPackageInactive from "./Pages/DashboardPackageInactive";

const App = () => {
  return (
    <>
      {/* ✅ Globally active listener: Catches all route changes below */}
      <ScrollToTop />
      
      <Routes>
        {/* ========== PUBLIC CLIENT ROUTES ========== */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="discover" element={<Discover />} />
          <Route path="centres" element={<ForCentrePage />} />
          <Route path="about" element={<About />} />
          <Route path="support" element={<Support />} />
   
<Route path="review" element={<ReviewPage />} />  // General reviews (no ID)
<Route path="review/:touristCentreId" element={<ReviewPage />} />  // Specific centre reviews
          <Route path="centre/:id" element={<ProductDetails />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
        </Route>
        
        {/* ========== CLIENT PROTECTED ROUTES ========== */}
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <WishList />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-checkout/:touristId/:packageId"
          element={
            <PrivateRoute>
              <PaymentCheckout />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentOptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking-confirmation/:bookingId"
          element={
            <PrivateRoute>
              <BookingConfirmation />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-confirmation"
          element={
            <PrivateRoute>
              <PaymentConfirmationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking-summary/:touristId/:packageId"
          element={
            <PrivateRoute>
              <BookingSummaryPage />
            </PrivateRoute>
          }
        />

        {/* ========== CLIENT/SHARED STANDALONE SETTINGS ========== */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-settings"
          element={
            <PrivateRoute>
              <ProfileSettingPage />
            </PrivateRoute>
          }
        />

        {/* ========== CLIENT AUTH PORTALS ========== */}
        <Route
          path="/signupscreen"
          element={
            <PublicRoute>
              <SignupScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/signinscreen"
          element={
            <PublicRoute>
              <SignInScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* ========== VENDOR PUBLIC AUTH ========== */}
        <Route
          path="/signupvendor"
          element={
            <PublicRoute role="vendor">
              <SignUpVendor />
            </PublicRoute>
          }
        />
        <Route
          path="/vendor/verify-otp"
          element={
            <PublicRoute role="vendor">
              <VendorVerifyOtp />
            </PublicRoute>
          }
        />
        <Route
          path="/vendor/login"
          element={
            <PublicRoute role="vendor">
              <VendorLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/vendor/forgot-password"
          element={
            <PublicRoute role="vendor">
              <VendorForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/vendor/reset-password"
          element={
            <PublicRoute role="vendor">
              <VendorResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="DashboardPackageActive"
          element={
            <PublicRoute role="DashboardPackageActive">
              <DashboardPackageActive />
            </PublicRoute>
          }
        />
        <Route
          path="DashboardPackageInactive"
          element={
            <PublicRoute role="DashboardPackageInactive">
              <DashboardPackageInactive />
            </PublicRoute>
          }
        />

        {/* ========== VENDOR DASHBOARD ROUTES (Nested Outlets) ========== */}
        <Route
          path="/vendor/dashboard"
          element={
            <PrivateRoute role="vendor">
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<DashboardBookingPage />} />
          <Route path="verify" element={<VerifyPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="package" element={<PackagePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="support" element={<Support />} />
        </Route>

        <Route
          path="/dashboard"
          element={<Navigate to="/vendor/dashboard" replace />}
        />
        <Route
          path="/vendor/change-password"
          element={
            <PrivateRoute role="vendor">
              <VendorChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-centre"
          element={
            <PrivateRoute role="vendor">
              <AddCentre />
            </PrivateRoute>
          }
        />
        <Route
          path="/kyc"
          element={
            <PrivateRoute role="vendor">
              <KycPage />
            </PrivateRoute>
          }
        />

        {/* ========== FALLBACK 404 ========== */}
        <Route
          path="*"
          element={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "24px" }}>
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
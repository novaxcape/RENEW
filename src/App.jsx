import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Import your header and layout tool
import Header from "./components/Header";
import PaymentHeader from "./components/PaymentHeader";
// import Home from "./components/Home"


// Import your route guard pages
import PrivateRoute from "./Pages/PrivateRoute";
import PublicRoute from "./Pages/PublicRoute";
import RootLayout from "./Outlet/RootLayout";
// ========== CLIENT PAGES ==========
// Public Pages (Client Auth)
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ResetPassword from "./Pages/ResetPassword";

// Public Accessible Pages
import LandingPage from "./Pages/LandingPage";
import About from "./Pages/Aboutpage";
import ForCentrePage from "./Pages/ForCentrePage";
// import Centres from "./Pages/ForCentrePage";
import Support from "./Pages/Supportpage";
import Discover from "./Pages/Discoverpage";
import ProductDetails from "./Pages/ProductDetails";

// Protected Pages (Client - require login)
import WishList from "./Pages/WishList";
import PaymentOptionPage from "./Pages/PaymentOptionPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import PaymentConfirmationPage from "./Pages/PaymentConfirmationPage";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./Pages/Dashboard";
import RevenueTrendPage from "./Pages/RevenueTrendPage";
import SettingsPage from "./Pages/SettingPage";
import ProfileSettingPage from "./Pages/ProfileSettingPage";
import AddCentre from "./Pages/Addcentre";
import KycPage from "./Pages/KycPage";
import DashboardBookingPage from "./Pages/DashboardBookingPage";

// Selection Pages
import SignUpScreen from "./Pages/SignUpScreen";
import SignInScreen from "./Pages/SignInScreen";

// ========== VENDOR PAGES ==========
// Vendor Auth Pages (Public - no login required)
import SignUpVendor from "./Pages/SignUpVendor";
import VendorVerifyOtp from "./Pages/VendorVerifyOtp";
import VendorLogin from "./Pages/VendorLogin";
import VendorForgotPassword from "./Pages/VendorForgotPassword";
import VendorResetPassword from "./Pages/VendorResetPassword";
import VendorChangePassword from "./Pages/VendorChangePassword";
import DashboardPackageActive from "./Pages/DashboardPackageActive";
import DashboardPackageInactive from "./Pages/DashboardPackageInactive";

// ✅ Booking Summary Page
import BookingSummaryPage from "./Pages/BookingSummaryPage";

// Shared layout configuration to render Fixed Header automatically


const App = () => {
  return (
    <Routes>
    
      {/* The RootLayout houses the conditional header switcher */}
      <Route path="/" element={<RootLayout />}>
        {/* All pages inside here will get injected into the <Outlet /> */}
        <Route index element={<LandingPage />} />
        <Route path="discover" element={<Discover />} />
        <Route path="centres" element={<ForCentrePage />} />
        <Route path="about" element={<About />} />
        <Route path="support" element={<Support />} />
        {/* ✅ ADDED: Product Detail Page Route */}
        <Route path="centre/:id" element={<ProductDetails />} />
        {/* Add all other route tracks below */}
      </Route>
      
      {/* Client Protected Pages (Require login but keep the main header) */}
      <Route
        path="/wishlist"
        element={
          <PrivateRoute>
            <WishList />
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
        path="/my-bookings"
        element={
          <PrivateRoute>
            <MyBookingsPage />
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

      <Route
        path="/signupscreen"
        element={
          <PublicRoute>
            <SignUpScreen />
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

      {/* Vendor Auth */}
      {/* ========== VENDOR AUTH ROUTES (Public) ========== */}
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

      <Route
        path="/wishlist"
        element={
          <PrivateRoute>
            <WishList />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <PrivateRoute>
            <MyBookingsPage />
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

      {/* ✅ BOOKING SUMMARY ROUTE */}
      <Route
        path="/booking-summary/:touristId/:packageId"
        element={
          <PrivateRoute>
            <BookingSummaryPage />
          </PrivateRoute>
        }
      />

      {/* ========== VENDOR DASHBOARD ROUTES (Protected) ========== */}
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
        <Route path="revenue" element={<RevenueTrendPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="support" element={<Support />} />
      </Route>

      <Route
        path="/dashboard"
        element={<Navigate to="/vendor/dashboard" replace />}
      />

      {/* ========== VENDOR PROTECTED ROUTES (Require login) ========== */}
      <Route
        path="/vendor/change-password"
        element={
          <PrivateRoute role="vendor">
            <VendorChangePassword />
          </PrivateRoute>
        }
      />

      {/* ========== STANDALONE PROTECTED PAGES ========== */}
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

      {/* ========== FALLBACK for 404 ========== */}
      <Route
        path="*"
        element={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontSize: "24px",
            }}
          >
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
};

export default App;
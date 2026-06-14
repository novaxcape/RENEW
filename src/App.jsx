import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Import your header and layout tool
import Header from "./components/Header";
import PaymentHeader from "./components/PaymentHeader";

// Import your route guard pages
import PrivateRoute from "./Pages/PrivateRoute";
import PublicRoute from "./Pages/PublicRoute";

// ========== CLIENT PAGES ==========
// Public Pages (Client Auth)
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ResetPassword from "./Pages/ResetPassword";

// Public Accessible Pages
import LandingPage from "./Pages/LandingPage";
import Aboutpage from "./Pages/Aboutpage";
import Centres from "./Pages/Centres";
import Supportpage from "./Pages/Supportpage";
import Discoverpage from "./Pages/Discoverpage";
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

// Selection Pages
import SignUpScreen from "./Pages/SignUpScreen";

// ========== VENDOR PAGES ==========
// Vendor Auth Pages (Public - no login required)
import SignUpVendor from "./Pages/SignUpVendor";
import VendorVerifyOtp from "./Pages/VendorVerifyOtp";
import VendorLogin from "./Pages/VendorLogin";
import VendorForgotPassword from "./Pages/VendorForgotPassword";
import VendorResetPassword from "./Pages/VendorResetPassword";
import VendorChangePassword from "./Pages/VendorChangePassword";


// Shared layout configuration to render Fixed Header automatically 
const MainLayout = () => {
  return (
    <>
      <PaymentHeader />
      <div className="has-fixed-header">
        <Outlet />
      </div>
    </>
  );
};

const SemiLayout = () => {
  return (
    <>
      <Header />
      <div className="has-fixed-header">
        <Outlet />
      </div>
    </>
  );
};


const App = () => {
  return (
    <Routes>
      
      {/* ========================================================
          1. CLIENT & PUBLIC WEBSITE PAGES (Fixed Header Appears Here)
          ======================================================== */}
      <Route element={<SemiLayout />}>
          <Route path="/" element={<LandingPage />} />
        <Route path="/centres" element={<Centres />} />
        </Route>
        

      <Route element={<MainLayout />}>
        {/* Publicly Accessible Pages */}
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/support" element={<Supportpage />} />
        <Route path="/discover" element={<Discoverpage />} />
        <Route path="/product" element={<ProductDetails />} />

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
      </Route>


      {/* ========================================================
          2. SELECTION & AUTH PAGES (No Header - Full Screen Design)
         ======================================================== */}
      <Route
        path="/signupscreen"
        element={
          <PublicRoute>
            <SignUpScreen />
          </PublicRoute>
        }
      />

      {/* Client Auth */}
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
      <Route
        path="/signupvendor"
        element={
          <PublicRoute>
            <SignUpVendor />
          </PublicRoute>
        }
      />
      <Route
        path="/vendor/verify-otp"
        element={
          <PublicRoute>
            <VendorVerifyOtp />
          </PublicRoute>
        }
      />
      <Route
        path="/vendor/login"
        element={
          <PublicRoute>
            <VendorLogin />
          </PublicRoute>
        }
      />
      <Route
        path="/vendor/forgot-password"
        element={
          <PublicRoute>
            <VendorForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/vendor/reset-password"
        element={
          <PublicRoute>
            <VendorResetPassword />
          </PublicRoute>
        }
      />


      {/* ========================================================
          3. VENDOR SYSTEM PAGES (Uses Dashboard Layout Instead)
         ======================================================== */}
      <Route
        path="/vendor/dashboard"
        element={
          <PrivateRoute role="vendor">
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="revenue" element={<RevenueTrendPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="support" element={<Supportpage />} />
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
          // <PrivateRoute role="vendor">
            <AddCentre />
          // </PrivateRoute>
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


      {/* Fallback 404 */}
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
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import your custom layout tool
import RootLayout from "./Outlet/RootLayout";
import Centres from "./Pages/Centres"


// Import your route guard rules
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
import ForCentrePage from "./Pages/ForCentrePage";
// import ForCenterPage from "./Pages/ForCentrePage";
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

const App = () => {
  return (
    <Routes>
    
      <Route element={<SemiLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/centres" element={<ForCentrePage />} />
      </Route>

      <Route element={<MainLayout />}>
        {/* Publicly Accessible Pages */}
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/support" element={<Supportpage />} />
        <Route path="/discover" element={<Discoverpage />} />
        <Route path="/product" element={<ProductDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/centre/:id" element={<ProductDetails />} />

      
        {/* Client Protected Pages (Require login but keep the main header) */}
        <Route
          path="wishlist"
          element={
            <PrivateRoute>
              <WishList />
            </PrivateRoute>
          }
        />
        <Route
          path="payment"
          element={
            <PrivateRoute>
              <PaymentOptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="payment/:packageId"
          element={
            <PrivateRoute>
              <PaymentOptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <PrivateRoute>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="payment-confirmation"
          element={
            <PrivateRoute>
              <PaymentConfirmationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="profile-settings"
          element={
            <PrivateRoute>
              <ProfileSettingPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* ========================================================
          2. PUBLIC CLIENT AUTHENTICATION ROUTES
          ========================================================
      */}
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

      {/* ========================================================
          3. VENDOR PUBLIC AUTHENTICATION ROUTES
          ========================================================
      */}
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
  path="/DashboardPackageActive"
  element={
    <PublicRoute role="DashboardPackageActive">
      <DashboardPackageActive />
    </PublicRoute>
  }
/>

<Route
  path="/DashboardPackageInactive"
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
        path="/payment/:packageId"
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
        <Route path="support" element={<Supportpage />} />
      </Route>

      <Route
        path="/dashboard"
        element={<Navigate to="/vendor/dashboard" replace />}
      />

      {/* Standalone Vendor Protected Components */}
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
              fontFamily: "sans-serif"
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

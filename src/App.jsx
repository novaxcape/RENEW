import { Routes, Route } from "react-router-dom";

// Import your route guard pages
import PrivateRoute from "./Pages/PrivateRoute";
import PublicRoute from "./Pages/PublicRoute";

// Public Pages
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

// Protected Pages (require login)
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
import Kyc from "./Pages/Kyc";

const App = () => {
  return (
    <Routes>
      {/* Public Routes - Everyone can access */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<Aboutpage />} />
      <Route path="/centres" element={<Centres />} />
      <Route path="/support" element={<Supportpage />} />
      <Route path="/discover" element={<Discoverpage />} />
      <Route path="/product" element={<ProductDetails />} />

      {/* Auth Routes - Redirect to home if already logged in */}
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

      {/* Protected Routes - Require login */}
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

      {/* Dashboard Routes - Protected */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
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

      {/* Standalone Protected Pages */}
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
          <PrivateRoute>
            <AddCentre />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/kyc" 
        element={
          <PrivateRoute>
            <Kyc />
          </PrivateRoute>
        } 
      />

      {/* Fallback for 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ResetPassword from "./Pages/ResetPassword";

import LandingPage from "./Pages/LandingPage";
import Aboutpage from "./Pages/Aboutpage";
import Centres from "./Pages/Centres";
import Supportpage from "./Pages/Supportpage";
import Discoverpage from "./Pages/Discoverpage";
import ProductDetails from "./Pages/ProductDetails";

import WishList from "./Pages/WishList";
import PaymentOptionPage from "./Pages/PaymentOptionPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import PaymentConfirmationPage from "./Pages/PaymentConfirmationPage";

import DashboardLayout from "./components/DashboardLayout";
import RevenueTrendPage from "./Pages/RevenueTrendPage";
import BasicInfo from "./components/BasicInfo" // ← Add this

import AddCentre from "./Pages/AddCentre";
import Kyc from "./Pages/Kyc";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
  
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/centres" element={<Centres />} />
        <Route path="/support" element={<Supportpage />} />
        <Route path="/discover" element={<Discoverpage />} />
        <Route path="/product" element={<ProductDetails />} />

        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User & Booking Routes */}
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/payment" element={<PaymentOptionPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmationPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<BasicInfo />} />
          <Route path="bookings" element={<MyBookingsPage />} />
          <Route path="revenue" element={<RevenueTrendPage />} />
        </Route>

        {/* NEW ROUTES: Add Centre & KYC */}
        <Route path="/add-centre" element={<AddCentre />} />
        <Route path="/kyc" element={<Kyc />} />

        {/* Fallback for 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ResetPassword from "./Pages/ResetPassword";
import Supportpage from "./Pages/Supportpage";
import Discover from "./Pages/Discover";
import Centres from "./Pages/Centres";
import About from "./Pages/About";
import LandingPage from "./Pages/LandingPage";
import ProductDetails from "./Pages/ProductDetails";
import Discoverpage from "./Pages/Discoverpage";
import Home from "./components/Home";
import WishList from "./Pages/WishList";
import PaymentOptionPage from "./Pages/PaymentOptionPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import PaymentConfirmationPage from "./Pages/PaymentConfirmationPage";
import Dashboard from "./Pages/Dashboard";
// import SettingsPage from "./Pages/SettingPage";
import RevenueTrendPage from "./Pages/RevenueTrendPage";
import DashboardLayout from "./components/DashboardLayout";

import Aboutpage from "./Pages/Aboutpage";

const App = () =>  {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/h" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/support" element={<Supportpage />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/centres" element={<Centres />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/product" element={<ProductDetails />} />
      
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/discoverpage" element={<Discoverpage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/payment" element={<PaymentOptionPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route
          path="/payment-confirmation"
          element={<PaymentConfirmationPage />}
        />
        <Route path="/dashboard" element={<DashboardLayout />}>

          <Route path="bookings" element={<MyBookingsPage />} />
          <Route path="revenue" element={<RevenueTrendPage />} />
          {/* <Route path="settings" element={<SettingsPage />} /> */}
          <Route path="support" element={<Supportpage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

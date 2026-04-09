import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protected";
import LoadingPage from "./components/loadingpage";
import AuthRedirect from "./components/authredirect";
import Vendornav from "./components/vendornav";
import NotFound from "./components/notfound";
const Landingpage = lazy(() => import("./app/home"));

const VendorSignup = lazy(() => import("./auth/vendorsignup"));
const VendorLogin = lazy(() => import("./auth/vendorlogin"));

const VendorForgotPassword = lazy(
  () => import("./auth/vendorforgetpassword"),
);

const VendorResetPassword = lazy(
  () => import("./auth/VendorResetPassword"),
);

const VendorDashboard = lazy(() => import("./app/vendordashboard"));
const VendorVerifyOTP = lazy(() => import("./auth/vendorverifyotp"));
const Subscriptions = lazy(() => import("./app/subscriptions"));
const VendorProfile = lazy(() => import("./app/vendorprofile"));
const Meals = lazy(()=> import("./app/meals"))
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<Vendornav />}>
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/subscriptions" element={<Subscriptions />} />
              <Route path="/vendor/profile" element={<VendorProfile />} />
              <Route path="/vendor/meals" element={<Meals/>}/>
            </Route>
          </Route>

          <Route element={<AuthRedirect />}>
            <Route path="/" element={<Landingpage />} />
            <Route path="/vendor/signup" element={<VendorSignup />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/verify_otp" element={<VendorVerifyOTP />} />
            <Route
              path="/vendor/forgetpassword"
              element={<VendorForgotPassword />}
            />
            <Route
              path="/vendor/resetpassword"
              element={<VendorResetPassword />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster position="bottom-right" />
      </Suspense>
    </BrowserRouter>
  );
}

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthRedirect = () => {
  const vendor_token = localStorage.getItem("vendor_token");
 
    return vendor_token ? <Navigate to="/vendor/dashboard" /> : <Outlet />;
};

export default AuthRedirect;
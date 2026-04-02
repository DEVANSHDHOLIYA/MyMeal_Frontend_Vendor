import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute() {
  const location = useLocation();
  
 
  const vendor_token = localStorage.getItem("vendor_token");
 

    
    return vendor_token ? <Outlet /> : <Navigate to="/vendor/login" replace />;
  }


export default ProtectedRoute;
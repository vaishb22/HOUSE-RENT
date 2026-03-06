import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ 
  children, 
  requiredRole,
  allowedRoles,
  redirectTo = "/login",
  fallbackPath = "/"
}) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Single role check
  if (requiredRole) {
    if (user.role !== requiredRole) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Multiple roles check (array of allowed roles)
  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;


import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectRole } from "../../redux/features/userSlice";
import authService from "../../services/authService";

const roleAccessMap = {
  ADMIN: [
    "/home",
    "/admin",
    "/user",
    "/mybookings",
    "/search",
    "/detailU",
    "/book",
    "/confirm",
    "/addcar",
    "/drivermanage",
    "/addDriver",
    "/allbookings",
    "/detailA",
    "/cars/edit",
    "/drivers/edit",
    "/cardetail",
    "/admintrack",
    "/driver",
    "/driverlocation",
  ],
  USER: ["/user", "/mybookings", "/search", "/detailU", "/book", "/confirm"],
  DRIVER: [ "/driver", "/driverlocation"],
};

/**
 * PrivateRoute component that checks if user is authenticated and authorized based on role
 * Redirects to login if not authenticated or to home if not authorized
 */
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectRole);
  const dispatch = useDispatch();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    // Initialize authentication if not already authenticated
    const initializeAuth = async () => {
      if (!isAuthenticated) {
        const success = authService.initAuth(dispatch);
        setIsAuthInitialized(success);
      } else {
        setIsAuthInitialized(true);
      }
    };
    initializeAuth();
  }, [isAuthenticated, dispatch]);

  // Show loading state while authentication is being initialized
  if (!isAuthInitialized && !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Check authentication status
  const authStatus = isAuthenticated || authService.isAuthenticated();

  if (!authStatus) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Use default role 'ADMIN' if role is null or undefined
  const effectiveRole = userRole || "ADMIN";

  // Check role-based authorization
  const currentPath = location.pathname;
  const hasAccess = checkRouteAccess(currentPath, effectiveRole);

  if (!hasAccess) {
    // Redirect to appropriate landing page based on role if unauthorized
    const defaultRoutes = {
      ADMIN: "/home", // Changed to /home for ADMIN
      USER: "/user",
      DRIVER: "/driver",
    };
    return <Navigate to={defaultRoutes[effectiveRole] || "/"} replace />;
  }

  // Return children only if authenticated and authorized
  return children;
};

/**
 * Helper function to check if the user has access to the current route based on their role
 */
const checkRouteAccess = (path, role) => {
  if (!role || !roleAccessMap[role]) {
    return false;
  }

  // Special handling for routes with parameters (like /detailU/:id)
  return roleAccessMap[role].some((allowedPath) => {
    // Exact match
    if (path === allowedPath) {
      return true;
    }
    // Path with parameter (e.g., /detailU/123 matches /detailU)
    if (path.startsWith(`${allowedPath}/`)) {
      return true;
    }
    return false;
  });
};

export default PrivateRoute;
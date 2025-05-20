import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { decodeJWT } from "../../utils/jwtUtils";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/userSlice";
import { toast } from "react-toastify";

const GoogleRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const isValidJWT =
      token &&
      typeof token === "string" &&
      token.split(".").length === 3 &&
      token.length > 30;

    if (!isValidJWT) {
      toast.error("Invalid or missing token");
      navigate("/login");
      return;
    }

    toast.success("Login successful!");
    Cookies.set("authToken", token);

    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      toast.error("Invalid authentication token");
      navigate("/login");
      return;
    }

    const { userId = "", sub = "", email = "", role = [] } = decodedToken;
    const userRole = role.length > 0 ? (Array.isArray(role) ? role[0] : role) : "ADMIN";
    const userData = {
      username: sub,
      userId,
      email,
      role: userRole,
    };

    dispatch(setUser(userData));
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect based on role
    if (userRole === "USER") {
      navigate("/user");
    } else if (userRole === "DRIVER") {
      navigate("/driver");
    } else {
      navigate("/home"); // Default to /home for ADMIN
    }
  }, [location, navigate, dispatch]);

  return <p>Redirecting...</p>;
};

export default GoogleRedirect;
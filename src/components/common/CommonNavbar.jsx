import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";
import ThemeToggleButton from "../../ThemeToggleButton";
import logo from "../../assets/logo.jpg";
import Cookies from "js-cookie";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectUsername,
  clearUser,
} from "../../redux/features/userSlice";

const CommonNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const username = useAppSelector(selectUsername);
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  console.log(userRole)
  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    switch (userRole) {
      case "USER":
        return "/user";
      case "DRIVER":
        return "/driver";
      case "ADMIN":
        return "/home";
      default:
        return "/";
    }
  };

  // Check for auth token on component mount and when it might change
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    // Setup an interval to periodically check auth status
    const intervalId = setInterval(checkAuth, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For handling screen size changes
  useEffect(() => {
    const handleResize = () => {
      // Reset hover state when resizing
      setShowFullName(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logout handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Just for debugging: check current token before removal
      const token = Cookies.get("authToken");

      // Remove token
      Cookies.remove("authToken");
      localStorage.removeItem("user");

      dispatch(clearUser());

      // Update logged in state
      setIsLoggedIn(false);

      // Redirect to home
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "scrolled backdrop-blur-lg shadow-md" : ""
      }`}
    >
      <div className="flex items-center justify-between p-4 lg:px-8 w-full">
        {/* Mobile Menu Button */}
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Logo with Animated Company Name */}
        <div className="flex items-center space-x-3">
          {/* Updated Circular Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <div
                className="relative w-10 h-10 overflow-hidden flex items-center justify-center"
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-red-500"></div>
                <div className="absolute inset-0.5 rounded-full bg-white"></div>
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Company Logo"
                    className={`w-6 h-6 object-contain transition-all duration-500 ${
                      isLogoHovered ? "scale-110" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Animated SLTT Text with Full Form Reveal - Overlapping same position */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowFullName(true)}
            onMouseLeave={() => setShowFullName(false)}
            onClick={() => setShowFullName(!showFullName)} // For mobile tap toggle
          >
            {/* Container with conditional rendering */}
            <div className="relative">
              {showFullName ? (
                // Full Company Name (shown on hover)
                <div className="logo-full text-center whitespace-nowrap">
                  <span className="text-blue-900 text-base lg:text-lg font-serif italic">
                    Shree{" "}
                  </span>
                  <span className="text-red-600 text-xl lg:text-2xl font-serif italic">
                    Lakhdatar
                  </span>
                  <div className="flex items-center justify-center">
                    <span className="text-blue-900 text-base lg:text-lg font-serif italic">
                      Tours & Travels
                    </span>
                  </div>
                </div>
              ) : (
                // SLTT Text (shown by default)
                <span className="font-serif tracking-wide">
                  <span className="font-serif font-bold text-xl lg:text-2xl tracking-wide text-blue-900">
                    S
                  </span>
                  <span className=" font-serif font-bold italic  text-red-600 text-xl lg:text-2xl ">
                    L
                  </span>
                  <span className="font-serif font-bold text-xl lg:text-2xl tracking-wide text-blue-900">
                    TT
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation & Login Button */}
        <div className="hidden lg:flex items-center gap-6 ml-auto">
          <nav className="grid grid-cols-5 gap-4 font-[Poppins,Arial,Verdana,Tahoma,sans-serif]">
            <Link
              to="/about"
              className="font-medium hover:text-red-500 transition-all"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="font-medium hover:text-red-500 transition-all"
            >
              Contact
            </Link>
            <Link
              to="/faq"
              className="font-medium hover:text-red-500 transition-all"
            >
              FAQs
            </Link>
            <Link
              to="/blogs"
              className="font-medium hover:text-red-500 transition-all"
            >
              Blogs
            </Link>
          </nav>

          {/* Theme Toggle Button */}
          <ThemeToggleButton />

          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <>
              {/* Dashboard Link based on role */}
              <Link
                to={getDashboardRoute()}
                className="flex items-center space-x-2 font-medium hover:text-red-500 transition-all font-[Poppins,Arial,Verdana,Tahoma,sans-serif]"
              >
                <FaHome className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </Link>

              {/* User Info */}
              <div className="flex items-center space-x-2 font-medium font-[Poppins,Arial,Verdana,Tahoma,sans-serif]">
                <FaUser className="w-5 h-5" />
                <span>{username}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-all flex items-center space-x-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link
                to="/login"
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold 
                rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 
                text-white text-sm md:text-base transition-all 
                duration-300 ease-out shadow-md hover:shadow-lg "
              >
                <span className="relative z-10">LOGIN</span>
              </Link>

              {/* Signup Button */}
              <Link
                to="/signup"
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold 
                rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 
                text-white text-sm md:text-base transition-all 
                duration-300 ease-out shadow-md hover:shadow-lg "
              >
                <span className="relative z-10">SIGNUP</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full backdrop-blur-lg p-4 flex flex-col space-y-4 shadow-md">
          <Link
            to="/about"
            className="hover:text-red-500"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-red-500"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/faq"
            className="hover:text-red-500"
            onClick={() => setIsOpen(false)}
          >
            FAQs
          </Link>
          <Link
            to="/blogs"
            className="hover:text-red-500"
            onClick={() => setIsOpen(false)}
          >
            Blogs
          </Link>

          {/* Theme Toggle in Mobile Menu */}
          <div className="flex items-center">
            <span className="mr-2">Theme:</span>
            <ThemeToggleButton />
          </div>

          {/* Conditional rendering for mobile based on login status */}
          {isLoggedIn ? (
            <>
              {/* Dashboard Link in Mobile */}
              <Link
                to={getDashboardRoute()}
                className="flex items-center space-x-2 font-medium hover:text-red-500 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <FaHome className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </Link>

              {/* User Info */}
              <div className="flex items-center space-x-2 font-medium">
                <FaUser className="w-5 h-5" />
                <span>{username}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-all flex items-center space-x-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold 
                rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 
                text-white text-sm md:text-base transition-all 
                duration-300 ease-out shadow-md hover:shadow-lg "
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">LOGIN</span>
              </Link>
              <Link
                to="/signup"
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold 
                rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 
                text-white text-sm md:text-base transition-all 
                duration-300 ease-out shadow-md hover:shadow-lg "
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">SIGNUP</span>
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap");

        /* Add serif font for the logo text */
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap");

        /* Ensure the popup doesn't overflow on small screens */
        @media (max-width: 640px) {
          .company-name-popup {
            max-width: 80vw;
            overflow-wrap: break-word;
          }
        }
      `}</style>
    </header>
  );
};

export default CommonNavbar;

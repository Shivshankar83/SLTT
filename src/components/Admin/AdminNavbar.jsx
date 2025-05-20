import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.jpg";
import ThemeToggleButton from "../../ThemeToggleButton";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectUsername, clearUser } from "../../redux/features/userSlice";

function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Fetch username from Redux store instead of hardcoding
  const username = useAppSelector(selectUsername) || "User";

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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Just for debugging: check current token before removal
      const token = Cookies.get("authToken");

      // Remove token
      Cookies.remove("authToken");
      localStorage.removeItem("user");


      dispatch(clearUser());

      // Redirect to login
      navigate("/");
    }
  };

  return (
    <>
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
            <Link to="/">
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
                      <span className="font-serif font-bold italic text-red-600 text-xl lg:text-2xl">
                        L
                      </span>
                      <span className="font-serif font-bold text-xl lg:text-2xl tracking-wide text-blue-900">
                        TT
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation & User Info */}
          <div className="hidden lg:flex items-center gap-6 ml-auto">
            {/* Theme Toggle Button */}
            <ThemeToggleButton />

            {/* User Info and Buttons */}
            <div className="flex items-center gap-4 font-[Poppins,Arial,Verdana,Tahoma,sans-serif]">
              <Link
                to="/home"
                className="flex items-center gap-2 font-medium hover:text-red-500 transition-all"
              >
                <FaHome />
                <span>Home</span>
              </Link>
              <div className="flex items-center gap-2 font-medium">
                <FaUser />
                <span>{username}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-all"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full backdrop-blur-lg p-4 flex flex-col space-y-4 shadow-md">
            {/* Theme Toggle in Mobile Menu */}
            <div className="flex items-center">
              <span className="mr-2">Theme:</span>
              <ThemeToggleButton />
            </div>
            <Link
              to="/home"
              className="flex items-center gap-2 hover:text-red-500 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              <FaHome />
              <span>Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <FaUser />
              <span className="font-medium">{username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md text-center"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
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
    </>
  );
}

export default AdminNavbar;

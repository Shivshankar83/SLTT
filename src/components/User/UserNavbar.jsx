import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectUsername,
  selectIsAuthenticated,
  clearUser,
} from "../../redux/features/userSlice";
import {
  FaBars,
  FaCar,
  FaHome,
  FaCarAlt,
  FaTimes,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../../assets/logo.jpg";
import ThemeToggleButton from "../../ThemeToggleButton";
import Cookies from "js-cookie";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const username = useAppSelector(selectUsername);
  const [showFullName, setShowFullName] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    const handleResize = () => {
      setShowFullName(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("authToken");
      dispatch(clearUser());
      localStorage.removeItem("user");
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
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Logo with Animated Company Name */}
        <div className="flex items-center space-x-3">
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

          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowFullName(true)}
            onMouseLeave={() => setShowFullName(false)}
            onClick={() => setShowFullName(!showFullName)}
          >
            <Link to="/">
              <div className="relative">
                {showFullName ? (
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
            </Link>
          </div>
        </div>

        {/* Desktop Navigation & User Info */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center mx-4">
            <ThemeToggleButton />
          </div>

          <Link
            to="/"
            className="flex items-center space-x-2 p-2 cursor-pointer font-medium hover:text-red-500 transition-all font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base"
          >
            <FaHome className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <Link
            to="/user"
            className="flex items-center space-x-2 p-2 cursor-pointer font-medium hover:text-red-500 transition-all font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base"
          >
            <FaCar className="w-5 h-5" />
            <span>Book a Car</span>
          </Link>

          <Link
            to="/mybookings"
            className="flex items-center space-x-2 p-2 cursor-pointer font-medium hover:text-red-500 transition-all font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base"
          >
            <FaCarAlt className="w-5 h-5" />
            <span>My Bookings</span>
          </Link>

          <div className="flex items-center space-x-2 font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base">
            <FaUser className="w-5 h-5" />
            <span className="font-medium">{username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-all font-[Poppins,Arial,Verdana,Tahoma,sans-serif]"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full backdrop-blur-lg p-4 flex flex-col space-y-4 shadow-md">
          <div className="flex items-center">
            <span className="mr-2 font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base">
              Theme:
            </span>
            <ThemeToggleButton />
          </div>

          <Link
            to="/"
            className="flex items-center space-x-2 p-2 w-full text-left hover:text-red-500 font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base"
            onClick={() => setIsOpen(false)}
          >
            <FaHome className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/user"
            className="flex items-center space-x-2 p-2 w-full text-left hover:text-red-500 font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base"
            onClick={() => setIsOpen(false)}
          >
            <FaCar className="w-5 h-5" />
            <span className="font-medium">Book a Car</span>
          </Link>

          <Link
            to="/mybookings"
            className="flex items-center space-x-2 p-2 w-full text-left hover:text-red-500 font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base"
            onClick={() => setIsOpen(false)}
          >
            <FaCarAlt className="w-5 h-5" />
            <span className="font-medium">My Bookings</span>
          </Link>

          <div className="flex items-center space-x-2 p-2 font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-base">
            <FaUser className="w-5 h-5" />
            <span className="font-medium">{username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md text-center hover:opacity-90 transition-all font-[Poppins,Arial,Verdana,Tahoma,sans-serif]"
          >
            <div className="flex items-center justify-center space-x-2">
              <FaSignOutAlt className="w-4 h-4" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      )}

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap");

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

export default UserNavbar;
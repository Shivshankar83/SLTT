import React, { useEffect, useState } from "react";
import { FaUser, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ThemeToggleButton from "../../ThemeToggleButton";
import { clearUser } from "../../redux/features/userSlice";
import { useAppDispatch } from "../../redux/hooks";

const NavHome = ({ userName = "Shivshankar" }) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Add scroll event listener to detect when to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Handle "Go to Home" navigation
  const handleGoHome = () => {
    navigate("/");
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      const token = Cookies.get("authToken");
      console.log("Token before removal:", token);

      Cookies.remove("authToken");
      localStorage.removeItem("user");
      dispatch(clearUser());
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed left-0 top-0 w-full z-30 transition-all duration-300 ${
        scrolled
          ? "bg-blue-500 shadow-md dark:bg-gray-800"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <div className="flex h-16 items-center justify-end px-2 sm:px-4 md:px-6">
        {/* Navbar Content - Visible on All Screen Sizes */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {/* Theme Toggle Button */}
          <div className="flex items-center">
            <ThemeToggleButton />
          </div>

          {/* Go to Home Button */}
          <button
            onClick={handleGoHome}
            className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 cursor-pointer font-medium hover:text-red-500 transition-all font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-sm sm:text-base text-blue"
          >
            <FaHome className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Username */}
          <div className="flex items-center space-x-1 sm:space-x-2 font-medium font-[Poppins,Arial,Verdana,Tahoma,sans-serif] text-blue">
            <FaUser className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
              {userName}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-400 to-pink-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg shadow-md hover:opacity-90 transition-all text-xs sm:text-sm md:text-base"
          >
            <FaSignOutAlt className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavHome;

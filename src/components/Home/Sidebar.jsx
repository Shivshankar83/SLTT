import React, { useEffect, useState } from "react";
import {
  FaUserTie,
  FaCar,
  FaClipboardList,
  FaCogs,
  FaUserEdit,
  FaCarAlt,
  FaTimes,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";
import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, onToggle }) => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [showFullName, setShowFullName] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".sidebar-content") &&
        !event.target.closest(".sidebar-toggle")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // For handling screen size changes
  useEffect(() => {
    const handleResize = () => {
      // Reset hover state when resizing
      setShowFullName(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Semi-transparent overlay for mobile - covers the entire screen when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-50 z-40" : "opacity-0 pointer-events-none -z-10"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar - Fixed positioning on mobile, static on desktop */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:relative md:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="sidebar-content h-full flex flex-col overflow-hidden">
          {/* Company Logo and Name */}
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Updated Logo Design from CarNavbar */}
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

              {/* Animated SLTT Text with Full Form Reveal */}
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => setShowFullName(true)}
                onMouseLeave={() => setShowFullName(false)}
                onClick={() => setShowFullName(!showFullName)} // For mobile tap toggle
              >
                <Link to="/">
                  {/* Container with conditional rendering */}
                  <div className="relative">
                    {showFullName ? (
                      // Full Company Name (shown on hover)
                      <div className="logo-full text-center whitespace-nowrap">
                        <span className="text-blue-900 text-base font-serif italic">
                          Shree{" "}
                        </span>
                        <span className="text-red-600 text-xl font-serif italic">
                          Lakhdatar
                        </span>
                        <div className="flex items-center justify-center">
                          <span className="text-blue-900 text-base font-serif italic">
                            Tours & Travels
                          </span>
                        </div>
                      </div>
                    ) : (
                      // SLTT Text (shown by default)
                      <span className="font-serif tracking-wide">
                        <span className="font-serif font-bold text-xl tracking-wide text-blue-900">
                          S
                        </span>
                        <span className="font-serif font-bold italic text-red-600 text-xl">
                          L
                        </span>
                        <span className="font-serif font-bold text-xl tracking-wide text-blue-900">
                          TT
                        </span>
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Close Button - Only visible on mobile */}
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close sidebar"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links with Scrollable Area */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto font-[Poppins,Arial,Verdana,Tahoma,sans-serif]">
            <Link to="/admin">
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-blue-600 p-2">
                  Admin
                </h3>
              </div>
            </Link>

            <Link
              to="/admin"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaCar className="w-5 h-5" />
              <span className="font-medium">Car Management</span>
            </Link>

            <Link
              to="/drivermanage"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaUserTie className="w-5 h-5" />
              <span className="font-medium">Driver Management</span>
            </Link>

            <Link
              to="/allbookings"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaCar className="w-5 h-5" />
              <span className="font-medium">All Bookings</span>
            </Link>

            <Link to="/user">
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-blue-600 p-2">
                  User
                </h3>
              </div>
            </Link>
            <Link
              to="/user"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaClipboardList className="w-5 h-5" />
              <span className="font-medium">Book Car</span>
            </Link>

            <Link
              to="/mybookings"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaCarAlt className="w-5 h-5" />
              <span className="font-medium">My Bookings</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaUserEdit className="w-5 h-5" />
              <span className="font-medium">Profile Settings</span>
            </Link>

            {/* Driver Section */}
            <Link to="/driver">
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-blue-600 p-2">
                  Driver
                </h3>
              </div>
            </Link>

            <Link
              to="/driver"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaCalendarAlt className="w-5 h-5" />
              <span className="font-medium">Available Bookings</span>
            </Link>

            <Link
              to="/driver-profile"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaIdCard className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </Link>

            {/* Car Section */}
            <Link to="/">
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-blue-600 p-2">Car</h3>
              </div>
            </Link>

            <Link
              to="/maintenance"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-red-500 rounded-lg transition-colors duration-200"
            >
              <FaCogs className="w-5 h-5" />
              <span className="font-medium">Maintenance</span>
            </Link>
          </nav>
        </div>
      </aside>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap");

        /* Add serif font for the logo text */
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap");

        /* Ensure the popup doesn't overflow on small screens */
        @media (max-width: 640px) {
          .logo-full {
            max-width: 80vw;
            overflow-wrap: break-word;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import NavHome from "./NavHome";
import MainContent from "./MainContent";
import { FaBars } from "react-icons/fa";
import Footer from "../common/Footer";
import Logo from "../common/Logo";
import { useAppSelector } from "../../redux/hooks";
import { selectUsername } from "../../redux/features/userSlice";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile, will be set to true for desktop
  const [currentView, setCurrentView] = useState("user");
  const [isMobile, setIsMobile] = useState(false);
  
  // Fetch username from Redux store instead of JWT decoding
  const userName = useAppSelector(selectUsername) || "User";

  useEffect(() => {
    // Handle responsive sidebar
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Toggle Button - Only visible when sidebar is closed on mobile */}
        {isMobile && !sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 rounded-md bg-white p-2 shadow-md md:hidden"
            aria-label="Open menu"
          >
            <FaBars className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Navbar */}
        <NavHome userName={userName} />

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto pt-16"
          id="main-scrollable-content" // Add ID for the scroll component to reference
        >
          <MainContent
            userRole={currentView}
            setUserRole={setCurrentView}
            currentUser={{
              name: userName,
              role: currentView.charAt(0).toUpperCase() + currentView.slice(1),
            }}
          />
          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* WhatsApp Logo */}
      <Logo
        whatsappNumber="918349762192" // Replace with your actual WhatsApp number (without +)
        message="Hello, I'm interested in booking a car!"
        scrollContainerId="main-scrollable-content" // Pass ID of scrollable container
      />
    </div>
  );
};

export default Home;

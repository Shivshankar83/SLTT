import React, { useState, useEffect } from "react";
import { FaCar, FaClock, FaUserTie } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserNavbar from "./UserNavbar";
import videoFile from "../../assets/BookRide.mp4";
import LocationAutocomplete from "./LocationAutocomplete";
import UserCarousel from "./UserCarousel";
import Footer from "../common/Footer";
import { useNavigate } from "react-router-dom";
import LocationPermissionModal from "./LocationPermissionModal";
import axios from "axios";
import Logo from "../common/Logo"; // Import the Logo component

function User() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const formattedTime = currentDate.toTimeString().slice(0, 5);

  const [pickupDate, setPickupDate] = useState(formattedDate);
  const [pickupTime, setPickupTime] = useState(formattedTime);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const navigate = useNavigate();
  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if script is already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsApiLoaded(true);
        return;
      }

      // Check if script tag already exists
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkApiLoaded = setInterval(() => {
          if (
            window.google &&
            window.google.maps &&
            window.google.maps.places
          ) {
            clearInterval(checkApiLoaded);
            setIsApiLoaded(true);
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("Google Maps API loaded successfully");
        setIsApiLoaded(true);
      };

      script.onerror = (error) => {
        console.error("Error loading Google Maps API:", error);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Sample card data
  const cards = [
    {
      icon: <FaCar className="w-8 h-8" />,
      title: "Premium Fleet",
      description:
        "Choose from our selection of luxury vehicles for any occasion",
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "24/7 Service",
      description: "Available round the clock for your convenience",
    },
    {
      icon: <FaUserTie className="w-8 h-8" />,
      title: "Professional Drivers",
      description: "Experienced and courteous chauffeurs at your service",
    },
  ];

  const handleBooking = async () => {
    if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      toast.success("Search successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Create URL parameters for search page
      const params = new URLSearchParams();
      params.set("pickup", pickupLocation);
      params.set("dropoff", dropoffLocation);
      params.set("date", pickupDate);
      params.set("time", pickupTime);

      // Navigate to search page with parameters after a short delay to show the toast
      setTimeout(() => {
        navigate(`/search?${params.toString()}`);
      }, 2000);
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(
        error.response?.data?.message || "Booking failed. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <LocationPermissionModal />
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <UserNavbar />

        {/* Hero Section with Video Background and Overlapping Search */}
        <div className="relative w-full h-screen overflow-hidden ">
          {/* Video Container with previous height */}
          <div className="absolute inset-x-0 top-0 bottom-32 z-0 flex justify-center items-center">
            <div className="w-full h-full relative overflow-hidden shadow-lg">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Hero Text */}
            <div className="flex-1 flex items-center justify-center mb-30 px-4 sm:px-6 lg:px-8 mb-100">
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight sm:leading-snug md:leading-relaxed">
                  Your Ride, Your Way: Book Now and Hit the Road in Comfort!
                </h1>
              </div>
            </div>

            {/* Booking Search Section - Moved up */}
            <div className="absolute top-[65%] left-0 right-0 z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform -translate-y-1/2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 font-poppins">
                    Book Your Ride
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full sm:w-auto">
                      <LocationAutocomplete
                        label="Pick-up Location"
                        value={pickupLocation}
                        onChange={setPickupLocation}
                        placeholder="Indore"
                      />
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                      <LocationAutocomplete
                        label="Drop-off Location"
                        value={dropoffLocation}
                        onChange={setDropoffLocation}
                        placeholder="Jaipur"
                      />
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pick-up Date
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-gray-100"
                        min={formattedDate}
                      />
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pick-up Time
                      </label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-gray-100"
                      />
                    </div>
                    <button
                      onClick={handleBooking}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-800 to-blue-900 text-white font-semibold rounded-md hover:from-blue-700 hover:to-blue-900 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm sm:text-base"
                    >
                      Search Car
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UserCarousel />

        {/* Features Section with Cards */}
        <div className="py-1 sm:py-2 mt-20 md:py-1 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                Why Choose Us
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Experience the best in luxury car services
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-blue-600 mb-3 sm:mb-4">
                      {card.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer />

        {/* WhatsApp Logo with Scroll-to-Top functionality */}
        <Logo
          whatsappNumber="971XXXXXXXX" // Replace with your actual WhatsApp number (without +)
          message="Hello, I'm interested in booking a car!"
        />
      </div>
    </>
  );
}

export default User;

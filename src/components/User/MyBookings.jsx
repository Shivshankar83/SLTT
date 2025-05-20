import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import Footer from "../common/Footer";
import { generateBookingsExcel } from "../common/ExcelUtils";
import { FaCar, FaRoute, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

const MyBookings = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateIcons, setAnimateIcons] = useState(false);

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/bookings`
        );

        // Updated parsing logic to match the new response structure
        const bookingsArray = response.data.data ? response.data.data : [];

        setBookingsData(bookingsArray);
        setError(null);
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load booking data. Please try again later."
        );
        setBookingsData([]); // Ensure bookingsData is an array even on error
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsData();

    // Trigger header animation after component mounts
    setTimeout(() => {
      setAnimateHeader(true);
    }, 100);

    // Trigger icons animation with a slight delay
    setTimeout(() => {
      setAnimateIcons(true);
    }, 600);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";

    // Handle time format (assuming HH:MM:SS)
    const timeParts = timeString.split(":");
    if (timeParts.length < 2) return timeString;

    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${hours}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handler for downloading Excel file
  const handleDownloadExcel = () => {
    if (bookingsData.length === 0) {
      return;
    }

    setDownloading(true);
    try {
      const success = generateBookingsExcel(bookingsData, "my-bookings");
      if (success) {
        // Show toast or success message if needed
      }
    } catch (err) {
      console.error("Error downloading excel:", err);
      // Show error toast or message if needed
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <>
        <UserNavbar />
        <div className="w-full flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserNavbar />
        <div className="w-full px-5 py-10 text-center">
          <div className="p-6 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="mt-2 text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <UserNavbar />

      {/* Professional Animated Header Section */}
      <header className="relative h-48 overflow-hidden mt-14">
        {/* Primary gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 transform transition-all duration-1000 ease-out ${
            animateHeader ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        {/* Animated overlay with elegant design */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/30 to-transparent transform transition-transform duration-1200 ${
            animateHeader ? "translate-y-0" : "-translate-y-full"
          }`}
        ></div>

        {/* Curved Road Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          {/* Road */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-800"></div>

          {/* Road markings */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-12">
            <div className="w-10 h-2 bg-yellow-400"></div>
            <div className="w-10 h-2 bg-yellow-400"></div>
            <div className="w-10 h-2 bg-yellow-400"></div>
            <div className="w-10 h-2 bg-yellow-400"></div>
            <div className="w-10 h-2 bg-yellow-400"></div>
          </div>
        </div>

        {/* Animated Car */}
        <div
          className={`absolute bottom-8 transform transition-all duration-2000 ease-out ${
            animateHeader ? "left-3/4" : "-left-20"
          }`}
        >
          <div className="text-white text-4xl">
            <FaCar />
          </div>
        </div>

        {/* Animated Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-16 overflow-hidden">
          {/* Calendar Icon */}
          <div
            className={`transform transition-all duration-1000 ease-out ${
              animateIcons
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
              <FaCalendarAlt className="text-white text-2xl" />
            </div>
          </div>

          {/* Route Icon */}
          <div
            className={`transform transition-all duration-1000 ease-out ${
              animateIcons
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
              <FaRoute className="text-white text-2xl" />
            </div>
          </div>

          {/* Map Icon */}
          <div
            className={`transform transition-all duration-1000 ease-out ${
              animateIcons
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
              <FaMapMarkerAlt className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Elegant pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E')",
          }}
        ></div>

        {/* Header Content */}
        <div
          className={`relative z-10 flex flex-col items-center justify-center h-full px-8 transition-all duration-1000 transform ${
            animateHeader
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white tracking-tight">
            Your Travel Plans
          </h1>
          <div
            className="w-24 h-1 bg-white rounded mb-4 transition-all duration-1000 transform"
            style={{
              width: animateHeader ? "6rem" : "0",
              transitionDelay: "500ms",
            }}
          ></div>
        </div>
      </header>

      <div className="w-full px-5 md:px-10 py-2">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-teal-800 border-b-4 border-teal-600 pb-2">
            My Bookings
          </h1>

          {/* Download Button */}
          <button
            onClick={handleDownloadExcel}
            disabled={downloading || bookingsData.length === 0}
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all ${
              downloading || bookingsData.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            }`}
          >
            {downloading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                Download Excel
              </>
            )}
          </button>
        </div>

        {bookingsData.length === 0 ? (
          <div className="w-full px-5 py-10 text-center">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">
                No Bookings Found
              </h3>
              <p className="mt-2 text-gray-600">
                You don't have any bookings yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingsData.map((booking) => (
              <div
                key={booking.bookingId}
                className="w-full rounded-lg shadow-md border border-gray-300 p-4 bg-white transition-transform duration-300 hover:shadow-xl flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-md aspect-[16/9] flex items-center justify-center">
                  <img
                    src={
                      "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJtd3xlbnwwfHwwfHx8MA%3D%3D"
                    }
                    alt={`${booking.carMake} ${booking.carModel}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/400x225?text=${booking.carMake}+${booking.carModel}`;
                    }}
                  />
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status || "N/A"}
                  </span>
                  <span className="absolute top-2 left-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded border border-black/20 shadow-sm">
                    {booking.carMake.toUpperCase()}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {booking.carMake} {booking.carModel}
                  </h2>

                  {/* Booking Details */}
                  <div className="text-gray-600 text-sm my-3">
                    <div className="mb-2">
                      <span className="font-medium">Booking ID: </span>
                      <span>#{booking.bookingId}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Pickup Date: </span>
                      <span>{formatDate(booking.pickupDate)}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Pickup Time: </span>
                      <span>{formatTime(booking.pickupTime)}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Pickup Location: </span>
                      <span>{booking.pickupLocation || "N/A"}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Destination: </span>
                      <span>{booking.destination || "N/A"}</span>
                    </div>
                    {booking.driverName && (
                      <div className="mb-2">
                        <span className="font-medium">Driver: </span>
                        <span>{booking.driverName}</span>
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="font-medium">Contact: </span>
                      <span>{booking.riderMobile || "N/A"}</span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyBookings;

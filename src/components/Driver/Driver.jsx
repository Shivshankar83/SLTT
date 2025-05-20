import React, { useState, useEffect, useCallback } from "react";
import DriverNavbar from "./DriverNavbar";
import Footer from "../common/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../common/Logo";
import { useAppSelector } from '../../redux/hooks';
import { selectUsername } from '../../redux/features/userSlice';
import Header from "./Header";
import Main from "./Main";

const Driver = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateCar, setAnimateCar] = useState(false);
  const [showSpeedometer, setShowSpeedometer] = useState(false);

  // Get username from Redux
  const username = useAppSelector(selectUsername);

  // Create a reusable function to fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`);

      // Check for non-200 responses
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();

      // Check for API success response
      if (result.success) {
        setBookings(result.data || []);
      } else {
        throw new Error(result.message || "Failed to fetch bookings");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Failed to load bookings. Please try again later.");
      toast.error("Failed to load ride requests. Please refresh the page.");
      setLoading(false);
    }
  }, []);

  // Initial loading and animations
  useEffect(() => {
    fetchBookings();

    // Trigger animations sequentially
    setTimeout(() => {
      setAnimateHeader(true);
    }, 100);

    setTimeout(() => {
      setAnimateCar(true);
    }, 500);

    setTimeout(() => {
      setShowSpeedometer(true);
    }, 1000);

    // Set up polling for real-time updates (every 10 seconds)
    const intervalId = setInterval(() => {
      fetchBookings();
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchBookings]);

  // Handle booking updates from the RideRequest component
  const handleBookingUpdate = (updatedBooking) => {
    setBookings(
      bookings.map((booking) =>
        booking.bookingId === updatedBooking.bookingId ? updatedBooking : booking
      )
    );

    // Refresh bookings to get the latest status from the server
    fetchBookings();
  };

  // Count pending bookings
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending" || booking.status === "PENDING"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Toaster Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Fixed Navbar */}
      <DriverNavbar />

      {/* Main Content - Everything below navbar */}
      <div className="pt-16">
        <Header
          username={username}
          pendingBookings={pendingBookings}
          animateHeader={animateHeader}
          animateCar={animateCar}
          showSpeedometer={showSpeedometer}
          fetchBookings={fetchBookings}
        />
        <Main
          bookings={bookings}
          loading={loading}
          error={error}
          fetchBookings={fetchBookings}
          handleBookingUpdate={handleBookingUpdate}
        />
      </div>

      {/* Footer */}
      <Footer />

      <Logo
        whatsappNumber="918349762192" // Replace with your actual WhatsApp number (without +)
        message="Hello, I'm interested in booking a car!"
      />

      {/* Add necessary CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Driver;



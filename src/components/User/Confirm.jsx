import React from "react";
import { CheckCircle, Home, Clock } from "lucide-react";
import UserNavbar from "./UserNavbar";
import Footer from "../common/Footer";
import { useLocation, useNavigate } from "react-router-dom";

export default function Confirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;

  // If no booking data is available, redirect to home
  React.useEffect(() => {
    if (!bookingData) {
      navigate("/home");
    }
  }, [bookingData, navigate]);

  // If data is still loading or not available
  if (!bookingData) {
    return (
      <>
        <UserNavbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="animate-pulse flex flex-col items-center p-10">
            <div className="h-16 w-16 bg-blue-200 rounded-full mb-4"></div>
            <div className="h-6 w-48 bg-blue-200 rounded mb-6"></div>
            <div className="h-4 w-64 bg-blue-100 rounded"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const {
    bookingId,
    userName,
    carMake,
    carModel,
    pickupLocation,
    destination,
    pickupDate,
    pickupTime,
    riderMobile,
    totalPayment,
    status
  } = bookingData;

  // Format date and time for display
  const formattedDate = new Date(pickupDate).toLocaleDateString();
  const formattedTime = new Date(`2000-01-01T${pickupTime}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <>
      <UserNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4 md:p-6 font-sans">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden mt-10 mb-10 border border-gray-100">
          {/* Header section with success icon */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-8 px-6 flex flex-col items-center">
            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
              <CheckCircle className="text-white w-12 h-12" strokeWidth={2.5} />
            </div>
            <h1 className="text-white text-2xl font-bold mt-4 tracking-tight">
              Booking Confirmed!
            </h1>
            <p className="text-green-50 mt-1 font-medium">Your ride is scheduled</p>
          </div>

          {/* Content section */}
          <div className="p-8">
            {/* Order ID */}
            <div className="flex justify-between items-center mb-6 border-b border-dashed border-gray-200 pb-4">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">BOOKING ID</p>
                <p className="text-gray-800 text-xl font-bold font-mono">{bookingId}</p>
              </div>
              <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {status}
              </div>
            </div>

            {/* Booking details */}
            <div className="mb-6 bg-gray-50 p-5 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-indigo-100 p-1.5 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                Booking Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Car</p>
                  <p className="text-gray-900 font-medium">{carMake} {carModel}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">From</p>
                  <p className="text-gray-900 font-medium max-w-[60%] text-right">{pickupLocation}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">To</p>
                  <p className="text-gray-900 font-medium max-w-[60%] text-right">{destination}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Date</p>
                  <p className="text-gray-900 font-medium">{formattedDate}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Time</p>
                  <p className="text-gray-900 font-medium">{formattedTime}</p>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <p className="text-gray-900 font-semibold">Fare</p>
                  <p className="text-gray-900 font-bold">₹{totalPayment}</p>
                </div>
              </div>
            </div>

            {/* Driver confirmation */}
            <div className="flex items-center mb-6 bg-blue-50 p-4 rounded-xl">
              <div className="mr-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="text-blue-600 w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-gray-800 font-medium text-sm">
                  Driver details will be provided shortly
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Usually within 30 minutes of booking
                </p>
              </div>
            </div>

            {/* SMS confirmation */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-8 border border-indigo-100">
              <div className="flex items-start">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 text-sm font-medium">
                    Driver details will be sent to:
                  </p>
                  <p className="text-indigo-700 text-sm font-bold mt-1">
                    {riderMobile}
                  </p>
                </div>
              </div>
            </div>

            {/* Thank you message */}
            <div className="text-center mb-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 font-medium">
                Thank you for your booking, {userName}!
              </p>
              <p className="text-gray-500 text-sm mt-1">
                We're preparing your ride. We look forward to serving you.
              </p>
            </div>

            {/* Home button */}
            <button
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 rounded-xl text-white font-medium flex items-center justify-center transition duration-300 shadow-lg shadow-blue-500/20"
              onClick={() => navigate("/home")}
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </button>
          </div>
        </div>

        {/* Help info */}
        <div className="flex items-center justify-center space-x-2 mb-8 text-gray-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Need help? Contact support at <span className="text-indigo-600 font-medium">support@example.com</span></p>
        </div>
      </div>
      <Footer />
    </>
  );
}

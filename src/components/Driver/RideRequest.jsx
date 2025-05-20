import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RideRequest = ({ booking, onBookingUpdate }) => {
  const [actionType, setActionType] = useState(null); // 'accept' or 'reject'
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const driverId = 2; // Default driver ID

  const handleAccept = async () => {
    // Confirm before proceeding
    if (!window.confirm("Are you sure you want to accept this ride?")) {
      return;
    }

    setActionType("accept");
    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/driver/booking/${
        booking.bookingId
      }/approve/${driverId}`;

      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      // Check if the response contains the updated booking data
      if (response.status === 200) {
        // Use the response data to update the booking
        const updatedBooking = {
          ...booking,
          ...response.data,
          status: response.data.status || "APPROVED"
        };
        
        onBookingUpdate(updatedBooking);
        setRequestStatus({
          success: true,
          message: "Ride accepted successfully!",
        });

        // Show toast notification
        toast.success("Ride accepted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error("Unable to process request");
      }
    } catch (error) {
      console.error("Error accepting ride:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to accept ride. Please try again.";

      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 500) {
          errorMessage = "Server error: This driver may not have permission to accept this ride.";
        } else {
          errorMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }

      setRequestStatus({
        success: false,
        message: errorMessage,
      });

      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const handleReject = async () => {
    // Confirm before proceeding
    if (!window.confirm("Are you sure you want to reject this ride?")) {
      return;
    }

    setActionType("reject");
    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/driver/booking/${
        booking.bookingId
      }/cancel/${driverId}`;

      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      // Check if response contains the updated booking data
      if (response.status === 200) {
        // Use the response data to update the booking if available
        const updatedBooking = {
          ...booking,
          ...response.data,
          status: response.data.status || "CANCELLED"
        };
        
        onBookingUpdate(updatedBooking);
        setRequestStatus({
          success: true,
          message: "Ride rejected successfully!",
        });

        // Show toast notification
        toast.info("Ride rejected successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error("Unable to process request");
      }
    } catch (error) {
      console.error("Error rejecting ride:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to reject ride. Please try again.";

      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 500) {
          errorMessage = "Server error: This driver may not have permission to reject this ride.";
        } else {
          errorMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }

      setRequestStatus({
        success: false,
        message: errorMessage,
      });

      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  // Format date to a user-friendly format
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format time removing seconds if available
  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    return timeString.substring(0, 5); // HH:MM format
  };

  return (
    <div className="w-80 h-[520px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col font-inter">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Ride Request</h1>
            <p className="text-xs opacity-90">ID: #{booking.bookingId}</p>
          </div>
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
              booking.status === "BOOKED"
                ? "bg-blue-200 text-blue-800"
                : booking.status === "APPROVED"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {booking.status}
          </span>
        </div>
      </div>

      {/* Ride details - fixed height with scroll if needed */}
      <div className="p-4 flex-grow overflow-y-auto min-h-0">
        {/* Timer indicator for BOOKED status */}
        {booking.status === "BOOKED" && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
          </div>
        )}

        {/* Vehicle info */}
        <div className="flex items-center mb-3">
          <div className="bg-gradient-to-br from-gray-200 to-gray-100 rounded-full p-2 mr-3 flex-shrink-0 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-sm text-gray-700">Vehicle</h2>
            <p className="text-gray-600 text-sm truncate capitalize">
              {booking.carMake || "Not specified"} {booking.carModel || ""}
            </p>
          </div>
        </div>

        {/* User info - Always show section, use placeholder text if no data */}
        <div className="flex items-center mb-3">
          <div className="bg-gradient-to-br from-gray-200 to-gray-100 rounded-full p-2 mr-3 flex-shrink-0 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-sm text-gray-700">Passenger</h2>
            <p className="text-gray-600 text-sm truncate">
              {booking.riderMobile || "Not specified"}
            </p>
            {booking.userName && (
              <p className="text-gray-500 text-xs truncate">
                {booking.userName}
              </p>
            )}
          </div>
        </div>

        {/* Journey details */}
        <div className="space-y-4 mb-3">
          {/* Pickup */}
          <div className="flex">
            <div className="mr-3 pt-1 flex-shrink-0">
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
              </div>
              <div className="h-8 w-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-gray-500">PICKUP</p>
              <p className="font-medium text-sm truncate text-gray-700">
                {booking.pickupLocation || "Not specified"}
              </p>
            </div>
          </div>

          {/* Dropoff */}
          <div className="flex">
            <div className="mr-3 pt-1 flex-shrink-0">
              <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-gray-500">DROP-OFF</p>
              <p className="font-medium text-sm truncate text-gray-700">
                {booking.destination || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Date and Time - Always show section */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-sm text-gray-700">
                {formatDate(booking.pickupDate)} at{" "}
                {formatTime(booking.pickupTime)}
              </p>
              {booking.additionalNotes && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Note: {booking.additionalNotes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment info - Always show section with default values if needed */}
        <div className="mb-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-gray-700">Payment</span>
            <span className="font-bold text-blue-700">
              ${booking.totalPayment ? parseFloat(booking.totalPayment).toFixed(2) : '0.00'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {booking.paymentMethod || "Payment method not specified"}
          </p>
        </div>

        {/* Status message */}
        {requestStatus && (
          <div
            className={`p-2 rounded-md text-sm ${
              requestStatus.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {requestStatus.message}
          </div>
        )}
      </div>

      {/* Footer with buttons - fixed height */}
      <div className="p-4 border-t border-gray-100">
        {/* Action buttons - only show for BOOKED status */}
        {booking.status === "BOOKED" && (
          <div className="flex space-x-3">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 bg-white border border-red-500 text-red-500 font-medium rounded-lg transition text-sm ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
              }`}
            >
              {isLoading && actionType === "reject" ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500"
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
                  Processing
                </span>
              ) : (
                "Reject"
              )}
            </button>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 bg-green-500 text-white font-medium rounded-lg transition text-sm ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
              }`}
            >
              {isLoading && actionType === "accept" ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Processing
                </span>
              ) : (
                "Accept"
              )}
            </button>
          </div>
        )}

        {/* Status messages for non-BOOKED statuses */}
        {booking.status !== "BOOKED" && (
          <div className="p-2 bg-gray-50 rounded-lg text-center">
            <span
              className={`text-sm font-medium ${
                booking.status === "APPROVED"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {booking.status === "APPROVED"
                ? "You approved this booking"
                : "This booking was cancelled"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideRequest;
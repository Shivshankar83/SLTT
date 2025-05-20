import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserNavbar from "./UserNavbar";
import Footer from "../common/Footer";
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectEmail, selectIsAuthenticated, selectUserId } from '../../redux/features/userSlice';

const Booked = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    carId: "",
    totalPayment: 100, // Default value
    distanceKm: 10, // Default value
  });

  const navigate = useNavigate();
  const location = useLocation();
  const email = useAppSelector(selectEmail);
  const userId = useAppSelector(selectUserId);
  // Extract query parameters and validate required fields
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pickup = searchParams.get("pickup") || "";
    const dropoff = searchParams.get("dropoff") || "";
    const date = searchParams.get("date") || "";
    const time = searchParams.get("time") || "";
    const carId = searchParams.get("carId") || "";
    
    // Check if all required fields are provided
    if (!pickup || !dropoff || !date || !time) {
      toast.error("Please fill in all fields: pickup location, drop-off location, date and time", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Navigate back after showing error
      navigate(-1);
      return;
    }
    
    setBookingDetails(prevState => ({
      ...prevState,
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      pickupDate: date,
      pickupTime: time,
      carId: carId ? parseInt(carId, 10) : ""
    }));

    // If carId exists, fetch car details
    if (carId) {
      fetchCarDetails(carId);
    } else {
      toast.error("Car ID is missing", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(-1);
    }
  }, [location, navigate]);

  const fetchCarDetails = async (carId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars/${carId}`);
      setCarDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching car details:", error);
      setLoading(false);
      toast.error("Failed to load car details", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
    setPhoneNumber(value);
  };

  const handleUpdateProfile = () => {
    // Validate phone number (10 digits)
    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number", {
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
    
    setIsProfileUpdated(true);
    toast.success("Phone number updated successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      
      // Prepare booking data according to API requirements
      const bookingData = {
        carId: bookingDetails.carId,
        pickupLocation: bookingDetails.pickupLocation,
        destination: bookingDetails.dropoffLocation,
        userId: userId, 
        userName : email,
        totalPayment: bookingDetails.totalPayment,
        distanceKm: bookingDetails.distanceKm,
        pickupDate: bookingDetails.pickupDate,
        pickupTime: bookingDetails.pickupTime,
        riderMobile: phoneNumber
      };
      console.log("Booking data before sending:", bookingData);
      // Send POST request to booking API
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, bookingData);
      
      // Check if response is successful
      if (response.data && response.data.success) {
        console.log("Booking confirmed:", response.data);
        setLoading(false);
        
        toast.success(response.data.message || "Booking confirmed successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        navigate("/confirm", { 
          state: { 
            bookingData: response.data.data 
          } 
        });
      } else {
        throw new Error(response.data.message || "Failed to confirm booking");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to confirm booking. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
    <UserNavbar />
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-lg mt-16 border border-gray-200">
        {!isProfileUpdated ? (
          // Phone Number Update Form
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Update Your Mobile Number
            </h2>
            <p className="text-gray-600 text-center mb-6 font-sans">
              To continue with your booking, please provide your contact number
            </p>

            {/* Phone Input Field */}
            <div className="flex mb-6">
              {/* Country Code Field */}
              <div className="w-1/4 mr-1">
                <input
                  type="text"
                  value="+91"
                  disabled
                  className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700 font-sans"
                  aria-label="Country Code"
                />
              </div>

              {/* Phone Number Field */}
              <div className="w-3/4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-700 font-sans"
                  aria-label="Phone Number"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdateProfile}
              className="w-full py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors font-medium font-sans"
            >
              Update Profile
            </button>
          </div>
        ) : (
          // Booking Details After Profile Update
          <div className="p-6 bg-white">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 font-sans">
              Confirm Your Booking
            </h2>

            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600 font-sans">Processing your request...</p>
              </div>
            ) : (
              <>
                {/* Car Details */}
                {carDetails && (
                  <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <img
                        src={"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D"}
                        alt={`${carDetails.make} ${carDetails.model}`}
                        className="h-32 object-contain rounded-md"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-center text-gray-800 font-sans">
                      {carDetails.make} {carDetails.model}
                    </h3>
                  </div>
                )}

                {/* Booking Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 font-sans">Pickup Location</p>
                      <p className="text-base font-semibold text-gray-800 font-sans">{bookingDetails.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 font-sans">Destination</p>
                      <p className="text-base font-semibold text-gray-800 font-sans">{bookingDetails.dropoffLocation}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 font-sans">Date</p>
                        <p className="text-base font-semibold text-gray-800 font-sans">{bookingDetails.pickupDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 font-sans">Time</p>
                        <p className="text-base font-semibold text-gray-800 font-sans">{bookingDetails.pickupTime}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 font-sans">Contact Number</p>
                      <p className="text-base font-semibold text-gray-800 font-sans">{phoneNumber}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 font-sans">Distance</p>
                        <p className="text-base font-semibold text-gray-800 font-sans">{bookingDetails.distanceKm} km</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 font-sans">Payment</p>
                        <p className="text-base font-semibold text-gray-800 font-sans">₹{bookingDetails.totalPayment}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="w-full py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed font-sans"
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Booked;
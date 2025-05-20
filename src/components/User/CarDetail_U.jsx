import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserNavbar from "./UserNavbar";
import Footer from "../common/Footer";

const CarDetail_U = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [carDetail, setCarDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const pickupLocation = queryParams.get("pickup") || "";
  const dropoffLocation = queryParams.get("dropoff") || "";
  const pickupDate = queryParams.get("date") || "";
  const pickupTime = queryParams.get("time") || "";

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/cars/${id}`
        );

        if (response.data && response.data.success) {
          setCarDetail(response.data.data);
          setError(null);
        } else {
          setError(response.data?.message || "Failed to load car details.");
        }
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError(
          err.response?.data?.message ||
            "Car not found or server error. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetail();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to previous page
  };

  // Validate required fields
  const validateFields = () => {
    if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime) {
      toast.error(
        "Please fill in all fields: pickup location, drop-off location, date and time",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return false;
    }
    return true;
  };

  const handleBookNow = (carId) => {
    // Validate fields before navigation
    if (!validateFields()) return;

    // Create URL parameters including car ID and search data
    const params = new URLSearchParams();
    params.set("pickup", pickupLocation);
    params.set("dropoff", dropoffLocation);
    params.set("date", pickupDate);
    params.set("time", pickupTime);
    params.set("carId", carId);

    navigate(`/book?${params.toString()}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString()
      : "N/A";
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen py-8 flex justify-center items-center font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !carDetail) {
    return (
      <div className="w-full bg-gray-50 min-h-screen py-8 font-sans">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-black mb-6 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to listings</span>
          </button>

          <div className="p-6 bg-red-50 rounded-lg shadow-md border border-red-100">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="mt-2 text-red-700">{error || "Car not found"}</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                View All Cars
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if maintenance history exists and is an array
  const maintenanceHistory = carDetail.maintenanceHistory || [];
  // Filter out maintenance records with null dates if needed
  const validMaintenanceHistory = maintenanceHistory.filter(
    (record) => record && record.date
  );

  return (
    <>
      <UserNavbar />
      <div className="w-full bg-gray-50 min-h-screen py-8 mt-16 font-sans">
        {/* Container with increased width to use more space */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-black mb-6 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to listings</span>
          </button>

          {/* Hero Section with Car Image and Title */}
          <div className="mb-8 relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="flex flex-col md:flex-row">
              {/* Car Image - Takes more screen width */}
              <div className="w-full md:w-2/3 h-72 sm:h-80 md:h-96 lg:h-112 relative">
                <img
                  src={
                    "https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxleHVzfGVufDB8fDB8fHww"
                  }
                  alt={`${carDetail.make} ${carDetail.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/800x400?text=${carDetail.make}+${carDetail.model}`;
                  }}
                />
                {/* Model tag with consistent positioning */}
                <div className="absolute top-0 left-0 m-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md">
                  <span className="font-semibold text-sm sm:text-base">
                    {carDetail.model}
                  </span>
                </div>
              </div>

              {/* Car Title and Quick Info */}
              <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-center">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  {carDetail.make} {carDetail.model}
                </h1>

                {/* Key Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <div>
                      <span className="text-gray-300">Insurance:</span>
                      <span className="ml-2 font-medium">
                        {carDetail.insurance?.provider || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <span className="text-gray-300">Rate:</span>
                      <span className="ml-2 font-medium">
                        ₹{carDetail.ratePerKm || 0}/km
                        {carDetail.discountRatePerKm > 0 && (
                          <span className="ml-1 text-green-400 text-sm">
                            (₹{carDetail.discountRatePerKm} off)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-gray-300">Location Available</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-gray-300">
                      {validMaintenanceHistory.length} Maintenance Records
                    </span>
                  </div>
                </div>

                {/* Book Now Button */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleBookNow(carDetail.carId)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Details Grid - Now with 3 columns for better space usage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Insurance Information */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Insurance Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Provider:</span>
                  <span className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-md">
                    {carDetail.insurance?.provider || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">
                    Policy Number:
                  </span>
                  <span className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-md">
                    {carDetail.insurance?.policyNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">
                    Expiry Date:
                  </span>
                  <span className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-md">
                    {formatDate(carDetail.insurance?.expiry)}
                  </span>
                </div>
                <div className="mt-6 pt-3 border-t border-gray-200 flex justify-end">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      carDetail.insurance?.expiry &&
                      new Date(carDetail.insurance.expiry) > new Date()
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {carDetail.insurance?.expiry &&
                    new Date(carDetail.insurance.expiry) > new Date()
                      ? "Active"
                      : "Expired"}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Location Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-600 font-medium">Address:</span>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md font-medium text-gray-900">
                    {carDetail.location?.address || "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 font-medium">Latitude:</span>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md font-medium text-gray-900 overflow-x-auto">
                      {carDetail.location?.latitude || "N/A"}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">
                      Longitude:
                    </span>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md font-medium text-gray-900 overflow-x-auto">
                      {carDetail.location?.longitude || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-3 border-t border-gray-200">
                  <button
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${carDetail.location?.latitude},${carDetail.location?.longitude}`,
                        "_blank"
                      )
                    }
                    className="w-full inline-flex items-center justify-center p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    disabled={
                      !carDetail.location?.latitude ||
                      !carDetail.location?.longitude
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    View on Map
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Information Panel (replacing Additional Info) */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Booking Details
              </h2>

              <div className="mb-6 flex flex-col">
                <div className="flex items-center bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="bg-green-500 text-white p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Pickup Location
                    </h3>
                    <p className="text-sm text-gray-600">
                      {pickupLocation || "Not specified yet"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="bg-blue-500 text-white p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Drop-off Location
                    </h3>
                    <p className="text-sm text-gray-600">
                      {dropoffLocation || "Not specified yet"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                  <div className="bg-purple-500 text-white p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Pickup Date & Time
                    </h3>
                    <p className="text-sm text-gray-600">
                      {pickupDate ? `${pickupDate}` : "Not specified yet"}
                      {pickupTime ? ` at ${pickupTime}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleBookNow(carDetail.carId)}
                  className="w-full inline-flex items-center justify-center p-3 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Proceed to Booking
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance History Card - Take full width */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  // Continuing from where the first file ended
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Maintenance History
              </h2>
            </div>

            {validMaintenanceHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>No maintenance records available for this vehicle.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost (₹)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Labor Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {validMaintenanceHistory.map((record, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">
                            {record.description || "N/A"}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Parts:{" "}
                            {record.partsUsed && record.partsUsed.length > 0
                              ? record.partsUsed.join(", ")
                              : "None"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.vendor || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(record.cost || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.laborHours || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Buttons - Sticky footer - Only Book Now button for user view */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md px-4 py-3 z-10">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
              <button
                onClick={handleBackClick}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Listings
              </button>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleBookNow(carDetail.carId)}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Book Now
                </button>
              </div>
            </div>
          </div>
          {/* Spacer for the sticky footer */}
          <div className="h-20"></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CarDetail_U;

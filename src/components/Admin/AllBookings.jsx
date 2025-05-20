import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import Footer from "../common/Footer";
import { generateBookingsExcel } from "../common/ExcelUtils";
import { FaFileExcel, FaSearch, FaFilter, FaCar, FaUserPlus, FaCarAlt, FaExclamationCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllBookings = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`);
        
        if (response.data && response.data.success) {
          setBookingsData(response.data.data || []);
        } else {
          throw new Error(response.data?.message || "Failed to fetch bookings");
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load booking data. Please try again later.");
        toast.error("Failed to load bookings. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsData();

    // Trigger header animation after component mounts
    setTimeout(() => {
      setAnimateHeader(true);
    }, 100);
  }, []);

  // Navigation handlers
  const handleAddDriver = () => {
    navigate("/adddriver");
  };

  const handleAddCar = () => {
    navigate("/addcar");
  };

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
      toast.warning("No booking data available to export");
      return;
    }

    setDownloading(true);
    try {
      const success = generateBookingsExcel(bookingsData, "car-bookings");
      if (success) {
        toast.success("Excel file downloaded successfully");
      }
    } catch (err) {
      console.error("Error downloading excel:", err);
      toast.error("Failed to download Excel file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Apply filters (search and status)
  const applyFilters = (bookings) => {
    return bookings.filter(booking => {
      // Apply search filter
      const matchesSearch = 
        (booking.carMake && booking.carMake.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.carModel && booking.carModel.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.driverName && booking.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.riderMobile && booking.riderMobile.includes(searchTerm)) ||
        (booking.pickupLocation && booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.destination && booking.destination.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply status filter
      const matchesStatus = 
        filterStatus === "all" || 
        (booking.status && booking.status === filterStatus);
      
      return matchesSearch && matchesStatus;
    });
  };

  // Get filtered bookings based on search and status
  const filteredBookings = applyFilters(bookingsData);

  // Status counts for statistics
  const bookedCount = bookingsData.filter(booking => booking.status === "BOOKED").length;
  const approvedCount = bookingsData.filter(booking => booking.status === "APPROVED").length;
  const completedCount = bookingsData.filter(booking => booking.status === "COMPLETED").length;
  const cancelledCount = bookingsData.filter(booking => booking.status === "CANCELLED").length;

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="flex justify-center items-center h-screen bg-gray-50 font-inter">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading bookings...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 font-inter">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        
        {/* Professional Admin Header */}
        <header className="relative bg-white shadow-md mt-18">
          {/* Top gradient accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="container mx-auto">
            {/* Main Header Content */}
            <div className={`py-8 px-6 transition-all duration-500 transform ${
              animateHeader ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-center">
                {/* Header Title and Description */}
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    Booking Management
                  </h1>
                  <p className="text-gray-500 font-medium mt-1">
                    Manage and monitor all car bookings
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={handleAddCar}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 font-medium"
                  >
                    <FaCarAlt className="mr-2" />
                    Add Car
                  </button>
                  
                  <button 
                    onClick={handleAddDriver}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 font-medium"
                  >
                    <FaUserPlus className="mr-2" />
                    Add Driver
                  </button>
                  
                  <button
                    onClick={handleDownloadExcel}
                    disabled={downloading || bookingsData.length === 0}
                    className={`flex items-center ${
                      downloading || bookingsData.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 font-medium`}
                  >
                    {downloading ? (
                      <>
                        <svg
                          className="animate-spin mr-2 h-5 w-5 text-white"
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
                        <FaFileExcel className="mr-2" />
                        Export Data
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Statistics Summary */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Total Bookings</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{bookingsData.length}</h3>
                  <p className="text-xs text-blue-600 mt-2">All time bookings</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow-sm border border-yellow-200">
                  <p className="text-sm text-yellow-700 font-medium">Booked</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{bookedCount}</h3>
                  <p className="text-xs text-yellow-600 mt-2">New bookings</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200">
                  <p className="text-sm text-green-700 font-medium">Approved</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{approvedCount}</h3>
                  <p className="text-xs text-green-600 mt-2">Ready for pickup</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Completed</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{completedCount}</h3>
                  <p className="text-xs text-blue-600 mt-2">Successfully completed</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Section */}
        <div className="container mx-auto px-4 py-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <div className="flex items-center w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <input
                  type="text"
                  placeholder="Search bookings by car, driver, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="px-4">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="md:w-56">
              <div className="flex items-center w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="BOOKED">Booked</option>
                  <option value="APPROVED">Approved</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <div className="px-4">
                  <FaFilter className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaExclamationCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Loading Bookings</h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-red-100 px-3 py-1 rounded-md text-red-800 hover:bg-red-200 text-sm font-medium transition-colors"
                    >
                      Refresh Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Grid */}
          {!error && bookingsData.length === 0 ? (
            <div className="w-full py-16 text-center">
              <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
                <div className="flex justify-center mb-4">
                  <FaCar className="text-gray-400 text-5xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Bookings Available
                </h3>
                <p className="text-gray-600 mb-6">
                  There are currently no car bookings in the system.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 font-medium"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          ) : !error && filteredBookings.length === 0 ? (
            <div className="w-full py-12 text-center">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
                <div className="flex justify-center mb-4">
                  <FaSearch className="text-gray-400 text-4xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600">
                  No bookings match your search criteria. Try adjusting your filters or search terms.
                </p>
                <div className="mt-4">
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          ) : !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="w-full rounded-lg shadow-md border border-gray-200 p-0 bg-white transition-transform duration-300 hover:shadow-xl flex flex-col h-full"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden rounded-t-lg aspect-[16/9] flex items-center justify-center">
                    <img
                      src={
                        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D"
                      }
                      alt={`${booking.carMake} ${booking.carModel}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/400x225?text=${booking.carMake || 'Car'}+${booking.carModel || ''}`;
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
                      {booking.carMake ? booking.carMake.toUpperCase() : "N/A"}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {booking.carMake || "Unknown Make"} {booking.carModel || "Unknown Model"}
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
                      <div className="mb-2">
                        <span className="font-medium">Customer: </span>
                        <span>{booking.userName || "N/A"}</span>
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
                      {booking.distanceKm && (
                        <div className="mb-2">
                          <span className="font-medium">Distance: </span>
                          <span>{booking.distanceKm} km</span>
                        </div>
                      )}
                      {booking.totalPayment && (
                        <div className="mb-2">
                          <span className="font-medium">Payment: </span>
                          <span>${booking.totalPayment}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mt-auto pt-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllBookings;
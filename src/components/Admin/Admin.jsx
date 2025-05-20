import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import Footer from "../common/Footer";
import {
  FaFileExcel,
  FaPlus,
  FaCarAlt,
  FaUserPlus,
  FaFilter,
} from "react-icons/fa";
import { generateCarsExcel } from "../common/ExcelUtils";
import axios from "axios";
import Logo from "../common/Logo";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalCars: 0,
    activeRentals: 0,
    availableCars: 0,
    totalRevenue: 0,
  });
  const [filter, setFilter] = useState("all");

  const userName = "Admin"; 
  const navigate = useNavigate();

  // Fetch car data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars`);
        
        // Handle the new response structure
        let carsData = [];
        if (response.data && response.data.success && response.data.data) {
          carsData = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          carsData = response.data;
        } else {
          carsData = [];
        }
        
        setCarData(carsData);
        setError(null);

        // Calculate statistics from the real data
        const totalCars = carsData.length;
        const activeRentals = carsData.filter(
          (car) => car.status === "rented"
        ).length;
        // const availableCars = carsData.filter(
        //   (car) => car.status === "available"
        // ).length;
        const availableCars = totalCars;

        const estimatedRevenue = await fetchRevenueData();

        setStatistics({
          totalCars,
          activeRentals,
          availableCars,
          totalRevenue: estimatedRevenue,
        });
      } catch (error) {
        console.error("Error fetching car data:", error);
        setError("Failed to load car data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Trigger header animation when component mounts
    setTimeout(() => {
      setAnimateHeader(true);
    }, 100);
  }, []);

  // Placeholder function to fetch revenue data - replace with actual API call
  const fetchRevenueData = async () => {
    try {
      return 12480;
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      return 0;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLatestMaintenance = (maintenanceHistory) => {
    if (!maintenanceHistory || maintenanceHistory.length === 0) {
      return { date: null };
    }
    
    // Filter out entries with null dates
    const validEntries = maintenanceHistory.filter(entry => entry.date);
    if (validEntries.length === 0) return { date: null };
    
    // Sort by date (newest first)
    return validEntries.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )[0];
  };

  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);

      const dataToExport =
        carData.length > 0
          ? carData
          : (await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars`)).data;

      // Handle the new response structure for export
      let carsToExport = [];
      if (dataToExport && dataToExport.success && dataToExport.data) {
        carsToExport = dataToExport.data;
      } else if (dataToExport && Array.isArray(dataToExport)) {
        carsToExport = dataToExport;
      }

      if (carsToExport && carsToExport.length > 0) {
        console.log("Preparing to export car data:", carsToExport);
        const success = generateCarsExcel(carsToExport, "complete-car-data");
        if (!success) {
          alert("Failed to generate Excel file. Please try again.");
        }
      } else {
        alert("No car data available to download");
      }
    } catch (err) {
      console.error("Error downloading Excel:", err);
      alert(
        "An error occurred while generating the Excel file: " + err.message
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddCar = () => {
    navigate("/addcar");
  };

  const handleAddDriver = () => {
    navigate("/adddriver");
  };

  const handleViewDetails = (carId) => {
    navigate(`/detailA/${carId}`);
  };

  const handleEditDetails = (carId) => {
    navigate(`/cars/edit/${carId}`);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Function to get the trend indicator and text
  const getTrendIndicator = (value, type) => {
    const trends = {
      totalCars: { value: 3, period: "month" },
      activeRentals: { value: 2, period: "week" },
      availableCars: { value: -1, period: "yesterday" },
      totalRevenue: { value: 8, period: "month", isPercentage: true },
    };

    const trend = trends[type];

    if (trend.value > 0) {
      return {
        text: `+${
          trend.isPercentage ? trend.value + "%" : trend.value
        } since last ${trend.period}`,
        color: "text-green-600",
      };
    } else if (trend.value < 0) {
      return {
        text: `${trend.value} since ${trend.period}`,
        color: "text-red-600",
      };
    }
    return {
      text: `No change since last ${trend.period}`,
      color: "text-gray-600",
    };
  };

  // Filter cars based on selected filter
  const filteredCars = filter === "all" 
    ? carData 
    : carData.filter(car => car.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <AdminNavbar />

      {/* Professional Admin Header */}
      <header className="relative bg-white shadow-md mt-18">
        {/* Top gradient accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-indigo-700"></div>

        <div className="container mx-auto">
          {/* Main Header Content */}
          <div
            className={`py-8 px-6 transition-all duration-500 transform ${
              animateHeader
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Welcome Section */}
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight font-poppins">
                  Welcome back,{" "}
                  <span className="text-blue-600">{userName}</span>
                </h1>
                <p className="text-gray-500 font-medium mt-1 font-poppins">
                  Manage your inventory and monitor business performance
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddCar}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 font-medium font-poppins"
                >
                  <FaCarAlt className="mr-2" />
                  Add Car
                </button>

                <button
                  onClick={handleAddDriver}
                  className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 font-medium font-poppins"
                >
                  <FaUserPlus className="mr-2" />
                  Add Driver
                </button>

                <button
                  onClick={handleDownloadExcel}
                  disabled={isDownloading}
                  className={`flex items-center ${
                    isDownloading
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 font-medium font-poppins`}
                >
                  <FaFileExcel className="mr-2" />
                  {isDownloading ? "Downloading..." : "Export Data"}
                </button>
              </div>
            </div>

            {/* Statistics Summary using real data */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Cars */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
                <p className="text-sm text-blue-700 font-medium font-poppins">
                  Total Cars
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1 font-poppins">
                  {loading ? "..." : statistics.totalCars}
                </h3>
                {!loading && (
                  <p
                    className={`text-xs ${
                      getTrendIndicator(statistics.totalCars, "totalCars").color
                    } mt-2 font-poppins`}
                  >
                    {getTrendIndicator(statistics.totalCars, "totalCars").text}
                  </p>
                )}
              </div>

              {/* Active Rentals */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg shadow-sm border border-indigo-200">
                <p className="text-sm text-indigo-700 font-medium font-poppins">
                  Active Rentals
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1 font-poppins">
                  {loading ? "..." : statistics.activeRentals}
                </h3>
                {!loading && (
                  <p
                    className={`text-xs ${
                      getTrendIndicator(
                        statistics.activeRentals,
                        "activeRentals"
                      ).color
                    } mt-2 font-poppins`}
                  >
                    {
                      getTrendIndicator(
                        statistics.activeRentals,
                        "activeRentals"
                      ).text
                    }
                  </p>
                )}
              </div>

              {/* Available Cars */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
                <p className="text-sm text-purple-700 font-medium font-poppins">
                  Available Cars
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1 font-poppins">
                  {loading ? "..." : statistics.availableCars}
                </h3>
                {!loading && (
                  <p
                    className={`text-xs ${
                      getTrendIndicator(
                        statistics.availableCars,
                        "availableCars"
                      ).color
                    } mt-2 font-poppins`}
                  >
                    {
                      getTrendIndicator(
                        statistics.availableCars,
                        "availableCars"
                      ).text
                    }
                  </p>
                )}
              </div>

              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg shadow-sm border border-teal-200">
                <p className="text-sm text-teal-700 font-medium font-poppins">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1 font-poppins">
                  {loading ? "..." : formatCurrency(statistics.totalRevenue)}
                </h3>
                {!loading && (
                  <p
                    className={`text-xs ${
                      getTrendIndicator(statistics.totalRevenue, "totalRevenue")
                        .color
                    } mt-2 font-poppins`}
                  >
                    {
                      getTrendIndicator(statistics.totalRevenue, "totalRevenue")
                        .text
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4">
        {/* Cars Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3 font-poppins">
            Car Inventory
          </h2>

          <div className="md:w-56">
            <div className="flex items-center w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <select
                className="w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="all">All Cars</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div className="px-4">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Car Cards Section */}
        {loading ? (
          <div className="w-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="w-full px-5 py-10 text-center font-sans">
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
        ) : !carData || carData.length === 0 ? (
          <div className="w-full px-5 py-10 text-center font-sans">
            <div className="p-8 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
              <svg 
                className="mx-auto h-16 w-16 text-gray-400"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">No Cars Available</h3>
              <p className="mt-2 text-gray-600">There are currently no cars in the inventory.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full px-5 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div
                key={car.carId}
                className="w-full rounded-lg shadow-md border border-gray-300 p-4 bg-white transition-transform duration-300 hover:shadow-xl flex flex-col h-full"
              >
                <div className="relative overflow-hidden rounded-md aspect-[16/9] flex items-center justify-center">
                  <img
                    src={"https://imagecdnsa.zigwheels.ae/large/gallery/exterior/13/124/gmc-yukon-denali-front-angle-low-view-821729.jpg"}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/400x225?text=${car.make}+${car.model}`;
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded border border-black/20 shadow-sm">
                    {car.make ? car.make.toUpperCase() : 'UNKNOWN'}
                  </span>
                  
                  {car.status && (
                    <span className={`absolute top-2 right-2 ${
                      car.status === 'available' ? 'bg-green-500' : 
                      car.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white text-xs font-semibold px-2 py-1 rounded shadow-sm`}>
                      {car.status.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {car.make || 'Unknown'} {car.model || 'Model'}
                  </h2>

                  {/* Rate Information */}
                  <div className="flex justify-between items-center mt-2 mb-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Standard Rate</span>
                      <span className="font-medium">{formatCurrency(car.ratePerKm)}/km</span>
                    </div>
                    
                    {car.discountRatePerKm > 0 && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">Discount Rate</span>
                        <span className="font-medium text-green-600">{formatCurrency(car.discountRatePerKm)}/km</span>
                      </div>
                    )}
                  </div>

                  {/* Car Features */}
                  <div className="text-gray-600 text-sm my-3">
                    <div className="mb-2">
                      <span className="font-medium">Insurance: </span>
                      <span>{car.insurance?.provider || "N/A"}</span>
                      {car.insurance?.expiry && (
                        <span className="ml-1 text-xs text-gray-500">
                          (Expires: {formatDate(car.insurance.expiry)})
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Location: </span>
                      <span>{car.location?.address || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Last Maintenance: </span>
                      <span>{formatDate(getLatestMaintenance(car.maintenanceHistory)?.date)}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEditDetails(car.carId)}
                      className="bg-white text-black border border-black py-2 rounded-md flex items-center justify-center hover:bg-gradient-to-r hover:from-red-400 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                    >
                      <span className="font-semibold text-sm">EDIT DETAILS</span>
                    </button>
                    <button
                      onClick={() => handleViewDetails(car.carId)}
                      className="bg-white text-black border border-black py-2 rounded-md flex items-center justify-center hover:bg-gradient-to-r hover:from-red-400 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                    >
                      <span className="font-semibold text-sm">VIEW DETAILS</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />

      <Logo
        whatsappNumber="971XXXXXXXX" 
        message="Hello, I'm interested in booking a car!"
      />
    </div>
  );
}

export default Admin;
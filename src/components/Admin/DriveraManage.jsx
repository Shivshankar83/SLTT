import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaUserTie,
  FaPhone,
  FaIdCard,
  FaFileExcel,
  FaCarAlt,
  FaUserPlus,
  FaFilter,
  FaEye,
} from "react-icons/fa";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import Footer from "../common/Footer";
import { generateDriversExcel } from "../common/ExcelUtils";

const DriverManage = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch drivers data
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/drivers`
      );
      // Access the 'data' property from the response
      const driversData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      console.log("Fetched drivers:", driversData);
      setDrivers(driversData);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Failed to fetch drivers. Please try again later.");
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();

    // Trigger header animation
    const timer = setTimeout(() => {
      setAnimateHeader(true);
    }, 100);

    return () => clearTimeout(timer); // Cleanup timer
  }, [fetchDrivers]);

  // Handle delete driver
  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/drivers/${id}`
        );
        if (res.status === 200) {
          setDrivers((prev) => prev.filter((driver) => driver.id !== id));
          alert("Driver deleted successfully!");
        }
      } catch (err) {
        console.error("Error deleting driver:", err);
        alert("Failed to delete driver. Please try again.");
      }
    }
  }, []);

  // Handle edit navigation
  const handleEdit = useCallback(
    (driverId) => {
      navigate(`/drivers/edit/${driverId}`);
    },
    [navigate]
  );

  // Handle add driver navigation
  const handleAddDriver = useCallback(() => {
    navigate("/addDriver");
  }, [navigate]);

  // Handle add car navigation
  const handleAddCar = useCallback(() => {
    navigate("/addcar");
  }, [navigate]);

  const handleLocation = (id) => {
    console.log(id);
    navigate(`/admintrack/${id}`);
  };
  // Handle download Excel
  const handleDownloadExcel = useCallback(() => {
    try {
      const dataToExport = applyFilters(drivers);
      if (dataToExport.length === 0) {
        alert("No data available to download");
        return;
      }
      const success = generateDriversExcel(dataToExport);
      if (!success) {
        alert("Failed to generate Excel file. Please try again.");
      }
    } catch (err) {
      console.error("Error generating Excel:", err);
      alert("An error occurred while generating the Excel file.");
    }
  }, [drivers]);

  // Apply search and status filters
  const applyFilters = useCallback(
    (driversData) => {
      if (!Array.isArray(driversData)) {
        console.warn("Invalid drivers data provided to applyFilters");
        return [];
      }

      return driversData.filter((driver) => {
        if (!driver || typeof driver !== "object") return false;

        const matchesSearch =
          driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false ||
          driver.mobileNumber?.includes(searchTerm) ||
          false ||
          driver.licenseNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          false;

        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "available" && driver.available) ||
          (filterStatus === "unavailable" && !driver.available);

        return matchesSearch && matchesStatus;
      });
    },
    [searchTerm, filterStatus]
  );

  // Memoized filtered drivers
  const filteredDrivers = applyFilters(drivers);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="relative bg-white shadow-md mt-18">
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div className="container mx-auto">
            <div
              className={`py-8 px-6 transition-all duration-500 transform ${
                animateHeader
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    Driver Management
                  </h1>
                  <p className="text-gray-500 font-medium mt-1">
                    Manage your drivers and monitor availability status
                  </p>
                </div>
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
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 font-medium"
                  >
                    <FaFileExcel className="mr-2" />
                    Export Data
                  </button>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">
                    Total Drivers
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {drivers.length}
                  </h3>
                  <p className="text-xs text-blue-600 mt-2">
                    +2 since last month
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200">
                  <p className="text-sm text-green-700 font-medium">
                    Available Drivers
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {drivers.filter((driver) => driver.available).length}
                  </h3>
                  <p className="text-xs text-green-600 mt-2">
                    Ready for assignment
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow-sm border border-red-200">
                  <p className="text-sm text-red-700 font-medium">
                    Unavailable Drivers
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {drivers.filter((driver) => !driver.available).length}
                  </h3>
                  <p className="text-xs text-red-600 mt-2">Currently on duty</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <div className="flex items-center w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <input
                  type="text"
                  placeholder="Search drivers by name, mobile or license..."
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
                  <option value="all">All Drivers</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <div className="px-4">
                  <FaFilter className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                  <div
                    className={`h-1.5 ${
                      driver.available ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  ></div>
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[70%]">
                        {driver.name}
                      </h2>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          driver.available
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {driver.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center text-gray-700 group">
                        <FaPhone
                          className="mr-3 text-indigo-500 group-hover:text-indigo-600 transition-colors"
                          size={14}
                        />
                        <span className="text-sm">{driver.mobileNumber}</span>
                      </div>
                      <div className="flex items-center text-gray-700 group">
                        <FaIdCard
                          className="mr-3 text-indigo-500 group-hover:text-indigo-600 transition-colors"
                          size={14}
                        />
                        <span className="text-sm">{driver.licenseNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 border-t border-gray-100 gap-2">
                    <button
                      onClick={() => handleEdit(driver.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-xs font-medium flex-1"
                    >
                      <FaEdit size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-md hover:bg-rose-200 transition-colors text-xs font-medium flex-1"
                    >
                      <FaTrash size={12} />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => handleLocation(driver.driverId)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors text-xs font-medium flex-1"
                    >
                      <FaEye size={12} />
                      <span className="truncate">Track {driver.name}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <FaUserTie className="text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                  No drivers found matching your criteria
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filter options
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DriverManage;

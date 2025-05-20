import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCarCard = () => {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars`);
        setCarData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching car data:", err);
        setError("Failed to load car data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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

  const handleViewDetails = (carId) => {
    navigate(`/detailA/${carId}`);
  };

  const handleEditDetails = (carId) => {
    navigate(`/cars/edit/${carId}`);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="w-full px-5 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {carData.map((car) => (
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
              {car.make.toUpperCase()}
            </span>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-lg font-semibold text-gray-900">
              {car.make} {car.model}
            </h2>

            {/* Car Features - Maintaining original style */}
            <div className="text-gray-600 text-sm my-3">
              <div className="mb-2">
                <span className="font-medium">Insurance: </span>
                <span>{car.insurance?.provider || "N/A"}</span>
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

            {/* Buttons - Keeping the original button style and layout */}
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
  );
};

export default AdminCarCard;
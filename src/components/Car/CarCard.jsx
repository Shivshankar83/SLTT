import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { selectRole } from "../../redux/features/userSlice";
import { useSelector } from "react-redux";

const CarCard = () => {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const role = useSelector(selectRole);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/cars`
        );

        if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          setCarData(response.data.data);
        } else {
          throw new Error("Invalid response format");
        }

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

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return `$${amount.toFixed(2)}`;
  };

  const getLatestMaintenance = (maintenanceHistory) => {
    if (!maintenanceHistory || maintenanceHistory.length === 0) {
      return { date: null };
    }
    const validEntries = maintenanceHistory.filter((entry) => entry.date);
    if (validEntries.length === 0) return { date: null };
    return validEntries.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const handleViewDetails = (carId) => {
    navigate(`/detail/${carId}`);
  };

  const handleBookNow = (carId) => {
    navigate(`/user`);
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
      <div className="w-full px-5 py-10 text-center font-inter">
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

  if (carData.length === 0) {
    return (
      <div className="w-full px-5 py-16 text-center font-inter">
        <div className="p-8 bg-gray-50 rounded-lg max-w-md mx-auto">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-700">
            No Cars Available
          </h3>
          <p className="mt-2 text-gray-600">
            No car data is currently available. Add new cars to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-inter">
      {carData.map((car) => (
        <div
          key={car.carId}
          className="w-full rounded-lg shadow-md border border-gray-300 p-4 bg-white transition-transform duration-300 hover:shadow-xl flex flex-col h-full"
        >
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-md aspect-[16/9] flex items-center justify-center">
            <img
              src={
                "https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxleHVzfGVufDB8fDB8fHww"
              }
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
            <div className="absolute top-2 right-2 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {formatCurrency(car.ratePerKm)}/km
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-lg font-semibold text-gray-900">
              {car.make} {car.model}
            </h2>

            <div className="flex items-center mt-2 mb-3">
              <div className="text-sm">
                <span className="line-through text-gray-500">
                  {formatCurrency(car.ratePerKm)}/km
                </span>
                <span className="ml-2 text-base font-medium text-green-600">
                  {formatCurrency(car.ratePerKm - car.discountRatePerKm)}/km
                </span>
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                  SAVE {formatCurrency(car.discountRatePerKm)}/km
                </span>
              </div>
            </div>

            <div className="text-gray-600 text-sm my-2">
              <div className="mb-2">
                <span className="font-medium">Insurance: </span>
                <span>{car.insurance?.provider || "N/A"}</span>
                {car.insurance?.expiry && (
                  <span className="ml-1 text-xs text-gray-500">
                    (Exp: {formatDate(car.insurance.expiry)})
                  </span>
                )}
              </div>
              <div className="mb-2">
                <span className="font-medium">Location: </span>
                <span>{car.location?.address || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">Last Maintenance: </span>
                <span>
                  {formatDate(
                    getLatestMaintenance(car.maintenanceHistory)?.date
                  )}
                </span>
              </div>
            </div>

            {car.status && (
              <div className="mt-2 mb-3">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded 
                  ${
                    car.status === "available"
                      ? "bg-green-100 text-green-800"
                      : car.status === "maintenance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {car.status.toUpperCase()}
                </span>
              </div>
            )}

            {/* ✅ Role-Based Buttons */}
            {role === "DRIVER" ? (
              <div className="mt-auto flex justify-center">
                <button
                  onClick={() => handleViewDetails(car.carId)}
                  className="bg-white text-black border border-black py-2 px-4 rounded-md flex items-center justify-center hover:bg-gradient-to-r hover:from-red-400 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  <span className="font-semibold text-sm">VIEW DETAILS</span>
                </button>
              </div>
            ) : (
              <div className="mt-auto grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleBookNow(car.carId)}
                  className="bg-white text-black border border-black py-2 rounded-md flex items-center justify-center hover:bg-gradient-to-r hover:from-red-400 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  <span className="font-semibold text-sm">BOOK NOW</span>
                </button>
                <button
                  onClick={() => handleViewDetails(car.carId)}
                  className="bg-white text-black border border-black py-2 rounded-md flex items-center justify-center hover:bg-gradient-to-r hover:from-red-400 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  <span className="font-semibold text-sm">VIEW DETAILS</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarCard;

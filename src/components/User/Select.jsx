import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import UserCarousel2 from "./UserCarousel2";
import Footer from "../common/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import LocationAutocomplete from "./LocationAutocomplete";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import videoFile from "../../assets/video.mp4";

const Select = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const formattedTime = currentDate.toTimeString().slice(0, 5);

  // Get values from URL or set defaults
  const [pickupLocation, setPickupLocation] = useState(
    searchParams.get("pickup") || ""
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    searchParams.get("dropoff") || ""
  );
  const [pickupDate, setPickupDate] = useState(
    searchParams.get("date") || formattedDate
  );
  const [pickupTime, setPickupTime] = useState(
    searchParams.get("time") || formattedTime
  );
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if script is already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsApiLoaded(true);
        return;
      }

      // Check if script tag already exists
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkApiLoaded = setInterval(() => {
          if (
            window.google &&
            window.google.maps &&
            window.google.maps.places
          ) {
            clearInterval(checkApiLoaded);
            setIsApiLoaded(true);
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCVScDu1L_v5f8VzGO56kDxSOv2vPX6Wec&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("Google Maps API loaded successfully");
        setIsApiLoaded(true);
      };

      script.onerror = (error) => {
        console.error("Error loading Google Maps API:", error);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Fetch cars data from API when component mounts
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/cars`
        );

        // Extract cars from the response data structure
        if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          setCars(response.data.data);
        } else {
          // Handle unexpected response structure
          setError("Unexpected data format received from server");
          setCars([]);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Failed to load cars. Please try again later.");
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Validate required fields
  const validateFields = () => {
    if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (!validateFields()) return;

    // Update the current URL with search parameters
    const params = new URLSearchParams();
    params.set("pickup", pickupLocation);
    params.set("dropoff", dropoffLocation);
    params.set("date", pickupDate);
    params.set("time", pickupTime);

    navigate(`/search?${params.toString()}`);
  };

  const handleViewDetails = (carId) => {
    // Validate fields before navigation
    if (!validateFields()) return;

    // Create URL parameters to pass with navigation
    const params = new URLSearchParams();
    params.set("pickup", pickupLocation);
    params.set("dropoff", dropoffLocation);
    params.set("date", pickupDate);
    params.set("time", pickupTime);

    // Navigate to car details with query parameters
    navigate(`/detailU/${carId}?${params.toString()}`);
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

  // Function to get a better display image based on car make

  return (
    <div className="pt-16 bg-gray-50 min-h-screen font-['Inter']">
      <UserNavbar />
      <ToastContainer />

      {/* Video Background */}
      <div className="relative w-full h-[500px]">
        {/* Video Background - Full height and width */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content - Positioned to overlap the video with some margin from top */}
        <div className="absolute inset-x-0 top-2/3 transform -translate-y-1/3 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 font-['Montserrat']">
                Book Your Ride
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full sm:w-auto">
                  <LocationAutocomplete
                    label="Pick-up Location"
                    value={pickupLocation}
                    onChange={setPickupLocation}
                    placeholder="Indore"
                  />
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <LocationAutocomplete
                    label="Drop-off Location"
                    value={dropoffLocation}
                    onChange={setDropoffLocation}
                    placeholder="Jaipur"
                  />
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-['Inter']">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-gray-100 font-['Inter']"
                    min={formattedDate}
                  />
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-['Inter']">
                    Pick-up Time
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-gray-100 font-['Inter']"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-md hover:from-blue-700 hover:to-blue-900 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm sm:text-base font-['Inter']"
                >
                  Search Car
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Car Listings */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-['Montserrat']">
          Available Cars
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-red-50 rounded-lg shadow-sm border border-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto text-red-500 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg text-red-600 font-['Inter']">{error}</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <p className="text-xl text-gray-600 font-['Montserrat']">
              No cars available at the moment
            </p>
            <p className="text-gray-500 mt-2 font-['Inter']">
              Please check back later or modify your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {cars.map((car) => (
              <div
                key={car.carId}
                className="w-full sm:w-11/12 mx-auto bg-white rounded-lg shadow-sm p-3 my-3 border border-gray-200"
              >
                <div className="flex flex-col md:flex-row items-center justify-between">
                  {/* Car Image */}
                  <div className="w-full md:w-1/4 flex justify-center">
                    <img
                      src={
                        "https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxleHVzfGVufDB8fDB8fHww"
                      }
                      alt={`${car.make} ${car.model}`}
                      className="h-auto max-h-32 object-contain"
                    />
                  </div>

                  {/* Car Details */}
                  <div className="w-full md:w-3/4 px-2 mt-2 md:mt-0">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                      <h3 className="text-lg font-bold text-gray-800 font-['Montserrat']">
                        {car.make} {car.model}
                      </h3>
                      <div className="mt-1 md:mt-0">
                        <span className="inline-block bg-blue-600 text-white font-medium px-2 py-1 rounded-full text-xs uppercase tracking-wide">
                          {car.make}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-lg font-bold text-teal-600 font-['Inter']">
                        ₹{car.ratePerKm}/km
                      </div>
                      {car.discountRatePerKm > 0 && (
                        <div className="text-sm text-gray-500 line-through font-['Inter']">
                          ₹{car.ratePerKm + car.discountRatePerKm}/km
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                      <div className="flex items-center text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 mr-2"
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
                        <span className="text-sm text-gray-700 font-['Inter']">
                          {car.insurance?.provider || "Standard Insurance"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 mr-2"
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
                        <span className="text-sm text-gray-700 font-['Inter']">
                          Expires: {car.insurance?.expiry || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 font-['Inter']">
                          Policy: {car.insurance?.policyNumber || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Maintenance History (Conditionally rendered) */}
                    {car.maintenanceHistory &&
                      car.maintenanceHistory.length > 0 && (
                        <div className="mt-1 mb-2">
                          <p className="text-xs font-medium text-gray-600 font-['Montserrat']">
                            Recent Maintenance:
                            <span className="text-xs text-gray-500 font-['Inter'] ml-1">
                              {car.maintenanceHistory[
                                car.maintenanceHistory.length - 1
                              ].date
                                ? `Last serviced: ${new Date(
                                    car.maintenanceHistory[
                                      car.maintenanceHistory.length - 1
                                    ].date
                                  ).toLocaleDateString()}`
                                : "Maintenance up to date"}
                            </span>
                          </p>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => handleViewDetails(car.carId)}
                        className="bg-white border border-blue-600 text-blue-600 text-xs text-bold font-medium py-1 px-3 rounded-md hover:bg-blue-50 transition-colors duration-300"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleBookNow(car.carId)}
                        className="bg-teal-500 hover:bg-teal-600 text-white text-bold text-xs font-medium py-1 px-3 rounded-md shadow-sm transition-colors duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UserCarousel2 />
      <Footer />
    </div>
  );
};

export default Select;

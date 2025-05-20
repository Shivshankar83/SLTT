import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const IOSStyleLocationPermission = () => {
  const [showModal, setShowModal] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const checkLocationPermission = () => {
      // Check if permission was previously granted or denied
      const storedPermission = Cookies.get("locationPermission");

      if (storedPermission) {
        setLocationPermission(storedPermission);

        // If permission was granted, also retrieve any stored location
        if (storedPermission === "granted") {
          const storedLocation = Cookies.get("userLocation");
          if (storedLocation) {
            try {
              const parsedLocation = JSON.parse(storedLocation);
              setUserLocation(parsedLocation);
            } catch (error) {
              console.error("Error parsing stored location:", error);
            }
          }
          // Try to get fresh location too
          getCurrentLocation();
        }
        return;
      }

      // Show modal if no previous permission
      setShowModal(true);
    };

    checkLocationPermission();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = { latitude, longitude };

          // Store coordinates in cookies for future use
          Cookies.set("userLocation", JSON.stringify(locationData), {
            expires: 30,
            secure: window.location.protocol === "https:", // Only send on HTTPS
            sameSite: "strict", // Protect against CSRF
          });

          // Update local state
          setUserLocation(locationData);

          // After successfully getting location, update permission
          setLocationPermission("granted");
          Cookies.set("locationPermission", "granted", {
            expires: 365,
            secure: window.location.protocol === "https:",
            sameSite: "strict",
          });

          console.log("Location saved successfully:", locationData);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission("denied");
          Cookies.set("locationPermission", "denied", {
            expires: 365,
            secure: window.location.protocol === "https:",
            sameSite: "strict",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  };

  const handleOnlyWhileUsingApp = () => {
    setShowModal(false);
    if (navigator.geolocation) {
      getCurrentLocation();
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationPermission("denied");
      Cookies.set("locationPermission", "denied", {
        expires: 365,
        secure: window.location.protocol === "https:",
        sameSite: "strict",
      });
    }
  };

  const handleAlwaysAllow = () => {
    setShowModal(false);
    if (navigator.geolocation) {
      getCurrentLocation();
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationPermission("denied");
      Cookies.set("locationPermission", "denied", {
        expires: 365,
        secure: window.location.protocol === "https:",
        sameSite: "strict",
      });
    }
  };

  const handleDenyLocation = () => {
    setShowModal(false);
    setLocationPermission("denied");
    // When denied, we explicitly do NOT save location data
    // Remove any existing location data
    Cookies.remove("userLocation");
    Cookies.set("locationPermission", "denied", {
      expires: 365,
      secure: window.location.protocol === "https:",
      sameSite: "strict",
    });
  };

  // Only show the permission modal, nothing else
  if (!showModal) {
    // Return nothing (null) when no modal needs to be shown
    return null;
  }

  // Render the permission modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl max-w-xs w-full mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="pt-6 pb-3 px-6">
          <h2 className="text-xl font-bold text-black text-center mb-2">
            Allow "Company" to access your location?
          </h2>
          <p className="text-base text-center text-gray-800">
            You must allow access for the Swoop app to work. We will only track
            your location while on duty.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 w-full"></div>

        {/* Only While Using App Button */}
        <button
          onClick={handleOnlyWhileUsingApp}
          className="w-full py-3.5 px-4 text-center text-blue-500 font-sm text-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          Only While Using the App
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200 w-full"></div>

        {/* Always Allow Button */}
        <button
          onClick={handleAlwaysAllow}
          className="w-full py-3.5 px-4 text-center text-blue-500 font-sm text-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          Always Allow
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200 w-full"></div>

        {/* Don't Allow Button */}
        <button
          onClick={handleDenyLocation}
          className="w-full py-3.5 px-4 text-center text-blue-500 font-sm text-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          Don't Allow
        </button>
      </div>
    </div>
  );
};

export default IOSStyleLocationPermission;

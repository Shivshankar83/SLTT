import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "../../index.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Fix Leaflet icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const driverIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
}

const AdminTracker = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [isDriverOffline, setIsDriverOffline] = useState(false);
  const { id } = useParams();
  const client = useRef(null);
  const timeoutRef = useRef(null);

  // Connect to WebSocket
  useEffect(() => {
    client.current = new Client({
      webSocketFactory: () => new SockJS("http://3.15.0.15:8083/ws-location"),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log("[STOMP]", str);
      },
    });

    client.current.onConnect = (frame) => {
      console.log("Connected to STOMP server", frame.headers);
      setIsConnected(true);
      setError("");
      toast.success("Connected to tracking server");

      client.current.subscribe(`/topic/location/${id}`, (message) => {
        if (message.body) {
          try {
            const data = JSON.parse(message.body);
            console.log("Received driver location:", data);

            setDriverLocation(data);
            setLastUpdateTime(new Date());
            setIsDriverOffline(false);

            if (!isMapInitialized) {
              setMapCenter([data.latitude, data.longitude]);
              setIsMapInitialized(true);
            }

            // Reset timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setIsDriverOffline(true);
            }, 15000); // 15 seconds timeout
          } catch (e) {
            console.error("Error parsing message", e);
            setError("Error parsing location data");
          }
        }
      });
    };

    client.current.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Details: " + frame.body);
      setError(`Connection error: ${frame.headers["message"]}`);
      setIsConnected(false);
    };

    client.current.onWebSocketClose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
      setError("WebSocket connection closed");
    };

    client.current.activate();

    return () => {
      if (client.current) {
        client.current.deactivate();
        console.log("WebSocket connection closed on unmount");
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id, isMapInitialized]);

  // Check for driver offline status
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdateTime && Date.now() - lastUpdateTime.getTime() > 15000) {
        setIsDriverOffline(true);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [lastUpdateTime]);

  // Memorize location data
  const locationData = React.useMemo(() => {
    if (!driverLocation) return null;
    return {
      ...driverLocation,
      formattedTime: new Date(driverLocation.updatedAt).toLocaleString(),
    };
  }, [driverLocation]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Live Driver Tracking</h1>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-400" : "bg-red-400"
                  } animate-pulse`}
                ></div>
                <span className="text-white text-sm font-medium">
                  {isConnected ? "Live" : "Connecting..."}
                </span>
              </div>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Driver offline warning */}
          {isDriverOffline && locationData && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 m-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Driver has stopped sharing location. Showing last known location.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Map Section */}
            <div className="lg:col-span-2 h-[500px] lg:h-[700px] relative">
              {locationData ? (
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={true}
                  scrollWheelZoom={true}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[locationData.latitude, locationData.longitude]}
                    icon={driverIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg mb-2">Driver Location</h3>
                        <p>
                          <strong>Driver ID:</strong> {locationData.driverId}
                        </p>
                        <p>
                          <strong>Address:</strong> {locationData.address}
                        </p>
                        <p>
                          <strong>Last Updated:</strong>{" "}
                          {locationData.formattedTime}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                  <MapUpdater
                    position={[locationData.latitude, locationData.longitude]}
                  />
                </MapContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Waiting for driver location data...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div className="p-6 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50">
              {locationData ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
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
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Driver Information
                    </h2>

                    <div className="bg-white rounded-lg shadow-md p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Driver ID</span>
                        <span className="font-semibold text-gray-800">
                          {locationData.driverId}
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <span className="text-gray-500 font-medium">Last Updated</span>
                        <div className="text-gray-800 font-semibold mt-1">
                          {locationData.formattedTime}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <span className="text-gray-500 font-medium">Coordinates</span>
                        <div className="flex justify-between text-gray-800 font-semibold mt-1">
                          <span>Latitude: {locationData.latitude.toFixed(6)}</span>
                          <span>Longitude: {locationData.longitude.toFixed(6)}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <span className="text-gray-500 font-medium">Address</span>
                        <div className="text-gray-800 font-semibold mt-1">
                          {locationData.address}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">
                          Live Tracking Active
                        </h3>
                        <p className="mt-1 text-sm text-blue-600">
                          This page is automatically updating as the driver's location
                          changes.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-700 mb-2">
                    Awaiting Driver Data
                  </h2>
                  <p className="text-gray-500">
                    The system is connecting to the tracking server. Driver information
                    will appear here once available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTracker;
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaExclamationCircle, FaLocationArrow, FaSync } from "react-icons/fa";

const UserTracker = ({ driverId = 1 }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  // Initialize WebSocket connection
  const connectWebSocket = () => {
    if (wsRef.current && [WebSocket.OPEN, WebSocket.CONNECTING].includes(wsRef.current.readyState)) {
      return;
    }

    const socket = new WebSocket("http://3.15.0.15:8083/ws-location");

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);
      reconnectAttemptsRef.current = 0;
      wsRef.current = socket;
      
      // Subscribe to driver updates
      socket.send(JSON.stringify({
        type: "subscribe",
        driverId: driverId
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.driverId === driverId && data.latitude && data.longitude) {
          const newLocation = {
            lat: Number(data.latitude),
            lng: Number(data.longitude),
            address: data.address,
            updatedAt: data.updatedAt
          };
          setDriverLocation(newLocation);
          setMapCenter(newLocation);
          setError(null);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      setIsConnected(false);
      wsRef.current = null;
      
      // Attempt reconnect with exponential backoff
      const delay = Math.min(5000 * (reconnectAttemptsRef.current + 1), 30000);
      reconnectAttemptsRef.current += 1;
      setTimeout(connectWebSocket, delay);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Connection error occurred");
    };

    return socket;
  };

  // Center map on driver location
  const centerOnDriver = () => {
    if (driverLocation) {
      setMapCenter({ lat: driverLocation.lat, lng: driverLocation.lng });
    }
  };

  // Initial setup
  useEffect(() => {
    const socket = connectWebSocket();

    return () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [driverId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-600" />
            Tracking Driver #{driverId}
          </h1>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
            <button
              onClick={() => {
                setError(null);
                connectWebSocket();
              }}
              className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            >
              <FaSync className="mr-1" /> Reconnect
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center">
            <FaExclamationCircle className="mr-2" />
            {error}
          </div>
        )}

        <div className="relative rounded-lg overflow-hidden shadow-md mb-4">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={15}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
              }}
            >
              {driverLocation && (
                <Marker
                  position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
                  onClick={() => setInfoOpen(true)}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                >
                  {infoOpen && (
                    <InfoWindow
                      position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
                      onCloseClick={() => setInfoOpen(false)}
                    >
                      <div className="p-2">
                        <p className="font-bold">Driver #{driverId}</p>
                        <p className="text-sm">{driverLocation.address}</p>
                        <p className="text-xs text-gray-600">
                          Updated: {new Date(driverLocation.updatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              )}
            </GoogleMap>
          </LoadScript>

          <button
            onClick={centerOnDriver}
            className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            title="Center on driver"
          >
            <FaLocationArrow className="text-blue-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Coordinates</p>
            <p className="text-lg text-gray-800">
              {driverLocation
                ? `${driverLocation.lat.toFixed(6)}, ${driverLocation.lng.toFixed(6)}`
                : "Waiting for data..."}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Address</p>
            <p className="text-lg text-gray-800">
              {driverLocation?.address || "Waiting for data..."}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Last Update</p>
            <p className="text-lg text-gray-800">
              {driverLocation
                ? new Date(driverLocation.updatedAt).toLocaleTimeString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTracker;


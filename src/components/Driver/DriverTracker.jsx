import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAppSelector } from "../../redux/hooks";
import { selectUserId } from "../../redux/features/userSlice";
import { toast } from "react-toastify";

const DriverTracker = ({ startTracking, stopTracking }) => {
  const stompClientRef = useRef(null);
  const intervalRef = useRef(null);
  const driverId = useAppSelector(selectUserId);
  const [connected, setConnected] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  // Check geolocation permission status
  const checkGeolocationPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      setHasPermission(permission.state); // 'granted', 'prompt', or 'denied'
      return permission.state;
    } catch (err) {
      console.error("Error checking geolocation permission:", err);
      return "denied";
    }
  };

  const connectWebSocket = async () => {
    const permission = await checkGeolocationPermission();
    if (permission === "denied") {
      console.warn("Geolocation permission denied");
      return;
    }

    const socket = new SockJS(`http://${import.meta.env.VITE_API_BASE_URL}/ws-location`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected via STOMP");
        setConnected(true);
        toast.success("Connected to tracking server");

        stompClient.subscribe(`/topic/location/${driverId}`, (message) => {
          const loc = JSON.parse(message.body);
          console.log("Received:", loc);
        });

        // Start sending updates immediately
        sendLocation(stompClient);

        // Set interval for periodic updates
        intervalRef.current = setInterval(() => {
          sendLocation(stompClient);
        }, 5000);
      },
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
        console.error("Details:", frame.body);
        setConnected(false);
      },
      onWebSocketClose: () => {
        console.log("WebSocket closed");
        setConnected(false);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setConnected(false);
  };

  const sendLocation = async (client) => {
    if (!client || !client.connected) {
      console.warn("WebSocket not connected, skipping location send");
      return;
    }

    let retries = 3;
    while (retries > 0) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 15000, // Increased timeout
              maximumAge: 0,
            }
          );
        });

        const { latitude, longitude } = position.coords;

        // Get address
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?key=${
            import.meta.env.VITE_GEO_LOCATION_API_KEY
          }&q=${latitude},${longitude}&pretty=1&no_annotations=1`
        );
        const data = await response.json();
        const currentAddress = data.results[0]?.formatted || "Address not found";

        const payload = {
          driverId: driverId,
          updatedAt: new Date().toISOString(),
          latitude,
          longitude,
          address: currentAddress,
        };

        client.publish({
          destination: "/app/track/update",
          body: JSON.stringify(payload),
        });
        console.log("Sent:", payload);
        return; // Exit after successful send
      } catch (err) {
        console.error("Error getting location:", err);
        retries--;
        if (retries === 0) {
          console.error("Max retries reached, skipping location send");
        } else {
          console.log(`Retrying location fetch (${retries} attempts left)...`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retry
        }
      }
    }
  };

  useEffect(() => {
    if (startTracking) {
      checkGeolocationPermission().then((permission) => {
        if (permission === "granted" || permission === "prompt") {
          connectWebSocket();
        }
      });
    } else if (stopTracking) {
      disconnectWebSocket();
    }

    // Monitor permission changes
    navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
      permissionStatus.onchange = async () => {
        const permission = await checkGeolocationPermission();
        if (permission === "granted" && startTracking) {
          connectWebSocket();
        } else if (permission === "denied") {
          disconnectWebSocket();
        }
      };
    });

    return () => {
      disconnectWebSocket();
    };
  }, [startTracking, stopTracking]);

  return null; // No UI rendering
};

export default DriverTracker;
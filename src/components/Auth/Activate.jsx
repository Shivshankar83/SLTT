import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

// Constants
const API_BASE_URL =`${import.meta.env.VITE_API_AUTH_URL}/api`;
const REDIRECT_DELAY = 3000; // 3 seconds


const Activate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activationState, setActivationState] = useState({
    status: "",
    isLoading: false,
    isSuccess: false,
    isAlreadyActivated: false,
    hasAttempted: false
  });

  // Extract token from URL on component mount
  const token = searchParams.get("token");
  
  // Helper function for showing notifications
  const showNotification = (message) => {
    if (message) {
      alert(message);
    }
  };

  // Redirect to login page
  const redirectToLogin = () => {
    setTimeout(() => {
      navigate("/login");
    }, REDIRECT_DELAY);
  };

  // Handle activation process
  const handleActivation = async () => {
    // Validate token presence
    if (!token) {
      setActivationState(prev => ({
        ...prev,
        status: "Invalid activation link - missing token",
        hasAttempted: true
      }));
      return;
    }

    // Update state to show loading
    setActivationState(prev => ({
      ...prev,
      isLoading: true,
      hasAttempted: true,
      status: "Processing activation..."
    }));

    try {
      // Make API request
      const url = `${API_BASE_URL}/auth/activate?token=${token}`;
      const response = await axios.post(url, {}, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });
      const { success, message, data } = response?.data || {};

      if (success) {
        // Handle successful activation
        const activationMsg = data || message || "🎉 Your account has been activated successfully!";
        
        setActivationState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
          status: activationMsg
        }));
        
        showNotification(activationMsg);
        redirectToLogin();
      } else {
        // Handle activation failure from server
        const errorMsg = message || data || "⚠️ Activation failed. Please try again or contact support.";
        
        setActivationState(prev => ({
          ...prev,
          isLoading: false,
          status: errorMsg
        }));
        
        showNotification(errorMsg);
      }
    } catch (error) {
      // Error handling with specific cases
      const errorResponse = error?.response?.data;
      const errorMessage = errorResponse?.message || errorResponse?.data || "⚠️ Something went wrong during activation.";
      
      // Check if account is already activated
      if (
        errorMessage.toLowerCase().includes("already activated") ||
        errorMessage.toLowerCase().includes("already active")
      ) {
        setActivationState(prev => ({
          ...prev,
          isLoading: false,
          isAlreadyActivated: true,
          status: "ℹ️ Your account is already activated. You can log in now."
        }));
        
        showNotification("Your account is already activated.");
        redirectToLogin();
      } else {
        // General error case
        setActivationState(prev => ({
          ...prev,
          isLoading: false,
          status: errorMessage
        }));
        
        showNotification(errorMessage);
      }
    }
  };

  // Determine icon to show based on activation state
  const renderStatusIcon = () => {
    const { isSuccess, isAlreadyActivated } = activationState;
    const isPositiveOutcome = isSuccess || isAlreadyActivated;
    
    return (
      <div className={`flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
        isPositiveOutcome ? "bg-green-100" : "bg-red-100"
      }`}>
        {isPositiveOutcome ? (
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>
    );
  };



  const { isLoading, isSuccess, isAlreadyActivated, status, hasAttempted } = activationState;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" id="activation-header">
            Account Activation
          </h2>

          {!hasAttempted ? (
            <button
              onClick={handleActivation}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Activate account"
            >
              Activate Account
            </button>
          ) : isLoading ? (
            <div className="flex flex-col items-center" aria-live="polite" aria-busy="true">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
                role="status"
                aria-label="Loading"
              />
              <p className="text-gray-600">Processing your activation...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center" aria-live="polite">
              {renderStatusIcon()}

              <h3
                className={`text-xl font-medium mb-2 ${
                  isSuccess || isAlreadyActivated
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {isAlreadyActivated
                  ? "Already Activated"
                  : isSuccess
                  ? "Success!"
                  : "Activation Error"}
              </h3>

              <p className="text-gray-600 mb-6">{status}</p>

              {isSuccess || isAlreadyActivated ? (
                <p className="text-sm text-gray-500">
                  Redirecting to login page in a few seconds...
                </p>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-label="Go to login page"
                >
                  Go to Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activate;
import React from "react";
import RideRequest from "./RideRequest";

const Main = ({ bookings, loading, error, fetchBookings, handleBookingUpdate }) => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {loading && bookings.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600 flex items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="font-medium">Loading ride requests...</span>
          </div>
        </div>
      ) : error ? (
        <div className="w-full max-w-md mx-auto bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Error Loading Ride Requests</h3>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Retry
            </button>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-xl shadow-md">
            <div className="rounded-full bg-yellow-100 p-3 mb-4">
              <svg
                className="h-8 w-8 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
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
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">No Ride Requests</h3>
            <p className="text-gray-600 text-center mb-6">
              There are currently no ride requests available for you.
            </p>
            <button
              onClick={fetchBookings}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="fixed top-16 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-md shadow-sm flex items-center">
              <svg
                className="animate-spin h-4 w-4 text-blue-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm font-medium">Refreshing...</span>
            </div>
          )}
          {bookings.map((booking, index) => (
            <div
              key={booking.bookingId}
              className="opacity-0"
              style={{
                animation: "slideIn 0.5s ease-out forwards",
                animationDelay: `${index * 100}ms`,
              }}
            >
              <RideRequest booking={booking} onBookingUpdate={handleBookingUpdate} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Main;
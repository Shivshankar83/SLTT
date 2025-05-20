import React from "react";

const Header = ({
  username,
  pendingBookings,
  animateHeader,
  animateCar,
  showSpeedometer,
  fetchBookings,
}) => {
  return (
    <header className="relative h-42 overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      {/* Road background */}
      <div className="absolute inset-0 bg-gray-800">
        {/* Road markings */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-700">
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2">
            <div className="flex justify-between">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-12 bg-yellow-400 transform transition-all duration-1000 ${
                    animateHeader ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Car silhouette animation */}
      <div
        className={`absolute bottom-2 transform transition-all duration-1500 ease-out ${
          animateCar ? "translate-x-1/3" : "-translate-x-full"
        }`}
      >
        <svg
          width="100"
          height="40"
          viewBox="0 0 100 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10,20 L20,10 L65,10 L80,20 L90,20 L90,30 L10,30 L10,20 Z"
            fill="#3B82F6"
          />
          <circle cx="25" cy="30" r="7" fill="#1F2937" />
          <circle cx="75" cy="30" r="7" fill="#1F2937" />
          <path
            d="M25,10 L35,0 L55,0 L65,10"
            stroke="#3B82F6"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="30"
            y="15"
            width="40"
            height="10"
            fill="#BFDBFE"
            fillOpacity="0.7"
          />
        </svg>
      </div>

      {/* Dashboard elements */}
      <div className="absolute right-8 bottom-4 flex items-center">
        {/* Speedometer */}
        <div
          className={`w-20 h-20 rounded-full border-4 border-blue-500 bg-gray-800 flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${
            showSpeedometer ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        >
          <div className="text-white text-xs absolute bottom-5">80</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-xs">km/h</div>
          </div>
        </div>

        {/* Fuel gauge */}
        <div
          className={`ml-4 w-16 h-8 bg-gray-700 border-2 border-blue-500 rounded relative overflow-hidden transition-all duration-1000 delay-300 ${
            showSpeedometer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-green-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-bold">FUEL</span>
          </div>
        </div>
      </div>

      {/* Content with sliding animation */}
      <div
        className={`relative z-20 flex items-center justify-center h-full px-8 transition-all duration-1000 transform ${
          animateHeader ? "translate-x-0 opacity-100" : "-translate-x-24 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a.5.5 0 00-.5-.5H18V8.86a1 1 0 00-.29-.7l-2.86-2.86A1 1 0 0014.14 5H13v-.5A1.5 1.5 0 0011.5 3h-7A1.5 1.5 0 003 4.5V4zm6 0v6H4V4h5z" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold mb-1 text-white font-inter">
              Welcome, {username}
            </h1>
          </div>
          <p className="text-lg text-blue-300 ml-11 font-inter">Your ride requests dashboard</p>

          {/* Status indicators */}
          <div className="flex mt-3 ml-11 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span className="text-green-300 text-sm">Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              <span className="text-yellow-300 text-sm">{pendingBookings} Pending</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={fetchBookings}
                className="flex items-center text-blue-300 hover:text-blue-200 text-sm transition-colors"
              >
                <svg
                  className="h-4 w-4 mr-1"
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
        </div>
      </div>
    </header>
  );
};

export default Header;
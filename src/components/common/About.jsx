import React from 'react';
import { Car, Users, UserCheck, Shield, Clock, MapPin } from 'lucide-react';
import Footer from './Footer';
import CommonNavbar from './CommonNavbar';
export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <CommonNavbar />
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 py-24">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Car Rental Platform</h1>
            <p className="text-xl md:text-2xl mb-8">
              Connecting drivers and passengers with a seamless car rental experience
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition duration-300">
                Learn More
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            To revolutionize the car rental industry by providing a user-friendly platform that connects car owners, 
            drivers, and passengers in a secure and efficient marketplace.
          </p>
          <p className="text-lg text-gray-600">
            We're committed to making transportation accessible, affordable, and convenient for everyone while 
            ensuring quality service and customer satisfaction.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="mb-4 text-blue-600">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">For Users</h3>
              <p className="text-gray-600">
                Browse our extensive collection of vehicles, view detailed information, and book your ideal car with just a few clicks.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="mb-4 text-blue-600">
                <UserCheck size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">For Drivers</h3>
              <p className="text-gray-600">
                Manage your bookings efficiently, approve or reject requests, and communicate with users directly through our platform.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="mb-4 text-blue-600">
                <Shield size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">For Admins</h3>
              <p className="text-gray-600">
                Add and manage drivers, maintain the car inventory, and oversee the entire operation through our comprehensive dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://img.freepik.com/free-photo/group-people-working-out-business-plan-office_1303-15872.jpg?ga=GA1.1.1326113295.1742042715&semt=ais_hybrid&w=740" 
                alt="Our story" 
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              Founded in 2024, our car rental platform was born from a simple idea: make car rentals accessible, 
              transparent, and hassle-free for everyone.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              What began as a small operation has grown into a comprehensive marketplace connecting car owners, 
              drivers, and passengers across the country.
            </p>
            <p className="text-lg text-gray-600">
              Today, we're proud to offer a robust platform that simplifies the car rental process while 
              maintaining the highest standards of security and service quality.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="mb-4 text-blue-600">
                <Car size={28} />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Diverse Fleet</h3>
              <p className="text-gray-600">
                Wide selection of vehicles to meet all your transportation needs
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="mb-4 text-blue-600">
                <Clock size={28} />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Quick Booking</h3>
              <p className="text-gray-600">
                Streamlined process to book your car in just a few minutes
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="mb-4 text-blue-600">
                <Shield size={28} />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Secure Platform</h3>
              <p className="text-gray-600">
                Advanced security measures to protect your data and transactions
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="mb-4 text-blue-600">
                <MapPin size={28} />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Convenient Locations</h3>
              <p className="text-gray-600">
                Pickup and drop-off points strategically located for your convenience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
              <img 
                src="data:image/jpeg;base64,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" 
                alt="Team member" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-xl mb-1 text-gray-800">Alex Johnson</h3>
            <p className="text-blue-600 mb-3">CEO & Founder</p>
            <p className="text-gray-600">
              With over 15 years in the transportation industry, Alex brings unparalleled expertise to our platform.
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
              <img 
                src="data:image/png;base64,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" 
                alt="Team member" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-xl mb-1 text-gray-800">Sarah Miller</h3>
            <p className="text-blue-600 mb-3">CTO</p>
            <p className="text-gray-600">
              Sarah leads our technical team, ensuring our platform remains cutting-edge and user-friendly.
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
              <img 
                src="data:image/jpeg;base64,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" 
                alt="Team member" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-xl mb-1 text-gray-800">Michael Chen</h3>
            <p className="text-blue-600 mb-3">Head of Operations</p>
            <p className="text-gray-600">
              Michael oversees day-to-day operations, focusing on service quality and customer satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">10,000+</p>
              <p className="text-lg">Registered Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">5,000+</p>
              <p className="text-lg">Available Cars</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">1,000+</p>
              <p className="text-lg">Certified Drivers</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50+</p>
              <p className="text-lg">Cities Covered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact/CTA */}
      <div className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied users who have transformed their car rental experience with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300">
              Register Now
            </button>
            <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
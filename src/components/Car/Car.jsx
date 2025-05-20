import React from "react";
import CarNavbar from "./CarNavbar";
import CarCarousel from "./CarCarousel";
import CarCard from "./CarCard";
import Footer from "../common/Footer";
import Logo from "../common/Logo"; // Import the Logo component

function Car() {
  return (
    <>
      <CarNavbar />
      <CarCarousel />
      
      {/* Car content */}
      <CarCard />
      
      {/* Footer */}
      <Footer />
      
      <Logo 
        whatsappNumber="918349762192" // Replace with your actual WhatsApp number (without +)
        message="Hello, I'm interested in booking a car!" 
      />
    </>
  );
}

export default Car;
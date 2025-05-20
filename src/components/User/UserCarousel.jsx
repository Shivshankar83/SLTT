import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const UserCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const transitionRef = useRef(null);
  const carouselRef = useRef(null);
  
  const carData = [
    {
      id: 1,
      name: 'Toyota Highlander',
      capacity: '4-5',
      image: 'https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxleHVzfGVufDB8fDB8fHww',
      alt: 'White Toyota Highlander SUV'
    },
    {
      id: 2,
      name: 'VOLKSWAGON TERAMONT',
      capacity: '4-5',
      image: 'https://imagecdnsa.zigwheels.ae/large/gallery/exterior/13/124/gmc-yukon-denali-front-angle-low-view-821729.jpg',
      alt: 'Black Volkswagen Teramont SUV'
    },
    {
      id: 3,
      name: 'LEXUS ES 300H',
      capacity: '4-5',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
      alt: 'Black Lexus ES 300H Sedan'
    },
    {
      id: 4,
      name: 'Mercedes Benz S-Class',
      capacity: '4-5',
      image: 'https://images.unsplash.com/photo-1598008533396-6bc9962f590b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z21jfGVufDB8fDB8fHww',
      alt: 'Black Mercedes Benz S-Class Sedan'
    },
    {
      id: 5,
      name: 'Cadillac Escalade',
      capacity: '6-7',
      image: 'https://images.unsplash.com/photo-1598008533396-6bc9962f590b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z21jfGVufDB8fDB8fHww',
      alt: 'Black Cadillac Escalade SUV'
    }
  ];

  // Creating an extended array for continuous looping
  // We duplicate the entire array to ensure smooth infinite scrolling
  const extendedCarData = [...carData, ...carData, ...carData];
  
  // Set up auto-scrolling when component mounts
  useEffect(() => {
    startAutoScroll();
    return () => clearAllTimeouts();
  }, []);

  // Handle auto-scrolling with currentIndex changes
  useEffect(() => {
    if (!isPaused) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, 2000);
    }
    
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isPaused]);

  // Handle reset to beginning when reaching end of extended array
  useEffect(() => {
    if (currentIndex >= carData.length) {
      transitionRef.current = setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(currentIndex % carData.length);
        
        // Re-enable transitions after a brief delay
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 500);
    }
    
    return () => clearTimeout(transitionRef.current);
  }, [currentIndex]);

  const clearAllTimeouts = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(transitionRef.current);
  };

  const startAutoScroll = () => {
    setIsPaused(false);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      goToNext();
    }, 3000);
  };

  const pauseAutoScroll = () => {
    setIsPaused(true);
    clearTimeout(timeoutRef.current);
  };
  
  const goToPrevious = () => {
    pauseAutoScroll();
    setCurrentIndex(prev => prev - 1);
    // Resume auto-scrolling after manual interaction
    setTimeout(startAutoScroll, 5000);
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleDotClick = (index) => {
    pauseAutoScroll();
    setCurrentIndex(index);
    // Resume auto-scrolling after manual interaction
    setTimeout(startAutoScroll, 5000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-navy-800 mb-2">OUR FLEET</h2>
        <p className="text-lg text-gray-600">Choose from a variety of well-maintained vehicles for your journey.</p>
      </div>
      
      <div 
        className="relative" 
        ref={carouselRef}
        onMouseEnter={pauseAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        {/* Navigation Arrows */}
        <button 
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        
        <button 
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>
        
        {/* Carousel Container */}
        <div className="relative overflow-hidden mx-8">
          <div 
            className={`flex ${isTransitioning ? 'transition-none' : 'transition-transform duration-500 ease-out'}`}
            style={{ transform: `translateX(-${(currentIndex * (100 / 3))}%)` }}
          >
            {/* Extended array of cards for infinite scrolling */}
            {extendedCarData.map((car, index) => (
              <div 
                key={`${car.id}-${index}`}
                className="w-1/3 flex-shrink-0 p-2 md:block hidden"
              >
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={car.alt}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300";
                        e.target.alt = "Car image placeholder";
                      }}
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
                    <div className="flex items-center mt-2 text-gray-600">
                      <Users size={16} className="mr-1" />
                      <span>{car.capacity}</span>
                    </div>
                    <div className="mt-auto flex justify-end">
                      <ChevronRight size={20} className="text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Mobile View - Single card at a time */}
            {extendedCarData.map((car, index) => (
              <div 
                key={`mobile-${car.id}-${index}`}
                className="w-full flex-shrink-0 p-2 md:hidden block"
              >
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={car.alt}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300";
                        e.target.alt = "Car image placeholder";
                      }}
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
                    <div className="flex items-center mt-2 text-gray-600">
                      <Users size={16} className="mr-1" />
                      <span>{car.capacity}</span>
                    </div>
                    <div className="mt-auto flex justify-end">
                      <ChevronRight size={20} className="text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: carData.length }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 mx-1 rounded-full transition-all duration-300 ${
                index === currentIndex % carData.length ? 'bg-blue-800 w-4' : 'bg-gray-300 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCarousel;
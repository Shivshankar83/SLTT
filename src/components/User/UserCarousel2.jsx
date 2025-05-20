import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const carModels = [
  { id: 1, name: 'SEDAN', image: 'https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxleHVzfGVufDB8fDB8fHww' },
  { id: 2, name: 'XL', image: 'https://imagecdnsa.zigwheels.ae/large/gallery/exterior/13/124/gmc-yukon-denali-front-angle-low-view-821729.jpg' },
  { id: 3, name: 'VIP', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D' },
  { id: 4, name: 'VIP PLUS', image: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJtd3xlbnwwfHwwfHx8MA%3D%3D' },
  { id: 5, name: 'TESLA', image: 'https://images.unsplash.com/photo-1598008533396-6bc9962f590b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z21jfGVufDB8fDB8fHww' },
  { id: 6, name: 'BMW 7 series', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D' },
];

const UserCarousel2 = () => {
  const navigate = useNavigate();
  
  // For infinite scroll, we duplicate the items at beginning and end
  const clonedCarModels = [...carModels, ...carModels, ...carModels];
  
  const [activeIndex, setActiveIndex] = useState(carModels.length);
  const [width, setWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [clickedCardId, setClickedCardId] = useState(null);
  const [autoSwipe, setAutoSwipe] = useState(true); // Auto-swipe state
  const [hoverPause, setHoverPause] = useState(false); // For pausing on hover
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  const autoSwipeTimerRef = useRef(null); // Ref for the timer

  // Update dimensions and visible items based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setWidth(containerWidth);
        
        // Determine number of visible items based on screen width
        let itemCount = 1; // Default for smallest screens
        
        if (window.innerWidth >= 1280) {
          itemCount = 4; // xl: 4 cards
        } else if (window.innerWidth >= 1024) {
          itemCount = 3; // lg: 3 cards
        } else if (window.innerWidth >= 768) {
          itemCount = 2; // md: 2 cards
        } else if (window.innerWidth >= 640) {
          itemCount = 2; // sm: 2 cards but smaller
        }
        
        setVisibleItems(itemCount);
        setItemWidth(containerWidth / itemCount);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Auto-swipe functionality
  useEffect(() => {
    // Start auto-swipe timer
    const startAutoSwipeTimer = () => {
      if (autoSwipeTimerRef.current) {
        clearInterval(autoSwipeTimerRef.current);
      }
      
      if (autoSwipe && !hoverPause) {
        autoSwipeTimerRef.current = setInterval(() => {
          if (!isTransitioning) {
            setIsTransitioning(true);
            setActiveIndex(prev => prev + 1);
          }
        }, 2000); // Slide every 3 seconds
      }
    };
    
    startAutoSwipeTimer();
    
    // Clean up timer on unmount
    return () => {
      if (autoSwipeTimerRef.current) {
        clearInterval(autoSwipeTimerRef.current);
      }
    };
  }, [autoSwipe, hoverPause, isTransitioning]);

  // Handle slide transition end - important for infinite loop
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    
    // If we've reached a clone, jump to the real item without transition
    if (activeIndex <= carModels.length - visibleItems) {
      setIsTransitioning(false);
      setActiveIndex(activeIndex + carModels.length);
    } else if (activeIndex >= carModels.length * 2) {
      setIsTransitioning(false);
      setActiveIndex(activeIndex - carModels.length);
    }
  };

  // Function to handle next slide with infinite loop
  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex(prev => prev + 1);
    }
  };

  // Function to handle previous slide with infinite loop
  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex(prev => prev - 1);
    }
  };

  // Handle card click to navigate
  const handleCardClick = (carId, event) => {
    event.stopPropagation();
    setClickedCardId(carId);
    navigate(`/search`);
  };

  // Handle mouse enter/leave for pausing auto-swipe
  const handleMouseEnter = () => {
    setHoverPause(true);
  };
  
  const handleMouseLeave = () => {
    setHoverPause(false);
    if (isSwiping) {
      setIsSwiping(false);
      if (carouselRef.current) {
        carouselRef.current.style.userSelect = '';
      }
      
      setTimeout(() => {
        setIsDragging(false);
      }, 300);
    }
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    const isCard = e.target.closest('[data-card]');
    if (isCard) return;
    
    setTouchStart(e.touches[0].clientX);
    setIsSwiping(true);
    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    
    setTouchEnd(e.touches[0].clientX);
    if (Math.abs(touchStart - e.touches[0].clientX) > 5) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    setIsSwiping(false);
    if (touchStart - touchEnd > 75) {
      handleNext();
    } else if (touchEnd - touchStart > 75) {
      handlePrev();
    }
    
    setTimeout(() => {
      setIsDragging(false);
    }, 300);
  };

  // Handle mouse events for desktop swipe
  const handleMouseDown = (e) => {
    const isCard = e.target.closest('[data-card]');
    if (isCard) return;
    
    setTouchStart(e.clientX);
    setIsSwiping(true);
    setIsDragging(false);
    
    if (carouselRef.current) {
      carouselRef.current.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e) => {
    if (isSwiping) {
      setTouchEnd(e.clientX);
      if (Math.abs(touchStart - e.clientX) > 5) {
        setIsDragging(true);
      }
    }
  };

  const handleMouseUp = () => {
    if (isSwiping) {
      if (touchStart - touchEnd > 75) {
        handleNext();
      } else if (touchEnd - touchStart > 75) {
        handlePrev();
      }
      
      setIsSwiping(false);
      
      if (carouselRef.current) {
        carouselRef.current.style.userSelect = '';
      }
      
      setTimeout(() => {
        setIsDragging(false);
      }, 300);
    }
  };

  // Global mouse up event listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSwiping) {
        setIsSwiping(false);
        if (carouselRef.current) {
          carouselRef.current.style.userSelect = '';
        }
        setTimeout(() => {
          setIsDragging(false);
        }, 300);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSwiping]);

  // Calculate translateX value for the sliding effect
  const translateX = -(activeIndex * itemWidth);

  return (
    <div className="w-full max-w-7xl mt-10 mx-auto py-4 md:py-8 px-4">
      <div className="flex items-center justify-center w-full">
        {/* Left Navigation Button */}
        <button 
          onClick={handlePrev}
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2 md:mr-4"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className={`flex ${isTransitioning ? 'transition-transform duration-300 ease-out' : ''}`}
            style={{ transform: `translateX(${translateX}px)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTransitionEnd={handleTransitionEnd}
            ref={carouselRef}
          >
            {clonedCarModels.map((car, index) => (
              <div 
                key={`${car.id}-${index}`}
                className="flex-shrink-0"
                style={{ width: `${itemWidth}px` }}
              >
                <div 
                  data-card="true"
                  onClick={(e) => handleCardClick(car.id, e)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 py-2 sm:py-3 md:py-4 px-2 sm:px-3 flex flex-col items-center h-full transition-all hover:shadow-md mx-2 cursor-pointer"
                >
                  <div className="w-full h-16 sm:h-20 md:h-24 lg:h-28 flex items-center justify-center mb-1 sm:mb-2">
                    <img 
                      src={car.image}
                      alt={car.name}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-center text-xs sm:text-sm md:text-base font-medium mt-1 sm:mt-2 text-gray-800 truncate w-full">
                    {car.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Navigation Button */}
        <button 
          onClick={handleNext}
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2 md:ml-4"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default UserCarousel2;
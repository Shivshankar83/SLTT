
import React, { useState, useEffect } from "react";

/**
 * WhatsApp Logo Component with Scroll Navigation Buttons
 * Combines WhatsApp chat button and scroll navigation functionality
 * Shows up button when scrolled down and down button when at the top
 * Works with custom scroll containers or window scroll
 * 
 * @param {Object} props
 * @param {string} props.whatsappNumber - WhatsApp number to redirect to (without +)
 * @param {string} props.message - Pre-filled message
 * @param {string} props.scrollContainerId - Optional ID of scrollable container (if not using window scroll)
 */
const Logo = ({ 
  whatsappNumber = "1234567890", 
  message = "Hello, I'm interested in your services!",
  scrollContainerId = null
}) => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  // Get the scroll container - either the specified element or window
  const getScrollContainer = () => {
    if (scrollContainerId) {
      return document.getElementById(scrollContainerId);
    }
    return window;
  };

  // Handle WhatsApp redirect
  const handleWhatsAppRedirect = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  // Check scroll position to determine which button to show
  const checkScrollPosition = () => {
    const scrollContainer = getScrollContainer();
    
    if (scrollContainerId) {
      // For custom scroll container
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      
      // Check if at top
      setIsAtTop(scrollTop <= 400);
      
      // Check if at bottom (with a small buffer)
      const bottomOffset = 100;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - bottomOffset);
    } else {
      // For window scroll
      const currentPosition = window.pageYOffset;
      
      // Check if at top
      setIsAtTop(currentPosition <= 400);
      
      // Check if at bottom
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const bottomOffset = 100;
      
      setIsAtBottom(windowHeight + currentPosition >= documentHeight - bottomOffset);
    }
  };

  const scrollToTop = () => {
    const scrollContainer = getScrollContainer();
    
    if (scrollContainerId) {
      // For custom scroll container
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // For window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    const scrollContainer = getScrollContainer();
    
    if (scrollContainerId) {
      // For custom scroll container
      scrollContainer.scrollTo({ 
        top: scrollContainer.scrollHeight, 
        behavior: 'smooth' 
      });
    } else {
      // For window scroll
      window.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = getScrollContainer();
    
    // Add the event listener to the appropriate element
    scrollContainer.addEventListener('scroll', checkScrollPosition);
    
    // Initial check
    checkScrollPosition();
    
    // Clean up
    return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
  }, [scrollContainerId]); // Re-run if scrollContainerId changes

  return (
    <>
      {/* WhatsApp Button */}
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer transition-all duration-300 hover:scale-110"
        onClick={handleWhatsAppRedirect}
      >
        <div className="bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Scroll Navigation Button */}
      <button 
        onClick={isAtTop ? scrollToBottom : scrollToTop}
        className="fixed right-6 bottom-24 z-50 bg-teal-500 dark:bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
      >
        {isAtTop ? (
          // Down Arrow
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          // Up Arrow
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>
    </>
  );
};

export default Logo;  
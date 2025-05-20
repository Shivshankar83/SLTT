import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const slides = [
  {
    image:
      "https://tmna.aemassets.toyota.com/is/image/toyota/lexus/images/homepage/hero/2025/Lexus-TX-F-Sport-Homepage-Desktop-Hero-1920x795-LEX-TXG-MY25-001301.jpg?wid=1920&hei=795",
    title: "THREE ROWS OF EXHILARATION",
    subtitle: "THE 2025 TX F SPORT HANDLING",
    color: "white",
    buttons: [
      { text: "About Us", link: "/about" },
      { text: "Book Now", link: "/user" },
    ],
  },
  {
    image:
      "https://tmna.aemassets.toyota.com/is/image/toyota/lexus/images/homepage/hero/2025/Lexus-homepage-hero-desktop-1920x795-LEX-RZV-MY26-0001.jpg?wid=1920&amp;hei=795",
    title: "EXPERIENCE LUXURY LIKE NEVER BEFORE",
    subtitle: "THE ALL-NEW LEXUS LX 600",
    color: "white",
    buttons: [
      { text: "About Us", link: "/about" },
      { text: "Book Now", link: "/user" },
    ],
  },
];

const CarCarousel = () => {
  return (
    <div className="w-full mt-6 sm:mt-18">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="relative w-full aspect-[9/10] sm:aspect-[3/2] md:aspect-[16/7] lg:aspect-[16/6]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>

              <div
                className="absolute top-[20%] sm:top-[25%] left-1/2 transform -translate-x-1/2 text-center w-[90%] sm:w-[75%]"
                style={{ color: slide.color }}
              >
                <h2
                  className="text-[clamp(1.2rem,2.8vw,2rem)] sm:text-[clamp(1.4rem,3.5vw,2.5rem)] md:text-[clamp(1.6rem,4vw,3rem)] lg:text-[clamp(1.8rem,4.5vw,3.5rem)] font-normal sm:font-light tracking-wide border-b pb-1 sm:pb-2"
                  style={{ borderColor: slide.color }}
                >
                  {slide.title}
                </h2>
                <h3 className="text-[clamp(0.9rem,2vw,1.3rem)] sm:text-[clamp(1rem,2.5vw,1.6rem)] md:text-[clamp(1.2rem,3vw,2rem)] lg:text-[clamp(1.3rem,3.5vw,2.2rem)] mt-1 sm:mt-2 leading-tight font-extralight sm:font-light">
                  {slide.subtitle}
                </h3>
              </div>

              <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-3 sm:gap-4">
                {slide.buttons.map((btn, i) => (
                  <a
                    key={i}
                    href={btn.link}
                    className="bg-white text-black font-semibold sm:font-bold px-4 py-1.5 sm:px-5 sm:py-2 text-[clamp(0.8rem,1.8vw,0.95rem)] sm:text-[clamp(0.9rem,2.2vw,1.1rem)] border border-black rounded-md flex items-center justify-center hover:bg-gradient-to-r hover:from-red-400 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                  >
                    {btn.text}
                  </a>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarCarousel;

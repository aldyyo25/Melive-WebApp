'use client';

import { useState, useEffect } from 'react';

export const ModernBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      title: "Experience Live Streaming",
      subtitle: "Connect with creators worldwide",
      description: "Join millions of viewers watching live content from their favorite streamers",
      gradient: "from-purple-600 to-blue-600"
    },
    {
      title: "Interactive Entertainment",
      subtitle: "More than just watching",
      description: "Send gifts, chat live, and become part of the streaming community",
      gradient: "from-fuchsia-600 to-pink-600"
    },
    {
      title: "Discover New Creators",
      subtitle: "Endless possibilities",
      description: "Explore trending streams and find your new favorite content creators",
      gradient: "from-violet-600 to-purple-600"
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [banners.length]);
  
  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          {/* Animated banner content */}
          <div className="relative h-64 flex items-center justify-center">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
                  index === currentSlide 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-8'
                }`}
              >
                <div className={`bg-gradient-to-r ${banner.gradient} bg-clip-text text-transparent mb-4`}>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    {banner.title}
                  </h2>
                </div>
                <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">
                  {banner.subtitle}
                </p>
                <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
                  {banner.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Slide indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          {/* Call to action */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold rounded-xl hover:from-fuchsia-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Explore Live Streams
            </button>
            <button className="px-8 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-fuchsia-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-500 rounded-full animate-bounce"></div>
    </div>
  );
};

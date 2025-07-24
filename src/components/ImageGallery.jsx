import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiChevronLeft, FiChevronRight, FiX, FiMaximize2, FiMinimize2, 
  FiImage, FiGrid, FiPlayCircle, FiPause, FiInfo
} = FiIcons;

const ImageGallery = ({ images = [], propertyName = "Property" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('standard'); // standard, grid, slideshow
  const [isPlaying, setIsPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Ensure we have at least one image
  const safeImages = images && images.length > 0 
    ? images 
    : ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!fullscreen) return;
      
      if (e.key === 'Escape') {
        setFullscreen(false);
        setViewMode('standard');
        setIsPlaying(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreen, activeIndex, isPlaying]);

  // Slideshow functionality
  useEffect(() => {
    let slideshowTimer;
    
    if (isPlaying) {
      slideshowTimer = setInterval(() => {
        goToNext();
      }, 3000);
    }
    
    return () => {
      if (slideshowTimer) clearInterval(slideshowTimer);
    };
  }, [isPlaying, activeIndex]);

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % safeImages.length);
  };

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + safeImages.length) % safeImages.length);
  };

  const handleImageClick = () => {
    if (!fullscreen) {
      setFullscreen(true);
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    if (fullscreen) {
      setViewMode('standard');
      setIsPlaying(false);
    }
  };

  const toggleSlideshow = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && viewMode !== 'slideshow') {
      setViewMode('slideshow');
    }
  };

  const toggleGridView = () => {
    setViewMode(viewMode === 'grid' ? 'standard' : 'grid');
    setIsPlaying(false);
  };

  // Touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // If the touch movement is significant enough
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go to next
        goToNext();
      } else {
        // Swipe right, go to previous
        goToPrevious();
      }
    }
  };

  // Image loading error handler
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
  };

  return (
    <div className="relative">
      {/* Standard View */}
      <div className={`${fullscreen ? 'hidden' : 'block'}`}>
        <div className="relative h-96 md:h-[500px] overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={`main-${activeIndex}`}
              src={safeImages[activeIndex]}
              alt={`${propertyName} - Image ${activeIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onError={handleImageError}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          {safeImages.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                aria-label="Previous image"
              >
                <SafeIcon icon={FiChevronLeft} className="h-6 w-6" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                aria-label="Next image"
              >
                <SafeIcon icon={FiChevronRight} className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            aria-label="Enter fullscreen mode"
          >
            <SafeIcon icon={FiMaximize2} className="h-5 w-5" />
          </button>

          {/* Image counter */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              {activeIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {safeImages.length > 1 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
            {safeImages.map((image, index) => (
              <div
                key={`thumb-${index}`}
                className={`relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${
                  index === activeIndex ? 'border-primary-500' : 'border-transparent'
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image}
                  alt={`${propertyName} thumbnail ${index + 1}`}
                  className="h-16 w-16 md:h-20 md:w-20 object-cover"
                  onError={handleImageError}
                />
                {index === activeIndex && (
                  <div className="absolute inset-0 bg-primary-500 bg-opacity-20"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex space-x-3">
            <button
              onClick={toggleFullscreen}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              aria-label="Exit fullscreen"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
            
            <button
              onClick={toggleGridView}
              className={`bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity ${
                viewMode === 'grid' ? 'bg-white bg-opacity-30' : ''
              }`}
              aria-label={viewMode === 'grid' ? "Exit grid view" : "View all images"}
            >
              <SafeIcon icon={FiGrid} className="h-6 w-6" />
            </button>
            
            <button
              onClick={toggleSlideshow}
              className={`bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity ${
                isPlaying ? 'bg-white bg-opacity-30' : ''
              }`}
              aria-label={isPlaying ? "Pause slideshow" : "Start slideshow"}
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlayCircle} className="h-6 w-6" />
            </button>
          </div>
          
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
            {activeIndex + 1} / {safeImages.length}
          </div>
          
          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="w-full h-full p-4 md:p-10 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {safeImages.map((image, index) => (
                  <div
                    key={`grid-${index}`}
                    className={`relative cursor-pointer rounded-lg overflow-hidden ${
                      index === activeIndex ? 'ring-4 ring-primary-500' : ''
                    }`}
                    onClick={() => {
                      setActiveIndex(index);
                      setViewMode('standard');
                    }}
                  >
                    <img
                      src={image}
                      alt={`${propertyName} - Image ${index + 1}`}
                      className="w-full h-48 md:h-64 object-cover"
                      onError={handleImageError}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Standard/Slideshow View */
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`fullscreen-${activeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex items-center justify-center p-4"
                >
                  <img
                    src={safeImages[activeIndex]}
                    alt={`${propertyName} - Image ${activeIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onError={handleImageError}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation arrows */}
              {safeImages.length > 1 && !isMobile && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-opacity"
                    aria-label="Previous image"
                  >
                    <SafeIcon icon={FiChevronLeft} className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-opacity"
                    aria-label="Next image"
                  >
                    <SafeIcon icon={FiChevronRight} className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronLeft, FiChevronRight, FiX, FiMaximize2, FiGrid, FiPlayCircle, FiPause } = FiIcons;

const PropertyImageHero = ({ images = [], propertyName = "Property" }) => {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Ensure we have at least one image
  const safeImages = images && images.length > 0 ? images : [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
  ];

  const featuredImage = safeImages[0];
  const hasMultipleImages = safeImages.length > 1;
  const masonryImages = hasMultipleImages ? safeImages.slice(1, Math.min(5, safeImages.length)) : [];
  const thumbnailImages = safeImages.length > 5 ? safeImages.slice(5) : [];

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fullscreenIndex !== null) {
        if (e.target.classList.contains('fullscreen-modal-background')) {
          closeFullscreen();
        }
      }
      
      if (showAllThumbnails) {
        if (e.target.classList.contains('thumbnails-modal-background')) {
          setShowAllThumbnails(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fullscreenIndex, showAllThumbnails]);

  // Handle image click to open fullscreen
  const handleImageClick = (index) => {
    setFullscreenIndex(index);
  };

  // Navigate in fullscreen
  const goToNext = () => {
    setFullscreenIndex((prev) => (prev + 1) % safeImages.length);
  };

  const goToPrevious = () => {
    setFullscreenIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  // Close fullscreen
  const closeFullscreen = () => {
    setFullscreenIndex(null);
    setIsSlideshow(false);
  };

  // Toggle slideshow
  const toggleSlideshow = () => {
    setIsSlideshow(!isSlideshow);
  };

  // Show all thumbnails
  const handleShowAllThumbnails = () => {
    setShowAllThumbnails(true);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      goToNext();
    }
    if (touchStart - touchEnd < -100) {
      goToPrevious();
    }
  };

  // Slideshow effect
  React.useEffect(() => {
    let interval;
    if (isSlideshow && fullscreenIndex !== null) {
      interval = setInterval(() => {
        goToNext();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSlideshow, fullscreenIndex]);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullscreenIndex === null) return;
      
      if (e.key === 'Escape') {
        closeFullscreen();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleSlideshow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex]);

  // Image error handler
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
  };

  return (
    <div className="w-full">
      {/* Main Hero Section - Dynamic Layout Based on Image Count */}
      <div className={`gap-2 h-96 md:h-[500px] rounded-xl overflow-hidden ${
        hasMultipleImages 
          ? 'grid grid-cols-1 lg:grid-cols-3' 
          : 'flex'
      }`}>
        
        {/* Featured Image - Full width if single image, 2/3 width if multiple */}
        <div className={`relative group cursor-pointer ${
          hasMultipleImages ? 'lg:col-span-2' : 'w-full'
        }`} onClick={() => handleImageClick(0)}>
          <img
            src={featuredImage}
            alt={`${propertyName} - Featured view`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <SafeIcon icon={FiMaximize2} className="h-5 w-5" />
          </div>
          
          {/* Navigation arrows for single image with multiple in array */}
          {!hasMultipleImages && safeImages.length > 1 && (
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
        </div>

        {/* Masonry Images - Only show if there are multiple images */}
        {hasMultipleImages && masonryImages.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {masonryImages.map((image, index) => {
              const actualIndex = index + 1; // +1 because featured is index 0
              
              // Dynamic sizing based on number of masonry images
              let className = "relative group cursor-pointer overflow-hidden rounded-lg";
              
              if (masonryImages.length === 1) {
                className += " h-full"; // Single image takes full height
              } else if (masonryImages.length === 2) {
                className += " h-full"; // Two images split the height equally
              } else if (masonryImages.length === 3) {
                if (index === 0) {
                  className += " row-span-2 h-full"; // First image larger
                } else {
                  className += " h-full";
                }
              } else if (masonryImages.length === 4) {
                className += " h-full"; // All images equal size
              }
              
              return (
                <div
                  key={actualIndex}
                  className={className}
                  onClick={() => handleImageClick(actualIndex)}
                >
                  <img
                    src={image}
                    alt={`${propertyName} - View ${actualIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <SafeIcon icon={FiMaximize2} className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Count and View All Button - Only show if multiple images */}
      {safeImages.length > 1 && (
        <div className="flex justify-between items-center mt-4 mb-6">
          <button 
            onClick={handleShowAllThumbnails} 
            className="text-sm text-gray-600 hover:text-primary-600 cursor-pointer transition-colors"
          >
            {safeImages.length} {safeImages.length === 1 ? 'photo' : 'photos'} - Click to view all
          </button>
          <button 
            onClick={handleShowAllThumbnails} 
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiGrid} className="h-4 w-4" />
            <span>View all photos</span>
          </button>
        </div>
      )}

      {/* Thumbnail Strip (if more than 5 images) */}
      {thumbnailImages.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">More Photos</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {thumbnailImages.map((image, index) => {
              const actualIndex = index + 5; // +5 because first 5 are shown above
              
              return (
                <div
                  key={actualIndex}
                  className="relative flex-shrink-0 cursor-pointer group"
                  onClick={() => handleImageClick(actualIndex)}
                >
                  <img
                    src={image}
                    alt={`${propertyName} thumbnail ${actualIndex + 1}`}
                    className="h-20 w-20 md:h-24 md:w-24 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show All Thumbnails Modal */}
      {showAllThumbnails && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center thumbnails-modal-background">
          <div className="bg-white rounded-xl max-w-7xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                All Photos ({safeImages.length})
              </h3>
              <button 
                onClick={() => setShowAllThumbnails(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiX} className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {safeImages.map((image, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    handleImageClick(index);
                    setShowAllThumbnails(false);
                  }}
                >
                  <img 
                    src={image} 
                    alt={`${propertyName} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center fullscreen-modal-background"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Controls */}
          <div className="absolute top-4 left-4 flex space-x-3 z-10">
            <button
              onClick={closeFullscreen}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              aria-label="Close fullscreen"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
            {safeImages.length > 1 && (
              <button
                onClick={toggleSlideshow}
                className={`bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity ${
                  isSlideshow ? 'bg-white bg-opacity-30' : ''
                }`}
                aria-label={isSlideshow ? "Pause slideshow" : "Start slideshow"}
              >
                <SafeIcon icon={isSlideshow ? FiPause : FiPlayCircle} className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Image counter */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm z-10">
              {fullscreenIndex + 1} / {safeImages.length}
            </div>
          )}

          {/* Main image */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="flex-1 flex items-center justify-center w-full px-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={fullscreenIndex}
                  src={safeImages[fullscreenIndex]}
                  alt={`${propertyName} - Image ${fullscreenIndex + 1}`}
                  className="max-w-full max-h-[75vh] object-contain"
                  onError={handleImageError}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>

            {/* Thumbnails at the bottom - Only show if multiple images */}
            {safeImages.length > 1 && (
              <div className="w-full bg-black bg-opacity-50 py-3 px-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {safeImages.map((image, index) => (
                    <div
                      key={`thumb-${index}`}
                      className={`relative flex-shrink-0 cursor-pointer transition-all ${
                        index === fullscreenIndex ? 'ring-2 ring-primary-500' : ''
                      }`}
                      onClick={() => setFullscreenIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${propertyName} thumbnail ${index + 1}`}
                        className="h-16 w-24 object-cover rounded"
                        onError={handleImageError}
                      />
                      {index === fullscreenIndex && (
                        <div className="absolute inset-0 bg-white bg-opacity-20 rounded"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation arrows - Only show if multiple images */}
            {safeImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-opacity"
                  aria-label="Previous image"
                >
                  <SafeIcon icon={FiChevronLeft} className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-opacity"
                  aria-label="Next image"
                >
                  <SafeIcon icon={FiChevronRight} className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImageHero;
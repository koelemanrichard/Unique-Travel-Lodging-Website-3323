import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiArrowRight, FiMaximize, FiInfo, FiX } = FiIcons;

const VirtualTour = ({ images, name, location }) => {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const containerRef = useRef(null);
  const touchSensitivity = 0.5;
  const dragSensitivity = 0.5;

  // Use panoramic images or create a 360 effect with regular images
  const panoramaImages = images || [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520637736862-4d197d17c92a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];
  
  // Rotate left 45 degrees
  const rotateLeft = () => {
    setCurrentAngle((prev) => (prev - 45) % 360);
  };

  // Rotate right 45 degrees
  const rotateRight = () => {
    setCurrentAngle((prev) => (prev + 45) % 360);
  };

  // Start drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  // Handle touch start for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  // Handle drag
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 5) {
      setCurrentAngle((prev) => (prev + deltaX * dragSensitivity) % 360);
      setStartX(e.clientX);
    }
  };

  // Handle touch move for mobile
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 5) {
      setCurrentAngle((prev) => (prev + deltaX * touchSensitivity) % 360);
      setStartX(e.touches[0].clientX);
    }
  };

  // End drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch end for mobile
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Exit fullscreen on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [fullscreen]);

  // Determine which image to show based on the current angle
  const getImageIndex = () => {
    const normalizedAngle = ((currentAngle % 360) + 360) % 360;
    const segmentSize = 360 / panoramaImages.length;
    return Math.floor(normalizedAngle / segmentSize) % panoramaImages.length;
  };

  // Calculate transform for 3D effect
  const getImageTransform = () => {
    const normalizedAngle = ((currentAngle % 360) + 360) % 360;
    const segmentSize = 360 / panoramaImages.length;
    const currentSegment = Math.floor(normalizedAngle / segmentSize);
    const angleWithinSegment = normalizedAngle - (currentSegment * segmentSize);
    const percentThroughSegment = angleWithinSegment / segmentSize;
    
    return {
      transform: `perspective(1000px) rotateY(${normalizedAngle}deg)`,
      filter: `brightness(${1 - 0.2 * Math.sin(percentThroughSegment * Math.PI)})`
    };
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative ${fullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-96 md:h-[500px]'}`}
        ref={containerRef}
      >
        {/* Main panorama view */}
        <div 
          className="w-full h-full overflow-hidden cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <img
            src={panoramaImages[getImageIndex()]}
            alt={`360° view of ${name || 'property'}`}
            className="w-full h-full object-cover transition-transform duration-200"
            style={getImageTransform()}
          />
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button
            onClick={rotateLeft}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-colors"
            aria-label="Rotate left"
          >
            <SafeIcon icon={FiArrowLeft} className="h-5 w-5" />
          </button>
          <button
            onClick={rotateRight}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-colors"
            aria-label="Rotate right"
          >
            <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-colors"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <SafeIcon icon={FiMaximize} className="h-5 w-5" />
          </button>
        </div>
        
        {/* Information overlay */}
        {showInfo && (
          <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{name || 'Virtual Tour'}</h3>
              {location && <p className="text-sm opacity-90">{location}</p>}
              <p className="text-xs mt-2">Drag to look around or use arrow buttons</p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="p-1 hover:bg-black hover:bg-opacity-30 rounded-full"
              aria-label="Close information"
            >
              <SafeIcon icon={FiX} className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Info button (when info is hidden) */}
        {!showInfo && (
          <button
            onClick={() => setShowInfo(true)}
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
            aria-label="Show information"
          >
            <SafeIcon icon={FiInfo} className="h-5 w-5" />
          </button>
        )}
        
        {/* Exit fullscreen button */}
        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
            aria-label="Exit fullscreen"
          >
            <SafeIcon icon={FiX} className="h-5 w-5" />
          </button>
        )}
      </motion.div>
    </>
  );
};

export default VirtualTour;
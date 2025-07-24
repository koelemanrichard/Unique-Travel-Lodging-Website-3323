import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import L from 'leaflet';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFavorites } from '../contexts/FavoritesContext';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const { FiStar, FiMapPin, FiExternalLink, FiHeart } = FiIcons;

// Fix for marker icons in Leaflet with React
// This is necessary because the default marker icons are not properly loaded in React
const createCustomIcon = (price, category) => {
  // Different colors for different property categories
  const colorMap = {
    'Treehouse': '#2E7D32', // green
    'Castle': '#5D4037', // brown
    'Modern': '#1976D2', // blue
    'Overwater': '#0097A7', // cyan
    'Cave': '#795548', // brown
    'Igloo': '#B3E5FC', // light blue
    'Forest Cabin': '#33691E', // dark green
    'Wellness Retreat': '#9C27B0', // purple
    'Lighthouse': '#E64A19', // orange
    'Houseboat': '#0288D1', // blue
    'Dome': '#7B1FA2', // purple
    'Container Home': '#455A64', // blue grey
    'Windmill': '#FF5722', // deep orange
    'Barn': '#BF360C', // deep orange
  };
  
  const bgColor = colorMap[category] || '#D84315'; // default orange
  
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        €${price}
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42]
  });
};

// Create a custom cluster icon with count
const createClusterCustomIcon = (cluster) => {
  return L.divIcon({
    html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40)
  });
};

// Component to update map view when props change
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const MapView = ({ stays, center, zoom, onMarkerClick, activeStay, setMapLoaded }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Use effect to notify parent when map has loaded
  useEffect(() => {
    setMapLoaded(true);
    return () => setMapLoaded(false);
  }, [setMapLoaded]);

  // Handle favorite toggle
  const handleFavoriteToggle = (e, stay) => {
    e.stopPropagation();
    e.preventDefault();
    if (isFavorite(stay.id)) {
      removeFavorite(stay.id);
    } else {
      addFavorite(stay);
    }
  };

  return (
    <>
      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // We'll add our own zoom control in a better position
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Add markers for each stay with clustering */}
        <MarkerClusterGroup 
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {stays.map(stay => (
            <Marker
              key={stay.id}
              position={stay.coordinates}
              icon={createCustomIcon(stay.price.replace('$', ''), stay.category)}
              eventHandlers={{
                click: () => onMarkerClick(stay),
              }}
            >
              <Popup className="stay-popup">
                <div className="w-64">
                  <div className="relative h-32 mb-2">
                    <img 
                      src={stay.image} 
                      alt={stay.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div 
                      className="absolute top-2 right-2 z-10 bg-white bg-opacity-90 rounded-full p-1.5 cursor-pointer"
                      onClick={(e) => handleFavoriteToggle(e, stay)}
                    >
                      <SafeIcon 
                        icon={FiHeart} 
                        className={`h-5 w-5 ${isFavorite(stay.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                      />
                    </div>
                    <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      {stay.category}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{stay.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiMapPin} className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm text-gray-600">{stay.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiStar} className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{stay.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">€{stay.price.replace('$', '')}</span>
                    <Link 
                      to={`/stay/${stay.id}`} 
                      className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Details
                      <SafeIcon icon={FiExternalLink} className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        {/* Component to update map view when props change */}
        <ChangeMapView center={center} zoom={zoom} />
        
        {/* Custom position for zoom control */}
        <ZoomControl position="bottomright" />
      </MapContainer>
      
      {/* Active stay details overlay */}
      {activeStay && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]"
        >
          <div className="flex items-start">
            <img 
              src={activeStay.image} 
              alt={activeStay.name} 
              className="w-16 h-16 object-cover rounded-md mr-3"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 mb-0.5">{activeStay.name}</h3>
                <button 
                  onClick={(e) => handleFavoriteToggle(e, activeStay)}
                  className="p-1"
                >
                  <SafeIcon 
                    icon={FiHeart} 
                    className={`h-4 w-4 ${isFavorite(activeStay.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`}
                  />
                </button>
              </div>
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <SafeIcon icon={FiMapPin} className="h-3 w-3 mr-1" />
                {activeStay.location}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-600">€{activeStay.price.replace('$', '')}</span>
                <div className="flex items-center">
                  <SafeIcon icon={FiStar} className="h-3.5 w-3.5 text-yellow-400 fill-current mr-0.5" />
                  <span className="text-xs font-medium">{activeStay.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <Link 
            to={`/stay/${activeStay.id}`}
            className="block w-full mt-3 text-center bg-primary-600 hover:bg-primary-700 text-white text-sm py-1.5 rounded transition-colors"
          >
            View Details
          </Link>
        </motion.div>
      )}
    </>
  );
};

export default MapView;
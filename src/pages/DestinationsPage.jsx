import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import MapView from '../components/MapView';
import { useFavorites } from '../contexts/FavoritesContext';
import supabase from '../lib/supabase';

const { FiFilter, FiStar, FiMapPin, FiSearch, FiDollarSign, FiHome, FiMap, FiList, FiX, FiChevronDown, FiSliders, FiGlobe, FiZap, FiWind, FiCheck, FiFlag, FiDroplet, FiSun, FiHeart, FiCoffee, FiShield, FiPlusCircle, FiMinusCircle, FiUsers, FiZoomIn } = FiIcons;

const DestinationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [mapCenter, setMapCenter] = useState([20, 0]); // Default center of the world
  const [mapZoom, setMapZoom] = useState(2); // Default zoom level
  const [activeStay, setActiveStay] = useState(null); // For map popups
  const [mapLoaded, setMapLoaded] = useState(false);
  const [allStays, setAllStays] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Fetch properties from Supabase when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        console.log('Fetching properties from Supabase...');
        
        const { data, error } = await supabase
          .from('properties_j293sk4l59')
          .select('*')
          .eq('status', 'Active')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching properties:', error);
          // Fall back to sample data if there's an error
          setAllStays(sampleStays);
        } else {
          console.log('Properties fetched successfully:', data);
          if (data && data.length > 0) {
            // Transform the data to match the expected format
            const formattedStays = data.map(property => ({
              id: property.id,
              name: property.name,
              location: property.location,
              image: property.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              rating: property.rating || 4.5,
              price: property.price?.toString() || '0',
              priceValue: parseFloat(property.price) || 0,
              category: property.category || 'Modern',
              environment: property.environment || ["Rural"],
              features: property.features || ["Garden"],
              suitability: property.suitability || ["Digital nomads"],
              sustainability: property.sustainability || ["Eco-friendly"],
              destination: property.destination || "Europe",
              guests: property.guests || 2,
              coordinates: property.coordinates || [Math.random() * 180 - 90, Math.random() * 360 - 180] // Random coordinates if none provided
            }));
            setAllStays(formattedStays);
          } else {
            // Fall back to sample data if no data returned
            setAllStays(sampleStays);
          }
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setAllStays(sampleStays);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter options
  const categories = [
    'All', 'Treehouse', 'Castle', 'Modern', 'Overwater', 'Cave', 'Igloo', 
    'Forest Cabin', 'Wellness Retreat', 'Lighthouse', 'Houseboat', 'Dome', 
    'Container Home', 'Windmill', 'Barn'
  ];

  const locations = [
    'Costa Rica', 'Scotland', 'Morocco', 'Maldives', 'Turkey', 'Finland', 
    'Japan', 'New Zealand', 'Norway', 'Indonesia'
  ];

  // Color mapping for categories and filters
  const categoryColorMap = {
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

  // Get category color or default
  const getCategoryColor = (category) => {
    return categoryColorMap[category] || '#D84315'; // default orange
  };

  // Sample stays data with coordinates (fallback data)
  const sampleStays = [
    {
      id: 1,
      name: "Treehouse Paradise",
      location: "Costa Rica",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      price: "180",
      priceValue: 180,
      category: "Treehouse",
      environment: ["In a forest", "Tropical"],
      features: ["Hammock", "Outdoor shower", "Floor-to-ceiling windows"],
      suitability: ["Romantic", "Adventure seekers"],
      sustainability: ["Eco-friendly", "Solar powered"],
      destination: "North America",
      guests: 2,
      coordinates: [9.9281, -84.0907] // San Jose, Costa Rica
    },
    {
      id: 2,
      name: "Castle in the Clouds",
      location: "Scotland",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c92a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      price: "450",
      priceValue: 450,
      category: "Castle",
      environment: ["Rural", "Mountain view"],
      features: ["Fireplace", "Garden", "Private chef"],
      suitability: ["Family friendly", "Group retreat"],
      sustainability: ["Local community support"],
      destination: "Europe",
      guests: 8,
      coordinates: [56.4907, -4.2026] // Scottish Highlands
    },
    {
      id: 3,
      name: "Desert Glass House",
      location: "Morocco",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      price: "320",
      priceValue: 320,
      category: "Modern",
      environment: ["Desert", "Remote"],
      features: ["Floor-to-ceiling windows", "Private pool", "Stargazing deck"],
      suitability: ["Romantic", "Photography"],
      sustainability: ["Solar powered", "Water conservation"],
      destination: "Africa",
      guests: 4,
      coordinates: [31.6295, -7.9811] // Morocco
    }
  ];

  // Calculate max price for range filter
  const maxPrice = Math.max(...allStays.map(stay => stay.priceValue), 1000);

  // Update active filters count
  useEffect(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedLocations.length > 0) count++;
    if (minRating > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    setActiveFilters(count);
  }, [selectedCategory, selectedLocations, minRating, priceRange, maxPrice]);

  const filteredStays = allStays.filter(stay => {
    // Text search
    const matchesSearch = searchTerm === '' || 
      stay.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      stay.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
      stay.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || stay.category === selectedCategory;
    
    // Price range filter
    const matchesPrice = stay.priceValue >= priceRange[0] && stay.priceValue <= priceRange[1];
    
    // Location filter
    const matchesLocation = selectedLocations.length === 0 || 
      selectedLocations.includes(stay.location);
    
    // Rating filter
    const matchesRating = stay.rating >= minRating;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesLocation && matchesRating;
  });

  // Reset all filters
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, maxPrice]);
    setSelectedLocations([]);
    setMinRating(0);
    setSearchTerm('');
    
    // Reset map view
    setMapCenter([20, 0]);
    setMapZoom(2);
  };

  // Toggle selection helpers
  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Handle location selection
  const toggleLocation = (location) => {
    toggleSelection(location, selectedLocations, setSelectedLocations);
  };

  // Handle map marker click
  const handleMarkerClick = (stay) => {
    setActiveStay(stay);
  };

  // Zoom to stay location
  const zoomToStay = (stay) => {
    if (stay.coordinates) {
      setMapCenter(stay.coordinates);
      setMapZoom(12); // Zoom in closely
      setViewMode('map'); // Switch to map view
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e, stay) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(stay.id)) {
      removeFavorite(stay.id);
    } else {
      addFavorite(stay);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-7xl px-4">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-16 min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Unique Destinations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover extraordinary places to stay around the world
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations, locations, or stay types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {/* View toggle buttons */}
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center justify-center px-4 py-3 ${
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={FiList} className="h-5 w-5" />
                    <span className="ml-2 hidden sm:inline">List</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center justify-center px-4 py-3 ${
                      viewMode === 'map'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={FiMap} className="h-5 w-5" />
                    <span className="ml-2 hidden sm:inline">Map</span>
                  </button>
                </div>
                <button
                  onClick={() => setFiltersVisible(!filtersVisible)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiSliders} className="h-5 w-5" />
                  <span>Filters</span>
                  {activeFilters > 0 && (
                    <span className="bg-white text-primary-700 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium">
                      {activeFilters}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Panel */}
      {filtersVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-b border-gray-200 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: €{priceRange[0]} - €{priceRange[1]}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {locations.map(location => (
                    <label key={location} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => toggleLocation(location)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating: {minRating > 0 ? minRating : 'Any'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilters > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiX} className="h-4 w-4 mr-2" />
                  Clear all filters ({activeFilters})
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-medium">{filteredStays.length}</span>{' '}
            {filteredStays.length === 1 ? 'stay' : 'stays'} found
            {activeFilters > 0 && ' matching your filters'}
          </p>
        </div>

        {/* View content - Map or List */}
        {viewMode === 'map' ? (
          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            style={{ height: '70vh', minHeight: '600px' }}
          >
            <MapView
              stays={filteredStays}
              center={mapCenter}
              zoom={mapZoom}
              onMarkerClick={handleMarkerClick}
              activeStay={activeStay}
              setMapLoaded={setMapLoaded}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStays.map((stay, index) => (
              <motion.div
                key={stay.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer relative"
              >
                <Link to={`/stay/${stay.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={stay.image}
                      alt={stay.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: getCategoryColor(stay.category) }}
                    >
                      {stay.category}
                    </div>
                    {/* Environment Tag */}
                    {stay.environment && stay.environment[0] && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {stay.environment[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {stay.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <SafeIcon
                          icon={FiStar}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                        <span className="text-sm font-medium text-gray-700">{stay.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-4">
                      <SafeIcon icon={FiMapPin} className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{stay.location}</span>
                    </div>
                    {/* Feature Tags */}
                    {stay.features && stay.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {stay.features.slice(0, 2).map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {stay.features.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            +{stay.features.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">€{stay.price}</span>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">per night</span>
                        <span className="text-sm text-gray-600 flex items-center">
                          <SafeIcon icon={FiUsers} className="h-4 w-4 mr-1" />
                          {stay.guests}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Favorite button */}
                <button
                  onClick={(e) => handleFavoriteToggle(e, stay)}
                  className="absolute top-4 right-16 bg-white bg-opacity-90 p-2 rounded-full shadow-md"
                >
                  <SafeIcon
                    icon={FiHeart}
                    className={`h-5 w-5 ${
                      isFavorite(stay.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                    }`}
                  />
                </button>
                {/* Zoom to location button */}
                <button
                  onClick={() => zoomToStay(stay)}
                  className="absolute bottom-4 right-4 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-700 transition-colors"
                  title="View on map"
                >
                  <SafeIcon icon={FiZoomIn} className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {filteredStays.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <SafeIcon icon={FiFilter} className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stays found</h3>
            <p className="text-gray-500 text-lg mb-6">
              No stays match your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiX} className="h-5 w-5 mr-2" />
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DestinationsPage;
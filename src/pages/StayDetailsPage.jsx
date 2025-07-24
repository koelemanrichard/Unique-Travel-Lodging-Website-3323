import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFavorites } from '../contexts/FavoritesContext';
import WeatherWidget from '../components/WeatherWidget';
import VirtualTour from '../components/VirtualTour';
import LocalExperiencesCarousel from '../components/LocalExperiencesCarousel';
import PriceAlerts from '../components/PriceAlerts';
import ImageGallery from '../components/ImageGallery';
import supabase from '../lib/supabase';

const { 
  FiStar, FiMapPin, FiWifi, FiCoffee, FiCar, FiShield, FiCamera, 
  FiSun, FiCloud, FiDroplet, FiThermometer, FiCompass, FiHeart, 
  FiCalendar, FiAward, FiCheckCircle, FiInfo, FiTarget, FiLocation, 
  FiLoader, FiMap, FiList
} = FiIcons;

// Use FiCompass as FiVirtualTour
const FiVirtualTour = FiCompass;

const StayDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('photos'); // 'photos','virtual-tour',or 'map' 
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite, getNote } = useFavorites();

  // Fetch property data when component mounts
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        console.log('Fetching property details for ID:', id);
        const { data, error } = await supabase
          .from('properties_j293sk4l59')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching property:', error);
          setError('Failed to load property details');
          // Fall back to sample data
          const fallbackData = stayData[id] || stayData[1];
          setProperty(fallbackData);
        } else {
          console.log('Property fetched successfully:', data);
          if (data) {
            // Transform the data to match the expected format
            const formattedProperty = {
              id: data.id,
              name: data.name,
              location: data.location,
              images: Array.isArray(data.images) && data.images.length > 0 
                ? data.images 
                : data.image 
                  ? [data.image] 
                  : [
                      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                      "https://images.unsplash.com/photo-1520637736862-4d197d17c92a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    ],
              rating: data.rating || 4.5,
              price: `$${data.price}`,
              category: data.category || 'Modern',
              description: data.description || `Experience this amazing ${data.category || 'stay'} in ${data.location}. This unique accommodation offers a perfect blend of comfort and adventure.`,
              // Use sample data for these complex properties
              amenities: stayData[1].amenities,
              features: stayData[1].features,
              uniqueFeatures: stayData[1].uniqueFeatures,
              localExperiences: stayData[1].localExperiences,
              sustainability: stayData[1].sustainability,
              weather: stayData[1].weather,
              guestStories: stayData[1].guestStories
            };
            setProperty(formattedProperty);
          } else {
            // Fall back to sample data if no data returned
            setProperty(stayData[id] || stayData[1]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch property:', error);
        setError('An unexpected error occurred');
        setProperty(stayData[id] || stayData[1]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Mock data - used as fallback when database fetch fails
  const stayData = {
    1: {
      id: 1,
      name: "Treehouse Paradise",
      location: "Monteverde, Costa Rica",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1520637736862-4d197d17c92a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ],
      rating: 4.9,
      price: "$180",
      category: "Treehouse",
      description: "Experience the magic of staying high in the canopy of Costa Rica's lush rainforest. This incredible treehouse offers a unique blend of luxury and nature, with panoramic views of the jungle and wildlife right at your doorstep.",
      amenities: [
        { icon: FiWifi, name: "Free WiFi" },
        { icon: FiCoffee, name: "Kitchen" },
        { icon: FiCar, name: "Free Parking" },
        { icon: FiShield, name: "Safe & Secure" }
      ],
      features: [
        "360-degree jungle views",
        "Private bathroom with rainforest shower",
        "Sustainable eco-friendly construction",
        "Wildlife watching opportunities",
        "Guided nature walks included",
        "Romantic dinner setup available"
      ],
      // New detailed information
      uniqueFeatures: {
        elevation: "90 feet above ground",
        buildYear: 2018,
        architecture: "Sustainable bamboo and reclaimed hardwood",
        accessibility: "Spiral staircase and rope bridge access",
        awards: ["Eco-Tourism Excellence Award 2022", "Top 10 Unique Stays in Central America"]
      },
      localExperiences: [
        { name: "Canopy Zipline Tour", distance: "1.2 miles", description: "Soar through the rainforest canopy on Costa Rica's most thrilling zipline course" },
        { name: "Cloud Forest Reserve", distance: "3 miles", description: "Explore one of the world's most diverse ecosystems with over 2,500 plant species" },
        { name: "Night Jungle Safari", distance: "On-site", description: "Guided nocturnal tour to spot rare wildlife like kinkajous and tarantulas" },
        { name: "Local Coffee Plantation", distance: "5 miles", description: "Learn the process of coffee production from bean to cup with tasting session" }
      ],
      sustainability: {
        energySource: "100% solar powered",
        waterConservation: "Rainwater collection and filtration system",
        wasteManagement: "Composting toilets and zero-waste initiatives",
        localCommunity: "Employs local guides and staff, supports regional conservation efforts"
      },
      weather: {
        bestTime: "December to April (dry season)",
        temperature: "65-75°F year-round (18-24°C)",
        rainfall: "Heavy during green season (May-November)",
        humidity: "High (70-90%)"
      },
      guestStories: [
        { name: "Emily & James", from: "Canada", story: "We woke up to a family of howler monkeys right outside our window! The sunrise view from the deck was absolutely breathtaking.", date: "March 2023" },
        { name: "Akira", from: "Japan", story: "Spotted 27 different bird species from the treehouse deck in just one morning. The hummingbirds would come right up to the railings!", date: "January 2023" }
      ]
    },
    2: {
      id: 2,
      name: "Castle in the Clouds",
      location: "Scottish Highlands, Scotland",
      images: [
        "https://images.unsplash.com/photo-1520637736862-4d197d17c92a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542320260-f8f651de8c12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ],
      rating: 4.8,
      price: "$450",
      category: "Castle",
      description: "Step back in time at this 16th-century Scottish castle nestled in the misty Highlands. Featuring original stone architecture, period furnishings, and modern luxuries, this castle offers a truly royal experience with breathtaking mountain and loch views.",
      amenities: [
        { icon: FiWifi, name: "Free WiFi" },
        { icon: FiCoffee, name: "Full Kitchen" },
        { icon: FiCar, name: "Free Parking" },
        { icon: FiShield, name: "24/7 Security" }
      ],
      features: [
        "Four-poster beds in all bedrooms",
        "Great Hall with original fireplace",
        "Private loch access",
        "Wine cellar and tasting room",
        "Library with rare book collection",
        "Private chef available"
      ],
      // New detailed information
      uniqueFeatures: {
        built: "1563, restored 2015",
        architecture: "Scottish Baronial",
        history: "Former residence of the Clan MacKenzie, site of the Highland Gathering of 1689",
        secretFeatures: "Hidden passages and priest holes from the Reformation era",
        awards: ["Historic Preservation Award 2017", "Heritage Accommodation of Excellence 2021"]
      },
      localExperiences: [
        { name: "Whisky Distillery Tour", distance: "7 miles", description: "Private tour of an authentic Highland distillery with exclusive tastings" },
        { name: "Loch Boat Trip", distance: "On-site", description: "Row boat provided for guests to explore the misty waters and hidden islands" },
        { name: "Highland Hiking Trails", distance: "From doorstep", description: "Access to private estate trails with views across the Highlands" },
        { name: "Traditional Ceilidh Night", distance: "Available on-site", description: "Experience traditional Scottish dancing and music in the Great Hall" }
      ],
      sustainability: {
        heating: "Biomass heating system using sustainable local timber",
        preservation: "Working with Historic Scotland on conservation efforts",
        localSourcing: "Farm-to-table ingredients from the estate and local producers",
        wildlife: "Estate manages red deer conservation program and bird sanctuary"
      },
      weather: {
        bestTime: "May to September",
        temperature: "50-65°F summer, 30-45°F winter (10-18°C / -1-7°C)",
        rainfall: "Frequent throughout the year",
        phenomenon: "Northern Lights visible during winter months"
      },
      guestStories: [
        { name: "The Williams Family", from: "United States", story: "Our children felt like princes and princesses for the week! The staff arranged a medieval banquet complete with costumes.", date: "July 2023" },
        { name: "Henrik & Sofia", from: "Sweden", story: "We saw the Northern Lights from the castle battlements. The caretaker showed us secret rooms that aren't on any floor plans!", date: "December 2022" }
      ]
    }
    // Other properties...
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!property) return;

    if (isFavorite(property.id)) {
      // Check if there's a note for this stay
      const hasNote = getNote(property.id) && getNote(property.id).trim() !== '';
      
      // If there's a note, ask for confirmation
      if (hasNote) {
        const confirmed = window.confirm(
          "This favorite has notes attached to it. Are you sure you want to remove it? Your notes will be deleted."
        );
        if (!confirmed) return;
      }
      
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !property) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <SafeIcon icon={FiInfo} className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Property</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-primary-600 text-white px-4 py-2 rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no property data is available, show an error
  if (!property) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <SafeIcon icon={FiInfo} className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Format weather info for display
  const formattedWeather = [
    { icon: FiSun, label: "Best Time", value: property.weather.bestTime },
    { icon: FiThermometer, label: "Temperature", value: property.weather.temperature },
    { icon: FiDroplet, label: "Rainfall", value: property.weather.rainfall },
    {
      icon: FiCloud,
      label: "Special",
      value: property.weather.specialCondition || property.weather.humidity || property.weather.phenomenon || property.weather.polarNight || property.weather.midnightSun || property.weather.waterTemperature || property.weather.snowfall
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-16 min-h-screen bg-white"
    >
      {/* View Mode Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => setViewMode('photos')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                viewMode === 'photos' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={FiCamera} className="h-5 w-5 inline mr-2" />
              Photos
            </button>
            <button
              onClick={() => setViewMode('virtual-tour')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                viewMode === 'virtual-tour' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={FiVirtualTour} className="h-5 w-5 inline mr-2" />
              Virtual Tour
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                viewMode === 'map' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={FiMap} className="h-5 w-5 inline mr-2" />
              Map
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'photos' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ImageGallery images={property.images} propertyName={property.name} />
        </div>
      )}
      
      {viewMode === 'virtual-tour' && (
        <div className="h-96 md:h-[500px]">
          <VirtualTour images={property.images} name={property.name} location={property.location} />
        </div>
      )}
      
      {viewMode === 'map' && (
        <div className="h-96 md:h-[500px] bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <SafeIcon icon={FiMapPin} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Interactive map would be displayed here</p>
            <p className="text-gray-400 text-sm mt-2">Using actual coordinates for {property.location}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
                    {property.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiStar} className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-700">{property.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiMapPin} className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{property.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite(property.id) ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400'
                    }`}
                    aria-label={isFavorite(property.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <SafeIcon icon={FiHeart} className={`h-6 w-6 ${isFavorite(property.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="bg-primary-600 text-white px-4 py-2 rounded-full font-medium">
                    {property.category}
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {property.description}
              </p>

              {/* Weather Widget */}
              <div className="mb-8">
                <WeatherWidget location={property.location} />
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 font-medium text-sm border-b-2 ${
                      activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('unique')}
                    className={`py-4 font-medium text-sm border-b-2 ${
                      activeTab === 'unique' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    What Makes It Special
                  </button>
                  <button
                    onClick={() => setActiveTab('experiences')}
                    className={`py-4 font-medium text-sm border-b-2 ${
                      activeTab === 'experiences' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Local Experiences
                  </button>
                  <button
                    onClick={() => setActiveTab('stories')}
                    className={`py-4 font-medium text-sm border-b-2 ${
                      activeTab === 'stories' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Guest Stories
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Amenities */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <SafeIcon icon={amenity.icon} className="h-5 w-5 text-primary-600" />
                          <span className="text-gray-700">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {property.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-primary-600 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weather Information */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Weather & Climate</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formattedWeather.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <SafeIcon icon={item.icon} className="h-5 w-5 text-primary-600 mt-0.5" />
                          <div>
                            <span className="block text-sm font-medium text-gray-500">{item.label}</span>
                            <span className="text-gray-700">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Unique Features Tab */}
              {activeTab === 'unique' && (
                <div className="space-y-8">
                  {/* What Makes It Special */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Unique Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(property.uniqueFeatures)
                        .filter(([key]) => key !== 'awards')
                        .map(([key, value], index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="bg-primary-100 p-2 rounded-full">
                              <SafeIcon icon={FiInfo} className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 capitalize">{key}</h4>
                              <p className="text-gray-700">{value}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Awards & Recognition */}
                  {property.uniqueFeatures.awards && property.uniqueFeatures.awards.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Awards & Recognition</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="space-y-3">
                          {property.uniqueFeatures.awards.map((award, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <SafeIcon icon={FiAward} className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <span className="text-gray-700">{award}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Sustainability */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sustainability Practices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(property.sustainability).map(([key, value], index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="mt-0.5">
                            <SafeIcon icon={FiTarget} className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-gray-700 text-sm">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Local Experiences Tab */}
              {activeTab === 'experiences' && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Nearby Experiences</h3>
                  {/* Local Experiences Carousel */}
                  <LocalExperiencesCarousel location={property.location} />
                  <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="flex items-start space-x-3">
                      <SafeIcon icon={FiCompass} className="h-6 w-6 text-primary-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Personalized Experiences</h4>
                        <p className="text-gray-700 text-sm">
                          Our local hosts can arrange custom experiences tailored to your interests. Contact us before your stay to discuss special arrangements or unique activities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Guest Stories Tab */}
              {activeTab === 'stories' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Guest Stories & Experiences</h3>
                  <div className="space-y-6">
                    {property.guestStories.map((story, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-gray-50 p-6 rounded-lg"
                      >
                        <p className="text-gray-700 italic mb-4">"{story.story}"</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-primary-700 font-medium">
                                {story.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{story.name}</h4>
                              <p className="text-sm text-gray-600">from {story.from}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <SafeIcon icon={FiCalendar} className="h-4 w-4 mr-1" />
                            <span>{story.date}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <SafeIcon icon={FiHeart} className="h-5 w-5 text-red-500 mr-2" />
                      Share Your Story
                    </h4>
                    <p className="text-gray-700">
                      Had a memorable experience at {property.name}? We'd love to hear about it! Share your story with us after your stay and it might be featured here.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-24"
            >
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-primary-600">{property.price}</span>
                <span className="text-gray-500 ml-2">per night</span>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors duration-300 mb-4">
                Book Now
              </button>
              <button
                onClick={handleFavoriteToggle}
                className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors duration-300 mb-4 flex items-center justify-center space-x-2 ${
                  isFavorite(property.id) ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SafeIcon icon={FiHeart} className={`h-5 w-5 ${isFavorite(property.id) ? 'fill-current' : ''}`} />
                <span>{isFavorite(property.id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>
              <div className="text-center text-sm text-gray-500 mb-4">
                You won't be charged yet
              </div>

              {/* Special Offers */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-3">Special Offers</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-gray-900">Stay 4 nights, pay for 3</span>
                      <span className="text-xs text-gray-500">Valid for stays during off-peak season</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-gray-900">Complimentary experience</span>
                      <span className="text-xs text-gray-500">Book 5+ nights for a free local activity</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Alerts */}
              <div className="border-t border-gray-200 pt-4 mt-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Alerts</h4>
                <PriceAlerts />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StayDetailsPage;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFavorites } from '../contexts/FavoritesContext';

const { FiStar, FiMapPin, FiHeart, FiTrendingUp, FiRefreshCw, FiCheck } = FiIcons;

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState([]);
  const [availablePreferences] = useState([
    'Adventure', 'Relaxation', 'Romance', 'Family', 'Culture', 'Nature',
    'Luxury', 'Budget', 'Photography', 'Food', 'Wellness', 'History'
  ]);
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Generate AI recommendations based on favorites and preferences
  useEffect(() => {
    const generateRecommendations = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app, this would come from an AI recommendation API
      const mockStays = [
        {
          id: 20,
          name: "Alpine Eco-Pod",
          location: "Swiss Alps, Switzerland",
          image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          rating: 4.9,
          price: "380",
          category: "Modern",
          matchScore: 98,
          matchReasons: ['Based on your Nature preference', 'Similar to Mountain Cave Retreat']
        },
        {
          id: 21,
          name: "Lakeside Glass Cabin",
          location: "Ontario, Canada",
          image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          rating: 4.7,
          price: "290",
          category: "Forest Cabin",
          matchScore: 95,
          matchReasons: ['Based on your Photography preference', 'Similar to Desert Glass House']
        },
        {
          id: 22,
          name: "Tropical Canopy Villa",
          location: "Bali, Indonesia",
          image: "https://images.unsplash.com/photo-1470165511815-34e78ff7a111?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          rating: 4.8,
          price: "220",
          category: "Treehouse",
          matchScore: 91,
          matchReasons: ['Based on your Romance preference', 'Matches your favorited locations']
        },
        {
          id: 23,
          name: "Historic Lighthouse Keeper's Home",
          location: "Maine, USA",
          image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          rating: 4.6,
          price: "245",
          category: "Lighthouse",
          matchScore: 89,
          matchReasons: ['Based on your History preference', 'Similar to Coastal Lighthouse']
        }
      ];
      
      // Filter recommendations based on selected preferences
      let filteredRecommendations = [...mockStays];
      
      if (preferences.length > 0) {
        filteredRecommendations = mockStays.filter(stay => {
          // Check if any of the user's preferences match the stay's matchReasons
          return preferences.some(pref => 
            stay.matchReasons.some(reason => 
              reason.toLowerCase().includes(pref.toLowerCase())
            )
          );
        });
        
        // If nothing matches, return all recommendations
        if (filteredRecommendations.length === 0) {
          filteredRecommendations = mockStays;
        }
      }
      
      setRecommendations(filteredRecommendations);
      setLoading(false);
    };

    generateRecommendations();
  }, [preferences, favorites]);

  // Toggle preference selection
  const togglePreference = (preference) => {
    setPreferences(prev => 
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
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

  // Refresh recommendations
  const handleRefresh = () => {
    setLoading(true);
    // In a real app, this would call the AI recommendation API again
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Personalized AI Recommendations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover unique stays tailored to your preferences and favorites
          </p>
        </motion.div>
        
        {/* Preference Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {availablePreferences.map((preference) => (
              <button
                key={preference}
                onClick={() => togglePreference(preference)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  preferences.includes(preference)
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {preferences.includes(preference) && (
                  <SafeIcon icon={FiCheck} className="h-3 w-3 inline-block mr-1" />
                )}
                {preference}
              </button>
            ))}
          </div>
        </div>
        
        {/* Refresh Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white text-primary-600 rounded-full border border-primary-200 hover:bg-primary-50 transition-colors"
          >
            <SafeIcon 
              icon={FiRefreshCw} 
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} 
            />
            Refresh Recommendations
          </button>
        </div>
        
        {/* Recommendations */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-6 w-full"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((stay, index) => (
              <motion.div
                key={stay.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {stay.category}
                    </div>
                    <div className="absolute top-4 right-16 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <SafeIcon icon={FiTrendingUp} className="h-3 w-3 mr-1" />
                      {stay.matchScore}% Match
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {stay.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiStar} className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{stay.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-4">
                      <SafeIcon icon={FiMapPin} className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{stay.location}</span>
                    </div>
                    
                    {/* Match Reasons */}
                    <div className="mb-4">
                      {stay.matchReasons.map((reason, idx) => (
                        <p key={idx} className="text-xs text-green-600 mb-1 flex items-center">
                          <span className="inline-block w-1 h-1 bg-green-600 rounded-full mr-2"></span>
                          {reason}
                        </p>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">€{stay.price}</span>
                      <span className="text-gray-500">per night</span>
                    </div>
                  </div>
                </Link>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => handleFavoriteToggle(e, stay)}
                  className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full shadow-md"
                >
                  <SafeIcon
                    icon={FiHeart}
                    className={`h-5 w-5 ${
                      isFavorite(stay.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                    }`}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIRecommendations;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMapPin, FiClock, FiStar, FiChevronLeft, FiChevronRight, FiHeart } = FiIcons;

const LocalExperiencesCarousel = ({ location }) => {
  const [experiences, setExperiences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Get mock experiences based on location
  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on location
      const mockExperiences = getMockExperiences(location);
      setExperiences(mockExperiences);
      setLoading(false);
    };
    
    fetchExperiences();
  }, [location]);

  // Mock experiences data
  const getMockExperiences = (locationName) => {
    const allExperiences = {
      'Costa Rica': [
        {
          id: 1,
          title: "Rainforest Canopy Zipline Adventure",
          image: "https://images.unsplash.com/photo-1544273677-c433136021d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Monteverde Cloud Forest",
          duration: "3 hours",
          rating: 4.9,
          price: "89",
          description: "Soar through the rainforest canopy on Costa Rica's most thrilling zipline course, spanning over 2 miles of cables with 14 platforms."
        },
        {
          id: 2,
          title: "Night Jungle Safari",
          image: "https://images.unsplash.com/photo-1596306499317-8490e6e45deb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Manuel Antonio National Park",
          duration: "2.5 hours",
          rating: 4.8,
          price: "65",
          description: "Discover the nocturnal creatures of the rainforest on this guided tour where you'll spot sloths, frogs, insects and maybe even kinkajous."
        },
        {
          id: 3,
          title: "Coffee Plantation Tour & Tasting",
          image: "https://images.unsplash.com/photo-1611080626919-7cf5a9041d72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Naranjo Valley",
          duration: "4 hours",
          rating: 4.7,
          price: "45",
          description: "Learn about Costa Rican coffee production from bean to cup with expert guides, followed by a tasting session of premium coffees."
        }
      ],
      'Scotland': [
        {
          id: 4,
          title: "Highland Whisky Distillery Tour",
          image: "https://images.unsplash.com/photo-1574725311001-a003383a2a94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Speyside",
          duration: "6 hours",
          rating: 4.9,
          price: "120",
          description: "Visit three historic whisky distilleries in the heart of the Scottish Highlands with tastings of rare single malts and expert commentary."
        },
        {
          id: 5,
          title: "Loch Ness & Urquhart Castle Tour",
          image: "https://images.unsplash.com/photo-1587259019855-6a6c0d3b0310?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Inverness",
          duration: "7 hours",
          rating: 4.7,
          price: "85",
          description: "Explore the mysterious Loch Ness and the ruins of the historic Urquhart Castle with tales of Nessie and Highland history."
        },
        {
          id: 6,
          title: "Traditional Scottish Ceilidh Night",
          image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Edinburgh",
          duration: "4 hours",
          rating: 4.8,
          price: "75",
          description: "Experience traditional Scottish dancing, music and storytelling while enjoying authentic food and whisky in a historic venue."
        }
      ],
      'Morocco': [
        {
          id: 7,
          title: "Marrakech Medina Food Tour",
          image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Marrakech",
          duration: "4 hours",
          rating: 4.9,
          price: "70",
          description: "Sample authentic Moroccan street food as you navigate the winding alleys of the ancient Marrakech Medina with a local food expert."
        },
        {
          id: 8,
          title: "Sahara Desert Camel Trek & Camp",
          image: "https://images.unsplash.com/photo-1561053362-2d9dd9f1f6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Merzouga",
          duration: "Overnight",
          rating: 4.9,
          price: "150",
          description: "Journey by camel across the golden dunes of the Sahara to a traditional Berber camp for an evening of stargazing and music."
        },
        {
          id: 9,
          title: "Atlas Mountains Day Hike",
          image: "https://images.unsplash.com/photo-1528148343865-51218c4a13e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "High Atlas",
          duration: "8 hours",
          rating: 4.7,
          price: "95",
          description: "Trek through stunning mountain landscapes and traditional Berber villages with a local guide, including a home-cooked lunch."
        }
      ],
      'default': [
        {
          id: 10,
          title: "Local Cooking Class",
          image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "City Center",
          duration: "3 hours",
          rating: 4.8,
          price: "75",
          description: "Learn to prepare authentic local dishes with a professional chef using fresh ingredients from the local market."
        },
        {
          id: 11,
          title: "Historical Walking Tour",
          image: "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Old Town",
          duration: "2.5 hours",
          rating: 4.7,
          price: "35",
          description: "Discover hidden gems and fascinating stories about the city's rich history with an expert local guide."
        },
        {
          id: 12,
          title: "Sunset Sailing Trip",
          image: "https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          location: "Harbor",
          duration: "3 hours",
          rating: 4.9,
          price: "95",
          description: "Enjoy breathtaking views of the coastline while sipping champagne and watching the sun set over the horizon."
        }
      ]
    };

    // Extract country from location string
    const country = locationName ? locationName.split(',').pop().trim() : '';
    
    // Find matching experiences or use default
    for (const [key, value] of Object.entries(allExperiences)) {
      if (country.includes(key) || key.includes(country)) {
        return value;
      }
    }
    
    return allExperiences.default;
  };

  // Move to next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === experiences.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Move to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? experiences.length - 1 : prevIndex - 1
    );
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setFavorites((prev) => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-16 bg-gray-200 rounded mt-4"></div>
      </div>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Local Experiences</h3>
        <p className="text-gray-600 mb-6">Discover authentic activities and adventures near your stay</p>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={currentIndex}
            className="flex flex-col md:flex-row"
          >
            {/* Image */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img
                src={experiences[currentIndex].image}
                alt={experiences[currentIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleFavorite(experiences[currentIndex].id)}
                  className="bg-white bg-opacity-80 p-2 rounded-full shadow-md"
                >
                  <SafeIcon
                    icon={FiHeart}
                    className={`h-5 w-5 ${
                      favorites.includes(experiences[currentIndex].id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="md:w-1/2 p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {experiences[currentIndex].title}
              </h4>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <SafeIcon icon={FiMapPin} className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{experiences[currentIndex].location}</span>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiClock} className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{experiences[currentIndex].duration}</span>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiStar} className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{experiences[currentIndex].rating}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                {experiences[currentIndex].description}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-600">€{experiences[currentIndex].price}</span>
                  <span className="text-gray-500 ml-1">per person</span>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
        >
          <SafeIcon icon={FiChevronLeft} className="h-6 w-6 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
        >
          <SafeIcon icon={FiChevronRight} className="h-6 w-6 text-gray-800" />
        </button>
        
        {/* Dots indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {experiences.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocalExperiencesCarousel;
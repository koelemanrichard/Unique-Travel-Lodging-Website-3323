import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFavorites } from '../contexts/FavoritesContext';
import supabase from '../lib/supabase';

const { FiStar, FiMapPin, FiHeart } = FiIcons;

const FeaturedStays = () => {
  const [featuredStays, setFeaturedStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Fetch featured stays from Supabase
  useEffect(() => {
    const fetchFeaturedStays = async () => {
      try {
        setLoading(true);
        console.log('Fetching featured stays from Supabase...');
        
        const { data, error } = await supabase
          .from('properties_j293sk4l59')
          .select('*')
          .eq('status', 'Active')
          .order('rating', { ascending: false })
          .limit(4);
        
        if (error) {
          console.error('Error fetching featured stays:', error);
          // Fall back to sample data
          setFeaturedStays(sampleStays);
        } else {
          console.log('Featured stays fetched successfully:', data);
          if (data && data.length > 0) {
            // Transform the data to match the expected format
            const formattedStays = data.map(property => ({
              id: property.id,
              name: property.name,
              location: property.location,
              image: property.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              rating: property.rating || 4.5,
              price: property.price?.toString() || '0',
              category: property.category || 'Modern'
            }));
            setFeaturedStays(formattedStays);
          } else {
            // Fall back to sample data if no data returned
            setFeaturedStays(sampleStays);
          }
        }
      } catch (error) {
        console.error('Failed to fetch featured stays:', error);
        setFeaturedStays(sampleStays);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStays();
  }, []);

  // Sample stays as fallback
  const sampleStays = [
    {
      id: 1,
      name: "Treehouse Paradise",
      location: "Costa Rica",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      price: "180",
      category: "Treehouse"
    },
    {
      id: 2,
      name: "Castle in the Clouds",
      location: "Scotland",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c92a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      price: "450",
      category: "Castle"
    },
    {
      id: 3,
      name: "Desert Glass House",
      location: "Morocco",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      price: "320",
      category: "Modern"
    },
    {
      id: 4,
      name: "Floating Villa",
      location: "Maldives",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 5.0,
      price: "680",
      category: "Overwater"
    }
  ];

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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Featured Unique Stays
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked extraordinary accommodations that offer more than just a place to sleep
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredStays.map((stay, index) => (
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

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/destinations"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Stays
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedStays;
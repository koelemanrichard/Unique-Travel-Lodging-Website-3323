import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiCloudLightning, FiWind, FiDroplet } = FiIcons;

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This is a mock function - in a production app, you'd connect to a real weather API
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock weather data based on location
        const mockWeatherData = getMockWeatherData(location);
        setWeather(mockWeatherData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load weather data');
        setLoading(false);
      }
    };

    if (location) {
      fetchWeather();
    }
  }, [location]);

  // Get icon based on weather condition
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return FiSun;
      case 'cloudy':
        return FiCloud;
      case 'rainy':
        return FiCloudRain;
      case 'snowy':
        return FiCloudSnow;
      case 'stormy':
        return FiCloudLightning;
      case 'windy':
        return FiWind;
      default:
        return FiCloud;
    }
  };

  // Mock weather data generator
  const getMockWeatherData = (locationName) => {
    const locations = {
      'Costa Rica': {
        condition: 'Sunny',
        temperature: 28,
        humidity: 75,
        wind: 10,
        forecast: [
          { day: 'Today', condition: 'Sunny', high: 28, low: 22 },
          { day: 'Tomorrow', condition: 'Cloudy', high: 26, low: 21 },
          { day: 'Wed', condition: 'Rainy', high: 25, low: 21 },
        ]
      },
      'Scotland': {
        condition: 'Cloudy',
        temperature: 14,
        humidity: 82,
        wind: 18,
        forecast: [
          { day: 'Today', condition: 'Cloudy', high: 14, low: 8 },
          { day: 'Tomorrow', condition: 'Rainy', high: 12, low: 7 },
          { day: 'Wed', condition: 'Windy', high: 11, low: 6 },
        ]
      },
      'Morocco': {
        condition: 'Sunny',
        temperature: 32,
        humidity: 35,
        wind: 15,
        forecast: [
          { day: 'Today', condition: 'Sunny', high: 32, low: 18 },
          { day: 'Tomorrow', condition: 'Sunny', high: 33, low: 19 },
          { day: 'Wed', condition: 'Sunny', high: 34, low: 20 },
        ]
      },
      'Maldives': {
        condition: 'Sunny',
        temperature: 30,
        humidity: 78,
        wind: 12,
        forecast: [
          { day: 'Today', condition: 'Sunny', high: 30, low: 26 },
          { day: 'Tomorrow', condition: 'Cloudy', high: 29, low: 26 },
          { day: 'Wed', condition: 'Rainy', high: 28, low: 25 },
        ]
      },
      'Turkey': {
        condition: 'Cloudy',
        temperature: 22,
        humidity: 60,
        wind: 8,
        forecast: [
          { day: 'Today', condition: 'Cloudy', high: 22, low: 14 },
          { day: 'Tomorrow', condition: 'Sunny', high: 24, low: 15 },
          { day: 'Wed', condition: 'Sunny', high: 25, low: 16 },
        ]
      },
      'Finland': {
        condition: 'Snowy',
        temperature: -5,
        humidity: 85,
        wind: 20,
        forecast: [
          { day: 'Today', condition: 'Snowy', high: -5, low: -12 },
          { day: 'Tomorrow', condition: 'Snowy', high: -6, low: -14 },
          { day: 'Wed', condition: 'Cloudy', high: -4, low: -10 },
        ]
      },
      'default': {
        condition: 'Cloudy',
        temperature: 22,
        humidity: 60,
        wind: 12,
        forecast: [
          { day: 'Today', condition: 'Cloudy', high: 22, low: 15 },
          { day: 'Tomorrow', condition: 'Sunny', high: 24, low: 16 },
          { day: 'Wed', condition: 'Sunny', high: 23, low: 15 },
        ]
      }
    };

    // Extract just the country from the location string (e.g., "Baa Atoll, Maldives" -> "Maldives")
    const country = locationName.split(',').pop().trim();
    
    // Find the matching location or use default
    for (const [key, value] of Object.entries(locations)) {
      if (country.includes(key) || key.includes(country)) {
        return value;
      }
    }
    
    return locations.default;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        <SafeIcon icon={FiCloud} className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Current Weather */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-primary-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Current Weather</h3>
            <p className="text-sm opacity-90">{location}</p>
          </div>
          <SafeIcon 
            icon={getWeatherIcon(weather.condition)} 
            className="h-10 w-10 text-yellow-300" 
          />
        </div>
        <div className="mt-4 flex items-end">
          <div className="text-4xl font-bold">{weather.temperature}°C</div>
          <div className="ml-4 text-sm">
            <div className="flex items-center">
              <SafeIcon icon={FiDroplet} className="h-4 w-4 mr-1" />
              <span>{weather.humidity}% humidity</span>
            </div>
            <div className="flex items-center mt-1">
              <SafeIcon icon={FiWind} className="h-4 w-4 mr-1" />
              <span>{weather.wind} km/h wind</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Forecast */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-500 mb-3">3-DAY FORECAST</h4>
        <div className="grid grid-cols-3 gap-2">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs font-medium text-gray-700">{day.day}</p>
              <SafeIcon 
                icon={getWeatherIcon(day.condition)} 
                className="h-6 w-6 mx-auto my-1 text-gray-600" 
              />
              <p className="text-xs">
                <span className="font-medium">{day.high}°</span>
                <span className="text-gray-500 ml-1">{day.low}°</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
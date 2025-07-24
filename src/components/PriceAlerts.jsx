import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFavorites } from '../contexts/FavoritesContext';

const { FiBell, FiAlertCircle, FiCheckCircle, FiX, FiCalendar, FiTrendingDown } = FiIcons;

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedStay, setSelectedStay] = useState(null);
  const [alertThreshold, setAlertThreshold] = useState(10);
  const { favorites } = useFavorites();

  // Mock alert data
  const mockAlerts = [
    {
      id: 1,
      stayId: 1,
      name: "Treehouse Paradise",
      location: "Costa Rica",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      originalPrice: "180",
      currentPrice: "150",
      discount: 17,
      dateRange: { start: '2024-08-10', end: '2024-08-15' },
      createdAt: '2024-05-15',
      threshold: 10
    },
    {
      id: 2,
      stayId: 3,
      name: "Desert Glass House",
      location: "Morocco",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      originalPrice: "320",
      currentPrice: "320",
      discount: 0,
      dateRange: { start: '2024-09-05', end: '2024-09-10' },
      createdAt: '2024-05-10',
      threshold: 15
    }
  ];

  // Load alerts on component mount
  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would come from an API
      setAlerts(mockAlerts);
      setLoading(false);
    };
    
    loadAlerts();
  }, []);

  // Create a new alert
  const createAlert = () => {
    if (!selectedStay || !dateRange.start || !dateRange.end) return;
    
    const newAlert = {
      id: Date.now(),
      stayId: selectedStay.id,
      name: selectedStay.name,
      location: selectedStay.location,
      image: selectedStay.image,
      originalPrice: selectedStay.price,
      currentPrice: selectedStay.price,
      discount: 0,
      dateRange,
      createdAt: new Date().toISOString().split('T')[0],
      threshold: alertThreshold
    };
    
    setAlerts([...alerts, newAlert]);
    setShowAddAlert(false);
    setSelectedStay(null);
    setDateRange({ start: '', end: '' });
    setAlertThreshold(10);
  };

  // Delete an alert
  const deleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  // Format price
  const formatPrice = (price) => {
    return `€${price}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
            <SafeIcon icon={FiBell} className="h-6 w-6 text-primary-600 mr-2" />
            Price Alerts
          </h3>
          <button
            onClick={() => setShowAddAlert(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Alert
          </button>
        </div>
        <p className="text-gray-600">
          Get notified when prices drop for your favorite stays
        </p>
      </div>
      
      {loading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center bg-gray-50 p-4 rounded-lg">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center p-4 rounded-lg ${
                    alert.discount > 0 ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <img
                    src={alert.image}
                    alt={alert.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{alert.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{alert.location}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <SafeIcon icon={FiCalendar} className="h-3 w-3 mr-1" />
                      <span>
                        {formatDate(alert.dateRange.start)} - {formatDate(alert.dateRange.end)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {alert.discount > 0 ? (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-green-600 font-medium mb-1">
                          <SafeIcon icon={FiTrendingDown} className="h-4 w-4 mr-1" />
                          {alert.discount}% off
                        </div>
                        <div>
                          <span className="text-gray-400 line-through text-sm mr-2">
                            {formatPrice(alert.originalPrice)}
                          </span>
                          <span className="text-green-600 font-bold">
                            {formatPrice(alert.currentPrice)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500 text-sm mb-1">No price change</p>
                        <p className="font-medium">{formatPrice(alert.currentPrice)}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <SafeIcon icon={FiAlertCircle} className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No price alerts yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Create alerts for your favorite stays to get notified when prices drop
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Create Alert Modal */}
      {showAddAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-900">Create Price Alert</h4>
              <button
                onClick={() => setShowAddAlert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Stay Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Stay
                </label>
                <div className="grid gap-3 max-h-40 overflow-y-auto">
                  {favorites.length > 0 ? (
                    favorites.map(stay => (
                      <div
                        key={stay.id}
                        onClick={() => setSelectedStay(stay)}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedStay && selectedStay.id === stay.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={stay.image}
                          alt={stay.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3"
                        />
                        <div>
                          <h5 className="font-medium text-gray-900">{stay.name}</h5>
                          <p className="text-sm text-gray-600">{stay.location}</p>
                        </div>
                        {selectedStay && selectedStay.id === stay.id && (
                          <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-primary-600 ml-auto" />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No favorite stays yet. Add stays to your favorites first.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min={dateRange.start || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              {/* Price Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert me when price drops by at least
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <span className="ml-4 font-medium text-primary-600 w-12 text-center">
                    {alertThreshold}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddAlert(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createAlert}
                disabled={!selectedStay || !dateRange.start || !dateRange.end}
                className={`px-4 py-2 rounded-lg ${
                  !selectedStay || !dateRange.start || !dateRange.end
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                } transition-colors`}
              >
                Create Alert
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;
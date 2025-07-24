import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAdmin } from '../../contexts/AdminContext';

const { FiBarChart3, FiTrendingUp, FiUsers, FiDollarSign, FiCalendar } = FiIcons;

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const { getAuthHeaders } = useAdmin();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data
      const mockData = {
        overview: {
          totalRevenue: 125750,
          revenueGrowth: 15.3,
          totalBookings: 342,
          bookingsGrowth: 8.7,
          totalUsers: 1847,
          usersGrowth: 12.4,
          avgBookingValue: 368,
          avgBookingGrowth: 6.2
        },
        monthlyRevenue: [
          { month: 'Jan', revenue: 95000, bookings: 45 },
          { month: 'Feb', revenue: 108000, bookings: 52 },
          { month: 'Mar', revenue: 125750, bookings: 68 },
          { month: 'Apr', revenue: 142000, bookings: 74 },
          { month: 'May', revenue: 156000, bookings: 82 },
          { month: 'Jun', revenue: 171000, bookings: 91 }
        ],
        topProperties: [
          { name: 'Floating Villa', revenue: 45200, bookings: 67 },
          { name: 'Treehouse Paradise', revenue: 32400, bookings: 54 },
          { name: 'Castle in the Clouds', revenue: 28900, bookings: 42 },
          { name: 'Desert Glass House', revenue: 19300, bookings: 38 }
        ],
        userGrowth: [
          { month: 'Jan', users: 1520 },
          { month: 'Feb', users: 1634 },
          { month: 'Mar', users: 1742 },
          { month: 'Apr', users: 1847 },
          { month: 'May', users: 1965 },
          { month: 'Jun', users: 2089 }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const { overview, monthlyRevenue, topProperties, userGrowth } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track performance and growth metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="1year">Last year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Revenue',
            value: `€${overview.totalRevenue.toLocaleString()}`,
            change: overview.revenueGrowth,
            icon: FiDollarSign,
            color: 'green'
          },
          {
            title: 'Total Bookings',
            value: overview.totalBookings.toLocaleString(),
            change: overview.bookingsGrowth,
            icon: FiCalendar,
            color: 'blue'
          },
          {
            title: 'Total Users',
            value: overview.totalUsers.toLocaleString(),
            change: overview.usersGrowth,
            icon: FiUsers,
            color: 'purple'
          },
          {
            title: 'Avg Booking Value',
            value: `€${overview.avgBookingValue}`,
            change: overview.avgBookingGrowth,
            icon: FiTrendingUp,
            color: 'orange'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                <SafeIcon icon={stat.icon} className="h-6 w-6" />
              </div>
              <div className="flex items-center text-sm text-green-600">
                <SafeIcon icon={FiTrendingUp} className="h-4 w-4 mr-1" />
                <span>+{stat.change}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="space-y-4">
            {monthlyRevenue.map((item, index) => (
              <div key={item.month} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-12">{item.month}</span>
                  <div className="ml-4 flex-1">
                    <div className="bg-gray-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(item.revenue / 200000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  €{item.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Properties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Properties</h3>
          <div className="space-y-4">
            {topProperties.map((property, index) => (
              <div key={property.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{property.name}</p>
                  <p className="text-sm text-gray-600">{property.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">€{property.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">#{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
        <div className="grid grid-cols-6 gap-4">
          {userGrowth.map((item, index) => (
            <div key={item.month} className="text-center">
              <div className="mb-2">
                <div 
                  className="bg-primary-600 rounded-t mx-auto"
                  style={{ 
                    height: `${(item.users / 2500) * 100}px`,
                    width: '20px'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{item.month}</p>
              <p className="text-sm font-medium text-gray-900">{item.users}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
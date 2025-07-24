import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAdmin } from '../../contexts/AdminContext';
import supabase from '../../lib/supabase';
import ImageGalleryManager from './ImageGalleryManager';

const { 
  FiPlus, FiEdit3, FiTrash2, FiEye, FiStar, FiMapPin, FiSearch, 
  FiFilter, FiMoreVertical, FiImage, FiDollarSign, FiX, FiLoader, 
  FiCheck, FiRefreshCw, FiAlertCircle, FiInfo 
} = FiIcons;

const AdminPropertyManager = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: 'Treehouse',
    price: '',
    description: '',
    image: '',
    images: [],
    status: 'Active',
    rating: 4.5
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  
  const { isAuthenticated } = useAdmin();

  // Fetch properties when component mounts
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      console.log('Fetching properties from Supabase...');
      setLoading(true);
      setBackendError('');
      
      const { data, error } = await supabase
        .from('properties_j293sk4l59')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching properties:', error);
        setBackendError('Failed to fetch properties from database');
        setProperties([]);
      } else {
        console.log('Properties fetched successfully:', data);
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setBackendError('Database connection failed');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All', 'Treehouse', 'Castle', 'Modern', 'Overwater', 'Cave', 
    'Igloo', 'Forest Cabin', 'Wellness Retreat', 'Lighthouse', 
    'Houseboat', 'Dome', 'Container Home', 'Windmill', 'Barn'
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (property.category && property.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All' || property.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProperty = async (propertyId) => {
    setDeleteConfirm(propertyId);
  };

  const confirmDelete = async (propertyId) => {
    try {
      setIsSubmitting(true);
      console.log('Deleting property with ID:', propertyId);
      
      const { error } = await supabase
        .from('properties_j293sk4l59')
        .delete()
        .eq('id', propertyId);
      
      if (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property: ' + error.message);
      } else {
        console.log('Property deleted successfully');
        setProperties(prevProperties => prevProperties.filter(p => p.id !== propertyId));
        alert('Property deleted successfully!');
      }
    } catch (error) {
      console.error('Property deletion error:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsSubmitting(false);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setFormError('');
  };

  const handleImagesChange = (newImages) => {
    setFormData({
      ...formData,
      images: newImages,
      // Set the primary image as well
      image: newImages.length > 0 ? newImages[0] : ''
    });
  };

  const handleEditProperty = (property) => {
    console.log('Editing property:', property);
    setEditingProperty(property);
    setFormData({
      name: property.name || '',
      location: property.location || '',
      category: property.category || 'Treehouse',
      price: property.price?.toString() || '',
      description: property.description || '',
      image: property.image || '',
      images: Array.isArray(property.images) ? property.images : [property.image].filter(Boolean),
      status: property.status || 'Active',
      rating: property.rating || 4.5
    });
    setShowAddModal(true);
    setFormError('');
    setSubmitSuccess(false);
    setDebugInfo('');
  };

  const handleAddNewProperty = () => {
    setEditingProperty(null);
    setFormData({
      name: '',
      location: '',
      category: 'Treehouse',
      price: '',
      description: '',
      image: '',
      images: [],
      status: 'Active',
      rating: 4.5
    });
    setShowAddModal(true);
    setFormError('');
    setSubmitSuccess(false);
    setDebugInfo('');
  };

  const validateForm = () => {
    if (!formData.name?.trim() || !formData.location?.trim() || !formData.price || !formData.category) {
      setFormError('Please fill in all required fields (Name, Location, Category, and Price)');
      return false;
    }
    
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError('Price must be a positive number');
      return false;
    }
    
    const ratingValue = parseFloat(formData.rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      setFormError('Rating must be between 0 and 5');
      return false;
    }
    
    setFormError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setFormError('');
    setDebugInfo('');
    
    try {
      const priceValue = parseFloat(formData.price);
      const ratingValue = parseFloat(formData.rating);
      
      const propertyData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        category: formData.category,
        price: priceValue,
        description: formData.description?.trim() || null,
        image: formData.images.length > 0 ? formData.images[0] : null,
        images: formData.images,
        status: formData.status,
        rating: ratingValue,
        updated_at: new Date().toISOString()
      };
      
      if (editingProperty) {
        setDebugInfo(`Starting update for property ID: ${editingProperty.id}`);
        
        // Perform the update with explicit RLS bypass
        const { data, error } = await supabase
          .from('properties_j293sk4l59')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select();
        
        if (error) {
          console.error('Update error:', error);
          setFormError(`Failed to update property: ${error.message}`);
          setDebugInfo(prevDebug => prevDebug + `\nUpdate error: ${JSON.stringify(error)}`);
          return;
        }
        
        console.log('Update successful:', data);
        setDebugInfo(prevDebug => prevDebug + `\nUpdate successful: ${JSON.stringify(data)}`);
        
        // Update local state - use returned data if available, otherwise use our form data
        const updatedProperty = data && data.length > 0 ? data[0] : { ...editingProperty, ...propertyData };
        
        setProperties(prevProperties => 
          prevProperties.map(p => 
            p.id === editingProperty.id ? updatedProperty : p
          )
        );
        
        setSubmitSuccess(true);
        
        // Close modal after showing success
        setTimeout(() => {
          setShowAddModal(false);
          setEditingProperty(null);
          resetForm();
        }, 2000);
        
      } else {
        console.log('Creating new property with data:', propertyData);
        
        // Add new property
        const { data, error } = await supabase
          .from('properties_j293sk4l59')
          .insert([{
            ...propertyData,
            created_at: new Date().toISOString()
          }])
          .select();
        
        if (error) {
          console.error('Error creating property:', error);
          setFormError('Failed to create property: ' + (error.message || 'Unknown error'));
          return;
        }
        
        console.log('Property created successfully, returned data:', data);
        
        // Add to local state
        if (data && data.length > 0) {
          setProperties(prevProperties => [data[0], ...prevProperties]);
        }
        
        setSubmitSuccess(true);
        
        // Close modal after showing success
        setTimeout(() => {
          setShowAddModal(false);
          resetForm();
        }, 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError('An unexpected error occurred: ' + (error.message || 'Please try again'));
      setDebugInfo(prevDebug => prevDebug + `\nCaught exception: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      category: 'Treehouse',
      price: '',
      description: '',
      image: '',
      images: [],
      status: 'Active',
      rating: 4.5
    });
    setSubmitSuccess(false);
    setFormError('');
    setDebugInfo('');
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProperty(null);
    resetForm();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageError = (e) => {
    if (e.target.src !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==') {
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-1">Manage all unique stays and accommodations</p>
        </div>
        <button 
          onClick={handleAddNewProperty} 
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="h-5 w-5" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Backend Error Alert */}
      {backendError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
          <span>{backendError}</span>
          <button 
            onClick={fetchProperties}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={fetchProperties}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
            title="Refresh data"
          >
            <SafeIcon icon={FiRefreshCw} className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <motion.tr 
                  key={property.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                        <img 
                          src={property.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='} 
                          alt={property.name} 
                          className="h-full w-full object-cover" 
                          onError={handleImageError}
                        />
                        {Array.isArray(property.images) && property.images.length > 1 && (
                          <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 rounded-tl">
                            +{property.images.length - 1}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <SafeIcon icon={FiMapPin} className="h-3 w-3 mr-1" />
                          {property.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {property.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{property.price}/night
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <SafeIcon icon={FiStar} className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-700">{property.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-gray-400 hover:text-primary-600">
                        <SafeIcon icon={FiEye} className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditProperty(property)} 
                        className="text-gray-400 hover:text-primary-600"
                      >
                        <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProperty(property.id)} 
                        className="text-gray-400 hover:text-red-600"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiImage} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Add/Edit Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="h-6 w-6" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {formError}
              </div>
            )}

            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <SafeIcon icon={FiCheck} className="h-5 w-5 mr-2" />
                {editingProperty ? 'Property updated successfully!' : 'Property created successfully!'}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.filter(c => c !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night (€)*
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter rating"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter property description"
                  ></textarea>
                </div>
              </div>
              
              {/* Image Gallery Manager */}
              <div className="mb-6">
                <ImageGalleryManager 
                  propertyId={editingProperty?.id} 
                  initialImages={formData.images} 
                  onImagesChange={handleImagesChange} 
                />
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-400"
                >
                  {isSubmitting && (
                    <SafeIcon icon={FiLoader} className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {submitSuccess ? (
                    <>
                      <SafeIcon icon={FiCheck} className="h-4 w-4 mr-2" />
                      {editingProperty ? 'Updated!' : 'Added!'}
                    </>
                  ) : (
                    editingProperty ? 'Update Property' : 'Add Property'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
              >
                {isSubmitting && (
                  <SafeIcon icon={FiLoader} className="h-4 w-4 mr-2 animate-spin" />
                )}
                Delete Property
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyManager;
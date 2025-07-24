import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { 
  FiImage, FiPlus, FiX, FiLink, FiUpload, FiMove, FiTrash2, 
  FiLoader, FiCheckCircle, FiAlertCircle, FiInfo 
} = FiIcons;

const ImageGalleryManager = ({ propertyId, initialImages = [], onImagesChange }) => {
  const [images, setImages] = useState(initialImages);
  const [imageUrl, setImageUrl] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();
  
  // Maximum number of images allowed
  const MAX_IMAGES = 10;
  
  // Add image via URL
  const handleAddImageUrl = () => {
    if (!imageUrl) {
      setError('Please enter a valid image URL');
      return;
    }
    
    if (images.length >= MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    
    // Check if URL is valid
    const img = new Image();
    img.onerror = () => {
      setError('Invalid image URL or image not accessible');
      setIsUploading(false);
    };
    
    img.onload = () => {
      const newImages = [...images, imageUrl];
      setImages(newImages);
      onImagesChange(newImages);
      setImageUrl('');
      setIsAddingUrl(false);
      setSuccess('Image added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    };
    
    setIsUploading(true);
    img.src = imageUrl;
  };
  
  // Remove image
  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesChange(newImages);
  };
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} images in total`);
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const newImages = [...images];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file type
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed');
          setIsUploading(false);
          return;
        }
        
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size should not exceed 5MB');
          setIsUploading(false);
          return;
        }
        
        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
        
        // Read file as data URL for preview
        const reader = new FileReader();
        
        // Create a promise to handle the FileReader
        const readFileAsDataURL = new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
        });
        
        reader.readAsDataURL(file);
        const dataUrl = await readFileAsDataURL;
        
        // In a real production app, you would upload to storage here
        // For this demo, we'll just use the data URL
        newImages.push(dataUrl);
      }
      
      setImages(newImages);
      onImagesChange(newImages);
      setSuccess(`${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Reorder images with drag and drop
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    if (draggedIndex !== index) {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];
      
      // Remove the dragged item
      newImages.splice(draggedIndex, 1);
      // Insert at the new position
      newImages.splice(index, 0, draggedImage);
      
      setImages(newImages);
      setDraggedIndex(index);
    }
  };
  
  const handleDragEnd = () => {
    onImagesChange(images);
    setDraggedIndex(null);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingUrl(true)}
            disabled={isUploading || images.length >= MAX_IMAGES}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
          >
            <SafeIcon icon={FiLink} className="h-4 w-4 mr-1" />
            Add URL
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || images.length >= MAX_IMAGES}
            className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center text-sm"
          >
            <SafeIcon icon={FiUpload} className="h-4 w-4 mr-1" />
            Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
      </div>
      
      {/* Error and success messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto">
            <SafeIcon icon={FiX} className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <SafeIcon icon={FiCheckCircle} className="h-5 w-5 mr-2" />
          <span>{success}</span>
        </div>
      )}
      
      {/* Upload progress */}
      {isUploading && (
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Add image URL modal */}
      {isAddingUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Image URL</h3>
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsAddingUrl(false);
                  setImageUrl('');
                  setError('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImageUrl}
                disabled={!imageUrl.trim() || isUploading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-400 flex items-center"
              >
                {isUploading ? (
                  <>
                    <SafeIcon icon={FiLoader} className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Add Image'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Images gallery */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                draggedIndex === index ? 'border-primary-500' : 'border-gray-200'
              } h-32`}
            >
              <img
                src={src}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                    title="Remove image"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1.5 bg-gray-800 text-white rounded-full cursor-move"
                    title="Drag to reorder"
                  >
                    <SafeIcon icon={FiMove} className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
          
          {/* Add image placeholder */}
          {images.length < MAX_IMAGES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="h-8 w-8 mb-2" />
              <span className="text-sm">Add Image</span>
            </button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <SafeIcon icon={FiImage} className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No images yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Upload images or add image URLs to showcase this property
          </p>
        </div>
      )}
      
      <div className="text-xs text-gray-500 flex items-center">
        <SafeIcon icon={FiInfo} className="h-4 w-4 mr-1" />
        <span>
          {images.length} of {MAX_IMAGES} images used. First image will be used as the primary image.
        </span>
      </div>
    </div>
  );
};

export default ImageGalleryManager;
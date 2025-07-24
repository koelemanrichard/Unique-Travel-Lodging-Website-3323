import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Link} from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useFavorites} from '../contexts/FavoritesContext';
import TravelPlanningCalendar from '../components/TravelPlanningCalendar';

const {FiStar, FiMapPin, FiTrash2, FiShare2, FiMail, FiDownload, FiFacebook, FiTwitter, FiLinkedin, FiRotateCcw, FiRotateCw, FiMessageCircle, FiCalendar} = FiIcons;

const FavoritesPage = () => {
  const {favorites, removeFavorite, updateNote, getNote, clearFavorites, undoNote, redoNote, canUndo, canRedo} = useFavorites();
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);

  // Handle note click to edit
  const handleNoteClick = (stayId) => {
    setEditingNoteId(stayId);
    setNoteText(getNote(stayId));
  };

  // Save note - now triggered on blur or when focus leaves the textarea
  const handleSaveNote = (stayId) => {
    updateNote(stayId, noteText);
    setEditingNoteId(null);
  };

  // Handle text change in the note
  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  // Handle note textarea keydown events
  const handleNoteKeyDown = (e, stayId) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSaveNote(stayId);
    }
  };

  // Handle share button click
  const handleShare = (stay) => {
    setShareItem(stay);
    setShareModalOpen(true);
  };

  // Close share modal
  const closeShareModal = () => {
    setShareModalOpen(false);
    setShareItem(null);
  };

  // Generate PDFexport of favorites
  const exportToPDF = () => {
    alert('Exporting to PDF... (In a real app, this would generate a PDF)');
    // In a real app, we would use a library like jsPDF to generate a PDF
  };

  // Email favorites
  const emailFavorites = () => {
    const subject = "My Favorite Unique Stays";
    const body = favorites
      .map(stay => 
        `${stay.name} in ${stay.location} - €${stay.price.replace('$', '')} per night\n${getNote(stay.id) ? `Notes: ${getNote(stay.id)}\n` : ''}`
      )
      .join('\n\n');
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Share on social media
  const shareOnSocial = (platform) => {
    if (!shareItem) return;
    
    const text = `Check out this amazing stay: ${shareItem.name} in ${shareItem.location}!`;
    const url = `${window.location.origin}/#/stay/${shareItem.id}`;
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    closeShareModal();
  };

  // Handle undo button click
  const handleUndoClick = (stayId) => {
    const success = undoNote(stayId);
    if (success && editingNoteId === stayId) {
      // Update the textarea content if we're currently editing this note
      setNoteText(getNote(stayId));
    }
  };

  // Handle redo button click
  const handleRedoClick = (stayId) => {
    const success = redoNote(stayId);
    if (success && editingNoteId === stayId) {
      // Update the textarea content if we're currently editing this note
      setNoteText(getNote(stayId));
    }
  };

  // Toggle travel planner
  const togglePlanner = () => {
    setShowPlanner(!showPlanner);
  };

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
                  My Favorites
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your collection of dream stays
                </p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={togglePlanner}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiCalendar} className="h-5 w-5" />
                  <span>{showPlanner ? "Hide Planner" : "Plan Your Trip"}</span>
                </button>
                <button
                  onClick={emailFavorites}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <SafeIcon icon={FiMail} className="h-5 w-5" />
                  <span>Email List</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="h-5 w-5" />
                  <span>Export PDF</span>
                </button>
                {favorites.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all favorites?')) {
                        clearFavorites();
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Travel Planning Calendar (conditionally shown) */}
      {showPlanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TravelPlanningCalendar />
        </div>
      )}

      {/* Favorites List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
              <p className="text-gray-500 text-lg mb-6">
                Your favorites list is empty. Start exploring unique stays and add them to your favorites!
              </p>
              <Link
                to="/destinations"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Explore Destinations
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {favorites.map((stay, index) => (
              <motion.div
                key={stay.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <Link to={`/stay/${stay.id}`}>
                      <img
                        src={stay.image || (stay.images && stay.images[0])}
                        alt={stay.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {stay.category}
                      </div>
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <Link to={`/stay/${stay.id}`}>
                        <h2 className="text-2xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          {stay.name}
                        </h2>
                      </Link>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiStar} className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-700">{stay.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-4">
                      <SafeIcon icon={FiMapPin} className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{stay.location}</span>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {stay.description || `A beautiful ${stay.category.toLowerCase()} in ${stay.location} with stunning views and exceptional amenities.`}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary-600">€{stay.price.replace('$', '')}</span>
                      <span className="text-gray-500">per night</span>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <SafeIcon icon={FiMessageCircle} className="h-5 w-5 mr-2 text-gray-500" />
                          My Notes
                        </h3>
                        {/* Undo/Redo buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUndoClick(stay.id)}
                            disabled={!canUndo(stay.id)}
                            className={`p-1 rounded transition-colors ${
                              canUndo(stay.id)
                                ? 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                            aria-label="Undo"
                            title="Undo"
                          >
                            <SafeIcon icon={FiRotateCcw} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRedoClick(stay.id)}
                            disabled={!canRedo(stay.id)}
                            className={`p-1 rounded transition-colors ${
                              canRedo(stay.id)
                                ? 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                            aria-label="Redo"
                            title="Redo"
                          >
                            <SafeIcon icon={FiRotateCw} className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {editingNoteId === stay.id ? (
                        <textarea
                          value={noteText}
                          onChange={handleNoteChange}
                          onBlur={() => handleSaveNote(stay.id)}
                          onKeyDown={(e) => handleNoteKeyDown(e, stay.id)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Add your notes about this stay..."
                          rows={3}
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => handleNoteClick(stay.id)}
                          className="bg-gray-50 p-3 rounded-lg min-h-[60px] cursor-text hover:bg-gray-100 transition-colors"
                        >
                          {getNote(stay.id) ? (
                            <p className="text-gray-700 whitespace-pre-line">{getNote(stay.id)}</p>
                          ) : (
                            <p className="text-gray-400 italic">Click here to add notes about this stay...</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleShare(stay)}
                          className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <SafeIcon icon={FiShare2} className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                        <Link
                          to={`/stay/${stay.id}`}
                          className="flex items-center space-x-1 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                        >
                          <span>View Details</span>
                        </Link>
                      </div>
                      <button
                        onClick={() => removeFavorite(stay.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareModalOpen && shareItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Share this stay</h3>
            <div className="mb-6">
              <p className="text-gray-700">
                {shareItem.name} in {shareItem.location}
              </p>
            </div>
            <div className="flex justify-center space-x-6 mb-6">
              <button onClick={() => shareOnSocial('facebook')} className="flex flex-col items-center space-y-2">
                <div className="bg-blue-600 text-white p-3 rounded-full">
                  <SafeIcon icon={FiFacebook} className="h-6 w-6" />
                </div>
                <span className="text-sm text-gray-600">Facebook</span>
              </button>
              <button onClick={() => shareOnSocial('twitter')} className="flex flex-col items-center space-y-2">
                <div className="bg-blue-400 text-white p-3 rounded-full">
                  <SafeIcon icon={FiTwitter} className="h-6 w-6" />
                </div>
                <span className="text-sm text-gray-600">Twitter</span>
              </button>
              <button onClick={() => shareOnSocial('linkedin')} className="flex flex-col items-center space-y-2">
                <div className="bg-blue-800 text-white p-3 rounded-full">
                  <SafeIcon icon={FiLinkedin} className="h-6 w-6" />
                </div>
                <span className="text-sm text-gray-600">LinkedIn</span>
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={closeShareModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default FavoritesPage;
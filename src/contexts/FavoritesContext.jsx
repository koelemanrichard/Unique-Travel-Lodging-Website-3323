import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const FavoritesContext = createContext();

// Provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState({});
  const [notesHistory, setNotesHistory] = useState({});
  // For undo/redo functionality
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState({});  // Current position in history for each note

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    const savedNotes = localStorage.getItem('favoriteNotes');
    const savedHistory = localStorage.getItem('favoriteNotesHistory');
    const savedIndices = localStorage.getItem('favoriteNotesIndices');

    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
        console.log('Loaded favorites:', parsedFavorites);
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    }

    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing notes:', error);
        setNotes({});
      }
    }

    if (savedHistory) {
      try {
        setNotesHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing notes history:', error);
        setNotesHistory({});
      }
    }

    if (savedIndices) {
      try {
        setCurrentHistoryIndex(JSON.parse(savedIndices));
      } catch (error) {
        console.error('Error parsing notes indices:', error);
        setCurrentHistoryIndex({});
      }
    }

    // Initialize history for notes that don't have history yet
    if (savedNotes && (!savedHistory || !savedIndices)) {
      const parsedNotes = JSON.parse(savedNotes);
      const initialHistory = {};
      const initialIndices = {};
      
      Object.entries(parsedNotes).forEach(([stayId, noteText]) => {
        if (noteText) {
          initialHistory[stayId] = [noteText];
          initialIndices[stayId] = 0;
        }
      });
      
      setNotesHistory(initialHistory);
      setCurrentHistoryIndex(initialIndices);
    }
  }, []);

  // Save favorites to localStorage when updated
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Saved favorites:', favorites);
  }, [favorites]);

  // Save notes to localStorage when updated
  useEffect(() => {
    localStorage.setItem('favoriteNotes', JSON.stringify(notes));
  }, [notes]);

  // Save history to localStorage when updated
  useEffect(() => {
    localStorage.setItem('favoriteNotesHistory', JSON.stringify(notesHistory));
  }, [notesHistory]);

  // Save indices to localStorage when updated
  useEffect(() => {
    localStorage.setItem('favoriteNotesIndices', JSON.stringify(currentHistoryIndex));
  }, [currentHistoryIndex]);

  // Add a stay to favorites
  const addFavorite = (stay) => {
    setFavorites(prev => {
      // Check if already in favorites
      if (prev.some(item => item.id === stay.id)) {
        return prev;
      }
      console.log('Adding to favorites:', stay);
      return [...prev, stay];
    });
  };

  // Remove a stay from favorites
  const removeFavorite = (stayId) => {
    // Check if there's a note for this stay
    const hasNote = notes[stayId] && notes[stayId].trim() !== '';
    
    // If there's a note, ask for confirmation
    if (hasNote) {
      const confirmed = window.confirm(
        "This favorite has notes attached to it. Are you sure you want to remove it? Your notes will be deleted."
      );
      if (!confirmed) return;
    }

    setFavorites(prev => prev.filter(item => item.id !== stayId));

    // Remove note and history if exists
    if (notes[stayId]) {
      const newNotes = { ...notes };
      delete newNotes[stayId];
      setNotes(newNotes);

      const newHistory = { ...notesHistory };
      delete newHistory[stayId];
      setNotesHistory(newHistory);

      const newIndices = { ...currentHistoryIndex };
      delete newIndices[stayId];
      setCurrentHistoryIndex(newIndices);
    }
  };

  // Check if a stay is in favorites
  const isFavorite = (stayId) => {
    return favorites.some(item => item.id === stayId);
  };

  // Update note for a stay and track history for undo/redo
  const updateNote = (stayId, noteText) => {
    // Update the note
    setNotes(prev => ({
      ...prev,
      [stayId]: noteText
    }));

    // Update history - this is the key fix
    setNotesHistory(prev => {
      const currentHistory = prev[stayId] || [];
      const currentIndex = currentHistoryIndex[stayId] || 0;
      
      // If we're not at the end of history, truncate everything after current position
      const truncatedHistory = currentHistory.slice(0, currentIndex + 1);
      
      // Add new state to history
      const newHistory = [...truncatedHistory, noteText];
      
      return {
        ...prev,
        [stayId]: newHistory
      };
    });

    // Update current index to point to the new entry
    setCurrentHistoryIndex(prev => {
      const currentHistory = notesHistory[stayId] || [];
      const currentIndex = prev[stayId] || 0;
      const truncatedLength = currentHistory.slice(0, currentIndex + 1).length;
      
      return {
        ...prev,
        [stayId]: truncatedLength // This will be the index of the newly added item
      };
    });
  };

  // Get note for a stay
  const getNote = (stayId) => {
    return notes[stayId] || '';
  };

  // Undo note change
  const undoNote = (stayId) => {
    const history = notesHistory[stayId];
    const currentIndex = currentHistoryIndex[stayId];
    
    if (!history || currentIndex <= 0) return false; // Nothing to undo
    
    const newIndex = currentIndex - 1;
    const previousNote = history[newIndex];
    
    // Update current note
    setNotes(prev => ({
      ...prev,
      [stayId]: previousNote
    }));
    
    // Update index
    setCurrentHistoryIndex(prev => ({
      ...prev,
      [stayId]: newIndex
    }));
    
    return true;
  };

  // Redo note change
  const redoNote = (stayId) => {
    const history = notesHistory[stayId];
    const currentIndex = currentHistoryIndex[stayId];
    
    if (!history || currentIndex >= history.length - 1) return false; // Nothing to redo
    
    const newIndex = currentIndex + 1;
    const nextNote = history[newIndex];
    
    // Update current note
    setNotes(prev => ({
      ...prev,
      [stayId]: nextNote
    }));
    
    // Update index
    setCurrentHistoryIndex(prev => ({
      ...prev,
      [stayId]: newIndex
    }));
    
    return true;
  };

  // Check if undo is available
  const canUndo = (stayId) => {
    const history = notesHistory[stayId];
    const currentIndex = currentHistoryIndex[stayId];
    return history && history.length > 1 && currentIndex > 0;
  };

  // Check if redo is available
  const canRedo = (stayId) => {
    const history = notesHistory[stayId];
    const currentIndex = currentHistoryIndex[stayId];
    return history && currentIndex < history.length - 1;
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
    setNotes({});
    setNotesHistory({});
    setCurrentHistoryIndex({});
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        updateNote,
        getNote,
        undoNote,
        redoNote,
        canUndo,
        canRedo,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook for using favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
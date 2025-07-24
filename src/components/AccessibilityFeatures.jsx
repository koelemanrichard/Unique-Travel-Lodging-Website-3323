import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSun, FiMoon, FiType, FiZap, FiSlash, FiVolume2, FiVolumeX, FiSave, FiCheckCircle } = FiIcons;

const AccessibilityFeatures = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    theme: 'auto' // 'light', 'dark', or 'auto'
  });
  const [saved, setSaved] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply settings when they change
  useEffect(() => {
    // High contrast mode
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Large text
    if (settings.largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    
    // Reduce motion
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && prefersDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [settings]);

  // Toggle settings
  const toggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  // Change theme
  const setTheme = (theme) => {
    setSettings({
      ...settings,
      theme
    });
  };

  // Save settings
  const saveSettings = () => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    setSaved(true);
    
    // Hide the saved indicator after 3 seconds
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40"
        aria-label="Accessibility Settings"
      >
        <SafeIcon icon={FiZap} className="h-6 w-6" />
      </button>
      
      {/* Accessibility Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Accessibility</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close accessibility panel"
              >
                <SafeIcon icon={FiSlash} className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Display Theme</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center p-3 rounded-lg border ${
                      settings.theme === 'light'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <SafeIcon icon={FiSun} className="h-6 w-6 text-yellow-500 mb-1" />
                    <span className="text-sm">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center p-3 rounded-lg border ${
                      settings.theme === 'dark'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <SafeIcon icon={FiMoon} className="h-6 w-6 text-gray-700 mb-1" />
                    <span className="text-sm">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('auto')}
                    className={`flex flex-col items-center p-3 rounded-lg border ${
                      settings.theme === 'auto'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex mb-1">
                      <SafeIcon icon={FiSun} className="h-5 w-5 text-yellow-500" />
                      <SafeIcon icon={FiMoon} className="h-5 w-5 text-gray-700 -ml-1" />
                    </div>
                    <span className="text-sm">Auto</span>
                  </button>
                </div>
              </div>
              
              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SafeIcon icon={FiType} className="h-5 w-5 text-gray-700 mr-3" />
                    <span className="text-gray-900">Larger Text</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.largeText}
                      onChange={() => toggleSetting('largeText')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SafeIcon icon={FiZap} className="h-5 w-5 text-gray-700 mr-3" />
                    <span className="text-gray-900">High Contrast</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.highContrast}
                      onChange={() => toggleSetting('highContrast')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SafeIcon icon={settings.reduceMotion ? FiSlash : FiZap} className="h-5 w-5 text-gray-700 mr-3" />
                    <span className="text-gray-900">Reduce Motion</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.reduceMotion}
                      onChange={() => toggleSetting('reduceMotion')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SafeIcon icon={settings.screenReader ? FiVolume2 : FiVolumeX} className="h-5 w-5 text-gray-700 mr-3" />
                    <span className="text-gray-900">Screen Reader Support</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.screenReader}
                      onChange={() => toggleSetting('screenReader')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="pt-4 flex items-center">
                <button
                  onClick={saveSettings}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <SafeIcon icon={FiSave} className="h-5 w-5 mr-2" />
                  Save Preferences
                </button>
                
                {saved && (
                  <div className="ml-4 text-green-600 flex items-center">
                    <SafeIcon icon={FiCheckCircle} className="h-5 w-5 mr-1" />
                    <span>Saved</span>
                  </div>
                )}
              </div>
              
              {/* Help Text */}
              <div className="text-sm text-gray-600 border-t border-gray-200 pt-4 mt-4">
                <p>
                  These settings help make our website more accessible for users with different needs.
                  Your preferences will be saved for future visits.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
      
      {/* CSS for accessibility features */}
      <style jsx global>{`
        .high-contrast {
          --primary-color: #0056b3;
          --text-color: #000000;
          --background-color: #ffffff;
        }
        
        .high-contrast body {
          background-color: var(--background-color);
          color: var(--text-color);
        }
        
        .high-contrast a, .high-contrast button {
          color: var(--primary-color);
        }
        
        .large-text {
          font-size: 120%;
        }
        
        .large-text h1 {
          font-size: 2.5rem;
        }
        
        .large-text h2 {
          font-size: 2rem;
        }
        
        .reduce-motion * {
          transition: none !important;
          animation: none !important;
        }
        
        .dark-theme {
          --primary-color: #4dabf7;
          --text-color: #e6e6e6;
          --background-color: #121212;
        }
        
        .dark-theme body {
          background-color: var(--background-color);
          color: var(--text-color);
        }
      `}</style>
    </>
  );
};

export default AccessibilityFeatures;
import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMapPin, FiMail, FiPhone, FiFacebook, FiInstagram, FiTwitter } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiMapPin} className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-serif font-bold">UniqueStays</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover extraordinary places to stay around the world. From treehouses to castles, 
              we curate the most unique accommodations for unforgettable experiences.
            </p>
            <div className="flex space-x-4">
              <SafeIcon icon={FiFacebook} className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <SafeIcon icon={FiInstagram} className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <SafeIcon icon={FiTwitter} className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/destinations" className="text-gray-300 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMail} className="h-5 w-5 text-primary-500" />
                <span className="text-gray-300">hello@uniquestays.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiPhone} className="h-5 w-5 text-primary-500" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 UniqueStays. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
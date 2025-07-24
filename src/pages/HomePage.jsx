import React from 'react';
import {motion} from 'framer-motion';
import Hero from '../components/Hero';
import FeaturedStays from '../components/FeaturedStays';
import CategorySection from '../components/CategorySection';
import TestimonialSection from '../components/TestimonialSection';
import AIRecommendations from '../components/AIRecommendations';
import AccessibilityFeatures from '../components/AccessibilityFeatures';

const HomePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }} 
      className="pt-16"
    >
      <Hero />
      <FeaturedStays />
      <AIRecommendations />
      <CategorySection />
      <TestimonialSection />
      <AccessibilityFeatures />
    </motion.div>
  );
};

export default HomePage;
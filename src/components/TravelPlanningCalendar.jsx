import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays } from 'date-fns';
import SafeIcon from '../common/SafeIcon';

const { FiChevronLeft, FiChevronRight, FiCalendar, FiPlusCircle, FiTrash2, FiInfo, FiMapPin } = FiIcons;

const TravelPlanningCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [planningStays, setPlanningStays] = useState([]);
  const [showStaySelector, setShowStaySelector] = useState(false);
  const [selectedDateForStay, setSelectedDateForStay] = useState(null);
  
  // Sample stays data
  const availableStays = [
    {
      id: 1,
      name: "Treehouse Paradise",
      location: "Costa Rica",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      price: "180",
      category: "Treehouse"
    },
    {
      id: 2,
      name: "Castle in the Clouds",
      location: "Scotland",
      image: "https://images.unsplash.com/photo-1520637736862-4d197d17c92a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      price: "450",
      category: "Castle"
    },
    {
      id: 3,
      name: "Desert Glass House",
      location: "Morocco",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      price: "320",
      category: "Modern"
    },
    {
      id: 4,
      name: "Floating Villa",
      location: "Maldives",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      price: "680",
      category: "Overwater"
    }
  ];

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Handle date selection
  const handleDateClick = (day) => {
    if (selectedDates.some(date => isSameDay(date, day))) {
      // If already selected, remove it
      setSelectedDates(selectedDates.filter(date => !isSameDay(date, day)));
      
      // Also remove any stays planned for this date
      setPlanningStays(planningStays.filter(stay => !isSameDay(new Date(stay.date), day)));
    } else {
      // Add to selected dates
      setSelectedDates([...selectedDates, day]);
      
      // Show stay selector for this date
      setSelectedDateForStay(day);
      setShowStaySelector(true);
    }
  };

  // Add stay to planning
  const addStayToPlan = (stay) => {
    if (!selectedDateForStay) return;
    
    setPlanningStays([
      ...planningStays,
      {
        ...stay,
        date: selectedDateForStay,
        id: `${stay.id}-${selectedDateForStay.getTime()}`
      }
    ]);
    
    setShowStaySelector(false);
  };

  // Remove stay from planning
  const removeStayFromPlan = (stayId) => {
    setPlanningStays(planningStays.filter(stay => stay.id !== stayId));
  };

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get stay for a specific date
  const getStayForDate = (date) => {
    return planningStays.find(stay => isSameDay(new Date(stay.date), date));
  };

  // Check if a date has a planned stay
  const hasPlannedStay = (date) => {
    return planningStays.some(stay => isSameDay(new Date(stay.date), date));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
            <SafeIcon icon={FiCalendar} className="h-6 w-6 text-primary-600 mr-2" />
            Travel Planning Calendar
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <SafeIcon icon={FiChevronLeft} className="h-5 w-5 text-gray-600" />
            </button>
            <div className="text-lg font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <SafeIcon icon={FiChevronRight} className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-sm text-gray-600 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {daysInMonth.map(day => {
            const isSelected = selectedDates.some(date => isSameDay(date, day));
            const dayHasStay = hasPlannedStay(day);
            const stayForDay = getStayForDate(day);
            
            return (
              <motion.div
                key={day.toString()}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleDateClick(day)}
                className={`
                  relative h-16 md:h-24 p-1 border rounded-lg cursor-pointer transition-colors
                  ${isToday(day) ? 'border-primary-400 bg-primary-50' : 'border-gray-200'}
                  ${!isSameMonth(day, currentMonth) ? 'opacity-40' : ''}
                  ${isSelected ? 'bg-primary-100 border-primary-500' : ''}
                `}
              >
                <div className={`
                  text-sm font-medium 
                  ${isToday(day) ? 'text-primary-700' : 'text-gray-700'}
                `}>
                  {format(day, 'd')}
                </div>
                
                {/* Show stay info if this date has a planned stay */}
                {dayHasStay && stayForDay && (
                  <div className="absolute bottom-1 left-1 right-1 bg-primary-600 rounded p-1 text-white text-xs overflow-hidden">
                    <div className="truncate">{stayForDay.name}</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Planning section */}
      <div className="p-6 bg-gray-50">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Travel Plan</h4>
        
        {planningStays.length > 0 ? (
          <div className="space-y-3">
            {planningStays
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(stay => (
                <div key={stay.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <img 
                    src={stay.image} 
                    alt={stay.name}
                    className="w-12 h-12 object-cover rounded-lg mr-3" 
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{stay.name}</h5>
                    <div className="flex items-center text-sm text-gray-600">
                      <SafeIcon icon={FiCalendar} className="h-3.5 w-3.5 mr-1" />
                      <span>{format(new Date(stay.date), 'MMM d, yyyy')}</span>
                      <SafeIcon icon={FiMapPin} className="h-3.5 w-3.5 ml-3 mr-1" />
                      <span>{stay.location}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-primary-600 font-medium">€{stay.price}</div>
                  </div>
                  <button
                    onClick={() => removeStayFromPlan(stay.id)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-500"
                    aria-label="Remove stay"
                  >
                    <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
              <SafeIcon icon={FiInfo} className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Travel Planning Tips</p>
                <p className="mt-1">Consider transportation between stays and local weather patterns when planning your multi-destination trip.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <SafeIcon icon={FiCalendar} className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>Select dates on the calendar to plan your stays</p>
          </div>
        )}
      </div>
      
      {/* Stay selector modal */}
      {showStaySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-gray-900">
                Select Stay for {selectedDateForStay ? format(selectedDateForStay, 'MMMM d, yyyy') : ''}
              </h4>
              <button
                onClick={() => setShowStaySelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiChevronLeft} className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-h-96 overflow-y-auto">
              {availableStays.map(stay => (
                <div
                  key={stay.id}
                  onClick={() => addStayToPlan(stay)}
                  className="flex border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary-500 transition-colors"
                >
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="p-3">
                    <h5 className="font-medium text-gray-900 mb-1">{stay.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{stay.location}</p>
                    <p className="text-primary-600 font-medium">€{stay.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStaySelector(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TravelPlanningCalendar;
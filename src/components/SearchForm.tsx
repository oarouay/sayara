"use client"

import { useState } from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';

export default function SearchForm() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');

  const handleSearch = () => {
    console.log({ pickupLocation, pickupDate, pickupTime, returnDate, returnTime });
  };

  return (
    <section className="bg-white shadow-lg rounded-lg p-4 max-w-7xl mx-auto -mt-10 z-10 relative">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Pickup Location */}
        <div className="flex-1 relative">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Pick-up location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Airport, city or station" 
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className={`w-full border-2 border-gray-300 pl-11 pr-3 py-3 rounded-md 
                        focus:outline-none focus:border-blue-500 transition-colors
                        ${pickupLocation ? 'text-gray-900' : 'text-gray-400'} placeholder-gray-400`}
            />
          </div>
        </div>

        {/* Pickup Date */}
        <div className="flex-shrink-0 w-full lg:w-44">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Pick-up date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input 
              type="date" 
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className={`w-full border-2 border-gray-300 pl-11 pr-3 py-3 rounded-md 
                        focus:outline-none focus:border-blue-500 transition-colors
                        [color-scheme:light] ${pickupDate ? 'text-gray-900' : 'text-gray-400'}`}
            />
          </div>
        </div>

        {/* Pickup Time */}
        <div className="flex-shrink-0 w-full lg:w-32">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input 
              type="time" 
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className={`w-full border-2 border-gray-300 pl-11 pr-3 py-3 rounded-md 
                        focus:outline-none focus:border-blue-500 transition-colors
                        [color-scheme:light] ${pickupTime ? 'text-gray-900' : 'text-gray-400'}`}
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="flex-shrink-0 w-full lg:w-44">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Drop-off date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input 
              type="date" 
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className={`w-full border-2 border-gray-300 pl-11 pr-3 py-3 rounded-md 
                        focus:outline-none focus:border-blue-500 transition-colors
                        [color-scheme:light] ${returnDate ? 'text-gray-900' : 'text-gray-400'}`}
            />
          </div>
        </div>

        {/* Return Time */}
        <div className="flex-shrink-0 w-full lg:w-32">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input 
              type="time" 
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className={`w-full border-2 border-gray-300 pl-11 pr-3 py-3 rounded-md 
                        focus:outline-none focus:border-blue-500 transition-colors
                        [color-scheme:light] ${returnTime ? 'text-gray-900' : 'text-gray-400'}`}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button 
            onClick={handleSearch}
            className="w-full lg:w-auto bg-green-600 text-white px-8 py-3 rounded-md 
                     hover:bg-blue-700 transition-colors font-semibold flex items-center 
                     justify-center gap-2 min-w-[120px]"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  )
}
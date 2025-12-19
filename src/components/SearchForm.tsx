"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, DollarSign } from 'lucide-react';

export default function SearchForm() {
  const router = useRouter();
  const [availability, setAvailability] = useState('all');
  const [selectedMaker, setSelectedMaker] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(1500);

  // Car makers from your database
  const makers = ['Toyota', 'BMW', 'Mercedes', 'Ford', 'Hyundai', 'KIA', 'Audi', 'Renault', 'VW' , 'Honda', 'Nissan', 'Peugeot', 'Subaru', 'Chevrolet', 'Jeep', 'Mazda'];
  
  // Car types
  const carTypes = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Sports Car' , 'Convertible', 'Wagon', 'Pickup Truck'];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (availability && availability !== 'all') params.append('availability', availability);
    if (selectedMaker && selectedMaker !== 'all') params.append('maker', selectedMaker);
    if (selectedType && selectedType !== 'all') params.append('type', selectedType);
    if (minPrice) params.append('minPrice', minPrice.toString());
    if (maxPrice) params.append('maxPrice', maxPrice.toString());

    const queryString = params.toString();
    router.push(`/car-deals${queryString ? '?' + queryString : ''}`);
  };

  return (
    <section className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto -mt-10 z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Availability */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Availability
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full border-2 border-gray-300 px-3 py-3 rounded-md focus:outline-none focus:border-green-500 transition-colors bg-white"
          >
            <option value="all">All</option>
            <option value="available">Available Now</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Car Maker */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Car Maker
          </label>
          <select
            value={selectedMaker}
            onChange={(e) => setSelectedMaker(e.target.value)}
            className="w-full border-2 border-gray-300 px-3 py-3 rounded-md focus:outline-none focus:border-green-500 transition-colors bg-white"
          >
            <option value="all">All Makers</option>
            {makers.map((maker) => (
              <option key={maker} value={maker}>
                {maker}
              </option>
            ))}
          </select>
        </div>

        {/* Car Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Car Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full border-2 border-gray-300 px-3 py-3 rounded-md focus:outline-none focus:border-green-500 transition-colors bg-white"
          >
            <option value="all">All Types</option>
            {carTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>


        {/* Monthly Price Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Monthly Price
          </label>
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="200"
                max="1500"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-1/2 border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-green-500 text-sm"
                placeholder="Min"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min="200"
                max="1500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-1/2 border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-green-500 text-sm"
                placeholder="Max"
              />
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={handleSearch}
          className="bg-green-600 text-white px-12 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg"
        >
          Search Cars
        </button>
      </div>
    </section>
  )
}
"use client"

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CarMaker } from '@prisma/client';

export default function SearchForm({ makers = [], types = [] }: { makers?: CarMaker[]; types?: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // stable string representation used for effect dependencies
  const searchStr = searchParams?.toString() || '';

  // Local safe state for available options (props may be empty)
  const [localMakers, setLocalMakers] = useState<CarMaker[]>(makers || []);
  const [localTypes, setLocalTypes] = useState<string[]>(types || []);

  const [selectedMaker, setSelectedMaker] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState<'all' | 'AVAILABLE' | 'UNAVAILABLE'>('all');
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(1500);

  // Keep local lists in sync when props change
  useEffect(() => {
    // Only update local state if incoming props actually differ to avoid render loops
    setLocalMakers(prev => {
      const next = makers || [];
      if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
      return next;
    });
    setLocalTypes(prev => {
      const next = types || [];
      if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
      return next;
    });
  }, [makers, types]);

  // Track whether we've attempted to fetch options to avoid repeating when server returns empty arrays
  const [fetchedOptions, setFetchedOptions] = useState(false);

  // Populate options from the server when not provided by props
  useEffect(() => {
    const shouldFetch = (!fetchedOptions && (localMakers.length === 0 || localTypes.length === 0));
    if (!shouldFetch) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/cars');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setLocalMakers(prev => {
          const next = data.makers || [];
          if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
          return next;
        });
        setLocalTypes(prev => {
          const next = data.types || [];
          if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
          return next;
        });

        const all = data.cars || [];
        if (all.length > 0) {
          const hasQMin = Boolean(searchParams?.get('minPrice'));
          const hasQMax = Boolean(searchParams?.get('maxPrice'));
          if (!hasQMin) setMinPrice(200);
          if (!hasQMax) setMaxPrice(1500);
        }
      } catch {
        // ignore
      } finally {
        setFetchedOptions(true);
      }
    })();

    return () => { cancelled = true };
  }, [localMakers.length, localTypes.length, fetchedOptions, searchParams]);

  useEffect(() => {
    // Use the query-string form to avoid re-running when the searchParams object identity changes
    const qMaker = searchParams?.get('maker') ?? 'all'
    const qType = searchParams?.get('type') ?? 'all'
    const qAvailability = (searchParams?.get('availability') ?? 'all') as 'all' | 'AVAILABLE' | 'UNAVAILABLE'
    const qMin = Number(searchParams?.get('minPrice') ?? 200)
    const qMax = Number(searchParams?.get('maxPrice') ?? 1500)

    // Only update when different to avoid causing extra renders
    setSelectedMaker(prev => prev !== qMaker ? qMaker : prev)
    setSelectedType(prev => prev !== qType ? qType : prev)
    setSelectedAvailability(prev => prev !== qAvailability ? qAvailability : prev)
    setMinPrice(prev => prev !== qMin ? qMin : prev)
    setMaxPrice(prev => prev !== qMax ? qMax : prev)
  }, [searchStr, searchParams]);

  // Ensure minPrice never exceeds maxPrice
  useEffect(() => {
    setMaxPrice(prev => prev < minPrice ? minPrice : prev);
  }, [minPrice]);

  // Ensure maxPrice never falls below minPrice
  useEffect(() => {
    setMinPrice(prev => prev > maxPrice ? maxPrice : prev);
  }, [maxPrice]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedMaker && selectedMaker !== 'all') params.append('maker', selectedMaker);
    if (selectedType && selectedType !== 'all') params.append('type', selectedType);
    if (selectedAvailability && selectedAvailability !== 'all') params.append('availability', selectedAvailability);
    if (minPrice) params.append('minPrice', minPrice.toString());
    if (maxPrice) params.append('maxPrice', maxPrice.toString());

    const queryString = params.toString();
    router.push(`/car-deals?${queryString}`);
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-7xl mx-auto -mt-10 z-10 relative transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Car Maker */}
        <div className="flex flex-col">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Car Maker
          </label>
          <select
            value={selectedMaker}
            onChange={(e) => setSelectedMaker(e.target.value)}
            className="w-full border-2 border-gray-300 dark:border-gray-600 px-3 py-3 rounded-md focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Makers</option>
            {localMakers.length === 0 ? (
              <option disabled>{fetchedOptions ? 'No makers available' : 'Loading makers...'}</option>
            ) : (
              localMakers.map((maker) => (
                <option key={maker} value={maker}>
                  {maker}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Car Type */}
        <div className="flex flex-col">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Car Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full border-2 border-gray-300 dark:border-gray-600 px-3 py-3 rounded-md focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Types</option>
            {localTypes.length === 0 ? (
              <option disabled>{fetchedOptions ? 'No types available' : 'Loading types...'}</option>
            ) : (
              localTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Availability Status */}
        <div className="flex flex-col">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Availability
          </label>
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value as 'all' | 'AVAILABLE' | 'UNAVAILABLE')}
            className="w-full border-2 border-gray-300 dark:border-gray-600 px-3 py-3 rounded-md focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Availability</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>

        {/* Min Price */}
        <div className="flex flex-col">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Min Price (TND د.ت)
          </label>
          <input
            type="number"
            min="200"
            max="1500"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full border-2 border-gray-300 dark:border-gray-600 px-3 py-3 rounded-md focus:outline-none focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
            placeholder="Min"
          />
        </div>

        {/* Max Price */}
        <div className="flex flex-col">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Max Price (TND د.ت)
          </label>
          <input
            type="number"
            min="200"
            max="1500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full border-2 border-gray-300 dark:border-gray-600 px-3 py-3 rounded-md focus:outline-none focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Price Slider - Positioned under price boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        <div className="flex flex-col lg:col-start-4 lg:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Price Range Slider
          </label>
          <input
            type="range"
            min="200"
            max="1500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>TND {minPrice}</span>
            <span>TND {maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-12 py-3 rounded-md transition-colors font-semibold shadow-md hover:shadow-lg"
        >
          Search Cars
        </button>
      </div>
    </section>
  )
}
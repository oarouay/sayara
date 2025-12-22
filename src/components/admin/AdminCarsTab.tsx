"use client"

import React, { useState, useEffect } from 'react'
import { Car, CarDetails, CarMaker } from '@prisma/client'

// Known logos map - used to attach default logos when a maker is selected. Maker list itself is fetched from the server to stay in sync.
const LOGO_MAP: Record<string, string> = {
    Toyota: '/data/toyota.svg',
    BMW: '/data/BMW.svg',
    Mercedes: '/data/mercedes.svg',
    Audi: '/data/audi.svg',
    Ford: '/data/ford.svg',
    Peugeot: '/data/peugeot.svg',
    Renault: '/data/Renault.svg',
    Kia: '/data/kia.svg',
    Hyundai: '/data/hyundai.svg',
    Volkswagen: '/data/vw.svg',
    Honda: '/data/honda.svg',
    Mazda: '/data/mazda.svg',
    Nissan: '/data/nissan.svg',
    Chevrolet: '/data/chevrolet.svg',
    Jeep: '/data/jeep.svg',
    Subaru: '/data/subaru.svg',
};


const keyInfoFields = ["Engine power", "Transmission", "Fuel", "Doors", "Seats", "Warranty"]
const statsFields = ["CO2 emissions", "Acceleration (0–100 km/h)", "Top speed", "Efficiency", "Boot (seats up)", "Safety rating"]
const featureCategories = ["Passive Safety", "Security", "Interior Features", "Exterior Features", "Entertainment", "Driver Convenience", "Engine/Drivetrain/Suspension", "Trim", "Wheels"]

type CarWithDetails = Car & { details: CarDetails | null };

export default function AdminCarsTab() {
  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewName, setPreviewName] = useState<string>('')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [detailsEditingId, setDetailsEditingId] = useState<string | null>(null)
  const [detailsSection, setDetailsSection] = useState<'keyinfo' | 'stats' | 'features'>('keyinfo')
  const [rawMode, setRawMode] = useState(false)
  const [detailsRaw, setDetailsRaw] = useState<string>('')
  const [detailsParseError, setDetailsParseError] = useState<string | null>(null)
  
  const [makerOptions, setMakerOptions] = useState<CarMaker[]>([]);

  const [form, setForm] = useState({
    maker: ('Toyota' as CarMaker),
    name: '',
    type: 'Sedan',
    logo: '',
    image: '',
    monthly: 0,
    mileage: 0,
    insuranceCost: 0,
    price: 0,
    leasingTerm: 36,
    leasingMileageLimit: 16000,
  })

  const [detailsForm, setDetailsForm] = useState<Partial<CarDetails>>({
    keyInfo: {},
    stats: {},
    features: {},
  })

  const fetchCars = async () => {
    const res = await fetch('/api/cars');
    const data = await res.json();
    // Support both legacy array response and new { cars, makers, types } shape
    setCars(Array.isArray(data) ? data : data.cars || []);
    // set maker options from API if available
    if (!Array.isArray(data) && data.makers) {
      setMakerOptions(data.makers);
    } else {
      // fallback to known logos map keys
      setMakerOptions(Object.keys(LOGO_MAP) as CarMaker[]);
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);

  const startCreate = () => {
    setEditingId(null)
    setForm({
        maker: 'Toyota',
        name: '',
        type: 'Sedan',
        logo: LOGO_MAP['Toyota'] || '',
        image: '',
        monthly: 0,
        mileage: 0,
        insuranceCost: 0,
        price: 0,
        leasingTerm: 36,
        leasingMileageLimit: 16000,
    })
    setShowModal(true)
  }

  const startEdit = (car: CarWithDetails) => {
    if (!car?.id) return alert('Cannot edit: missing car id');
    setEditingId(car.id)
    setForm({
        maker: car.maker,
        name: car.name,
        type: car.type,
        logo: car.logo,
        image: car.image,
        monthly: car.monthly,
        mileage: car.mileage,
        insuranceCost: car.insuranceCost,
        price: car.price,
        leasingTerm: car.leasingTerm,
        leasingMileageLimit: car.leasingMileageLimit,
    })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.name || !form.maker) return alert('Car name and maker required')
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/cars/${editingId}` : '/api/cars';

    try {
      const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
      });

      if (res.ok) {
          await fetchCars();
          setShowModal(false);
      } else {
          const err = await res.json().catch(() => ({}));
          alert(`Failed to save car: ${err.error || err.message || res.status}`);
      }
    } catch (e) {
      alert(`Network error: ${String(e)}`);
    }
  }

  const remove = async (id: string) => {
    if (!id || id === 'undefined') return alert('Cannot delete: invalid car id');
    if (!confirm('Delete car?')) return;

    const url = `/api/cars/${String(id)}`;
    console.debug('[AdminCarsTab] Deleting car', { id, url });

    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
          await fetchCars();
      } else {
          const body = await res.text().catch(() => '');
          console.error('[AdminCarsTab] Delete failed', { status: res.status, body });
          const err = (() => {
            try { return JSON.parse(body); } catch { return { error: body || 'Unknown' }; }
          })();
          alert(`Failed to delete car: ${err.error || err.message || res.status}`);
      }
    } catch (e) {
      console.error('[AdminCarsTab] Delete network error', e);
      alert(`Network error: ${String(e)}`);
    }
  }

  const startEditDetails = (car: CarWithDetails) => {
    if (!car?.id) return alert('Cannot edit details: missing car id');
    setDetailsEditingId(car.id)
    const initial = car.details || { keyInfo: {}, stats: {}, features: {} };
    setDetailsForm(initial)
    setDetailsRaw(JSON.stringify(initial, null, 2))
    setDetailsSection('keyinfo')
    setRawMode(false)
    setDetailsParseError(null)
    setShowDetailsModal(true)
  }

  const saveDetails = async () => {
    if (!detailsEditingId) return;

    const carToUpdate = cars.find(c => c.id === detailsEditingId);
    if (!carToUpdate) return;

    const payload = { details: detailsForm };

    const res = await fetch(`/api/cars/${detailsEditingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        await fetchCars();
        setShowDetailsModal(false);
    } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to save details: ${err.error || err.message || res.status}`);
    }
  }

  const updateKeyInfo = (field: string, value: string) => {
    setDetailsForm(prev => ({ ...prev, keyInfo: { ...((prev.keyInfo as any) || {}), [field]: value } }))
  }

  const updateStat = (field: string, value: string) => {
    setDetailsForm(prev => ({ ...prev, stats: { ...((prev.stats as any) || {}), [field]: value } }))
  }

  const updateFeature = (category: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setDetailsForm(prev => ({ ...prev, features: { ...((prev.features as any) || {}), [category]: items } }))
  }

  const hasDetails = (car: CarWithDetails) => {
    const details = car.details;
    return details && (Object.keys(details.keyInfo || {}).length > 0 || Object.keys(details.stats || {}).length > 0 || Object.keys(details.features || {}).length > 0)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Manage Cars</h3>
        <button onClick={startCreate} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow-sm hover:shadow-md transition-shadow">Add Car</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-auto">
        <table className="w-full text-left divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr className="text-sm font-semibold text-green-700">
              <th className="py-4 px-4">Image</th>
              <th className="py-4 px-4">Maker</th>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Mileage Limit</th>
              <th className="py-4 px-4">Mileage</th>
              <th className="py-4 px-4">Insurance</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-green-50">
                <td className="py-4 px-4">
                  {car.image ? (
                    <img src={car.image} alt={car.name} className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity" onClick={() => { setPreviewImage(car.image); setPreviewName(car.name) }} />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="relative group inline-flex items-center">
                    <img src={car.logo} alt={car.maker} className="w-16 h-16 object-contain cursor-help" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{car.maker}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">{car.name}</td>
                <td className="py-4 px-4 text-gray-700 text-sm">{car.type}</td>
                <td className="py-4 px-4 text-gray-900 text-sm">{car.leasingMileageLimit.toLocaleString()} km/year</td>
                <td className="py-4 px-4 text-gray-900">{car.mileage.toLocaleString()} km</td>
                <td className="py-4 px-4 text-gray-900">${car.insuranceCost}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(car)} className="text-sm px-3 py-1 bg-white border text-green-700 rounded-md hover:bg-green-50">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); startEditDetails(car); }} className={`text-sm px-3 py-1 rounded-md ${hasDetails(car) ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>{hasDetails(car) ? 'Details' : 'Add Details'}</button>
                    <button onClick={() => remove(car.id)} className="text-sm px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-10">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 sticky top-0 z-10">
              <h4 className="text-xl font-semibold">{editingId ? 'Edit Car' : 'Add New Car'}</h4>
              <p className="text-sm text-green-100 mt-1">Fill in all car details</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maker *</label>
                  <select value={form.maker} onChange={(e) => { 
                      const sel = e.target.value;
                      setForm(prev => ({ ...prev, maker: sel as CarMaker, logo: LOGO_MAP[sel] || prev.logo })) 
                  }} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    {makerOptions.map(maker => (
                      <option key={maker} value={maker}>{maker}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Name *</label>
                  <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Corolla" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select value={form.type} onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sports Car">Sports Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly ($) *</label>
                  <input type="number" value={form.monthly} onChange={(e) => setForm(prev => ({ ...prev, monthly: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leasing Term (months) *</label>
                  <input type="number" value={form.leasingTerm} onChange={(e) => setForm(prev => ({ ...prev, leasingTerm: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <p className="text-xs text-gray-500 mt-1">Or auto-calculated: Monthly × Term = ${form.monthly * form.leasingTerm}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage Limit (km/year)</label>
                  <input type="number" value={form.leasingMileageLimit} onChange={(e) => setForm(prev => ({ ...prev, leasingMileageLimit: Number(e.target.value) }))} placeholder="16000" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km) *</label>
                  <input type="number" value={form.mileage} onChange={(e) => setForm(prev => ({ ...prev, mileage: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance ($) *</label>
                  <input type="number" value={form.insuranceCost} onChange={(e) => setForm(prev => ({ ...prev, insuranceCost: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              {form.image && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                  <img src={form.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={save} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow">
                  {editingId ? 'Update Car' : 'Add Car'}
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowDetailsModal(false)}>
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col z-10" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 flex-shrink-0">
              <h4 className="text-xl font-semibold">Car Specifications</h4>
            </div>
            
            <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <button onClick={() => { setRawMode(false); setDetailsSection('keyinfo') }} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${!rawMode && detailsSection === 'keyinfo' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Key Info</button>
              <button onClick={() => { setRawMode(false); setDetailsSection('stats') }} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${!rawMode && detailsSection === 'stats' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Stats</button>
              <button onClick={() => { setRawMode(false); setDetailsSection('features') }} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${!rawMode && detailsSection === 'features' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Features</button>
              <button onClick={() => setRawMode(true)} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${rawMode ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Raw JSON</button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {!rawMode && detailsSection === 'keyinfo' && (
                <div className="space-y-4">
                  {keyInfoFields.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field}</label>
                      <input value={(detailsForm.keyInfo as any)?.[field] || ''} onChange={(e) => updateKeyInfo(field, e.target.value)} placeholder={`Enter ${field}`} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}

              {!rawMode && detailsSection === 'stats' && (
                <div className="space-y-4">
                  {statsFields.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field}</label>
                      <input value={(detailsForm.stats as any)?.[field] || ''} onChange={(e) => updateStat(field, e.target.value)} placeholder={`Enter ${field}`} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}

              {!rawMode && detailsSection === 'features' && (
                <div className="space-y-4">
                  {featureCategories.map(category => (
                    <div key={category}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{category}</label>
                      <input value={((detailsForm.features as any)?.[category] || []).join(', ')} onChange={(e) => updateFeature(category, e.target.value)} placeholder="Enter features separated by commas" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}

              {rawMode && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edit raw JSON</label>
                  <textarea value={detailsRaw} onChange={(e) => { setDetailsRaw(e.target.value); setDetailsParseError(null); }} rows={14} className="w-full p-3 border border-gray-300 rounded-md text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  {detailsParseError && <p className="text-sm text-red-600">{detailsParseError}</p>}
                  <div className="flex gap-3">
                    <button onClick={() => {
                      try {
                        const parsed = JSON.parse(detailsRaw);
                        setDetailsForm(parsed);
                        setDetailsParseError(null);
                        setRawMode(false);
                      } catch (e: any) {
                        setDetailsParseError(String(e.message || e));
                      }
                    }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Apply JSON</button>
                    <button onClick={() => { setDetailsRaw(JSON.stringify(detailsForm, null, 2)); setDetailsParseError(null); }} className="px-4 py-2 border border-gray-300 rounded">Reset</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t flex-shrink-0">
              <button onClick={saveDetails} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow">
                Save Details
              </button>
              <button onClick={async () => {
                if (!detailsEditingId) return;
                if (!confirm('Delete details for this car?')) return;
                try {
                  const res = await fetch(`/api/cars/${detailsEditingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ details: null }) });
                  if (res.ok) {
                    await fetchCars();
                    setShowDetailsModal(false);
                  } else {
                    const err = await res.json().catch(() => ({}));
                    alert(`Failed to delete details: ${err.error || err.message || res.status}`);
                  }
                } catch (e) {
                  alert(`Network error: ${String(e)}`);
                }
              }} className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50">Delete Details</button>
              <button onClick={() => setShowDetailsModal(false)} className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPreviewImage(null)}>
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
          <div className="relative max-w-4xl max-h-[90vh] z-10" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt={previewName} className="w-full h-full object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import React, { useState } from 'react'

type CarMaker = {
  name: string
  logo: string
}

type Car = {
  id: number
  maker: string
  name: string
  image: string
  monthly: number
  mileage: number
  insuranceCost: number
  price: number
  leasingTerm?: number
  leasingMileageLimit?: string
}

type CarDetails = {
  keyInfo?: Record<string, string>
  stats?: Record<string, string>
  features?: Record<string, string[]>
}

const carMakers: CarMaker[] = [
  { name: "Toyota", logo: "/data/toyota.svg" },
  { name: "BMW", logo: "/data/BMW.svg" },
  { name: "Mercedes", logo: "/data/mercedes.svg" },
  { name: "Audi", logo: "/data/audi.svg" },
  { name: "Ford", logo: "/data/ford.svg" },
  { name: "Peugeot", logo: "/data/peugeot.svg" },
  { name: "Renault", logo: "/data/Renault.svg" },
  { name: "Kia", logo: "/data/kia.svg" },
  { name: "Hyundai", logo: "/data/hyundai.svg" },
  { name: "Volkswagen", logo: "/data/vw.svg" },
]

const keyInfoFields = ["Engine power", "Transmission", "Fuel", "Doors", "Seats", "Warranty"]
const statsFields = ["CO2 emissions", "Acceleration (0–100 km/h)", "Top speed", "Efficiency", "Boot (seats up)", "Safety rating"]
const featureCategories = ["Passive Safety", "Security", "Interior Features", "Exterior Features", "Entertainment", "Driver Convenience", "Engine/Drivetrain/Suspension", "Trim", "Wheels"]

const initialCars: Car[] = [
  { id: 1, maker: "Toyota", name: "Corolla", image: "https://images.unsplash.com/photo-1605557623739-1f9f3f3e9f3a", monthly: 289, mileage: 25000, insuranceCost: 150, price: 10404, leasingTerm: 36, leasingMileageLimit: "16,000 km/year" },
  { id: 2, maker: "BMW", name: "3 Series", image: "https://images.unsplash.com/photo-1617814077082-9d2e3f3a9f3a", monthly: 399, mileage: 15000, insuranceCost: 150, price: 14364, leasingTerm: 36, leasingMileageLimit: "20,000 km/year" },
  { id: 3, maker: "Mercedes", name: "C-Class", image: "https://images.unsplash.com/photo-1620057633739-1f9f3f3e9f3a", monthly: 429, mileage: 12000, insuranceCost: 150, price: 15444, leasingTerm: 36, leasingMileageLimit: "20,000 km/year" },
  { id: 4, maker: "Ford", name: "Mustang", image: "https://images.unsplash.com/photo-1605557623739-1f9f3f3e9f3a", monthly: 499, mileage: 8000, insuranceCost: 150, price: 17964, leasingTerm: 36, leasingMileageLimit: "15,000 km/year" },
]

export default function AdminCarsTab() {
  const [makers, setMakers] = useState<CarMaker[]>(carMakers)
  const [cars, setCars] = useState<Car[]>(initialCars)
  const [carDetails, setCarDetails] = useState<Record<number, CarDetails>>({})
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showMakerModal, setShowMakerModal] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewName, setPreviewName] = useState<string>('')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [detailsEditingId, setDetailsEditingId] = useState<number | null>(null)
  const [detailsSection, setDetailsSection] = useState<'keyinfo' | 'stats' | 'features'>('keyinfo')
  const [newMaker, setNewMaker] = useState({ name: '', logo: '' })
  
  const [form, setForm] = useState({
    maker: 'Toyota',
    name: '',
    image: '',
    monthly: 0,
    mileage: 0,
    insuranceCost: 0,
    price: 0,
    leasingTerm: 36,
    leasingMileageLimit: '16,000 km/year',
  })

  const [detailsForm, setDetailsForm] = useState<CarDetails>({
    keyInfo: {},
    stats: {},
    features: {},
  })

  const startCreate = () => {
    setEditingId(null)
    setForm({ maker: 'Toyota', name: '', image: '', monthly: 0, mileage: 0, insuranceCost: 0, price: 0, leasingTerm: 36, leasingMileageLimit: '16,000 km/year' })
    setShowModal(true)
  }

  const startEdit = (car: Car) => {
    setEditingId(car.id)
    setForm({ maker: car.maker, name: car.name, image: car.image, monthly: car.monthly, mileage: car.mileage, insuranceCost: car.insuranceCost, price: car.price, leasingTerm: car.leasingTerm || 36, leasingMileageLimit: car.leasingMileageLimit || '16,000 km/year' })
    setShowModal(true)
  }

  const save = () => {
    if (!form.name || !form.maker) return alert('Car name and maker required')
    const calculatedPrice = form.monthly * form.leasingTerm
    if (editingId) {
      setCars(prev => prev.map(c => c.id === editingId ? { ...c, maker: form.maker, name: form.name, image: form.image, monthly: form.monthly, mileage: form.mileage, insuranceCost: form.insuranceCost, price: calculatedPrice, leasingTerm: form.leasingTerm, leasingMileageLimit: form.leasingMileageLimit } : c))
    } else {
      const id = Math.max(...cars.map(c => c.id), 0) + 1
      setCars(prev => [{ id, maker: form.maker, name: form.name, image: form.image, monthly: form.monthly, mileage: form.mileage, insuranceCost: form.insuranceCost, price: calculatedPrice, leasingTerm: form.leasingTerm, leasingMileageLimit: form.leasingMileageLimit }, ...prev])
    }
    setShowModal(false)
    setForm({ maker: 'Toyota', name: '', image: '', monthly: 0, mileage: 0, insuranceCost: 0, price: 0, leasingTerm: 36, leasingMileageLimit: '16,000 km/year' })
  }

  const remove = (id: number) => {
    if (!confirm('Delete car?')) return
    setCars(prev => prev.filter(c => c.id !== id))
    setCarDetails(prev => {
      const newDetails = { ...prev }
      delete newDetails[id]
      return newDetails
    })
  }

  const getMakerLogo = (makerName: string) => {
    return makers.find(m => m.name === makerName)?.logo || ''
  }

  const addMaker = () => {
    if (!newMaker.name) return alert('Maker name required')
    const makerExists = makers.some(m => m.name.toLowerCase() === newMaker.name.toLowerCase())
    if (makerExists) return alert('This maker already exists')
    setMakers(prev => [...prev, { name: newMaker.name, logo: newMaker.logo }])
    setForm(prev => ({ ...prev, maker: newMaker.name }))
    setNewMaker({ name: '', logo: '' })
    setShowMakerModal(false)
  }

  const startEditDetails = (carId: number) => {
    setDetailsEditingId(carId)
    setDetailsForm(carDetails[carId] || { keyInfo: {}, stats: {}, features: {} })
    setDetailsSection('keyinfo')
    setShowDetailsModal(true)
  }

  const saveDetails = () => {
    if (!detailsEditingId) return
    setCarDetails(prev => ({ ...prev, [detailsEditingId]: detailsForm }))
    setShowDetailsModal(false)
  }

  const updateKeyInfo = (field: string, value: string) => {
    setDetailsForm(prev => ({ ...prev, keyInfo: { ...prev.keyInfo, [field]: value } }))
  }

  const updateStat = (field: string, value: string) => {
    setDetailsForm(prev => ({ ...prev, stats: { ...prev.stats, [field]: value } }))
  }

  const updateFeature = (category: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setDetailsForm(prev => ({ ...prev, features: { ...prev.features, [category]: items } }))
  }

  const hasDetails = (carId: number) => {
    const details = carDetails[carId]
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
              <th className="py-4 px-4">Monthly</th>
              <th className="py-4 px-4">Term</th>
              <th className="py-4 px-4">Mileage Limit</th>
              <th className="py-4 px-4">Mileage</th>
              <th className="py-4 px-4">Insurance</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-green-50">
                <td className="py-4 px-4">
                  <img src={car.image} alt={car.name} className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity" onClick={() => { setPreviewImage(car.image); setPreviewName(car.name) }} />
                </td>
                <td className="py-4 px-4">
                  <div className="relative group inline-flex items-center">
                    <img src={getMakerLogo(car.maker)} alt={car.maker} className="w-16 h-16 object-contain cursor-help" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{car.maker}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">{car.name}</td>
                <td className="py-4 px-4 text-gray-900">${car.monthly}</td>
                <td className="py-4 px-4 text-gray-900 text-sm">{car.leasingTerm} month(s)</td>
                <td className="py-4 px-4 text-gray-900 text-sm">{car.leasingMileageLimit}</td>
                <td className="py-4 px-4 text-gray-900">{car.mileage.toLocaleString()} km</td>
                <td className="py-4 px-4 text-gray-900">${car.insuranceCost}</td>
                <td className="py-4 px-4 text-gray-900">${car.price.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(car)} className="text-sm px-3 py-1 bg-white border text-green-700 rounded-md hover:bg-green-50">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); startEditDetails(car.id); }} className={`text-sm px-3 py-1 rounded-md ${hasDetails(car.id) ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>{hasDetails(car.id) ? 'More Details' : 'Add More Details'}</button>
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
                  <select value={form.maker} onChange={(e) => { if (e.target.value === '__add_new__') { setShowMakerModal(true) } else { setForm(prev => ({ ...prev, maker: e.target.value })) } }} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <optgroup label="Available Makers">
                      {makers.map(maker => (
                        <option key={maker.name} value={maker.name}>{maker.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Add New">
                      <option value="__add_new__">+ Add New Maker</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Name *</label>
                  <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Corolla" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input type="number" value={form.price} disabled className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-gray-100 focus:outline-none" />
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated: Monthly × Term</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage Limit</label>
                  <input value={form.leasingMileageLimit} onChange={(e) => setForm(prev => ({ ...prev, leasingMileageLimit: e.target.value }))} placeholder="16,000 km/year" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
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

      {showMakerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 z-10">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-lg">
              <h4 className="text-xl font-semibold">Add Car Maker</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maker Name *</label>
                <input value={newMaker.name} onChange={(e) => setNewMaker(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Tesla" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input value={newMaker.logo} onChange={(e) => setNewMaker(prev => ({ ...prev, logo: e.target.value }))} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              {newMaker.logo && (
                <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img src={newMaker.logo} alt="Preview" className="h-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={addMaker} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow">Add Maker</button>
                <button onClick={() => { setShowMakerModal(false); setNewMaker({ name: '', logo: '' }) }} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
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
              <button onClick={() => setDetailsSection('keyinfo')} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${detailsSection === 'keyinfo' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Key Info</button>
              <button onClick={() => setDetailsSection('stats')} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${detailsSection === 'stats' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Stats</button>
              <button onClick={() => setDetailsSection('features')} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${detailsSection === 'features' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Features</button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {detailsSection === 'keyinfo' && (
                <div className="space-y-4">
                  {keyInfoFields.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field}</label>
                      <input value={detailsForm.keyInfo?.[field] || ''} onChange={(e) => updateKeyInfo(field, e.target.value)} placeholder={`Enter ${field}`} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}

              {detailsSection === 'stats' && (
                <div className="space-y-4">
                  {statsFields.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field}</label>
                      <input value={detailsForm.stats?.[field] || ''} onChange={(e) => updateStat(field, e.target.value)} placeholder={`Enter ${field}`} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}

              {detailsSection === 'features' && (
                <div className="space-y-4">
                  {featureCategories.map(category => (
                    <div key={category}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{category}</label>
                      <input value={(detailsForm.features?.[category] || []).join(', ')} onChange={(e) => updateFeature(category, e.target.value)} placeholder="Enter features separated by commas" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t flex-shrink-0">
              <button onClick={saveDetails} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow">
                Save Details
              </button>
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
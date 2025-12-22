'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Main Store location
const MAIN_STORE = {
  name: 'Main Store',
  address: '85-87 Rue de La Palestine, Tunis 1002',
  latitude: 36.817702,
  longitude: 10.179812,
}

// Fix Leaflet marker icon issue in Next.js
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.setIcon(markerIcon)

interface LocationData {
  name: string
  latitude: number
  longitude: number
}

interface LocationPickerProps {
  value: LocationData | null
  onChange: (location: LocationData) => void
  title?: string
}

function MapClickHandler({ onChange, value }: { onChange: (loc: LocationData) => void; value: LocationData | null }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      const { lat, lng } = e.latlng
      onChange({
        name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        latitude: lat,
        longitude: lng,
      })
    },
  })
  return null
}

export default function LocationPicker({ value, onChange, title = 'Pick Location' }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-96 bg-gray-200 rounded animate-pulse">Loading map...</div>

  const defaultLat = value?.latitude || 36.8065
  const defaultLng = value?.longitude || 10.1686 // Tunisia center coordinates

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">{title}</label>
      
      {/* Quick Select Main Store Button */}
      <button
        onClick={() => onChange(MAIN_STORE)}
        className="w-full p-3 border-2 border-green-500 rounded-lg hover:bg-green-50 transition text-left"
      >
        <p className="font-semibold text-green-700">{MAIN_STORE.name}</p>
        <p className="text-sm text-gray-600">{MAIN_STORE.address}</p>
      </button>
      
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm font-semibold text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      
      <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-300">
        <MapContainer center={[defaultLat, defaultLng] as L.LatLngExpression} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapClickHandler onChange={onChange} value={value} />
          {value && (
            <Marker position={[value.latitude, value.longitude] as L.LatLngExpression}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{value.name}</p>
                  <p>Lat: {value.latitude.toFixed(6)}</p>
                  <p>Lng: {value.longitude.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {value && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
          <p className="font-semibold text-blue-900">{value.name}</p>
          <p className="text-blue-700">Latitude: {value.latitude.toFixed(6)}</p>
          <p className="text-blue-700">Longitude: {value.longitude.toFixed(6)}</p>
        </div>
      )}
    </div>
  )
}

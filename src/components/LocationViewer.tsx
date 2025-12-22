'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icon issue
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

interface LocationViewerProps {
  location: LocationData
  title?: string
}

export default function LocationViewer({ location, title = 'Location' }: LocationViewerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-64 bg-gray-200 rounded animate-pulse">Loading map...</div>

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">{title}</label>

      <div className="h-64 rounded-lg overflow-hidden border-2 border-gray-300">
        <MapContainer center={[location.latitude, location.longitude] as L.LatLngExpression} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[location.latitude, location.longitude] as L.LatLngExpression}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{location.name}</p>
                <p>Lat: {location.latitude.toFixed(6)}</p>
                <p>Lng: {location.longitude.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
        <p className="font-semibold text-green-900">{location.name}</p>
        <p className="text-green-700">Latitude: {location.latitude.toFixed(6)}</p>
        <p className="text-green-700">Longitude: {location.longitude.toFixed(6)}</p>
      </div>
    </div>
  )
}

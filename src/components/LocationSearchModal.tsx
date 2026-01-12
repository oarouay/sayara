'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

const mainStoreIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'main-store-marker',
})

// Main Store location: 85-87 Rue de La Palestine, Tunis 1002
const MAIN_STORE = {
  name: 'Main Store',
  address: '85-87 Rue de La Palestine, Tunis 1002',
  latitude: 36.817702,
  longitude: 10.179812,
}

const RADIUS_KM = 1

interface LocationSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (location: { name: string; latitude: number; longitude: number }) => void
  currentLocation?: { name: string; latitude: number; longitude: number } | null
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      const { lat, lng } = e.latlng
      onSelect(lat, lng)
    },
  })
  return null
}

export default function LocationSearchModal({
  isOpen,
  onClose,
  onSelect,
  currentLocation,
}: LocationSearchModalProps) {
  const [selectedLoc, setSelectedLoc] = useState<{ lat: number; lng: number } | null>(null)

  if (!isOpen) return null

  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : [MAIN_STORE.latitude, MAIN_STORE.longitude]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Pickup Location</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Store Option */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Option</h3>
            <button
              onClick={() => {
                onSelect({
                  name: MAIN_STORE.name,
                  latitude: MAIN_STORE.latitude,
                  longitude: MAIN_STORE.longitude,
                })
                onClose()
              }}
              className="w-full p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 transition text-left"
            >
              <p className="font-semibold text-green-700">{MAIN_STORE.name}</p>
              <p className="text-sm text-gray-600">{MAIN_STORE.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                📍 {MAIN_STORE.latitude.toFixed(4)}, {MAIN_STORE.longitude.toFixed(4)}
              </p>
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm font-semibold text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Custom Location Option */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Custom Location</h3>
            <p className="text-sm text-gray-600 mb-4">
              Click on the map to select a pickup location within 1km radius of Main Store
            </p>

            <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-300">
              <MapContainer
                center={mapCenter as L.LatLngExpression}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

                {/* Main Store Marker */}
                <Marker position={[MAIN_STORE.latitude, MAIN_STORE.longitude]} icon={mainStoreIcon}>
                </Marker>

                {/* 1km Radius Circle */}
                <Circle
                  center={[MAIN_STORE.latitude, MAIN_STORE.longitude]}
                  radius={RADIUS_KM * 1000}
                  pathOptions={{
                    color: 'rgba(34, 197, 94, 0.3)',
                    fill: true,
                    fillColor: 'rgba(34, 197, 94, 0.1)',
                    weight: 2,
                  }}
                />

                {/* Selected Location Marker */}
                {selectedLoc && (
                  <Marker position={[selectedLoc.lat, selectedLoc.lng]} icon={markerIcon} />
                )}

                {/* Click Handler */}
                <MapClickHandler
                  onSelect={(lat, lng) => setSelectedLoc({ lat, lng })}
                />
              </MapContainer>
            </div>

            {selectedLoc && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Selected:</strong> {selectedLoc.lat.toFixed(6)}, {selectedLoc.lng.toFixed(6)}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Distance from Main Store:{' '}
                  {(
                    L.latLng(selectedLoc.lat, selectedLoc.lng).distanceTo(
                      L.latLng(MAIN_STORE.latitude, MAIN_STORE.longitude)
                    ) / 1000
                  ).toFixed(2)}{' '}
                  km
                </p>
                <button
                  onClick={() => {
                    onSelect({
                      name: `Custom Location (${selectedLoc.lat.toFixed(4)}, ${selectedLoc.lng.toFixed(4)})`,
                      latitude: selectedLoc.lat,
                      longitude: selectedLoc.lng,
                    })
                    onClose()
                  }}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
                >
                  Confirm Location
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

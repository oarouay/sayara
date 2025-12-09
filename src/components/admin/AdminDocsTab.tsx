"use client"

import React, { useState } from 'react'

// --- Types ---
type Doc = {
  id: string
  userId: string
  userName: string
  type: 'license' | 'nationalId'
  url: string | null
  verified: boolean
}

// --- ImageModal Component ---
// This component displays the image in a modal with a blurry background.
interface ImageModalProps {
  doc: Doc
  onClose: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({ doc, onClose }) => {
  if (!doc.url) return null

  return (
    // Backdrop for the modal - fixed, full screen, centered, blurry, and dark.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm"
      onClick={onClose} // Close when clicking the backdrop
    >
      <div
        className="relative max-w-4xl w-full max-h-full bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full z-10 transition"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-4 sm:p-6">
          <h4 className="text-xl font-bold mb-4 text-gray-900">
            Viewing: {doc.type === 'license' ? 'Driving License' : 'National ID'} for {doc.userName}
          </h4>
          {/* Container for the image, max height/width for responsiveness */}
          <div className="max-h-[80vh] overflow-y-auto">
            <img
              src={doc.url}
              alt={`${doc.userName}'s ${doc.type}`}
              className="w-full h-auto object-contain rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- AdminDocsTab Component ---
export default function AdminDocsTab() {
  const [docs, setDocs] = useState<Doc[]>([
    { id: 'd1', userId: 'u1', userName: 'John Doe', type: 'license', url: '/data/sample-license.png', verified: false },
    { id: 'd2', userId: 'u1', userName: 'John Doe', type: 'nationalId', url: '/data/sample-id.png', verified: false },
    { id: 'd3', userId: 'u2', userName: 'Jane Smith', type: 'license', url: '/data/sample-license.png', verified: true },
    { id: 'd4', userId: 'u2', userName: 'Jane Smith', type: 'nationalId', url: '/data/sample-id.png', verified: false },
  ])

  // State to hold the document currently selected for viewing in the modal
  const [viewingDoc, setViewingDoc] = useState<Doc | null>(null)

  const toggleVerify = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, verified: !d.verified } : d))
  }

  const remove = (id: string) => {
    if (!confirm('Remove document?')) return
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  // New function to open the modal
  const openModal = (doc: Doc) => {
    if (doc.url) {
      setViewingDoc(doc)
    }
  }
  
  // New function to close the modal
  const closeModal = () => {
    setViewingDoc(null)
  }

  // Group documents by user
  const userDocs = docs.reduce((acc: Record<string, Doc[]>, doc) => {
    if (!acc[doc.userId]) acc[doc.userId] = []
    acc[doc.userId].push(doc)
    return acc
  }, {})

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Document Verification</h3>
        <div className="flex gap-2">
          <p className="text-sm text-gray-500">Verify driving license and national ID for each user</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-auto">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(userDocs).map(([userId, userDocList]) => (
              <div key={userId} className="p-6 bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{userDocList[0].userName}</h4>
                <div className="space-y-4">
                  {userDocList.map(d => (
                    <div key={d.id} className="flex gap-4 items-start border-t pt-4 first:border-t-0 first:pt-0">
                      <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-200 flex-shrink-0">
                        {d.url ? <img src={d.url} alt={d.type} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-500">No Image</span>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{d.type === 'license' ? 'Driving License' : 'National ID'}</p>
                            <p className={`text-sm font-semibold ${d.verified ? 'text-green-700' : 'text-yellow-700'}`}>{d.verified ? 'Verified' : 'Pending'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => toggleVerify(d.id)} className={`px-3 py-1 rounded text-xs font-medium ${d.verified ? 'bg-yellow-50 text-yellow-800 border' : 'bg-green-600 text-white'}`}>
                            {d.verified ? 'Unverify' : 'Verify'}
                          </button>
                          <button onClick={() => remove(d.id)} className="px-3 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">Remove</button>
                          
                          {/* UPDATED: Change onClick to open the modal */}
                          <button 
                            onClick={() => openModal(d)} 
                            disabled={!d.url} // Disable if no image URL exists
                            className="px-3 py-1 bg-white border text-green-700 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Conditionally render the Image Modal */}
      {viewingDoc && <ImageModal doc={viewingDoc} onClose={closeModal} />}
    </div>
  )
}
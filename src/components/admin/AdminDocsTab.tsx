"use client"

import React, { useState, useEffect } from 'react'

type Doc = {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: 'license' | 'nationalId'
  url: string | null
  verified: boolean
  licenseNumber?: string | null
  idNumber?: string | null
  submittedAt?: Date
}

type ImageModalProps = {
  doc: Doc
  onClose: () => void
  onVerify: (docId: string, verified: boolean) => void
}

const ImageModal: React.FC<ImageModalProps> = ({ doc, onClose, onVerify }) => {
  const [inputValue, setInputValue] = useState(doc.type === 'license' ? doc.licenseNumber || '' : doc.idNumber || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      alert(`Please enter a ${doc.type === 'license' ? 'license' : 'ID'} number`)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/admin/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: doc.userId,
          docType: doc.type === 'license' ? 'license' : 'id',
          licenseNumber: doc.type === 'license' ? inputValue : undefined,
          idNumber: doc.type === 'nationalId' ? inputValue : undefined,
          verified: !doc.verified
        })
      })

      if (response.ok) {
        onVerify(doc.id, !doc.verified)
        onClose()
      } else {
        alert('Failed to update document')
      }
    } catch (error) {
      console.error('Error updating document:', error)
      alert('Error updating document')
    } finally {
      setSubmitting(false)
    }
  }

  if (!doc.url) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-full bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full z-10 transition"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="p-4 sm:p-6 flex flex-col h-full">
          <h4 className="text-xl font-bold mb-4 text-gray-900">
            {doc.type === 'license' ? 'Driving License' : 'National ID'} for {doc.userName}
          </h4>
          <div className="flex-1 max-h-[60vh] overflow-y-auto mb-6">
            <img
              src={doc.url}
              alt={`${doc.userName}'s ${doc.type}`}
              className="w-full h-auto object-contain rounded-md"
            />
          </div>
          
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {doc.type === 'license' ? 'License Number' : 'ID Number'}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter ${doc.type === 'license' ? 'license' : 'ID'} number`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 text-gray-900"
            />
            
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex-1 px-4 py-2 rounded font-medium text-white transition ${
                  doc.verified
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {submitting ? 'Updating...' : doc.verified ? 'Unverify' : 'Verify & Save'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDocsTab() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingDoc, setViewingDoc] = useState<Doc | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/admin/documents', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setDocs(data.documents || [])
      } else {
        console.error('Failed to fetch documents')
        setDocs([])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocs([])
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyDocument = (docId: string, verified: boolean) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, verified } : d))
  }

  const openModal = (doc: Doc) => {
    if (doc.url) {
      setViewingDoc(doc)
    }
  }

  const closeModal = () => {
    setViewingDoc(null)
  }

  const userDocs = docs.reduce((acc: Record<string, Doc[]>, doc) => {
    if (!acc[doc.userId]) acc[doc.userId] = []
    acc[doc.userId].push(doc)
    return acc
  }, {})

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Document Verification</h3>
        <p className="text-sm text-gray-500">Verify driving license and national ID for each user</p>
      </div>

      {loading && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Loading documents...</p>
        </div>
      )}

      {!loading && docs.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No documents to verify</p>
        </div>
      )}

      {!loading && docs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(userDocs).map(([userId, userDocList]) => (
                <div key={userId} className="p-6 bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{userDocList[0].userName}</h4>
                  <p className="text-sm text-gray-600 mb-4">{userDocList[0].userEmail}</p>
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
                              {d.type === 'license' && d.licenseNumber && (
                                <p className="text-xs text-gray-600 mt-1">License: {d.licenseNumber}</p>
                              )}
                              {d.type === 'nationalId' && d.idNumber && (
                                <p className="text-xs text-gray-600 mt-1">ID: {d.idNumber}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button 
                              onClick={() => openModal(d)} 
                              disabled={!d.url}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              Verify & Enter #
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
      )}

      {viewingDoc && (
        <ImageModal 
          doc={viewingDoc} 
          onClose={closeModal}
          onVerify={handleVerifyDocument}
        />
      )}
    </div>
  )
}
'use client'

import React, { useState, useRef } from 'react'

/* -------------------------------------------------------
   ✅ Strongly typed document structure
------------------------------------------------------- */
export interface UserDocuments {
  driverLicense: string | null
  nationalIdCard: string | null
  driverLicenseVerified: boolean
  nationalIdVerified: boolean
}

/* -------------------------------------------------------
   ✅ Strongly typed props
------------------------------------------------------- */
interface DocumentValidationTabProps {
  documents: UserDocuments
  setDocuments?: React.Dispatch<React.SetStateAction<UserDocuments>>
}

export default function DocumentValidationTab({ documents, setDocuments }: DocumentValidationTabProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const licenseInputRef = useRef<HTMLInputElement>(null)
  const idInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File, docType: 'license' | 'id') => {
    if (!file) return

    setUploading(true)
    setUploadMessage('')

    try {
      const reader = new FileReader()
      
      // Use Promise to properly wait for FileReader
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          const result = e.target?.result as string
          resolve(result)
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...(docType === 'license' 
            ? { driverLicenseDocument: base64 }
            : { idDocumentContent: base64 }
          )
        })
      })

      if (res.ok) {
        const data = await res.json()
        
        // Update local state with new document data
        if (setDocuments && data.user) {
          setDocuments({
            driverLicense: data.user.driverLicenseDocument ?? null,
            nationalIdCard: data.user.idDocumentContent ?? null,
            driverLicenseVerified: data.user.driverLicenseVerified,
            nationalIdVerified: data.user.idDocumentVerified,
          })
        }
        
        setUploadMessage(`✓ ${docType === 'license' ? 'Driver License' : 'National ID'} uploaded successfully! Pending admin verification.`)
        setTimeout(() => setUploadMessage(''), 5000)
      } else {
        const error = await res.json()
        setUploadMessage(`❌ Failed to upload: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      setUploadMessage(`❌ Error uploading document: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    inputRef.current?.click()
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Verification</h2>
      <p className="text-gray-600 mb-8">
        Upload your documents for verification by our admin team
      </p>

      {/* Upload Message */}
      {uploadMessage && (
        <div className={`mb-6 p-4 rounded ${uploadMessage.includes('✓') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {uploadMessage}
        </div>
      )}

      {/* Status Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div
          className={`rounded-lg p-4 ${
            documents.driverLicenseVerified
              ? 'bg-green-50 border border-green-200'
              : documents.driverLicense
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <p className="font-semibold text-gray-900">Driver License</p>
          <p
            className={`text-sm mb-4 ${
              documents.driverLicenseVerified ? 'text-green-700' : documents.driverLicense ? 'text-yellow-700' : 'text-gray-700'
            }`}
          >
            {documents.driverLicenseVerified
              ? '✓ Verified'
              : documents.driverLicense
              ? '⏳ Pending Verification'
              : '○ Not Submitted'}
          </p>
          {!documents.driverLicenseVerified && (
            <button
              onClick={() => triggerFileInput(licenseInputRef)}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {uploading ? 'Uploading...' : 'Upload License'}
            </button>
          )}
          <input
            ref={licenseInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'license')}
          />
        </div>

        <div
          className={`rounded-lg p-4 ${
            documents.nationalIdVerified
              ? 'bg-green-50 border border-green-200'
              : documents.nationalIdCard
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <p className="font-semibold text-gray-900">National ID / Passport</p>
          <p
            className={`text-sm mb-4 ${
              documents.nationalIdVerified ? 'text-green-700' : documents.nationalIdCard ? 'text-yellow-700' : 'text-gray-700'
            }`}
          >
            {documents.nationalIdVerified
              ? '✓ Verified'
              : documents.nationalIdCard
              ? '⏳ Pending Verification'
              : '○ Not Submitted'}
          </p>
          {!documents.nationalIdVerified && (
            <button
              onClick={() => triggerFileInput(idInputRef)}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {uploading ? 'Uploading...' : 'Upload ID'}
            </button>
          )}
          <input
            ref={idInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'id')}
          />
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Document Submission Requirements</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Clear photo of your driver's license (front and back)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Clear photo of your national ID or passport</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Admin will verify and update your profile with identification numbers</span>
          </li>
        </ul>
      </div>

      {/* Status Summary */}
      {(documents.driverLicenseVerified && documents.nationalIdVerified) && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-800 font-semibold flex items-center gap-2">
            ✓ All documents verified! You're all set to book rentals.
          </p>
        </div>
      )}
    </div>
  )
}

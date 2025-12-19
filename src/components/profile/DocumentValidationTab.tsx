'use client'

import React, { useState } from 'react'

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

/* -------------------------------------------------------
   ✅ DocumentCard component - OUTSIDE main component
------------------------------------------------------- */
const DocumentCard = ({
  title,
  type,
  preview,
  verified,
  isUploading,
  onFileUpload
}: {
  title: string
  type: 'license' | 'id'
  preview: string | null
  verified: boolean
  isUploading: boolean
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'id') => void
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>

      {verified && (
        <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
          ✓ Verified
        </span>
      )}

      {!verified && preview && (
        <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
          ⏳ Pending Verification
        </span>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Upload {title}
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={e => onFileUpload(e, type)}
            className="hidden"
            id={`upload-${type}`}
            disabled={isUploading}
          />

          <label htmlFor={`upload-${type}`} className="cursor-pointer">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-12l-3.172-3.172a4 4 0 00-5.656 0L28 12m0 0L16.828 0.828a4 4 0 00-5.656 0L8 3.172"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <p className="mt-2 text-sm text-gray-600">
                {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>
          </label>
        </div>
      </div>

      {/* Preview Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preview
        </label>

        {preview ? (
          <div className="bg-gray-100 rounded-lg overflow-hidden h-48 flex items-center justify-center">
            <img src={preview} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            <p className="text-gray-500 text-center">No image uploaded yet</p>
          </div>
        )}
      </div>
    </div>

    {/* Actions */}
    <div className="mt-4 flex gap-3">
      <label htmlFor={`upload-${type}`} className="flex-1">
        <button
          onClick={e => e.preventDefault()}
          disabled={isUploading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isUploading ? 'Processing...' : 'Upload Image'}
        </button>
      </label>

      {preview && !verified && (
        <div className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded text-center font-semibold">
          Pending Review
        </div>
      )}

      {verified && (
        <div className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded text-center font-semibold">
          Verified ✓
        </div>
      )}
    </div>
  </div>
)

/* -------------------------------------------------------
   ✅ Main Component
------------------------------------------------------- */
const DocumentValidationTab: React.FC<DocumentValidationTabProps> = ({
  documents,
  setDocuments
}) => {
  const [uploadingLicense, setUploadingLicense] = useState(false)
  const [uploadingId, setUploadingId] = useState(false)
  const [licensePreview, setLicensePreview] = useState<string | null>(documents.driverLicense)
  const [idPreview, setIdPreview] = useState<string | null>(documents.nationalIdCard)
  const [message, setMessage] = useState('')

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'license' | 'id'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = event => {
      const base64 = event.target?.result as string

      if (type === 'license') {
        setLicensePreview(base64)
        setUploadingLicense(true)

        setTimeout(() => {
          setDocuments?.(prev => ({
            ...prev,
            driverLicense: base64,
            driverLicenseVerified: false
          }))
          setUploadingLicense(false)
          setMessage('Driver license uploaded successfully!')
          setTimeout(() => setMessage(''), 3000)
        }, 1500)
      } else {
        setIdPreview(base64)
        setUploadingId(true)

        setTimeout(() => {
          setDocuments?.(prev => ({
            ...prev,
            nationalIdCard: base64,
            nationalIdVerified: false
          }))
          setUploadingId(false)
          setMessage('National ID card uploaded successfully!')
          setTimeout(() => setMessage(''), 3000)
        }, 1500)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Validation</h2>
      <p className="text-gray-600 mb-8">
        Upload and verify your driver license and national ID card
      </p>

      {message && (
        <div
          className={`mb-6 p-4 rounded border ${
            message.includes('successfully')
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* Status Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div
          className={`rounded-lg p-4 ${
            documents.driverLicenseVerified
              ? 'bg-green-50 border border-green-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <p className="font-semibold text-gray-900">Driver License</p>
          <p
            className={`text-sm ${
              documents.driverLicenseVerified ? 'text-green-700' : 'text-yellow-700'
            }`}
          >
            {documents.driverLicenseVerified
              ? '✓ Verified'
              : documents.driverLicense
              ? '⏳ Pending'
              : '○ Not uploaded'}
          </p>
        </div>

        <div
          className={`rounded-lg p-4 ${
            documents.nationalIdVerified
              ? 'bg-green-50 border border-green-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <p className="font-semibold text-gray-900">
            Identification Document (CIN or Passport)
          </p>
          <p
            className={`text-sm ${
              documents.nationalIdVerified ? 'text-green-700' : 'text-yellow-700'
            }`}
          >
            {documents.nationalIdVerified
              ? '✓ Verified'
              : documents.nationalIdCard
              ? '⏳ Pending'
              : '○ Not uploaded'}
          </p>
        </div>
      </div>

      {/* Upload Cards */}
      <DocumentCard
        title="Driver License"
        type="license"
        preview={licensePreview}
        verified={documents.driverLicenseVerified}
        isUploading={uploadingLicense}
        onFileUpload={handleFileUpload}
      />

      <DocumentCard
        title="Identification Document"
        type="id"
        preview={idPreview}
        verified={documents.nationalIdVerified}
        isUploading={uploadingId}
        onFileUpload={handleFileUpload}
      />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-blue-900 mb-2">Important Information:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Clear, well-lit photos of both documents</li>
          <li>• All text must be readable</li>
          <li>• File size must be less than 5MB</li>
          <li>• Supported formats: PNG, JPG, GIF</li>
          <li>• Documents will be reviewed by our admin team</li>
          <li>• You will receive an email once verified</li>
          <li>• Verification typically takes 24–48 hours</li>
        </ul>
      </div>
    </div>
  )
}

export default DocumentValidationTab
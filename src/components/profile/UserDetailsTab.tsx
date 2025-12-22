'use client';

import React, { useState } from 'react';

/* -------------------------------------------------------
   ✅ Strong type for user profile
------------------------------------------------------- */
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  licenseNumber: string;
  nationalId: string;
}

/* -------------------------------------------------------
   ✅ Strong props type (no any)
------------------------------------------------------- */
interface UserDetailsTabProps {
  userProfile: UserProfile
  setUserProfile?: React.Dispatch<React.SetStateAction<UserProfile>>
}


/* -------------------------------------------------------
   ✅ Component
------------------------------------------------------- */
const UserDetailsTab: React.FC<UserDetailsTabProps> = ({
  userProfile,
  setUserProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          nationality: formData.country,
          dateOfBirth: formData.dateOfBirth,
          driverLicenseNumber: formData.licenseNumber,
          idDocumentNumber: formData.nationalId,
        })
      })

      if (res.ok) {
        const data = await res.json()
        setUserProfile?.(formData)
        setIsEditing(false)
        setSuccessMessage('Profile updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(`Failed to update: ${err.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile')
    }
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.phone}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.dateOfBirth}</p>
          )}
        </div>

        {/* License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
          {isEditing ? (
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.licenseNumber}</p>
          )}
        </div>

        {/* National ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
          {isEditing ? (
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.nationalId}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.address}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          {isEditing ? (
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.city}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          {isEditing ? (
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{userProfile.country}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetailsTab;
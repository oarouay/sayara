'use client';

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthWizard from './AuthWizard';
import UserDetailsTab from './profile/UserDetailsTab';
import RentalDashboardTab from './profile/RentalDashboardTab';
import PaymentDetailsTab from './profile/PaymentDetailsTab';
import DocumentValidationTab from './profile/DocumentValidationTab';

type Tab = 'details' | 'rental' | 'payment' | 'documents';

interface UserProfileState {
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

interface PaymentState {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
}

interface DocumentState {
  driverLicense: string | null;
  nationalIdCard: string | null;
  driverLicenseVerified: boolean;
  nationalIdVerified: boolean;
}

interface RentalState {
  activeRentals: Array<{
    id: string;
    carModel: string;
    rentalDate: string;
    returnDate: string;
    status: 'active' | 'completed' | 'pending';
    totalCost: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    driverName?: string;
    driverPhone?: string;
    licensePlate?: string;
    dailyRate?: number;
    rentalDays?: number;
    insurance?: boolean;
    additionalServices?: string[];
    notes?: string;
  }>;
}

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [showAuthWizard, setShowAuthWizard] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  
  const [userProfile, setUserProfile] = useState<UserProfileState>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    licenseNumber: 'DL123456',
    nationalId: 'NID123456789',
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentState>({
    cardHolder: 'JOHN DOE',
    cardNumber: '4532123456789012',
    expiryDate: '12/25',
    cvv: '123',
    billingAddress: '123 Main Street, New York, USA',
  });

  const [documents, setDocuments] = useState<DocumentState>({
    driverLicense: null,
    nationalIdCard: null,
    driverLicenseVerified: false,
    nationalIdVerified: false,
  });

  const [rentals, setRentals] = useState<RentalState>({
    activeRentals: [
      {
        id: '1',
        carModel: '2023 BMW X5',
        rentalDate: '2025-12-01',
        returnDate: '2025-12-10',
        status: 'active',
        totalCost: 1500,
        pickupLocation: 'Downtown Branch',
        dropoffLocation: 'Downtown Branch',
        driverName: 'John Doe',
        driverPhone: '+1 234 567 8900',
        licensePlate: 'BMW-X5-001',
        dailyRate: 150,
        rentalDays: 9,
        insurance: true,
        additionalServices: ['GPS Navigation', 'Roadside Assistance', 'Child Seat'],
        notes: 'Business trip. Please ensure car is clean and fueled.',
      },
      {
        id: '2',
        carModel: '2022 Audi A6',
        rentalDate: '2025-11-15',
        returnDate: '2025-11-20',
        status: 'completed',
        totalCost: 800,
        pickupLocation: 'Airport Branch',
        dropoffLocation: 'Downtown Branch',
        driverName: 'John Doe',
        driverPhone: '+1 234 567 8900',
        licensePlate: 'AUDI-A6-045',
        dailyRate: 140,
        rentalDays: 5,
        insurance: true,
        additionalServices: ['Airport Transfer'],
        notes: 'Flight arrived early. Car was returned in excellent condition.',
      },
    ],
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        onLogin={() => {
          setAuthType('login');
          setShowAuthWizard(true);
        }} 
        onRegister={() => {
          setAuthType('register');
          setShowAuthWizard(true);
        }} 
      />
      
      {showAuthWizard && (
        <AuthWizard 
          type={authType}
          onClose={() => setShowAuthWizard(false)}
        />
      )}
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account, payments, and documents</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto border-b border-gray-300">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === 'details'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              User Details
            </button>
            <button
              onClick={() => setActiveTab('rental')}
              className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === 'rental'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Rental Dashboard
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === 'payment'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Payment Details
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === 'documents'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Document Validation
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'details' && (
              <UserDetailsTab userProfile={userProfile} setUserProfile={setUserProfile} />
            )}
            {activeTab === 'rental' && (
              <RentalDashboardTab rentals={rentals} setRentals={setRentals} />
            )}
            {activeTab === 'payment' && (
              <PaymentDetailsTab paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails} />
            )}
            {activeTab === 'documents' && (
              <DocumentValidationTab documents={documents} setDocuments={setDocuments} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileDashboard;

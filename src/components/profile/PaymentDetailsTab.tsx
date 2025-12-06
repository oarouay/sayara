'use client';

import React, { useState } from 'react';

interface PaymentDetailsTabProps {
  paymentDetails: {
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
  };
  setPaymentDetails: (details: any) => void;
}

const PaymentDetailsTab: React.FC<PaymentDetailsTabProps> = ({ paymentDetails, setPaymentDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(paymentDetails);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSave = () => {
    setPaymentDetails(formData);
    setIsEditing(false);
    setSuccessMessage('Payment details updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData(paymentDetails);
    setIsEditing(false);
  };

  const maskCardNumber = (cardNumber: string) => {
    const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  const getCardBrand = (cardNumber: string): { brand: string; bgGradient: string } => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!cleaned) {
      return { brand: 'CARD', bgGradient: 'from-gray-600 to-gray-800' };
    }

    const firstDigit = cleaned[0];
    const firstTwoDigits = cleaned.slice(0, 2);
    const firstFourDigits = cleaned.slice(0, 4);
    const firstSixDigits = cleaned.slice(0, 6);

    // Visa: starts with 4
    if (firstDigit === '4') {
      return { brand: 'VISA', bgGradient: 'from-blue-600 to-blue-800' };
    }

    // Mastercard: 51-55 or 2221-2720 range
    if (
      (firstTwoDigits >= '51' && firstTwoDigits <= '55') ||
      (firstFourDigits >= '2221' && firstFourDigits <= '2720')
    ) {
      return { brand: 'MASTERCARD', bgGradient: 'from-red-600 to-red-800' };
    }

    // American Express: 34 or 37
    if (firstTwoDigits === '34' || firstTwoDigits === '37') {
      return { brand: 'AMEX', bgGradient: 'from-cyan-600 to-cyan-800' };
    }

    // Discover: 6011, 622126-622925, 644, 645, 646, 647, 648, 649, or 65
    if (
      firstFourDigits === '6011' ||
      (firstSixDigits >= '622126' && firstSixDigits <= '622925') ||
      (firstTwoDigits >= '64' && firstTwoDigits <= '65')
    ) {
      return { brand: 'DISCOVER', bgGradient: 'from-orange-600 to-orange-800' };
    }

    // China UnionPay: 62 (but exclude Discover ranges)
    if (firstTwoDigits === '62' && !(firstFourDigits === '6011' || (firstTwoDigits >= '64' && firstTwoDigits <= '65'))) {
      return { brand: 'UNIONPAY', bgGradient: 'from-red-500 to-red-700' };
    }

    // JCB: 3528-3589
    if (firstFourDigits >= '3528' && firstFourDigits <= '3589') {
      return { brand: 'JCB', bgGradient: 'from-sky-600 to-sky-800' };
    }

    // Diners Club: 36, 38, or 300-305
    if (
      firstTwoDigits === '36' ||
      firstTwoDigits === '38' ||
      (firstFourDigits >= '3000' && firstFourDigits <= '3005')
    ) {
      return { brand: 'DINERS', bgGradient: 'from-amber-600 to-amber-800' };
    }

    // Default fallback
    return { brand: 'CARD', bgGradient: 'from-gray-600 to-gray-800' };
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Edit Payment
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Holder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
          {isEditing ? (
            <input
              type="text"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{paymentDetails.cardHolder}</p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
          {isEditing ? (
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-black"
            />
          ) : (
            <p className="text-gray-900 font-mono font-medium">{maskCardNumber(paymentDetails.cardNumber)}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
          {isEditing ? (
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{paymentDetails.expiryDate}</p>
          )}
        </div>

        {/* CVV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
          {isEditing ? (
            <input
              type="password"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="***"
              maxLength={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">***</p>
          )}
        </div>

        {/* Billing Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
          {isEditing ? (
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
          ) : (
            <p className="text-gray-900 font-medium">{paymentDetails.billingAddress}</p>
          )}
        </div>
      </div>

      {/* Credit Card Preview */}
      {!isEditing && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Preview</h3>
          <div className={`bg-gradient-to-br ${getCardBrand(paymentDetails.cardNumber).bgGradient} rounded-lg p-6 text-white max-w-sm shadow-lg`}>
            <div className="flex justify-between items-start mb-12">
              <div className="text-sm font-semibold">CREDIT CARD</div>
              <div className="text-lg font-bold">{getCardBrand(paymentDetails.cardNumber).brand}</div>
            </div>
            <div className="mb-6">
              <p className="text-xs opacity-70 mb-2">CARD NUMBER</p>
              <p className="text-lg font-mono tracking-widest">{maskCardNumber(paymentDetails.cardNumber)}</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-70 mb-1">CARD HOLDER</p>
                <p className="text-sm font-semibold">{paymentDetails.cardHolder}</p>
              </div>
              <div>
                <p className="text-xs opacity-70 mb-1">EXPIRES</p>
                <p className="text-sm font-semibold">{paymentDetails.expiryDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default PaymentDetailsTab;

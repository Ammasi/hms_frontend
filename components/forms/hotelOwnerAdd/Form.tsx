'use client';

import { useState } from 'react';
import axios from 'axios';

type HotelOwnerAddProps = {
  setShowModal: (value: boolean) => void;
};

const HotelOwnerAdd = ({ setShowModal }: HotelOwnerAddProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    clientName: '',
    clientEmail: '',
    clientMobileNo: '',
    gst: '',
    currency: 'INR',
    subscription: 'Premium',
    subscriptionStatus: 'Active',
    subscriptionStartDate: '',
    subscriptionEndDate: '',
    clientAddress: '',
    clientDocuments: '',
    status: 'active',
    noOfHotels: 0,
    subscriptionDuration: 'yearly',
    propertyCount: 0,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'noOfHotels' || name === 'propertyCount' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.1.14:8000/api/v1/product-subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          // Ensure correct field names match API expectations
          subscripton: formData.subscription, // Note the typo to match API
          subscriptonStatus: formData.subscriptionStatus,
          subscriptonEndDate: formData.subscriptionEndDate,
          subscriptonDuration: formData.subscriptionDuration
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Hotel owner added successfully!');
      console.log('Success:', result);
      setShowModal(false);
      // Reset form
      setFormData({
        companyName: '',
        clientName: '',
        clientEmail: '',
        clientMobileNo: '',
        gst: '',
        currency: 'INR',
        subscription: 'Premium',
        subscriptionStatus: 'Active',
        subscriptionStartDate: '',
        subscriptionEndDate: '',
        clientAddress: '',
        clientDocuments: '',
        status: 'active',
        noOfHotels: 0,
        subscriptionDuration: 'yearly',
        propertyCount: 0,
        isActive: true,
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to save data. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
  <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Hotel Owner</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client Email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mobile No</label>
            <input
              type="text"
              name="clientMobileNo"
              value={formData.clientMobileNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">GST</label>
            <input
              type="text"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Currency</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Subscription</label>
            <select
              name="subscription"
              value={formData.subscription}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Plan</option>
              <option value="Basic Plan">Basic Plan</option>
              <option value="Standard Plan">Standard Plan</option>
              <option value="Premium Plan">Premium Plan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">subscriptionStatus</label>
            <input
              type="text"
              name="subscriptionStatus"
              value={formData.subscriptionStatus}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">subscriptionStartDate</label>
            <input
              type="date"
              name="subscriptionStartDate"
              value={formData.subscriptionStartDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">subscriptionEndDate</label>
            <input
              type="date"
              name="subscriptionEndDate"
              value={formData.subscriptionEndDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">clientAddress</label>
            <input
              type="text"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">clientDocuments</label>
            <input
              type="text"
              name="clientDocuments"
              value={formData.clientDocuments}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
            <div>
            <label className="block text-sm font-medium">noOfHotels</label>
            <input
              type="number"
              name="noOfHotels"
              value={formData.noOfHotels}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
            <div>
            <label className="block text-sm font-medium">subscriptionDuration</label>
            <input
              type="text"
              name="subscriptionDuration"
              value={formData.subscriptionDuration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
            <div>
            <label className="block text-sm font-medium">propertyCount</label>
            <input
              type="number"
              name="propertyCount"
              value={formData.propertyCount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
           {/* <label className="block text-sm font-medium">isActive</label>
            <input
              type=""
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div> */}

          <div className="md:col-span-2 flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default HotelOwnerAdd;




 
'use client';

import { useEffect, useState } from 'react';

type SubscriptionData = {
  id?: string | number;
  companyName: string;
  clientName: string;
  clientEmail: string;
  clientMobileNo: string;
  gst: string;
  currency: string;
  subscription: string;
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  clientAddress: string;
  clientDocuments: string;
  status: string;
  noOfHotels: number;
  subscriptionDuration: string;
  propertyCount: number;
  isActive: boolean;
  subscripton?: string; // API field name
  subscriptonStatus?: string; // API field name
  subscriptonEndDate?: string; // API field name
  subscriptonDuration?: string; // API field name
};

type HotelOwnerAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: SubscriptionData | null;
  onSaved?: () => void;
};

const HotelOwnerAdd = ({ setShowModal, editingData, onSaved }: HotelOwnerAddProps) => {
  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  // Format date for input fields
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (editingData) {
      // Transform API data to match form fields
      const transformedData = {
        companyName: editingData.companyName || '',
        clientName: editingData.clientName || '',
        clientEmail: editingData.clientEmail || '',
        clientMobileNo: editingData.clientMobileNo || '',
        gst: editingData.gst || '',
        currency: editingData.currency || 'INR',
        subscription: editingData.subscripton || editingData.subscription || 'Premium',
        subscriptionStatus: editingData.subscriptonStatus || editingData.subscriptionStatus || 'Active',
        subscriptionStartDate: formatDateForInput(editingData.subscriptionStartDate),
        subscriptionEndDate: formatDateForInput(editingData.subscriptonEndDate || editingData.subscriptionEndDate),
        clientAddress: editingData.clientAddress || '',
        clientDocuments: editingData.clientDocuments || '',
        status: editingData.status || 'active',
        noOfHotels: editingData.noOfHotels || 0,
        subscriptionDuration: editingData.subscriptonDuration || editingData.subscriptionDuration || 'yearly',
        propertyCount: editingData.propertyCount || 0,
        isActive: editingData.isActive !== undefined ? editingData.isActive : true,
      };
      setFormData(transformedData);
    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'noOfHotels' || name === 'propertyCount' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = editingData
      ? `http://192.168.1.8:8000/api/v1/product-subscription/update/${editingData.id}`
      : `http://192.168.1.8:8000/api/v1/product-subscription/create`;

    const method = editingData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          companyName: formData.companyName,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientMobileNo: formData.clientMobileNo,
          gst: formData.gst,
          currency: formData.currency,
          subscription: formData.subscription,
          subscriptionStatus: formData.subscriptionStatus,
          subscriptionStartDate: formData.subscriptionStartDate,
          subscriptionEndDate: formData.subscriptionEndDate,
          clientAddress: formData.clientAddress,
          clientDocuments: formData.clientDocuments,
          status: formData.status,
          noOfHotels: formData.noOfHotels,
          subscriptionDuration: formData.subscriptionDuration,
          propertyCount: formData.propertyCount,
          isActive: formData.isActive,
        }),

      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(editingData ? 'Hotel owner updated successfully!' : 'Hotel owner added successfully!');
      onSaved?.();
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to save data. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">

        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Hotel Owner' : 'Add Hotel Owner'}
          </h2>
          <div className="absolute top-0 right-0">
            <button
              onClick={() => {
                setShowModal(false);
                onSaved?.();
              }}
              className="text-gray-900 hover:text-red-500 text-2xl font-bold"
              disabled={isLoading}
            >
              &times;
            </button>
          </div>
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
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div >
            <label className="block text-sm font-medium">Subscription</label>
            <select
              name="subscription"
              value={formData.subscription}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Subscription Status</label>
            <select
              name="subscriptionStatus"
              value={formData.subscriptionStatus}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Start Date</label>
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
            <label className="block text-sm font-medium">End Date</label>
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
            <label className="block text-sm font-medium">Client Address</label>
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
            <label className="block text-sm font-medium">Client Documents</label>
            <input
              type="text"
              name="clientDocuments"
              value={formData.clientDocuments}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Number of Hotels</label>
            <input
              type="number"
              name="noOfHotels"
              value={formData.noOfHotels}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Subscription Duration</label>
            <select
              name="subscriptionDuration"
              value={formData.subscriptionDuration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>

            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Property Count</label>
            <input
              type="number"
              name="propertyCount"
              value={formData.propertyCount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">  Active</label>
            <select
              name="isActive"
              value={formData.isActive ? 'true' : 'false'}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                onSaved?.();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : editingData ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelOwnerAdd;
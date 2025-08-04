'use client';

import { useEffect, useState } from 'react';

type SubscriptionData = {
  id: string;
  clientId: string;
  propertyId: string;
  softwareLimit: number;
  ownerLimit: number;
  managerLimit: number;
  employeeLimit: number;
  isActive: boolean
};

type SubscriptionLimitAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: SubscriptionData | null;
  onSaved?: () => void;
};

const SubscriptionLimitAdd = ({ setShowModal, editingData, onSaved }: SubscriptionLimitAddProps) => {
  const initialFormData = {
    clientId: '',
    propertyId: '',
    softwareLimit: '',
    ownerLimit: '',
    managerLimit: '',
    employeeLimit: '',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (editingData) {
      // Transform API data to match form fields
      const subscriptionLimitData = {
        clientId: editingData.clientId || '',
        propertyId: editingData.propertyId || '',
        softwareLimit: editingData.softwareLimit !== undefined ? String(editingData.softwareLimit) : '',
        ownerLimit: editingData.ownerLimit !== undefined ? String(editingData.ownerLimit) : '',
        managerLimit: editingData.managerLimit !== undefined ? String(editingData.managerLimit) : '',
        employeeLimit: editingData.employeeLimit !== undefined ? String(editingData.employeeLimit) : '',
        isActive: editingData.isActive !== undefined ? editingData.isActive : true,
      };
      setFormData(subscriptionLimitData);
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
  ? `http://192.168.1.14:8000/api/v1/subscription-limits/update/${editingData.id}`
  : `http://192.168.1.14:8000/api/v1/subscription-limits/create`;



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
          clientId: formData.clientId,
          propertyId: formData.propertyId,
          softwareLimit: Number(formData.softwareLimit),
          ownerLimit: Number(formData.ownerLimit),
          managerLimit: Number(formData.managerLimit),
          employeeLimit: Number(formData.employeeLimit),
          isActive: formData.isActive,
        }),


      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(editingData ? 'Subscription limit updated successfully!' : 'Subscription limit added successfully!');
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
            {editingData ? 'Edit Subscription Limit' : 'Add Subscription Limit'}
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
            <label className="block text-sm font-medium">clientId</label>
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">propertyId</label>
            <input
              type="text"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">softwareLimit</label>
            <input
              type="number"
              name="softwareLimit"
              value={formData.softwareLimit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">ownerLimit</label>
            <input
              type="number"
              name="ownerLimit"
              value={formData.ownerLimit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">managerLimit</label>
            <input
              type="number"
              name="managerLimit"
              value={formData.managerLimit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">employeeLimit</label>
            <input
              type="number"
              name="employeeLimit"
              value={formData.employeeLimit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
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

export default SubscriptionLimitAdd;
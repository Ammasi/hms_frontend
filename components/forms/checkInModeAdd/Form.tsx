'use client';

import { get } from 'lodash';
import { useEffect, useState } from 'react';

// Types
type checkInModeData = {
  id: string;
  clientId: string;
  propertyId: string;
  checkInMode: string;
  description: string;
};

interface CheckInModeFormProps {
  setShowModal: (value: boolean) => void;
  editingData?: checkInModeData | null;
  onSaved?: () => void;
}

const CheckInModeForm = ({ setShowModal, editingData, onSaved }: CheckInModeFormProps) => {
  const initialFormData: checkInModeData = {
    id: '',
    clientId: '',
    propertyId: '',
    checkInMode: '',
    description: '',
  };


  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setFormData({
        id: get(editingData, 'id', ''),
        clientId: get(editingData, 'clientId', ''),
        propertyId: get(editingData, 'propertyId', ''),
        checkInMode: get(editingData, 'checkInMode', ''),
        description: get(editingData, 'description', ''),
      });

    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const id = get(editingData, 'id', '');
      const url = id
        ? `http://192.168.1.14:8000/api/v1/checkin-mode/update/${id}`
        : `http://192.168.1.14:8000/api/v1/checkin-mode/create`;

      const response = await fetch(url, {
        method: editingData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: formData.clientId,
          propertyId: formData.propertyId,
          checkInMode: formData.checkInMode,
          description: formData.description,
        }),
        credentials: 'include',
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save check-in mode');
      }

      alert(editingData ? 'Facility updated!' : 'Facility added!');
      onSaved?.();
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">
        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Check-in Mode' : 'Add Check-in Mode'}
          </h2>
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setShowModal(false)}
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
            <label className="block text-sm font-medium">checkInMode</label>
            <input
              type="text"
              name="checkInMode"
              value={formData.checkInMode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
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

export default CheckInModeForm;

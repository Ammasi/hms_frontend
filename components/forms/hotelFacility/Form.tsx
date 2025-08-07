'use client';

import { useEffect, useRef, useState } from 'react';

// Types
interface HotelFacilityData {
  id: string;
  clientId: string;
  propertyId: string;
  propertyName: string;
  facilityType: string;
  facilityDescription: string;
  status: string;
  facilityImages: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface HotelFacilityFormProps {
  setShowModal: (value: boolean) => void;
  editingData?: HotelFacilityData | null;
  onSaved?: () => void;
}

const HotelFacilityForm = ({ setShowModal, editingData, onSaved }: HotelFacilityFormProps) => {
  const initialFormData: HotelFacilityData = {
    id: '',
    clientId: '',
    propertyId: '',
    propertyName: '',
    facilityType: '',
    facilityDescription: '',
    status: '',
    facilityImages: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [facilityFiles, setFacilityFiles] = useState<File[]>([]);
  const facilityImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingData) {
      setFormData({
        ...initialFormData,
        ...editingData,
        facilityImages: editingData.facilityImages || [],
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFile = files[0]; // Uploading one-by-one
    setFacilityFiles(prev => {
      const updated = [...prev, newFile];
      if (updated.length > 5) {
        updated.shift(); // Remove the first one if > 5
      }
      return updated;
    });

    // Reset input value to allow re-selecting the same file again
    if (facilityImageRef.current) facilityImageRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingData
        ? `http://192.168.1.14:8000/api/v1/hotel-facility/update/${editingData.id}`
        : `http://192.168.1.14:8000/api/v1/hotel-facility/create`;

      const formDataToSend = new FormData();
      formDataToSend.append('clientId', formData.clientId);
      formDataToSend.append('propertyId', formData.propertyId);
      formDataToSend.append('propertyName', formData.propertyName);
      formDataToSend.append('facilityType', formData.facilityType);
      formDataToSend.append('facilityDescription', formData.facilityDescription);
      formDataToSend.append('status', formData.status);

      facilityFiles.forEach((file: File) => {
        formDataToSend.append('file', file);
      });

      const response = await fetch(url, {
        method: editingData ? 'PUT' : 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save hotel facility');
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
    <div className="fixed inset-0    flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">
        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Facility' : 'Add Facility'}
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
          {['clientId', 'propertyId', 'propertyName', 'facilityType', 'facilityDescription', 'status'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium">{field}</label>
              <input
                type="text"
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium">Facility Images (Max 5)</label>
            <input
              type="file"
              ref={facilityImageRef}
              name="facilityImages"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="mt-2 flex gap-2 flex-wrap">
              {facilityFiles.map((file, index) => (
                <div key={index} className="relative">
                  <span className="absolute top-0 left-0 bg-black text-white text-xs px-1 rounded">
                    {index + 1}
                  </span>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
              ))}
            </div>
            {facilityFiles.length >= 5 && (
              <p className="text-xs text-gray-500 mt-1">Maximum 5 images reached (oldest will be removed)</p>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
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

export default HotelFacilityForm;

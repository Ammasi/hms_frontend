'use client';

import { useEffect, useState } from 'react';

type CustomerData = {
  id: string;
  clientId: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  mrOrMrs: string;
  email: string;
  gender: string;
  mobileNo: string;
  nationality: string;
  idType: string;
  idNumber: string;
  image: string;
  idProof: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type CustomerAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: CustomerData | null;
  onSaved?: () => void;
};

const CustomerAdd = ({ setShowModal, editingData, onSaved }: CustomerAddProps) => {
  const initialFormData = {
    // Old fields (if needed elsewhere)
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
    // Add required customer fields
    id: '',
    clientId: '',
    propertyId: '',
    firstName: '',
    lastName: '',
    mrOrMrs: '',
    email: '',
    gender: '',
    mobileNo: '',
    nationality: '',
    idType: '',
    idNumber: '',
    image: '',
    idProof: '',
    address: '',
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
        ...initialFormData,
        id: editingData.id || '',
        clientId: editingData.clientId || '',
        propertyId: editingData.propertyId || '',
        firstName: editingData.firstName || '',
        lastName: editingData.lastName || '',
        mrOrMrs: editingData.mrOrMrs || '',
        email: editingData.email || '',
        gender: editingData.gender || '',
        mobileNo: editingData.mobileNo || '',
        nationality: editingData.nationality || '',
        idType: editingData.idType || '',
        idNumber: editingData.idNumber || '',
        image: editingData.image || '',
        idProof: editingData.idProof || '',
        address: editingData.address || '',
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
      [name]: name === 'noOfCustomers' || name === 'propertyCount' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = editingData
      ? `http://192.168.1.14:8000/api/v1/customer/update/${editingData.id}`
      : `http://192.168.1.14:8000/api/v1/customer/create`;

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
          firstName: formData.firstName,
          lastName: formData.lastName,
          mrOrMrs: formData.mrOrMrs,
          email: formData.email,
          gender: formData.gender,
          mobileNo: formData.mobileNo,
          nationality: formData.nationality,
          idType: formData.idType,
          idNumber: formData.idNumber,
          image: formData.image,
          idProof: formData.idProof,
          address: formData.address,
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
            {editingData ? 'Edit Customer' : 'Add Customer'}
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
            <label className="block text-sm font-medium">firstName</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">lastName</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">mrOrMrs</label>
            <input
              type="text"
              name="mrOrMrs"
              value={formData.mrOrMrs}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div >
            <label className="block text-sm font-medium">gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium">mobileNo</label>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">nationality</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="hindu">Hindu</option>
              <option value="muslim">Muslim</option>
              <option value="christian">Christian</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">idType</label>
            <input
              type="text"
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">idNumber</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Customer"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>

          {/* ID Proof URL */}
          <div>
            <label className="block text-sm font-medium">ID Proof URL</label>
            <input
              type="text"
              name="idProof"
              value={formData.idProof}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {formData.idProof && (
              <img
                src={formData.idProof}
                alt="ID Proof"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>


          <div>
            <label className="block text-sm font-medium">address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
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

export default CustomerAdd;
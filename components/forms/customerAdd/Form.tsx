'use client';

import {    useEffect, useRef, useState } from 'react';

type CustomerData = {
  id: string;
  clientId: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  title: string;
  isVIP: boolean;
  isForeignCustomer: boolean;
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
};

type CustomerAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: CustomerData | null;
  onSaved?: () => void;
};

const CustomerAdd = ({ setShowModal, editingData, onSaved }: CustomerAddProps) => {
  const initialFormData = {

    // Add required customer fields
    id: '',
    clientId: '',
    propertyId: '',
    firstName: '',
    lastName: '',
    title: '',
    isVIP: true,
    isForeignCustomer: true,
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);
const [newCustomerId, setNewCustomerId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'idProof') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        // only preview locally — do not update formData
        if (type === 'image') {
          setImageFile(file);
        } else {
          setIdProofFile(file);
        }
      };

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.readAsDataURL(file);
        if (type === 'image') setImageFile(file);
        else setIdProofFile(file);
      }
    }
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
        title: editingData.title || '',
        isVIP: editingData.isVIP !== undefined ? editingData.isVIP : true,
        isForeignCustomer: editingData.isForeignCustomer !== undefined ? editingData.isForeignCustomer : true,
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

    try {
      const baseUrl = 'http://192.168.1.8:8000/api/v1/customers';
      const url = editingData
        ? `${baseUrl}/update/${editingData.id}`
        : `${baseUrl}/create`;

      const formDataToSend = new FormData();


      formDataToSend.append('clientId', formData.clientId);
      formDataToSend.append('propertyId', formData.propertyId);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('isVIP', String(formData.isVIP));
      formDataToSend.append('isForeignCustomer', String(formData.isForeignCustomer));
      formDataToSend.append('email', formData.email);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('mobileNo', formData.mobileNo);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('idType', formData.idType);
      formDataToSend.append('idNumber', formData.idNumber);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('isActive', String(formData.isActive));


      if (imageFile) formDataToSend.append('image', imageFile); // Must be 'image'
      if (idProofFile) formDataToSend.append('idproof', idProofFile); // Must be 'idproof' (lowercase

      const response = await fetch(url, {
        method: editingData ? 'PUT' : 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server validation errors:', errorData.errors);
        throw new Error(errorData.message || 'Failed to save customer');
      }


      const result = await response.json();
       setNewCustomerId(result.id); 
      alert(editingData ? 'Customer updated successfully!' : 'Customer added successfully!');
      onSaved?.();
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };
// customerId={newCustomerId}
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
          <div >
            <label className="block text-sm font-medium">Title</label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="choose">choose</option>
              <option value="Mr">Mr</option>
              <option value="Dr">Dr</option>
              <option value="Ms">Ms</option>
              <option value="Captain">Captain</option>
              <option value="Miss">Miss</option>
              <option value="Master">Master</option>
              <option value="Others">Others</option>
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium">VIP</label>
            <select
              name="isVIP"
              value={formData.isVIP ? 'true' : 'false'}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  isVIP: e.target.value === 'true',
                }))
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Foreign Customer</label>
            <select
              name="isForeignCustomer"
              value={formData.isForeignCustomer ? 'true' : 'false'}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  isForeignCustomer: e.target.value === 'true',
                }))
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
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
          <div>
            <label className="block text-sm font-medium">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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
            <label className="block text-sm font-medium">Nationality *</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Other">Other</option>
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

          <div>
            <label className="block text-sm font-medium">Profile Image</label>
            <input
              type="file"
              name="image"
              ref={imageInputRef}
              onChange={(e) => handleFileChange(e, 'image')}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Customer Preview"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}

            {formData.image && formData.image.startsWith('data:application/pdf') && (
              <div className="mt-2 text-sm text-gray-700">
                image uploaded
              </div>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium">ID Proof</label>
            <input
              type="file"
              name="idproof"
              ref={idProofInputRef}
              onChange={(e) => handleFileChange(e, 'idProof')}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded"
            />


            {formData.idProof && (
              <img
                src={formData.idProof}
                alt="ID Proof Preview"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}


            {formData.idProof && formData.idProof.startsWith('data:application/pdf') && (
              <div className="mt-2 text-sm text-gray-700">
                ID Proof uploaded
              </div>
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
            <label className="block text-sm font-medium">Active</label>
            <select
              name="isActive"
              value={formData.isActive ? 'true' : 'false'}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  isActive: e.target.value === 'true',
                }))
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
'use client';

import { get } from 'lodash';
import { useEffect, useState } from 'react';

type EmployeeData = {
  id: string;
  clientId: string;
  propertyId: string;
  name: string;
  email: string;
  mobileNo: string;
  gender: string;
  department: string;
  maritalstatus: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};


type EmployeeAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: EmployeeData | null;
  onSaved?: () => void;
  load?: () => void;
};

const EmployeeAdd = ({ setShowModal, editingData, onSaved, load }: EmployeeAddProps) => {

  const initialFormData = {
    clientId: '',
    propertyId: '',
    name: '',
    email: '',
    mobileNo: '',
    gender: '',
    department: '',
    maritalstatus: '',
    address: '',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

   

  useEffect(() => {
    if (editingData) {
      // Transform API data to match form fields
      const transformedData = {
        clientId: get(editingData, 'clientId', ''),
        propertyId: get(editingData, 'propertyId', ''),
        name: get(editingData, 'name', ''),
        email: get(editingData, 'email', ''),
        mobileNo: get(editingData, 'mobileNo', ''),
        gender: get(editingData, 'gender', ''),
        department: get(editingData, 'department', ''),
        maritalstatus: get(editingData, 'maritalstatus', ''),
        address: get(editingData, 'address', ''),
        isActive: get(editingData, 'isActive', true),
        createdAt: get(editingData, 'createdAt', ''),
        updatedAt: get(editingData, 'updatedAt', ''),
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

    if (
      !formData.clientId ||
      !formData.propertyId ||
      !formData.name ||
      !formData.email ||
      !formData.mobileNo ||
      !formData.gender ||
      !formData.department ||
      !formData.maritalstatus ||
      !formData.address
    ) {
      alert("Please fill all required fields.");
      setIsLoading(false);
      return;
    }

    const url = editingData
      ? `http://192.168.1.8:8000/api/v1/employee/update/${editingData.id}`
      : `http://192.168.1.8:8000/api/v1/employee/create`;

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
          ...(editingData && { id: editingData.id }),
          clientId: formData.clientId,
          propertyId: formData.propertyId,
          name: formData.name,
          email: formData.email,
          mobileNo: String(formData.mobileNo),
          gender: formData.gender,
          department: formData.department,
          maritalstatus: formData.maritalstatus,
          address: formData.address,
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(editingData ? 'Employee updated successfully!' : 'Employee added successfully!');
      onSaved?.();
      load?.(); // reload employee data
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
            {editingData ? 'Edit Employee' : 'Add Employee'}
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
            <label className="block text-sm font-medium">name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
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


          <div >
            <label className="block text-sm font-medium">gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Gender</option> 
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

          </div>


          <div>
            <label className="block text-sm font-medium">department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">maritalstatus</label>
            <select
              name="maritalstatus"
              value={formData.maritalstatus}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value=""> </option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
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

export default EmployeeAdd;

 

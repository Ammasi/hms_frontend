'use client';

import { useEffect, useState } from 'react';

type GSTRegisterData = {
  id?: string;
  clientId: string;
  propertyId: string;
  legalName: string;
  tradeName: string;
  gstNumber: string;
  panNumber: string;
  gstType: string;
  businessType: string;
  email: string;
  phoneNo: string;
  gstStateCode: string;
  cgst: string;
  sgst: string;
  igst: string;                  
  registrationDate: string;
  taxJurisdiction: string;      
  propertyAddress: string;   
  gstCertificateUrl?: string;
  isActive: boolean;
};


type GSTRegisterDataProps = {
  setShowModal: (value: boolean) => void;
  editingData?: GSTRegisterData | null;
  onSaved?: () => void;
};

const GSTRegisterAdd = ({ setShowModal, editingData, onSaved }: GSTRegisterDataProps) => {
  const initialFormData: GSTRegisterData = {
    clientId: '',
    propertyId: '',
    legalName: '',
    tradeName: '',
    gstNumber: '',
    panNumber: '',
    gstType: '',
    businessType: '',
    email: '',
    phoneNo: '',
    gstStateCode: '',
    cgst: '',
    sgst: '',
    igst: '0',
    registrationDate: '',
    taxJurisdiction: '',
    propertyAddress: '',
    gstCertificateUrl: '',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  useEffect(() => {
    if (editingData) {
      const initialFormData = {
        clientId: editingData.clientId || '',
        propertyId: editingData.propertyId || '',
        legalName: editingData.legalName || '',
        tradeName: editingData.tradeName || '',
        gstNumber: editingData.gstNumber || '',
        panNumber: editingData.panNumber || '',
        gstType: editingData.gstType || '',
        businessType: editingData.businessType || '',
        email: editingData.email || '',
        phoneNo: editingData.phoneNo || '',
        gstStateCode: editingData.gstStateCode || '',
        cgst: editingData.cgst || '',
        sgst: editingData.sgst || '',
        igst: editingData.igst?.toString() || '0',
        registrationDate: formatDateForInput(editingData.registrationDate) || '',
        taxJurisdiction: editingData.taxJurisdiction?.toString() || '',
        propertyAddress: editingData.propertyAddress?.toString() || '',
        gstCertificateUrl: editingData.gstCertificateUrl || '',
        isActive: editingData.isActive !== undefined ? editingData.isActive : true,
      };

      setFormData(initialFormData);
    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, type, checked } = e.target as HTMLInputElement;

  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const url = editingData
      ? `http://192.168.1.4:8000/api/v1/gst/update/${editingData.id}`
      : `http://192.168.1.4:8000/api/v1/gst/create`;


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
          legalName: formData.legalName,
          tradeName: formData.tradeName,
          gstNumber: formData.gstNumber,
          panNumber: formData.panNumber,
          gstType: formData.gstType,
          businessType: formData.businessType,
          email: formData.email,
          phoneNo: formData.phoneNo,
          gstStateCode: formData.gstStateCode,
          cgst: formData.cgst,
          sgst: formData.sgst,
          igst: formData.igst,
          registrationDate: formData.registrationDate,
          taxJurisdiction: formData.taxJurisdiction,
          propertyAddress: formData.propertyAddress,
          gstCertificateUrl: formData.gstCertificateUrl,
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
            {editingData ? 'Edit GST Registration' : 'Add GST Registration'}
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
            <label className="block text-sm font-medium">Client ID</label>
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
            <label className="block text-sm font-medium">legalName</label>
            <input
              type="text"
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">tradeName</label>
            <input
              type="text"
              name="tradeName"
              value={formData.tradeName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">gstNumber</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>





          <div>
            <label className="block text-sm font-medium">pan Number</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">gstType</label>
            <input
              type="text"
              name="gstType"
              value={formData.gstType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">Business Type</label>
            <input
              type="text"
              name="businessType"
              value={formData.businessType}
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
            />
          </div>




          <div>
            <label className="block text-sm font-medium">phone No</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">gstStateCode</label>
            <input
              type="text"
              name="gstStateCode"
              value={formData.gstStateCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium"> cgst</label>
            <input
              type="text"
              name="cgst"
              value={formData.cgst}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">sgst</label>
            <input
              type="text"
              name="sgst"
              value={formData.sgst}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>


          <div>
            <label className="block text-sm font-medium"> igst</label>
            <input
              type="text"
              name="igst"
              value={formData.igst}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">Registration Date</label>
            <input
              type="date"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tax Jurisdiction</label>
            <input
              type="text"
              name="taxJurisdiction"
              value={formData.taxJurisdiction}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Property Address</label>
            <input
              type="text"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">GST Certificate URL</label>
            <input
              type="text"
              name="gstCertificateUrl"
              value={formData.gstCertificateUrl}
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

export default GSTRegisterAdd;
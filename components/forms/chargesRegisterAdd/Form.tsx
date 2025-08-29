'use client';

import { get } from 'lodash';
import { useEffect, useState } from 'react';

// Types
type ChargesRegisterData = {
  id: string,
  clientId: string,
  propertyId: string,
  chargeDate: string,
  planName: string,
  chargeName: string,
  refNo: string,
  rate: string,
  quantity: string,
  amount: string,
  remark: string,
  createdAt: string,
  updatedAt: string
};

interface ChargesRegisterFormProps {
  setShowModal: (value: boolean) => void;
  editingData?: ChargesRegisterData | null;
  onSaved?: () => void;
}

const ChargesRegisterForm = ({ setShowModal, editingData, onSaved }: ChargesRegisterFormProps) => {
  const initialFormData: ChargesRegisterData = {
    id: '',
    clientId: '',
    propertyId: '',
    chargeDate: '',
    planName: '',
    chargeName: '',
    refNo: '',
    rate: '',
    quantity: '',
    amount: '',
    remark: '',
    createdAt: '',
    updatedAt: '',
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
      setFormData({
        id: get(editingData, 'id', ''),
        clientId: get(editingData, 'clientId', ''),
        propertyId: get(editingData, 'propertyId', ''),
        chargeDate: formatDateForInput(get(editingData, 'chargeDate', '')),
        planName: get(editingData, 'planName', ''),
        chargeName: get(editingData, 'chargeName', ''),
        refNo: get(editingData, 'refNo', ''),
        rate: get(editingData, 'rate', ''),
        quantity: get(editingData, 'quantity', ''),
        amount: get(editingData, 'amount', ''),
        remark: get(editingData, 'remark', ''),
        createdAt: formatDateForInput(get(editingData, 'createdAt', '')),
        updatedAt: formatDateForInput(get(editingData, 'updatedAt', '')),
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
        ? `http://192.168.1.8:8000/api/v1/manage-charge/update/${id}`
        : `http://192.168.1.8:8000/api/v1/manage-charge/create`;

      const response = await fetch(url, {
        method: editingData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: formData.clientId,
          propertyId: formData.propertyId,
          chargeDate: formData.chargeDate,
          planName: formData.planName,
          chargeName: formData.chargeName,
          refNo: formData.refNo,
          rate: formData.rate,
          quantity: formData.quantity,
          amount: formData.amount,
          remark: formData.remark,
          createdAt: formData.createdAt,
          updatedAt: formData.updatedAt,
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
            {editingData ? 'Edit Charges Register' : 'Add Charges Register'}
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
            <label className="block text-sm font-medium">chargeDate</label>
            <input
              type="date"
              name="chargeDate"
              value={formData.chargeDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">planName</label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">chargeName</label>
            <input
              type="text"
              name="chargeName"
              value={formData.chargeName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">refNo</label>
            <input
              type="text"
              name="refNo"
              value={formData.refNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">rate</label>
            <input
              type="text"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">quantity</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">amount</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">remark</label>
            <input
              type="text"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">createdAt</label>
            <input
              type="date"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">updatedAt</label>
            <input
              type="date"
              name="updatedAt"
              value={formData.updatedAt}
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

export default ChargesRegisterForm;

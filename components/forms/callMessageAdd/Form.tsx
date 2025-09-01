'use client';
import { useEffect, useState } from 'react';
import { createCallMessage, updateCallMessage } from '../../../lib/api';
import { CallMessageItem } from '../../interface/callMessage';


type CallMessageAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: CallMessageItem | null;
  onSaved?: () => void;
};

const CallMessageAdd = ({ setShowModal, editingData, onSaved }: CallMessageAddProps) => {
  const initialFormData: CallMessageItem = {
    defaultCallName: '',
    customCallName: '',
    isEnableOrDisable: false,
    noOfTypes: 0,
    id: ''
  };

  const [formData, setFormData] = useState<CallMessageItem>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setFormData({
        id: editingData.id,
        defaultCallName: editingData.defaultCallName ?? '',
        customCallName: editingData.customCallName ?? '',
        isEnableOrDisable: !!editingData.isEnableOrDisable,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, isEnableOrDisable: e.target.value === 'true' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isEdit = !!editingData?.id;

    try {
      const item = {
        defaultCallName: formData.defaultCallName.trim(),
        customCallName: formData.customCallName.trim(),
        isEnableOrDisable: !!formData.isEnableOrDisable,
      };

      if (isEdit) {
        await updateCallMessage(editingData!.id!, item);
        alert("Call Message updated successfully!");
      } else {
        await createCallMessage({
          noOfTypes: formData.noOfTypes ?? 1,
          callMessage: [item],
        });
        alert("Call Message added successfully!");
      }

      onSaved?.();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(
        `Failed to save data. ${err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">
        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Call Message' : 'Add Call Message'}
          </h2>
          <div className="absolute top-0 right-0">
            <button
              onClick={() => {
                setShowModal(false);
                onSaved?.();
              }}
              className="text-gray-900 hover:text-red-500 text-2xl font-bold"
              disabled={isLoading}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            {!editingData && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Number Of Types</label>
                <input
                  type="number"
                  name="noOfTypes"
                  value={formData.noOfTypes ?? 0}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/^0+(?=\d)/, '');
                  }}
                  min={0}
                />
              </div>
            )}


            {editingData && (
              <>
                <div>
                  <label className="block text-sm font-medium">Default Call Name</label>
                  <input
                    type="text"
                    name="defaultCallName"
                    value={formData.defaultCallName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Custom Call Name</label>
                  <input
                    type="text"
                    name="customCallName"
                    value={formData.customCallName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    value={formData.isEnableOrDisable ? 'true' : 'false'}
                    onChange={handleToggleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="false">Enabled</option>
                    <option value="true">Disabled</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end pt-4 space-x-3">
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

export default CallMessageAdd;

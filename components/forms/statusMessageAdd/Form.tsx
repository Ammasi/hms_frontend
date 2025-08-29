'use client';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface StatusMessageItem {
  defaultStatusName: string;
  customStatusName: string;
  isEnableOrDisable: boolean;
}

type StatusMessageAddProps = {
  setShowModal: (value: boolean) => void;
  onSaved?: () => void;
};

const api = axios.create({
  baseURL: 'http://192.168.1.8:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default function StatusMessageAdd({
  setShowModal,
  onSaved,
}: StatusMessageAddProps) {
  const [item, setItem] = useState<StatusMessageItem>({
    defaultStatusName: '',
    customStatusName: '',
    isEnableOrDisable: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setItem({ defaultStatusName: '', customStatusName: '', isEnableOrDisable: true });
  }, []);

  const updateField = (field: keyof StatusMessageItem, value: string | boolean) => {
    setItem((prev) => ({ ...prev, [field]: value as never }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: StatusMessageItem[] = [
      {
        defaultStatusName: item.defaultStatusName.trim(),
        customStatusName: item.customStatusName.trim(),
        isEnableOrDisable: !!item.isEnableOrDisable,
      },
    ];

    if (!payload[0].defaultStatusName || !payload[0].customStatusName) {
      alert('Please fill both Default Status Name and Custom Status Name.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/status-message/create', payload);
      alert('Status Message added successfully!');
      onSaved?.();
      setShowModal(false);
    } catch (err) {
      const axErr = err as AxiosError<any>;
      const serverMsg =
        axErr.response?.data?.message ||
        axErr.response?.data?.error ||
        axErr.message ||
        'Unknown error';
      console.error('POST /status-message/create failed:', axErr.response?.data || axErr);
      alert(`Failed to save data. ${serverMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto"
      onClick={() => !isLoading && setShowModal(false)}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">Add Status Message</h2>
          <div className="absolute top-0 right-0">

            <button
              onClick={() => setShowModal(false)}
              className="text-gray-900 hover:text-red-500 text-2xl font-bold"
              disabled={isLoading}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Default Status Name</label>
                <input
                  type="text"
                  value={item.defaultStatusName}
                  onChange={(e) => updateField('defaultStatusName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Custom Status Name</label>
                <input
                  type="text"
                  value={item.customStatusName}
                  onChange={(e) => updateField('customStatusName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Enable/Disable</label>
                <select
                  value={item.isEnableOrDisable ? 'true' : 'false'}
                  onChange={(e) => updateField('isEnableOrDisable', e.target.value === 'true')}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="true">Enable</option>
                  <option value="false">Disable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 space-x-3">

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
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

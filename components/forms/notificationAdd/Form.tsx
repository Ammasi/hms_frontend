'use client';
import { useEffect, useState } from 'react';

interface NotificationItem {
  defaultNotificationName: string;
  customNotificationName: string;
  defaultActionName: string;
  customActionName: string;
  isEnableOrDisable: boolean;
}

interface NotificationData {
  id: string;
  clientId: string;
  propertyId: string;
  noOfTypes: number;
  notification: NotificationItem[];
}

type NotificationProps = {
  setShowModal: (value: boolean) => void;
  editingData?: NotificationData | null;
  onSaved?: () => void;
};

const NotificationAdd = ({ setShowModal, editingData, onSaved }: NotificationProps) => {
  const initialFormData = {
    clientId: '',
    propertyId: '',
    noOfTypes: 0,
    notification: [] as NotificationItem[]
  };


  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setFormData({
        clientId: editingData.clientId || '',
        propertyId: editingData.propertyId || '',
        noOfTypes: editingData.noOfTypes || 0,
        notification: editingData.notification || []
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "noOfTypes" ? Number(value) : value
    }));
  };


  const handleNotificationChange = (index: number, field: keyof NotificationItem, value: string | boolean) => {
    const updatedNotification = [...formData.notification];
    updatedNotification[index] = {
      ...updatedNotification[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      notification: updatedNotification
    }));
  };

  const addNotification = () => {
    setFormData(prev => {
      const updated = [
        ...prev.notification,
        {
          defaultNotificationName: '',
          customNotificationName: '',
          defaultActionName: '',
          customActionName: '',
          isEnableOrDisable: true
        }
      ];
      return { ...prev, notification: updated, noOfTypes: updated.length };
    });
  };

  const removeNotification = (index: number) => {
    setFormData(prev => {
      const updated = prev.notification.filter((_, i) => i !== index);
      return { ...prev, notification: updated, noOfTypes: updated.length };
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = editingData
      ? `http://192.168.1.14:8000/api/v1/notification/update/${editingData.id}`
      : `http://192.168.1.14:8000/api/v1/notification/create`;

    const method = editingData ? 'PUT' : 'POST';

    try {
      const requestData = {
        clientId: formData.clientId,
        propertyId: formData.propertyId,
        noOfTypes: formData.noOfTypes,
        notification: formData.notification
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(editingData ? 'Status Message updated successfully!' : 'Status Message added successfully!');
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
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">
        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Notification' : 'Add Notification'}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium">Property Id</label>
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
              <label className="block text-sm font-medium">No Of Types</label>
              <input
                type="number"
                name="noOfTypes"
                value={formData.noOfTypes}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Notification</h3>
            {formData.notification.map((notification, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Notification{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeNotification(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Default Status Name</label>
                    <input
                      type="text"
                      value={notification.defaultNotificationName}
                      onChange={(e) => handleNotificationChange(index, 'defaultNotificationName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">custom Notification Name</label>
                    <input
                      type="text"
                      value={notification.customNotificationName}
                      onChange={(e) => handleNotificationChange(index, 'customNotificationName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Default Action Name</label>
                    <input
                      type="text"
                      value={notification.defaultActionName}
                      onChange={(e) => handleNotificationChange(index, 'defaultActionName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Custom Action Name</label>
                    <input
                      type="text"
                      value={notification.customActionName}
                      onChange={(e) => handleNotificationChange(index, 'customActionName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Enable/Disable</label>
                    <select
                      value={notification.isEnableOrDisable ? 'true' : 'false'}
                      onChange={(e) => handleNotificationChange(index, 'isEnableOrDisable', e.target.value === 'true')}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="true">Enable</option>
                      <option value="false">Disable</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addNotification}
              className="mt-2 bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
            >
              Add Notification
            </button>

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

export default NotificationAdd;
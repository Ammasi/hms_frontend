'use client';
import { useEffect, useState } from 'react';

interface NotificationRow {
  id?: string;
  defaultNotificationName: string;
  customNotificationName: string;
  defaultActionName: string;
  customActionName: string;
  isEnableOrDisable: boolean;
  noOfTypes?: number;
}

type NotificationAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: NotificationRow | null;
  onSaved?: () => void;
};

const NotificationAdd = ({ setShowModal, editingData, onSaved }: NotificationAddProps) => {
  const initialFormData: NotificationRow = {
    defaultNotificationName: '',
    customNotificationName: '',
    defaultActionName: '',
    customActionName: '',
    isEnableOrDisable: false,
    noOfTypes: 0,
  };

  const [formData, setFormData] = useState<NotificationRow>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setFormData({
        id: editingData.id,
        defaultNotificationName: editingData.defaultNotificationName ?? '',
        customNotificationName: editingData.customNotificationName ?? '',
        defaultActionName: editingData.defaultActionName ?? '',
        customActionName: editingData.customActionName ?? '',
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
        defaultNotificationName: String(formData.defaultNotificationName || ""),
        customNotificationName: String(formData.customNotificationName || ""),
        defaultActionName: String(formData.defaultActionName || ""),
        customActionName: String(formData.customActionName || ""),
        isEnableOrDisable: Boolean(formData.isEnableOrDisable),
      };


      const url = isEdit
        ? `http://192.168.1.8:8000/api/v1/notification/update/${editingData!.id}`
        : `http://192.168.1.8:8000/api/v1/notification/create`;

      const method = isEdit ? "PUT" : "POST";


      const bodyPayload = isEdit
        ? item
        : { noOfTypes: formData.noOfTypes ?? 0, notification: [item] };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} — ${text}`);
      }

      await res.json().catch(() => ({}));

      alert(isEdit ? "Notification updated successfully!" : "Notification added successfully!");
      onSaved?.();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(`Failed to save data. ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4">
          {editingData ? "Edit Notification" : "Add Notification"}
        </h2>

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
                  <label className="block text-sm font-medium">Default Notification Name</label>
                  <input
                    type="text"
                    name="defaultNotificationName"
                    value={formData.defaultNotificationName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Custom Notification Name</label>
                  <input
                    type="text"
                    name="customNotificationName"
                    value={formData.customNotificationName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Default Action Name</label>
                  <input
                    type="text"
                    name="defaultActionName"
                    value={formData.defaultActionName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Custom Action Name</label>
                  <input
                    type="text"
                    name="customActionName"
                    value={formData.customActionName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    value={formData.isEnableOrDisable ? "true" : "false"}
                    onChange={handleToggleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
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
              {isLoading ? "Processing..." : editingData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationAdd;

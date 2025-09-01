'use client';
import { useEffect, useState } from "react";
import { StatusMessageItem } from "../../interface/StatusMessage";
import { createStatusMessage, updateStatusMessage } from "../../../lib/api";



type StatusMessageAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: StatusMessageItem | null;
  onSaved?: () => void;
};

export default function StatusMessageAdd({
  setShowModal,
  editingData,
  onSaved,
}: StatusMessageAddProps) {
  const [formData, setFormData] = useState<StatusMessageItem>({
    defaultStatusName: "",
    customStatusName: "",
    isEnableOrDisable: true,
    noOfTypes: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setFormData({
        ...editingData,
        noOfTypes: editingData.noOfTypes ?? 0,
      });
    } else {
      setFormData({
        defaultStatusName: "",
        customStatusName: "",
        isEnableOrDisable: true,
        noOfTypes: 0,
      });
    }
  }, [editingData]);

  const handleChange = (field: keyof StatusMessageItem, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value as never }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const isEdit = !!editingData?.id;
    try {


      const item = {
        defaultStatusName: formData.defaultStatusName.trim(),
        customStatusName: formData.customStatusName.trim(),
        isEnableOrDisable: !!formData.isEnableOrDisable,
      };

      if (isEdit) {
        await updateStatusMessage(editingData!.id!, item);
        alert("Status Message updated successfully!");
      } else {
        await createStatusMessage({
          noOfTypes: formData.noOfTypes ?? 1,
          statusMessage: [item],

        });
        alert("Status Message added successfully!");
      }
      onSaved?.();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save data.");
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
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? "Edit Status Message" : "Add Status Message"}
          </h2>
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
            {!editingData && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Number Of Types</label>
                <input
                  type="number"
                  name="noOfTypes"
                  value={formData.noOfTypes ?? 0}
                  onChange={(e) => handleChange("noOfTypes", parseInt(e.target.value, 10))}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Default Status Name</label>
                  <input
                    type="text"
                    value={formData.defaultStatusName}
                    onChange={(e) => handleChange("defaultStatusName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Custom Status Name</label>
                  <input
                    type="text"
                    value={formData.customStatusName}
                    onChange={(e) => handleChange("customStatusName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Enable/Disable</label>
                  <select
                    value={formData.isEnableOrDisable ? "true" : "false"}
                    onChange={(e) => handleChange("isEnableOrDisable", e.target.value === "true")}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="true">Enable</option>
                    <option value="false">Disable</option>
                  </select>
                </div>
              </div>
            )}
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
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

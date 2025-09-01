'use client';
import { useEffect, useState } from 'react';
import { createSubscriptioModel, fetchCallMessage, fetchNotification, fetchStatusMessage, updateSubscriptioModel } from '../../../lib/api';
import { CallMessageItem } from '../../interface/callMessage';
import { StatusMessageItem } from '../../interface/StatusMessage';
import { FlatCallMessage, FlatNotificationMessage, FlatStatusMessage, SubscriptionModelData } from '../../interface/SubscriptionModel';

type SubscriptionModelAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: SubscriptionModelData | null;
  onSaved?: () => void;
};

const SubscriptionModelAdd = ({ setShowModal, editingData, onSaved }: SubscriptionModelAddProps) => {
  const initialFormData = {
    clientId: '',
    propertyId: '',
    planDefaultName: '',
    planCustomName: '',
    price: '',
    duration: '',
    noOfProperty: '',
    noOfFloors: '',
    noOfRooms: '',
    noOfRoomTypes: '',
    noOfReportTypes: [] as string[],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const [statusOptions, setStatusOptions] = useState<FlatStatusMessage[]>([]);
  const [callOptions, setCallOptions] = useState<FlatCallMessage[]>([]);
  const [notificationOptions, setNotificationOptions] = useState<FlatNotificationMessage[]>([]);


  const [selectedStatusNames, setSelectedStatusNames] = useState<Set<string>>(new Set());
  const [selectedCallNames, setSelectedCallNames] = useState<Set<string>>(new Set());
  const [selectedNotificationNames, setSelectedNotificationNames] = useState<Set<string>>(new Set());



  useEffect(() => {
    if (editingData) {
      setFormData({
        clientId: editingData.clientId || '',
        propertyId: editingData.propertyId || '',
        planDefaultName: editingData.planDefaultName || '',
        planCustomName: editingData.planCustomName || '',
        price: (editingData.price ?? '').toString(),
        duration: editingData.duration || '',
        noOfProperty: (editingData.noOfProperty ?? '').toString(),
        noOfFloors: editingData.noOfFloors?.[0]?.toString() || '',
        noOfRooms: editingData.noOfRooms?.[0]?.toString() || '',
        noOfRoomTypes: editingData.noOfRoomTypes?.join(', ') || '',
        noOfReportTypes: editingData.noOfReportTypes || [],
      });

      if (editingData.noOfStatus) {
        const names = editingData.noOfStatus.map((s: any) =>
          typeof s === 'string' ? s : s.defaultStatusName
        ).filter(Boolean);
        setSelectedStatusNames(new Set(names));
      }
      if (editingData.noOfCall) {
        const names = editingData.noOfCall.map((c: any) =>
          typeof c === 'string' ? c : c.defaultCallName
        ).filter(Boolean);
        setSelectedCallNames(new Set(names));
      }
      if (editingData.noOfNotification) {
        const names = editingData.noOfNotification.map((n: any) =>
          typeof n === 'string' ? n : n.defaultNotificationName
        ).filter(Boolean);
        setSelectedNotificationNames(new Set(names));
      }
    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);

  // Load options
  useEffect(() => {
    const load = async () => {


      try {
        const list: CallMessageItem[] = await fetchCallMessage();
        const res = await fetchNotification();
        const listStatus: StatusMessageItem[] = await fetchStatusMessage();

        const flatStatus = (Array.isArray(listStatus) ? listStatus : []).map((s) => ({
          id: s.id ?? '',
          defaultStatusName: s.defaultStatusName,
          customStatusName: s.customStatusName,
          isEnableOrDisable: s.isEnableOrDisable,
        }));

        const flatCall = Array.isArray(list) ? list : [];
        const flatNotification = Array.isArray(res) ? res : [];

        setStatusOptions(flatStatus);
        setCallOptions(flatCall);
        setNotificationOptions(flatNotification);
      } catch (err: any) {
        console.error('Error fetching options:', err);

        setStatusOptions([]);
        setCallOptions([]);
        setNotificationOptions([]);
      }
    };

    load();
  }, [editingData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReportChange = (value: string) => {
    setFormData((prev) => {
      const newReports = [...prev.noOfReportTypes];
      if (newReports.includes(value)) {
        return { ...prev, noOfReportTypes: newReports.filter((r) => r !== value) };
      } else {
        return { ...prev, noOfReportTypes: [...newReports, value] };
      }
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const roomTypesArray = formData.noOfRoomTypes
        .split(',')
        .map((type) => type.trim())
        .filter((type) => type.length > 0);

      const statusIds = Array.from(selectedStatusNames)
        .map((name) => statusOptions.find((s) => s.defaultStatusName === name)?.id)
        .filter(Boolean);

      const callIds = Array.from(selectedCallNames)
        .map((name) => callOptions.find((c) => c.defaultCallName === name)?.id)
        .filter(Boolean);

      const notificationIds = Array.from(selectedNotificationNames)
        .map((name) => notificationOptions.find((n) => n.defaultNotificationName === name)?.id)
        .filter(Boolean);

      const requestData = {
        clientId: formData.clientId,
        propertyId: formData.propertyId,
        planDefaultName: formData.planDefaultName,
        planCustomName: formData.planCustomName,
        price: Number(formData.price),
        duration: formData.duration,
        noOfProperty: Number(formData.noOfProperty),
        noOfFloors: [Number(formData.noOfFloors)],
        noOfRooms: [Number(formData.noOfRooms)],
        noOfRoomTypes: roomTypesArray,
        noOfReportTypes: formData.noOfReportTypes,
        noOfStatus: statusIds,
        noOfCall: callIds,
        noOfNotification: notificationIds,
      };


      if (editingData) {
        await updateSubscriptioModel(editingData.id, requestData);
        alert("Subscription model updated successfully!");
      } else {
        await createSubscriptioModel(requestData);
        alert("Subscription model created successfully!");
      }

      onSaved?.();
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert(
        `Failed to save data. ${error instanceof Error ? error.message : "Please try again."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">
        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Subscription Model' : 'Add Subscription Model'}
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
              <label className="block text-sm font-medium">Property ID</label>
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
              <label className="block text-sm font-medium">Plan Default Name</label>
              <input
                type="text"
                name="planDefaultName"
                value={formData.planDefaultName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Plan Custom Name</label>
              <input
                type="text"
                name="planCustomName"
                value={formData.planCustomName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Number of Properties</label>
              <input
                type="number"
                name="noOfProperty"
                value={formData.noOfProperty}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Floors</label>
              <input
                type="number"
                name="noOfFloors"
                value={formData.noOfFloors}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Rooms</label>
              <input
                type="number"
                name="noOfRooms"
                value={formData.noOfRooms}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Room Types (comma separated)</label>
              <input
                type="text"
                name="noOfRoomTypes"
                value={formData.noOfRoomTypes}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="delux, suite, normal"
                required
              />
            </div>
          </div>


          <h3 className="text-lg font-semibold mb-3">Property Details</h3>


          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Report Types</label>
            <div className="flex flex-col gap-2">
              {[
                { value: "arrivalreport", label: "Stay Report" },
                { value: "checkinreport", label: "Reservation Report" },
                { value: "nightauditreport", label: "Night Audit Report" },
                { value: "bookingreport", label: "Booking Report" }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.noOfReportTypes.includes(option.value)}
                    onChange={() => handleReportChange(option.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Status Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {statusOptions.map((opt) => {
                const key = opt.defaultStatusName;
                const checked = selectedStatusNames.has(key);
                return (
                  <label key={opt.id} className="flex items-center gap-2 border p-2 rounded">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelectedStatusNames((prev) => {
                          const next = new Set(prev);
                          e.target.checked ? next.add(key) : next.delete(key);
                          return next;
                        });
                      }}
                    />
                    <span>{opt.defaultStatusName}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Call Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Call</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {callOptions.map((opt) => {
                const key = opt.defaultCallName;
                const checked = selectedCallNames.has(key);
                return (
                  <label key={opt.id} className="flex items-center gap-2 border p-2 rounded">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelectedCallNames((prev) => {
                          const next = new Set(prev);
                          e.target.checked ? next.add(key) : next.delete(key);
                          return next;
                        });
                      }}
                    />
                    <span>{opt.defaultCallName}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notification Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Notification</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {notificationOptions.map((opt) => {
                const key = opt.defaultNotificationName;
                const checked = selectedNotificationNames.has(key);
                return (
                  <label key={opt.id} className="flex items-center gap-2 border p-2 rounded">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelectedNotificationNames((prev) => {
                          const next = new Set(prev);
                          e.target.checked ? next.add(key) : next.delete(key);
                          return next;
                        });
                      }}
                    />
                    <span>{opt.defaultNotificationName}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                onSaved?.();
              }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isLoading ? 'Processing…' : editingData ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SubscriptionModelAdd;
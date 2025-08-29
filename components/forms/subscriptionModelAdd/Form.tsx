'use client';
import { ReactNode, useEffect, useState } from 'react';
import { fetchStatusMessage } from '../../../lib/api';

type Floor = { propertyId: string; floors: number };
type Room = { propertyId: string; rooms: number };
type RoomType = { propertyId: string; types: number };
type ReportType = { propertyId: string; reports: number };

type Status = { propertyId: string; status: number };

type Call = { propertyId: string; call: number };
type Notification = { propertyId: string; notification: number };

type SubscriptionModelData = {
  id: string;
  clientId: string;
  planDefaultName: string;
  planCustomName: string;
  price: number;
  duration: string;
  noOfProperty: number;
  noOfFloors: Floor[];
  noOfRooms: Room[];
  noOfRoomTypes: RoomType[];
  noOfReportTypes: ReportType[];
  noOfStatus?: string[] | Status[];
  noOfCall: Call[];
  noOfNotification: Notification[];
  priority?: ReactNode;
  deadline?: string;
};

type SubscriptionModelAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: SubscriptionModelData | null;
  onSaved?: () => void;
};

type FlatStatusMessage = {
  id: string;
  defaultStatusName: string;
  customStatusName?: string;
  isEnableOrDisable: boolean;
};

const SubscriptionModelAdd = ({ setShowModal, editingData, onSaved }: SubscriptionModelAddProps) => {
  const initialFormData = {
    clientId: '',
    planDefaultName: '',
    planCustomName: '',
    price: '',
    duration: '',
    noOfProperty: '',
    properties: [] as Array<{
      propertyId: string;
      floors: string;
      rooms: string;
      types: string;
      reports: string;
      status: string;
      call: string;
      notification: string;
    }>,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);


  const [statusOptions, setStatusOptions] = useState<FlatStatusMessage[]>([]);
  const [selectedStatusIds, setSelectedStatusIds] = useState<Set<string>>(new Set());
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);


  useEffect(() => {
    if (editingData) {
      const propertyMap = new Map<string, any>();

      editingData.noOfFloors?.forEach((floor) => {
        if (!propertyMap.has(floor.propertyId)) {
          propertyMap.set(floor.propertyId, { propertyId: floor.propertyId });
        }
        propertyMap.get(floor.propertyId).floors = floor.floors.toString();
      });

      editingData.noOfRooms?.forEach((room) => {
        if (!propertyMap.has(room.propertyId)) {
          propertyMap.set(room.propertyId, { propertyId: room.propertyId });
        }
        propertyMap.get(room.propertyId).rooms = room.rooms.toString();
      });

      editingData.noOfRoomTypes?.forEach((type) => {
        if (!propertyMap.has(type.propertyId)) {
          propertyMap.set(type.propertyId, { propertyId: type.propertyId });
        }
        propertyMap.get(type.propertyId).types = type.types.toString();
      });

      editingData.noOfReportTypes?.forEach((report) => {
        if (!propertyMap.has(report.propertyId)) {
          propertyMap.set(report.propertyId, { propertyId: report.propertyId });
        }
        propertyMap.get(report.propertyId).reports = report.reports.toString();
      });


      editingData.noOfCall?.forEach((call) => {
        if (!propertyMap.has(call.propertyId)) {
          propertyMap.set(call.propertyId, { propertyId: call.propertyId });
        }
        propertyMap.get(call.propertyId).call = call.call.toString();
      });

      editingData.noOfNotification?.forEach((notification) => {
        if (!propertyMap.has(notification.propertyId)) {
          propertyMap.set(notification.propertyId, { propertyId: notification.propertyId });
        }
        propertyMap.get(notification.propertyId).notification = notification.notification.toString();
      });

      const properties = Array.from(propertyMap.values());

      setFormData({
        clientId: editingData.clientId || '',
        planDefaultName: editingData.planDefaultName || '',
        planCustomName: editingData.planCustomName || '',
        price: editingData.price.toString() || '',
        duration: editingData.duration || '',
        noOfProperty: editingData.noOfProperty.toString() || '',
        properties,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);

  useEffect(() => {
    const loadStatuses = async () => {
      setStatusLoading(true);
      setStatusError(null);
      try {
        const res = await fetchStatusMessage();
        const raw = res?.data;
        const list: FlatStatusMessage[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];

        // const active = list.filter((x) => x.isEnableOrDisable !== false);
        setStatusOptions(list);
        if (editingData && Array.isArray(editingData.noOfStatus) && typeof editingData.noOfStatus[0] === 'string') {
          setSelectedStatusIds(new Set(editingData.noOfStatus as string[]));
        }
      } catch (err: any) {
        console.error('Error fetching status messages:', err);
        setStatusError('Failed to fetch status options');
        setStatusOptions([]);
      } finally {
        setStatusLoading(false);
      }
    };

    loadStatuses();
  }, [editingData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePropertyChange = (index: number, field: string, value: string) => {
    const updatedProperties = [...formData.properties];
    updatedProperties[index] = {
      ...updatedProperties[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      properties: updatedProperties,
    }));
  };

  const addProperty = () => {
    setFormData((prev) => ({
      ...prev,
      properties: [
        ...prev.properties,
        {
          propertyId: '',
          floors: '',
          rooms: '',
          types: '',
          reports: '',
          status: '',
          call: '',
          notification: '',
        },
      ],
    }));
  };

  const removeProperty = (index: number) => {
    const updatedProperties = [...formData.properties];
    updatedProperties.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      properties: updatedProperties,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = editingData
      ? `http://192.168.1.8:8000/api/v1/subscription-model/update/${editingData.id}`
      : `http://192.168.1.8:8000/api/v1/subscription-model/create`;

    const method = editingData ? 'PUT' : 'POST';

    try {
      const requestData = {
        clientId: formData.clientId,
        planDefaultName: formData.planDefaultName,
        planCustomName: formData.planCustomName,
        price: Number(formData.price),
        duration: formData.duration,
        noOfProperty: Number(formData.noOfProperty),
        noOfFloors: formData.properties.map((p) => ({
          propertyId: p.propertyId,
          floors: Number(p.floors),
        })),
        noOfRooms: formData.properties.map((p) => ({
          propertyId: p.propertyId,
          rooms: Number(p.rooms),
        })),
        noOfRoomTypes: formData.properties.map((p) => ({
          propertyId: p.propertyId,
          types: Number(p.types),
        })),
        noOfReportTypes: formData.properties.map((p) => ({
          propertyId: p.propertyId,
          reports: Number(p.reports),
        })),
        noOfStatus: Array.from(selectedStatusIds),

        noOfCall: formData.properties.map((p) => ({
          propertyId: p.propertyId,
          call: Number(p.call),
        })),
        noOfNotification: formData.properties.map((p) => ({
          propertyId: p.propertyId,
          notification: Number(p.notification),
        })),
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

      await response.json();
      alert(editingData ? 'Subscription model updated successfully!' : 'Subscription model added successfully!');
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
          </div>
         



          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Properties</h3>
            {formData.properties.map((property, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Property {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProperty(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Property ID</label>
                    <input
                      type="text"
                      value={property.propertyId}
                      onChange={(e) => handlePropertyChange(index, 'propertyId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Floors</label>
                    <input
                      type="number"
                      value={property.floors}
                      onChange={(e) => handlePropertyChange(index, 'floors', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Rooms</label>
                    <input
                      type="number"
                      value={property.rooms}
                      onChange={(e) => handlePropertyChange(index, 'rooms', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Room Types</label>
                    <input
                      type="number"
                      value={property.types}
                      onChange={(e) => handlePropertyChange(index, 'types', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Reports</label>
                    <input
                      type="number"
                      value={property.reports}
                      onChange={(e) => handlePropertyChange(index, 'reports', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>

                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStatusIds(new Set(statusOptions.map(o => o.id)))}
                        className="text-xs px-2 py-1 rounded border"
                      >
                        Select all
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedStatusIds(new Set())}
                        className="text-xs px-2 py-1 rounded border"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="border border-gray-300 rounded p-2 max-h-48 overflow-y-auto">
                      {statusLoading && <div className="text-sm text-gray-500 p-2">Loading…</div>}
                      {statusError && <div className="text-sm text-red-600 p-2">{statusError}</div>}
                      {!statusLoading && statusOptions.length === 0 && (
                        <div className="text-sm text-gray-500 p-2">No status options available.</div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {statusOptions.map((opt) => {
                          const label = opt.customStatusName?.trim() ? opt.customStatusName : opt.defaultStatusName;
                          const checked = selectedStatusIds.has(opt.id);
                          return (
                            <label
                              key={opt.id}
                              className={`flex items-center gap-2 rounded border px-3 py-2 transition
              ${checked ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'}
            `}
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={checked}
                                onChange={(e) => {
                                  setSelectedStatusIds(prev => {
                                    const next = new Set(prev);
                                    e.target.checked ? next.add(opt.id) : next.delete(opt.id);
                                    return next;
                                  });
                                }}
                              />
                              <span className="text-sm">{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">Selected: {selectedStatusIds.size}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Call</label>
                    <input
                      type="number"
                      value={property.call}
                      onChange={(e) => handlePropertyChange(index, 'call', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Notification</label>
                    <input
                      type="number"
                      value={property.notification}
                      onChange={(e) => handlePropertyChange(index, 'notification', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addProperty}
              className="mt-2 bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
            >
              Add Property
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

export default SubscriptionModelAdd;

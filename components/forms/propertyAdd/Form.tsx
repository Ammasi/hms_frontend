'use client';
import { useEffect, useRef, useState } from 'react';
import { Floor, PropertyData } from '../../interface/property';
import { createProperty, updateProperty } from '../../../lib/api';

type PropertyAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: PropertyData | null;
  onSaved?: () => void;
};

const PropertyAdd = ({ setShowModal, editingData, onSaved }: PropertyAddProps) => {
  const [formData, setFormData] = useState<
    Omit<
      PropertyData,
      'id' | 'createdAt' | 'updatedAt' | 'floors' | 'propertyImage'
    >
  >({
    clientId: '',
    propertyName: '',
    propertyType: '',
    propertyCreateCount: '',
    propertyContact: '',
    propertyEmail: '',
    propertyAddress: '',
    includeGroundFloor: true,
    noOfFloors: 0,
    roomTypeCount: 0,
    city: '',
    pinCode: '',
    starRating: '',
    totalRooms: '',
    facility: '',
    policies: '',
    status: '',
    commonId: '',
  });

  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [propertyImageFile, setPropertyImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const propertyImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingData) {
      setFormData({
        clientId: editingData.clientId,
        propertyName: editingData.propertyName,
        propertyType: editingData.propertyType,
        propertyCreateCount: editingData.propertyCreateCount,
        propertyContact: editingData.propertyContact,
        propertyEmail: editingData.propertyEmail,
        propertyAddress: editingData.propertyAddress,
        includeGroundFloor: editingData.includeGroundFloor,
        noOfFloors: editingData.noOfFloors,
        roomTypeCount: editingData.roomTypeCount,
        city: editingData.city,
        pinCode: editingData.pinCode,
        starRating: editingData.starRating,
        totalRooms: editingData.totalRooms,
        facility: editingData.facility,
        policies: editingData.policies,
        status: editingData.status,
        commonId: editingData.commonId,
      });

      if (editingData.propertyImage) {
        setImagePreview(editingData.propertyImage);
      }
      if (Array.isArray(editingData.floors)) {
        setFloors(editingData.floors);
      }
    } else {

      const initialFloors: Floor[] = [];
      if (formData.includeGroundFloor) {
        initialFloors.push({
          defaultName: 'GroundFloor',
          customName: '',
          roomCount: 0,
        });
      }
      for (let i = 1; i <= formData.noOfFloors; i++) {
        initialFloors.push({
          defaultName: `Floor${i}`,
          customName: '',
          roomCount: 0,
        });
      }
      setFloors(initialFloors);
    }
  }, [editingData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean;

    if (name === 'includeGroundFloor') {
      newValue = value === 'true';
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      newValue = parseInt(value) || 0;
    } else {
      newValue = value;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };
      if (name === 'noOfFloors' || name === 'includeGroundFloor') {
        const includeGF =
          name === 'includeGroundFloor' ? (newValue as boolean) : prev.includeGroundFloor;
        const numFloors =
          name === 'noOfFloors' ? (newValue as number) : prev.noOfFloors;

        const next: Floor[] = [];
        if (includeGF) {
          const existingGF = floors.find((f) => f.defaultName === 'GroundFloor');
          next.push({
            defaultName: 'GroundFloor',
            customName: existingGF?.customName ?? '',
            roomCount: existingGF?.roomCount ?? 0,
          });
        }
        for (let i = 1; i <= numFloors; i++) {
          const key = `Floor${i}`;
          const existing = floors.find((f) => f.defaultName === key);
          next.push({
            defaultName: key,
            customName: existing?.customName ?? '',
            roomCount: existing?.roomCount ?? 0,
          });
        }
        setFloors(next);
      }

      return updated;
    });
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPropertyImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRoomCountChange = (index: number, value: number) => {
    const updatedFloors = [...floors];
    updatedFloors[index].roomCount = value;
    setFloors(updatedFloors);

    const total = updatedFloors.reduce(
      (sum, f) => sum + (f.roomCount || 0),
      0
    );
    setFormData((prev) => ({ ...prev, totalRooms: total.toString() }));
  };

  const renderRoomCountInputs = () => {
    return floors.map((floor, index) => {
      if (!formData.includeGroundFloor && floor.defaultName === 'GroundFloor') {
        return null;
      }
      const label =
        floor.defaultName === 'GroundFloor'
          ? 'Ground Floor'
          : floor.defaultName.replace('Floor', 'Floor ');
      return (
        <div key={index} className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type="number"
            value={floor.roomCount}
            onChange={(e) => handleRoomCountChange(index, parseInt(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/^0+(?=\d)/, '');
            }}
          />
        </div>
      );
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("clientId", formData.clientId);
    formDataToSend.append("propertyName", formData.propertyName);
    formDataToSend.append("propertyType", formData.propertyType);
    formDataToSend.append("propertyCreateCount", String(formData.propertyCreateCount));
    formDataToSend.append("propertyContact", formData.propertyContact);
    formDataToSend.append("propertyEmail", formData.propertyEmail);
    formDataToSend.append("propertyAddress", formData.propertyAddress);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("pinCode", formData.pinCode);
    formDataToSend.append("starRating", String(formData.starRating));
    formDataToSend.append("totalRooms", String(formData.totalRooms));
    formDataToSend.append("facility", formData.facility);
    formDataToSend.append("policies", formData.policies);
    formDataToSend.append("status", formData.status);

    formDataToSend.append("includeGroundFloor", JSON.stringify(formData.includeGroundFloor));
    formDataToSend.append("noOfFloors", String(formData.noOfFloors));
    formDataToSend.append("roomTypeCount", String(formData.roomTypeCount));
    formDataToSend.append(
      "roomCounts",
      JSON.stringify(floors.map((f) => (Number.isFinite(f.roomCount) ? f.roomCount : 0)))
    );

    if (propertyImageFile) {
      formDataToSend.append("file", propertyImageFile);
    }

    console.log("Submitting form data:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    try {
      if (editingData) {
        await updateProperty(editingData.id, formDataToSend);
        alert("Property updated successfully");
      } else {
        await createProperty(formDataToSend);
        alert("Property created successfully");
      }

      setShowModal(false);
      onSaved?.();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0  not-even: bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 my-10">
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            onClick={() => {
              setShowModal(false);
              onSaved?.();
            }}
            className="absolute top-0 right-0 text-gray-500 hover:text-red-600 text-3xl font-bold transition-colors"
            disabled={isLoading}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client ID*</label>
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required

            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name*</label>
            <input
              type="text"
              name="propertyName"
              value={formData.propertyName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required

            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">property Type*</label>
            <input
              type="text"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required

            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">property Create Count*</label>
            <input
              type="text"
              name="propertyCreateCount"
              value={formData.propertyCreateCount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required

            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">property Contact*</label>
            <input
              type="text"
              name="propertyContact"
              value={formData.propertyContact}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required

            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input
              type="email"
              name="propertyEmail"
              value={formData.propertyEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required

            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Image</label>
            <input
              type="file"
              ref={propertyImageRef}
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Property preview"
                  className="h-20 w-20 object-cover rounded"
                />
              </div>
            )}

          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
            <input
              type="text"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required

            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Include Ground Floor*
            </label>
            <select
              name="includeGroundFloor"
              value={String(formData.includeGroundFloor)}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Floors*</label>
            <input
              type="number"
              name="noOfFloors"
              value={formData.noOfFloors}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="20"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/^0+(?=\d)/, '');
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rooms per Floor*</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {renderRoomCountInputs()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Types*</label>
            <input
              type="text"
              name="roomTypeCount"
              value={formData.roomTypeCount}
              onChange={handleChange} onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/^0+(?=\d)/, '');
              }}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required

            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code*</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating*</label>
            <select
              name="starRating"
              value={formData.starRating}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
            <input
              type="text"
              name="totalRooms"
              value={formData.totalRooms}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
            <input
              type="text"
              name="facility"
              value={formData.facility}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

            />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policies</label>
            <input
              type="text"
              name="policies"
              value={formData.policies}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

            />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

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
}; export default PropertyAdd;
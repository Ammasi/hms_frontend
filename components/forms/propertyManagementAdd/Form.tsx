'use client';

import { useEffect, useRef, useState } from 'react';

interface PropertyData {
  id: string;
  clientId: string;
  propertyName: string;
  propertyType: string;
  propertyCreateCount: string;
  propertyContact: string;
  propertyEmail: string;
  propertyImage: string;
  propertyAddress: string;
  includeGroundFloor: boolean;
  noOfFloors: number;
  roomTypeCount: number;
  floors: string[];
  roomTypes: string[];
  roomCounts: number[];
  city: string;
  pinCode: string;
  starRating: string;
  totalRooms: string;
  facility: string;
  policies: string;
  status: string;
  commonId: string;
  createdAt: string;
  updatedAt: string;
}

type PropertyAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: PropertyData | null;
  onSaved?: () => void;
};

const PropertyAdd = ({ setShowModal, editingData, onSaved }: PropertyAddProps) => {
  const [formData, setFormData] = useState({
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
    starRating: '0',
    totalRooms: '0',
    facility: '',
    policies: '',
    status: '',
    commonId: '',
  });

  const [roomCounts, setRoomCounts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [propertyImageFile, setPropertyImageFile] = useState<File | null>(null);
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
      setRoomCounts(editingData.roomCounts || []);
    } else {
      // Initialize roomCounts for new property
      const initialCounts = Array(formData.noOfFloors + (formData.includeGroundFloor ? 1 : 0)).fill(0);
      setRoomCounts(initialCounts);
    }
  }, [editingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                    type === 'number' ? parseInt(value) || 0 : value;

    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: newValue
      };

      // When noOfFloors or includeGroundFloor changes, update roomCounts
      if (name === 'noOfFloors' || name === 'includeGroundFloor') {
        const floorCount = name === 'noOfFloors' ? newValue as number : prev.noOfFloors;
        const includeGround = name === 'includeGroundFloor' ? newValue as boolean : prev.includeGroundFloor;
        
        const totalFloors = floorCount + (includeGround ? 1 : 0);
        const newRoomCounts = Array(totalFloors).fill(0);
        setRoomCounts(newRoomCounts);
        
        // Update total rooms
        newFormData.totalRooms = '0';
      }

      return newFormData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setPropertyImageFile(file);
      }
    }
  };

  const handleRoomCountChange = (index: number, value: number) => {
    const newRoomCounts = [...roomCounts];
    newRoomCounts[index] = value;
    setRoomCounts(newRoomCounts);

    // Update total rooms
    const total = newRoomCounts.reduce((sum, count) => sum + count, 0);
    setFormData(prev => ({
      ...prev,
      totalRooms: total.toString()
    }));
  };

  const renderRoomCountInputs = () => {
    return roomCounts.map((count, index) => {
      let floorLabel = '';
      if (formData.includeGroundFloor) {
        floorLabel = index === 0 ? 'Ground Floor' : `Floor ${index}`;
      } else {
        floorLabel = `Floor ${index + 1}`;
      }

      return (
        <div key={index} className="mb-2">
          <label className="block text-sm font-medium">{floorLabel} Rooms</label>
          <input
            type="number"
            value={count}
            onChange={(e) => handleRoomCountChange(index, parseInt(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded"
            min="0"
          />
        </div>
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();

    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, String(value));
      }
    });

    // Append arrays
    // Create roomTypes array based on roomTypeCount
    const roomTypes = Array(formData.roomTypeCount).fill('').map((_, i) => `Room Type ${i + 1}`);
    roomTypes.forEach(roomType => formDataToSend.append('roomTypes', roomType));
    
    roomCounts.forEach(count => formDataToSend.append('roomCounts', count.toString()));

    // Append image file if exists
    if (propertyImageFile) {
      formDataToSend.append('propertyImage', propertyImageFile);
    }

    try {
      const baseUrl = 'http://192.168.1.14:8000/api/v1/property';
      const url = editingData 
        ? `${baseUrl}/update/${editingData.id}`
        : `${baseUrl}/create`;

      const method = editingData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(editingData ? 'Property updated successfully' : 'Property added successfully');
      setShowModal(false);
      onSaved?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">
        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Property' : 'Add Property'}
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
          {/* Basic Information */}
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
            <label className="block text-sm font-medium">Property Name</label>
            <input
              type="text"
              name="propertyName"
              value={formData.propertyName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Hotel">Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Motel">Motel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Property Contact</label>
            <input
              type="text"
              name="propertyContact"
              value={formData.propertyContact}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Property Email</label>
            <input
              type="email"
              name="propertyEmail"
              value={formData.propertyEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Property Image</label>
            <input
              type="file"
              ref={propertyImageRef}
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded"
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
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Include Ground Floor</label>
            <select
              name="includeGroundFloor"
              value={formData.includeGroundFloor.toString()}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                includeGroundFloor: e.target.value === 'true'
              }))}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Number of Floors</label>
            <input
              type="number"
              name="noOfFloors"
              value={formData.noOfFloors}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Room Type Count</label>
            <input
              type="number"
              name="roomTypeCount"
              value={formData.roomTypeCount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
              max="3"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Room Counts by Floor</label>
            {renderRoomCountInputs()}
          </div>

          <div>
            <label className="block text-sm font-medium">Total Rooms</label>
            <input
              type="text"
              name="totalRooms"
              value={formData.totalRooms}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Star Rating</label>
            <select
              name="starRating"
              value={formData.starRating}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Facilities</label>
            <input
              type="text"
              name="facility"
              value={formData.facility}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Pool,Gym,Spa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Policies</label>
            <input
              type="text"
              name="policies"
              value={formData.policies}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="No pets; Check-in after 2 PM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Under Maintenance">Under Maintenance</option>
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

export default PropertyAdd;
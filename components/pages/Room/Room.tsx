"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchRoomsByCommonId, updateRooms, deleteRooms } from "../../../lib/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { get } from "lodash";

type Room = {
  id: string;
  propertyName: string;
  floorName: string;
  roomNumber: string;
  roomName: string;
  roomImage: string[];
  roomType: string;
  roomTypeCustomName: string;
  isDefaultRoomType: boolean;
  bedType: string;
  roomFacility: string;
  roomRentPerDay: string;
  roomRentPerHour: string;
  maxOccupancy: string;
  isSmokingAllowed: boolean;
  roomStatus: string;
  category: string;
  discounts: string;
  amenities: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function RoomDetailsPage() {
  const { commonId } = useParams<{ commonId: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteRoom, setDeleteRoom] = useState<string | null>(null);

  const [selectedFloor, setSelectedFloor] = useState<string>("All");

  useEffect(() => {
    if (!commonId) return;

    const loadRooms = async () => {
      try {
        const data = await fetchRoomsByCommonId(commonId);
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [commonId]);

  const confirmDelete = async () => {
    if (!deleteRoom) return;

    try {
      await deleteRooms(deleteRoom);
      setRooms(prev => prev.filter(data => data.id !== deleteRoom));
      setDeleteRoom(null);
    } catch (error) {
      setError('Failed to delete the record');
    }
  };
  const floors = Array.from(new Set(rooms.map((room) => room.floorName)));


  const floorStats = floors.map((floor) => ({
    floorName: floor,
    roomCount: rooms.filter((room) => room.floorName === floor).length,
  }));

  const filteredRooms =
    selectedFloor === "All"
      ? rooms
      : rooms.filter((room) => room.floorName === selectedFloor);

  const handleEditClick = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setCurrentImageIndex(0);
    setNewImages([]);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (index: number) => {
    if (!formData.roomImage) return;

    const newImages = [...formData.roomImage];
    newImages.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      roomImage: newImages
    }));

    if (currentImageIndex >= index) {
      setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const newFiles = [...newImages];
    newFiles.splice(index, 1);
    setNewImages(newFiles);
  };

  const handleUpdate = async () => {
    if (!editingRoom) return;

    setUploading(true);
    try {
      const formDataToSend = new FormData();


      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'roomImage' && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      newImages.forEach(file => {
        formDataToSend.append('files', file);
      });


      if (formData.roomImage) {
        formData.roomImage.forEach((url: string) => {
          formDataToSend.append('existingImages', url);
        });
      }

      const response = await updateRooms(editingRoom.id, formDataToSend);

      alert("Room updated successfully!");

      setEditingRoom(null);
      setNewImages([]);


      const data = await fetchRoomsByCommonId(commonId!);
      const items = get(data, "data", [])
      setRooms(items);

    } catch (err) {

      console.error("Error updating room:", err);
      alert("Failed to update room");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading room details...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  function handleImageChange(index: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-2 mb-4 border border-gray-200">
        <div className="flex items-center flex-wrap gap-2 text-sm">
          <span className="text-gray-700 font-medium mr-2">
            Floors: {floors.length} | Rooms: {rooms.length}
          </span>

          <button
            onClick={() => setSelectedFloor("All")}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${selectedFloor === "All"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            All
          </button>

          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${selectedFloor === floor
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
          <h3 className="mt-4 text-lg font-medium text-gray-900">No rooms found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="w-full text-xs text-gray-700 border-collapse">

            <thead className="bg-blue-100 text-gray-800 font-semibold text-[11px]">
              <tr>
                <th className="px-2 py-2 border-b w-[90px] text-center whitespace-nowrap">Images</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Floor Room</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Active Status</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Room Type</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Default Type</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Smoking</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Occupancy</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Bed Type</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Category</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Offer</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Facilities</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Amenities</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Hour Price</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Day Price</th>
                <th className="px-2 py-2 border-b text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition">
                  <td className="px-2 py-2 border-b text-center">
                    <div className="w-[70px] h-[55px] rounded-md overflow-hidden border mx-auto">
                      <Slider
                        autoplay
                        autoplaySpeed={2000}
                        infinite
                        speed={600}
                        slidesToShow={1}
                        slidesToScroll={1}
                        arrows={false}
                        dots={false}
                      >
                        {room.roomImage?.map((img, index) => (
                          <div key={index} className="w-[70px] h-[55px]">
                            <img
                              src={img}
                              alt={`Room ${room.roomNumber} - ${index + 1}`}
                              className="w-full h-full object-cover"
                              draggable={false}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </td>

                  <td className="px-2 py-2 border-b text-center font-medium text-gray-800">
                    {room.floorName} {room.roomNumber}
                  </td>

                  <td className="px-2 py-2 border-b text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${room.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {room.isActive ? "Active" : "Inactive"}
                    </span>
                    <div className="text-[10px] mt-0.5">
                      {room.roomStatus === "available" ? (
                        <span className="text-green-600 font-medium">Available</span>
                      ) : (
                        <span className="text-red-600 font-medium">Occupied</span>
                      )}
                    </div>
                  </td>

                  <td className="px-2 py-2 border-b text-center">{room.roomType || "-"}</td>

                  <td className="px-2 py-2 border-b text-center">{room.isDefaultRoomType ? "Yes" : "No"}</td>
                  <td className="px-2 py-2 border-b text-center">
                    {room.isSmokingAllowed ? "Allowed" : "Not Allowed"}
                  </td>
                  <td className="px-2 py-2 border-b text-center">{room.maxOccupancy || "-"}</td>
                  <td className="px-2 py-2 border-b text-center">{room.bedType || "-"}</td>
                  <td className="px-2 py-2 border-b text-center">{room.category || "-"}</td>
                  <td className="px-2 py-2 border-b text-center text-green-600 font-medium">
                    {room.discounts || "-"}
                  </td>
                  <td className="px-2 py-2 border-b text-center">{room.roomFacility || "-"}</td>
                  <td className="px-2 py-2 border-b text-center">{room.amenities || "-"}</td>
                  <td className="px-2 py-2 border-b text-center font-bold text-blue-600">
                    ₹{room.roomRentPerHour || "0"}
                  </td>
                  <td className="px-2 py-2 border-b text-center font-bold text-blue-600">
                    ₹{room.roomRentPerDay || "0"}
                  </td>

                  <td className="px-2 py-2 border-b text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleEditClick(room)}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-[10px] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteRoom(room.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-[10px] font-medium"
                      >
                        Delete
                      </button>
                    </div>
                    {deleteRoom === room.id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                          <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Deletion
                          </h2>
                          <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this room?
                          </p>
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={confirmDelete}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-md text-sm"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteRoom(null)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-md text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}

      {editingRoom && (
        <div className="fixed inset-0 pt-80 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">

          <div className="bg-white  max-w-4xl rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Edit Room {editingRoom.roomNumber}</h2>
              <button
                onClick={() => setEditingRoom(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                X
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Room Images</h3>


                {(formData.roomImage?.length || newImages.length) ? (
                  <div className="mb-4 h-64 bg-gray-100 rounded-lg overflow-hidden">
                    {formData.roomImage?.length && currentImageIndex < formData.roomImage.length ? (
                      <img
                        src={formData.roomImage[currentImageIndex]}
                        alt={`Room ${formData.roomName} - ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover p-2"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(newImages[currentImageIndex - (formData.roomImage?.length || 0)])}
                        alt={`New image preview`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No images available
                  </div>
                )}


                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">

                  {formData.roomImage?.map((img, index) => (
                    <div key={`existing-${index}`} className="relative flex-shrink-0">
                      <button
                        onClick={() => handleImageChange(index)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                          }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <button
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >x
                      </button>
                    </div>
                  ))}
                  {newImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative flex-shrink-0">
                      <button
                        onClick={() => handleImageChange((formData.roomImage?.length || 0) + index)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === (formData.roomImage?.length || 0) + index
                          ? 'border-blue-500'
                          : 'border-transparent'
                          }`}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <button
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        x
                      </button>
                    </div>
                  ))}

                  <label className="flex-shrink-0 w-16 h-16 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                    <span className="text-2xl text-gray-400">+</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Room Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                    <input
                      name="roomName"
                      value={formData.roomName || ""}
                      onChange={handleFormChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                      <input
                        name="roomNumber"
                        value={formData.roomNumber || ""}
                        onChange={handleFormChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                      <input
                        name="roomType"
                        value={formData.roomType || ""}
                        onChange={handleFormChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rent Per Day (₹)</label>
                      <input
                        name="roomRentPerDay"
                        value={formData.roomRentPerDay || ""}
                        onChange={handleFormChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rent Per Hour (₹)</label>
                      <input
                        name="roomRentPerHour"
                        value={formData.roomRentPerHour || ""}
                        onChange={handleFormChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Occupancy</label>
                      <input
                        name="maxOccupancy"
                        value={formData.maxOccupancy || ""}
                        onChange={handleFormChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bed Type</label>
                      <input
                        name="bedType"
                        value={formData.bedType || ""}
                        onChange={handleFormChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Policy</label>
                      <select
                        name="isSmokingAllowed"
                        value={formData.isSmokingAllowed ? "true" : "false"}
                        onChange={handleFormChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="true">Allowed</option>
                        <option value="false">Not Allowed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Status</label>
                      <select
                        name="roomStatus"
                        value={formData.roomStatus || ""}
                        onChange={handleFormChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isDefaultRoomType"
                        checked={!!formData.isDefaultRoomType}
                        onChange={handleFormChange}
                        className="rounded"
                      />
                      Default Room Type
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={!!formData.isActive}
                        onChange={handleFormChange}
                        className="rounded"
                      />
                      Active
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discounts</label>
                    <input
                      name="discounts"
                      value={formData.discounts}
                      onChange={handleFormChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                    <textarea
                      name="roomFacility"
                      value={formData.roomFacility || ""}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                    <textarea
                      name="amenities"
                      value={formData.amenities || ""}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setEditingRoom(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={uploading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { ReactNode, useEffect, useState } from 'react';
import { deleteStatusMessage, fetchStatusMessageById, fetchStatusMessage } from '../../../lib/api';
 
import StatusMessageAdd from "../../forms/statusMessageAdd/Form";

type Message = { propertyId: string; Message: string };

type StatusMessageData = {
  id: string;
  clientId: string;
  propertyId: string;
  noOfTypes: number;
  statusMessage: Message[];
  
};

export default function StatusMessage() {
  const [data, setData] = useState<StatusMessageData[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [editingData, setEditingData] = useState<StatusMessageData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleOpen = () => setShowModal(true);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchStatusMessage();
      // If API returns `res.data` directly as array
      setData(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Error fetching subscription model:", err);
      setError("Failed to fetch data");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleEdit = async (id: string) => {
    try {
      const res = await fetchStatusMessageById(id);
      setEditingData(res);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch for edit', error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteStatusMessage(deleteTarget);
      setData(prev => prev.filter(item => item.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (error) {
      setError('Failed to delete the record');
    }
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const renderPropertyDetails = (item: StatusMessageData) => {
    return item.noOfFloors?.map((floor, index) => (
      <div key={index} className="mb-4 p-3 border rounded-lg bg-gray-50">
        <h4 className="font-medium text-gray-800 mb-2">
          Property ID: {floor.propertyId || `Property ${index + 1}`}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Floors:</span> {floor.floors}</div>
          <div><span className="font-medium">Rooms:</span> {item.noOfRooms?.[index]?.rooms || 'N/A'}</div>
          <div><span className="font-medium">Room Types:</span> {item.noOfRoomTypes?.[index]?.types || 'N/A'}</div>
          <div><span className="font-medium">Reports:</span> {item.noOfReportTypes?.[index]?.reports || 'N/A'}</div>
          {index === 0 && (
            <>
              <div><span className="font-medium">Status Types:</span> {item.noOfStatus?.[0]?.status || 'N/A'}</div>
              <div><span className="font-medium">Call Types:</span> {item.noOfCall?.[0]?.call || 'N/A'}</div>
              <div><span className="font-medium">Notifications:</span> {item.noOfNotification?.[0]?.notification || 'N/A'}</div>
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white rounded-t-2xl shadow-lg w-full max-w-7xl">
        <div className="mb-6 bg-blue-800 p-4 rounded-t-2xl text-white relative">
          <div className="flex items-center justify-between">
            <div className="w-1/3"></div>
            <div className="w-1/3 text-center">
              <h1 className="text-xl font-bold">Status Message</h1>
            </div>
            <div className="w-1/3 flex justify-end gap-2">
              <button
                onClick={handleOpen}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
              >
                Add
              </button>
              <button
                onClick={() => setView('table')}
                className={`px-4 py-2 rounded-lg ${view === 'table' ? 'bg-blue-700 text-white' : 'bg-blue-900 text-white'}`}
              >
                Table View
              </button>
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 rounded-lg ${view === 'grid' ? 'bg-blue-700 text-white' : 'bg-blue-900 text-white'}`}
              >
                Grid View
              </button>
            </div>
            {/* Popup Modal */}
            {showModal && (
              <div className="fixed inset-0 flex text-black items-center justify-center bg-opacity-50 z-50">
                <StatusMessageAdd
                  setShowModal={(val) => {
                    setShowModal(val);
                    if (!val) setEditingData(null);
                  }}
                  editingData={editingData}
                  onSaved={() => {
                    setShowModal(false);
                    setEditingData(null);
                    load();
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl ms-2 font-bold">Status Message</h1>

        {isLoading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No Status Message found.</div>
        ) : view === 'table' ? (
          <div className="overflow-x-auto shadow bg-white p-4 mt-2 w-full">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Plan Name</th>
                  <th className="px-6 py-4">Client ID</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Properties</th>
                  <th className="px-6 py-4">View</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data.map((item) => (
                  <>
                    <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="font-medium">{item.planDefaultName}</div>
                        <div className="text-xs text-gray-500">{item.planCustomName}</div>
                      </td>
                      <td className="px-6 py-3">{item.clientId}</td>
                      <td className="px-6 py-3">₹{item.price}</td>
                      <td className="px-6 py-3">{item.duration}</td>
                      <td className="px-6 py-3">{item.noOfProperty}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => toggleRow(item.id)}
                          className="font-bold text-blue-600 hover:text-blue-800 mr-2"
                        >
                          {expandedRows.has(item.id) ? 'Hide Details' : 'View Details'}
                        </button></td>


                      <td className="px-6 py-3 flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md shadow"
                          title="Edit"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md shadow"
                          title="Delete"
                        >
                          <MdDelete className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(item.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="space-y-3">
                            <h3 className="font-medium text-gray-800">Property Details</h3>
                            {renderPropertyDetails(item)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="p-5 border rounded-lg shadow-md bg-white flex flex-col"
              >
                <div className="text-center space-y-2 mb-4">
                  <h2 className="text-2xl font-semibold text-blue-700">{item.planDefaultName}</h2>
                  <p className="text-lg text-gray-600">{item.planCustomName}</p>
                  <div className="flex justify-center gap-4">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      ₹{item.price}
                    </span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {item.duration}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Client ID</h3>
                  <p className="text-sm">{item.clientId}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Property Details</h3>
                  {renderPropertyDetails(item)}
                </div>

                <div className="mt-auto pt-3 border-t">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete this record?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
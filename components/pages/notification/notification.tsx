'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { deleteNotification, fetchNotificationById, fetchNotification } from '../../../lib/api';
import NotificationAdd from "../../forms/notificationAdd/Form";
 

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

export default function Notification() {
  const [data, setData] = useState<NotificationData[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [editingData, setEditingData] = useState<NotificationData | null>(null);
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
      const res = await fetchNotification();
      setData(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Error fetching status messages:", err);
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
      const res = await fetchNotificationById(id);
      setEditingData(res);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch for edit', error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteNotification(deleteTarget);
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

  const renderNotifications = (notifications: NotificationItem[]) => {
    return notifications.map((message, index) => (
      <div key={index} className="mb-4 p-3 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <span className="font-medium">Default Name:</span> {message.defaultNotificationName}
          </div>
          <div>
            <span className="font-medium">Custom Name:</span> {message.customNotificationName}
          </div>
          <div>
            <span className="font-medium">Default Name:</span> {message.defaultActionName}
          </div>
          <div>
            <span className="font-medium">Custom Name:</span> {message.customActionName}
          </div>
          <div>
            <span className="font-medium">Status:</span> 
            {message.isEnableOrDisable ? ' Disabled' : ' Enabled'}
          </div>
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
              <h1 className="text-xl font-bold">Notification </h1>
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
            {showModal && (
              <div className="fixed inset-0 flex text-black items-center justify-center bg-opacity-50 z-50">
                <NotificationAdd
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

        <h1 className="text-2xl ms-2 font-bold">Notification</h1>

        {isLoading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No Notification found.</div>
        ) : view === 'table' ? (
          <div className="overflow-x-auto shadow bg-white p-4 mt-2 w-full">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Client Id</th>
                  <th className="px-6 py-4">Property Id</th>
                  <th className="px-6 py-4">No Of Types</th>
                  <th className="px-6 py-4">View</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data.map((item) => (
                  <>
                    <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="font-medium">{item.clientId}</div>
                        
                      </td>
                      <td className="px-6 py-3">{item.propertyId}</td>
                      <td className="px-6 py-3">{item.noOfTypes}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => toggleRow(item.id)}
                          className="font-bold text-blue-600 hover:text-blue-800 mr-2"
                        >
                          {expandedRows.has(item.id) ? 'Hide Details' : 'View Details'}
                        </button>
                      </td>
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
                            <h3 className="font-medium text-gray-800">Status Messages</h3>
                            {renderNotifications(item.notification)}
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
                  <h2 className="text-xl font-semibold text-blue-700">Status Messages</h2>
                  <div className="flex justify-center gap-4">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Types: {item.noOfTypes}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Client ID</h3>
                  <p className="text-sm">{item.clientId}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Property ID</h3>
                  <p className="text-sm">{item.propertyId}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Status Messages</h3>
                  {renderNotifications(item.notification)}
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
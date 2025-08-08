'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { ReactNode, useEffect, useState } from 'react';
import { deleteSubscriptioModel, fetchSubscriptioModelById, fetchSubscriptioModel } from '../../../lib/api';

type Floor = { floors: string };
type Room = { rooms: string };
type RoomType = { types: string };
type ReportType = { reports: string };
type Status = { status: string };
type Call = { call: string };
type Notification = { notification: string };

type SubscriptionModelData = {
  priority: ReactNode;
  deadline: any;
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
  noOfStatus: Status[];
  noOfCall: Call[];
  noOfNotification: Notification[];
};

export default function SubscriptionModel() {
  const [data, setData] = useState<SubscriptionModelData[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [editingData, setEditingData] = useState<SubscriptionModelData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleOpen = () => setShowModal(true);

const load = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const res = await fetch("http://192.168.1.14:8000/api/v1/subscription-model/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    setData(json.data);
  } catch (err) {
    console.error("Error fetching subscription model:", err);
    setError("Failed to fetch data");
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    load();
  }, []);

  const handleEdit = async (id: string) => {
    try {
      const res = await fetchSubscriptioModelById(id);
      setEditingData(res);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch for edit', error);
    }
  };
  // Delete handler
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteSubscriptioModel(deleteTarget);
      setData(prev => prev.filter(item => item.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (error) {

      setError('Failed to delete the record');
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white  rounded-t-2xl shadow-lg  w-full max-w-7xl">
        <div className="mb-6 bg-blue-800 p-4 rounded-t-2xl text-white relative">
          <div className="flex items-center justify-between">
            <div className="w-1/3"></div>

            <div className="w-1/3 text-center">
              <h1 className="text-xl font-bold"> subscription Model </h1>
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
                {/* <subscriptionModelAdd
                  setShowModal={(val) => {
                    setShowModal(val);
                    if (!val) setEditingData(null); // clear editing data on close
                  }}
                  editingData={editingData}
                  onSaved={() => {
                    setShowModal(false);
                    setEditingData(null);
                    load();
                  }}
                /> */}
              </div>
            )}
          </div>
        </div>
        <h1 className="text-2xl ms-2 font-bold"> subscription Model</h1>
        {isLoading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No subscription Model found.</div>
        ) : view === 'table' ? (
          <div className="overflow-x-auto  shadow bg-white p-4 mt-2">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">clientId</th>
                  <th className="px-6 py-4">planDefaultName</th>
                  <th className="px-6 py-4">planCustomName</th>
                  <th className="px-6 py-4">price</th>
                  <th className="px-6 py-4">duration</th>
                  <th className="px-6 py-4">noOfProperty</th>
                  <th className="px-6 py-4">noOfFloors</th>
                  <th className="px-6 py-4">noOfRooms</th>
                  <th className="px-6 py-4">noOfRoomTypes</th>
                  <th className="px-6 py-4">noOfReportTypes</th>
                  <th className="px-6 py-4">noOfStatus</th>
                  <th className="px-6 py-4">noOfCall</th>
                  <th className="px-6 py-4">noOfNotification</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">

                    <td className="px-6 py-3">{item.clientId}</td>
                    <td className="px-6 py-3">{item.planDefaultName}</td>
                    <td className="px-6 py-3">{item.planCustomName}</td>
                    <td className="px-6 py-3">{item.price}</td>
                    <td className="px-6 py-3">{item.duration}</td>
                    <td className="px-6 py-3">{item.noOfProperty}</td>
                    <td className="px-6 py-3">
                      {item.noOfFloors?.map(f => f.floors).join(', ')}
                    </td>
                    <td className="px-6 py-3">
                      {item.noOfRooms?.map(r => r.rooms).join(', ')}
                    </td>
                    <td className="px-6 py-3">
                      {item.noOfRoomTypes?.map(t => t.types).join(', ')}
                    </td>
                    <td className="px-6 py-3">
                      {item.noOfReportTypes?.map(rt => rt.reports).join(', ')}
                    </td>
                    <td className="px-6 py-3">
                      {item.noOfStatus?.map(s => s.status).join(', ')}
                    </td>
                    <td className="px-6 py-3">
                      {item.noOfCall?.map(c => c.call).join(', ')}
                    </td>
                    <td className="px-6 py-3">
                      {item.noOfNotification?.map(n => n.notification).join(', ')}
                    </td>

                    <td className="px-6 py-3 flex rounded-b-2xl items-center gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md shadow transition duration-200"
                        title="Edit"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md shadow transition duration-200"
                        title="Delete"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="p-5 border rounded-lg shadow-md bg-white flex flex-col justify-between space-y-4"
              >

                <div className=" text-center items-center space-y-2">
                  <h2 className="text-2xl font-semibold text-blue-700">{item.planDefaultName}</h2>
                  <p className="text-lg text-gray-600">{item.planCustomName}</p>
                </div>


                <div className="space-y-1">
                  <p className="text-sm text-gray-700"><span className="font-medium">clientId:</span> {item.clientId}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">price:</span> {item.price}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">duration:</span> {item.duration}</p>
                </div>

                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No. of Property:</span> {item.noOfProperty}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No. of Floors:</span> {item.noOfFloors?.map(f => f.floors).join(', ')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No. of Rooms:</span> {item.noOfRooms?.map(r => r.rooms).join(', ')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No. of Room Types:</span> {item.noOfRoomTypes?.map(t => t.types).join(', ')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No. of Report Types:</span> {item.noOfReportTypes?.map(rt => rt.reports).join(', ')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No. of Status:</span> {item.noOfStatus?.map(s => s.status).join(', ')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No. of Calls:</span> {item.noOfCall?.map(c => c.call).join(', ')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No. of Notifications:</span> {item.noOfNotification?.map(n => n.notification).join(', ')}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Deadline:</span> {item.deadline?.split('T')[0]}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Priority:</span> {item.priority}
                  </p>
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

'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { useEffect, useState } from 'react';
import { deleteTaskSheet, fetchTaskSheetById, fetchTaskSheet } from '../../../lib/api';
import TaskSheetAdd from "../../forms/taskSheetAdd/Form";

type taskSheetData = {

  id: string;
  clientId: string;
  propertyId: string;
  taskType: string;
  taskMessage: string;
  roomNo: string;
  houseKeeper: string;
  taskGivenBy: string;
  taskCompletedBy: string;
  taskStatus: string;
  taskAssignDate: string;
  taskCompletionDate: string;
  deadline: string;
  priority: string;
};

export default function TaskSheet() {
  const [data, setData] = useState<taskSheetData[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [editingData, setEditingData] = useState<taskSheetData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleOpen = () => setShowModal(true);


  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTaskSheet();
      setData(res.data);
    } catch (err) {
      console.error('Error fetching task sheets:', err);
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = async (id: string) => {
    try {
      const res = await fetchTaskSheetById(id);
      setEditingData(res);
      setShowModal(true);   // open after data is set
    } catch (error) {
      console.error('Failed to fetch for edit', error);
    }
  };
  // Delete handler
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteTaskSheet(deleteTarget);
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
              <h1 className="text-xl font-bold"> Task Management </h1>
            </div>

            <div className="w-1/3 flex justify-end gap-2">
              <button
                onClick={handleOpen}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
              >
                Add Owner
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
                <TaskSheetAdd
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
                />
              </div>
            )}
          </div>
        </div>
        <h1 className="text-2xl ms-2 font-bold"> Task Sheets</h1>
        {isLoading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No task sheets found.</div>
        ) : view === 'table' ? (
          <div className="overflow-x-auto  shadow bg-white p-4 mt-2">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">clientId</th>
                  <th className="px-6 py-4">propertyId</th>
                  <th className="px-6 py-4">taskType</th>
                  <th className="px-6 py-4">taskMessage</th>
                  <th className="px-6 py-4">roomNo</th>
                  <th className="px-6 py-4">houseKeeper</th>
                  <th className="px-6 py-4">taskGivenBy</th>
                  <th className="px-6 py-4">taskCompletedBy</th>
                  <th className="px-6 py-4">taskStatus</th>
                  <th className="px-6 py-4">taskAssignDate</th>
                  <th className="px-6 py-4">taskCompletionDate</th>
                  <th className="px-6 py-4">priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">

                    <td className="px-6 py-3">{item.clientId}</td>
                    <td className="px-6 py-3">{item.propertyId}</td>
                    <td className="px-6 py-3">{item.taskType}</td>
                    <td className="px-6 py-3">{item.taskMessage}</td>
                    <td className="px-6 py-3">{item.roomNo}</td>
                    <td className="px-6 py-3">{item.houseKeeper}</td>
                    <td className="px-6 py-3">{item.taskGivenBy}</td>
                    <td className="px-6 py-3">{item.taskCompletedBy}</td>
                    <td className="px-6 py-3">{item.taskStatus}</td>
                    <td className="px-6 py-3">{item.taskAssignDate?.split('T')[0]}</td>
                    <td className="px-6 py-3">{item.taskCompletionDate?.split('T')[0]}</td>
                    <td className="px-6 py-3">{item.deadline?.split('T')[0]}</td>
                    <td className="px-6 py-3">{item.priority}</td>
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
                  <h2 className="text-2xl font-semibold text-blue-700">{item.taskType}</h2>
                  <p className="text-lg text-gray-600">{item.roomNo}</p>
                </div>


                <div className="space-y-1">
                  <p className="text-sm text-gray-700"><span className="font-medium">clientId:</span> {item.clientId}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">propertyId:</span> {item.propertyId}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">taskMessage:</span> {item.taskMessage}</p>
                </div>

                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <p className="text-sm text-gray-700"><span className="font-medium">houseKeeper:</span> {item.houseKeeper}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">taskGivenBy:</span> {item.taskGivenBy}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">taskCompletedBy:</span> {item.taskCompletedBy}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">taskStatus:</span> {item.taskStatus}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">taskAssignDate:</span> {item.taskAssignDate?.split('T')[0]}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">taskCompletionDate:</span> {item.taskCompletionDate?.split('T')[0]}</p>
                </div>

                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <p className="text-sm text-gray-700"><span className="font-medium">deadline:</span> {item.deadline?.split('T')[0]}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">priority:</span> {item.priority}</p>
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

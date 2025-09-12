'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { deleteChargesRegister, fetchChargesRegisterById, fetchChargesRegister } from '../../../lib/api';
import ChargesRegisterForm from "../../forms/chargesRegisterAdd/Form";
import { get } from "lodash";

type ChargesRegisterData = {
  id: string,
  clientId: string,
  propertyId: string,
  chargeDate: string,
  planName: string,
  chargeName: string,
  refNo: string,
  rate: string,
  quantity: string,
  amount: string,
  remark: string,
  createdAt: string,
  updatedAt: string
};

export default function ChargesRegister() {
  const [data, setData] = useState<ChargesRegisterData[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [editingData, setEditingData] = useState<ChargesRegisterData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleOpen = () => setShowModal(true);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchChargesRegister();
      const items = get(res, 'data', []);
      setData(items);
    } catch (err) {
      console.error('Error fetching charges register:', err);
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = async (id: string) => {
    console.log("Edit clicked for ID:", id);
    try {
      const res = await fetchChargesRegisterById(id);
      const item = get(res, 'data', res);

      if (item) {
        setEditingData(item);
        setShowModal(true);
      } else {
        console.error('No data returned for ID:', id);
      }
    } catch (error) {
      console.error('Failed to fetch for edit', error);
    }
  };
  // Delete handler
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteChargesRegister(deleteTarget);
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
              <h1 className="text-xl font-bold">Charges Register </h1>
            </div>

            <div className="w-1/3 flex justify-end gap-2">
              <button
                onClick={handleOpen}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
              >
                Add Charges Register
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
                <ChargesRegisterForm
                  setShowModal={(val) => {
                    setShowModal(val);
                    if (!val) setEditingData(null);
                  }}
                  editingData={editingData}
                  onSaved={() => {
                    setShowModal(false);
                    setEditingData(null);
                    load(); // reload after save
                  }}
                />
              </div>
            )}

          </div>
        </div>
        <h1 className="text-2xl ms-2 font-bold">Charges Register</h1>
        {isLoading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hotel owners found.</div>
        ) : view === 'table' ? (
          <div className="overflow-x-auto  shadow bg-white p-4 mt-2">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">clientId</th>
                  <th className="px-6 py-4">propertyId</th>
                  <th className="px-6 py-4">chargeDate</th>
                  <th className="px-6 py-4">planName</th>
                  <th className="px-6 py-4">chargeName</th>
                  <th className="px-6 py-4">refNo</th>
                  <th className="px-6 py-4">rate</th>
                  <th className="px-6 py-4">quantity</th>
                  <th className="px-6 py-4">amount</th>
                  <th className="px-6 py-4">remark</th>
                  <th className="px-6 py-4">createdAt</th>
                  <th className="px-6 py-4">updatedAt</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">

                    <td className="px-6 py-3">{item.clientId}</td>
                    <td className="px-6 py-3">{item.propertyId}</td>
                    <td className="px-6 py-3">{item.chargeDate?.split('T')[0]}</td>
                    <td className="px-6 py-3">{item.planName}</td>
                    <td className="px-6 py-3">{item.chargeName}</td>
                    <td className="px-6 py-3">{item.refNo}</td>
                    <td className="px-6 py-3">{item.rate}</td>
                    <td className="px-6 py-3">{item.quantity}</td>
                    <td className="px-6 py-3">{item.amount}</td>
                    <td className="px-6 py-3">{item.remark}</td>
                    <td className="px-6 py-3">{item.createdAt?.split('T')[0]}</td>
                    <td className="px-6 py-3">{item.updatedAt?.split('T')[0]}</td>
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
                  <h2 className="text-2xl font-semibold text-blue-700">{item.clientId}</h2>
                  <p className="text-lg text-gray-600">{item.propertyId}</p>
                </div>


                <div className="space-y-1">
                  <p className="text-sm text-gray-700"><span className="font-medium">chargeDate :</span> {item.chargeDate?.split('T')[0]}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">planName :</span> {item.planName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700"><span className="font-medium">refNo :</span> {item.refNo}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">rate :</span> {item.rate}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">quantity :</span> {item.quantity}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">amount :</span> {item.amount}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">remark :</span> {item.remark}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">createdAt :</span> {item.createdAt?.split('T')[0]}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">updatedAt :</span> {item.updatedAt?.split('T')[0]}</p>
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

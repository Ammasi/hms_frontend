'use client';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import HotelOwnerAdd from '../../forms/hotelOwnerAdd/Form';
import { deleteHotelOwner, fetchHotelOwnerById, fetchSubscriptions } from '../../../lib/api';

type SubscriptionData = {
  id: string;
  companyName: string;
  clientName: string;
  clientEmail: string;
  clientMobileNo: string;
  gst: string;
  currency: string;
  subscription: string;
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  clientAddress: string;
  clientDocuments: string;
  status: string;
  noOfHotels: number;
  subscriptionDuration: string;
  propertyCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function HotelManagement() {
  const [data, setData] = useState<SubscriptionData[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [editingData, setEditingData] = useState<SubscriptionData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData =
    pageSize === -1 ? data : data.slice((page - 1) * pageSize, page * pageSize);

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? -1 : parseInt(e.target.value, 10);
    setPageSize(value);
    setPage(1);
  };

  const handleOpen = () => setShowModal(true);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchSubscriptions();
      setData(res.data);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
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
      const res = await fetchHotelOwnerById(id);
      setEditingData(res);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch for edit', error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteHotelOwner(deleteTarget);
      setData(prev => prev.filter(item => item.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (error) {
      setError('Failed to delete the record');
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white rounded-t-2xl shadow-lg w-full max-w-7xl">
        <div className="mb-6 bg-blue-800 p-4 rounded-t-2xl text-white relative">
          <div className="flex items-center justify-between">
            <div className="w-1/3"></div>
            <div className="w-1/3 text-center">
              <h1 className="text-xl font-bold">Hotel Management Software</h1>
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
                className={`px-4 py-2 rounded-lg ${view === 'table' ? 'bg-blue-700' : 'bg-blue-900'} text-white`}
              >
                Table View
              </button>
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 rounded-lg ${view === 'grid' ? 'bg-blue-700' : 'bg-blue-900'} text-white`}
              >
                Grid View
              </button>
            </div>
            {showModal && (
              <div className="fixed inset-0 flex text-black items-center justify-center bg-opacity-50 z-50">
                <HotelOwnerAdd
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

        <h1 className="text-2xl ms-2 font-bold">Hotel Owners</h1>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 mb-4 gap-3">
          <div>
            <label className="text-sm text-gray-600 font-medium mr-2">Show:</label>
            <select
              value={pageSize === -1 ? 'all' : pageSize}
              onChange={handlePageSizeChange}
              className="p-1 rounded border border-gray-300 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded bg-blue-700 text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page {page} of {totalPages || 1}</span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 text-sm rounded bg-blue-700 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hotel owners found.</div>
        ) : view === 'table' ? (
          <div className="overflow-x-auto shadow bg-white p-4 mt-2">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Company Name</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">GST</th>
                  <th className="px-6 py-4">Currency</th>
                  <th className="px-6 py-4">Subscription</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">End</th>
                  <th className="px-6 py-4">Docs</th>
                  <th className="px-6 py-4"># Hotels</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Count</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {paginatedData.map(item => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">{item.companyName}</td>
                    <td className="px-6 py-3">{item.clientName}</td>
                    <td className="px-6 py-3">{item.clientAddress}</td>
                    <td className="px-6 py-3">{item.clientEmail}</td>
                    <td className="px-6 py-3">{item.clientMobileNo}</td>
                    <td className="px-6 py-3">{item.gst}</td>
                    <td className="px-6 py-3">{item.currency}</td>
                    <td className="px-6 py-3">{item.subscription}</td>
                    <td className="px-6 py-3">{item.subscriptionStatus}</td>
                    <td className="px-6 py-3">{item.subscriptionStartDate?.split('T')[0]}</td>
                    <td className="px-6 py-3">{item.subscriptionEndDate?.split('T')[0]}</td>
                    <td className="px-6 py-3">{item.clientDocuments}</td>
                    <td className="px-6 py-3">{item.noOfHotels}</td>
                    <td className="px-6 py-3">{item.subscriptionDuration}</td>
                    <td className="px-6 py-3">{item.propertyCount}</td>
                    <td className="px-6 py-3">{item.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      <button onClick={() => handleEdit(item.id)} className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md">
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button onClick={() => setDeleteTarget(item.id)} className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md">
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
            {paginatedData.map(item => (
              <div key={item.id} className="p-5 border rounded-lg shadow-md bg-white space-y-3">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-blue-700">{item.companyName}</h2>
                  <p className="text-gray-600">{item.clientName}</p>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><b>Email:</b> {item.clientEmail}</p>
                  <p><b>Mobile:</b> {item.clientMobileNo}</p>
                  <p><b>Address:</b> {item.clientAddress}</p>
                  <p><b>Subscription:</b> {item.subscription}</p>
                  <p><b>Duration:</b> {item.subscriptionDuration}</p>
                  <p><b>Currency:</b> {item.currency}</p>
                  <p><b>Start:</b> {item.subscriptionStartDate?.split('T')[0]}</p>
                  <p><b>End:</b> {item.subscriptionEndDate?.split('T')[0]}</p>
                  <p><b>Status:</b> {item.subscriptionStatus}</p>
                  <p><b>GST:</b> {item.gst}</p>
                  <p><b>Documents:</b> {item.clientDocuments}</p>
                  <p><b>Active:</b> {item.isActive ? 'Yes' : 'No'}</p>
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
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md">Yes</button>
              <button onClick={() => setDeleteTarget(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

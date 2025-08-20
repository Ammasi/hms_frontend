'use client';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Home,
  ListChecks,
  BadgeCheck,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { deleteHotelOwner, fetchHotelOwnerById, fetchSubscriptions } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { get } from "lodash";
import ClientAdd from '../../forms/ClientAdd/Form';

type ClientList = {
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
  clientDocuments: File[] | string[];
  status: string;
  noOfHotels: number;
  subscriptionDuration: string;
  propertyCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ClientList() {
  const [data, setData] = useState<ClientList[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [editingData, setEditingData] = useState<ClientList | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();
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
      const items = get(res, 'data', [])

      setData(items);
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
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-7xl">
        <div className=" bg-blue-800 p-2 rounded-t-2xl text-white relative">
          <div className="flex items-center justify-between">
            <div className="w-1/3"></div>
            <div className="w-1/3 text-center">
              <h1 className=" font-bold">Client List</h1>
            </div>
            <div className="w-1/2 flex justify-end gap-2">
              <button
                onClick={handleOpen}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
              >
                Add
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
                <ClientAdd
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

        {isLoading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-8 rounded-2xl text-gray-500">No  Client List found.</div>
        ) : view === 'table' ? (
          <div className=' rounded-2xl'>
            <div className="overflow-x-auto shadow-md rounded-2xl bg-white mt-4">
              <table className="min-w-full text-sm text-gray-700">
                {/* ====== Table Header ====== */}
                <thead className="bg-blue-100 text-gray-800 font-semibold text-[11px]">
                  <tr>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Company</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Client</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Address</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Email</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Mobile</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">GST</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Currency</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Subscription</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Status</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Start</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">End</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Hotels</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Duration</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Count</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Active</th>
                    <th className="px-3 py-3 whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                {/* ====== Table Body ====== */}
                <tbody className="text-sm divide-y divide-gray-200   text-[11px]">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition cursor-pointer`}
                      onClick={() => router.push(`/properties/${item.id}`)}
                    >
                      {/* Company */}
                      <td className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap max-w-[180px] overflow-x-auto">
                        <div className="flex items-center justify-center h-full">
                          <div className="truncate text-center">{item.companyName}</div>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">{item.clientName}</td>

                      {/* Address */}
                      <td className="px-3 py-3 whitespace-nowrap max-w-[200px] overflow-x-auto">
                        <div className="flex items-center justify-center h-full">
                          <div className="truncate text-center">{item.clientAddress}</div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-3 py-3 whitespace-nowrap max-w-[180px] overflow-x-auto text-blue-600">
                        <div className="flex items-center justify-center h-full">
                          <div className="truncate text-center">{item.clientEmail}</div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">{item.clientMobileNo}</td>

                      {/* GST */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">{item.gst}</td>

                      {/* Currency */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">{item.currency}</td>

                      {/* Subscription */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">{item.subscription}</td>

                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="flex justify-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.subscriptionStatus === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}>
                            {item.subscriptionStatus}
                          </span>
                        </div>
                      </td>

                      {/* Start Date */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {item.subscriptionStartDate?.split("T")[0]}
                      </td>

                      {/* End Date */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {item.subscriptionEndDate?.split("T")[0]}
                      </td>



                      {/* Hotels */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">{item.noOfHotels}</td>

                      {/* Duration */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">{item.subscriptionDuration}</td>

                      {/* Count */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">{item.propertyCount}</td>

                      {/* Active */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {item.isActive ? (
                          <span className="text-green-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-red-600 font-semibold">No</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-3 py-3 whitespace-nowrap text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-100 transition"
                            title="Edit"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item.id)}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-100 transition"
                            title="Delete"
                          >
                            <MdDelete className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col rounded-2xl md:flex-row md:items-center justify-between p-4">
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
          </div>
        ) : (
          <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedData.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/properties/${item.id}`)}
                className="p-5 rounded-lg shadow-md bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-blue-300"
              >
                {/* Header Section */}
                <div className="text-center mb-4">
                  <h2 className="text-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-2xl font-bold shadow-sm">
                    {item.companyName}
                  </h2>
                  <p className="text-gray-700 font-semibold mt-2 flex justify-center items-center gap-1">
                    <Building2 className="w-4 h-4 text-blue-600" /> {item.clientName}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="bg-white p-4 rounded-lg mb-4 space-y-2 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium min-w-[60px]">Email:</span>
                    <span className="text-gray-700 truncate">{item.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium min-w-[60px]">Mobile:</span>
                    <span className="text-gray-700">{item.clientMobileNo}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-blue-600 font-medium min-w-[60px]">Address:</span>
                    <span className="text-gray-700 line-clamp-2">{item.clientAddress}</span>
                  </div>
                </div>

                {/* Hotels Info */}
                <div className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
                  <h3 className="font-bold text-blue-600 mb-2 border-b border-gray-200 pb-1 flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" /> Hotels
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <ListChecks className="inline w-4 h-4 mr-1 text-blue-500" />
                      No Of Hotels: {item.noOfHotels}
                    </div>
                    <div>
                      <Building2 className="inline w-4 h-4 mr-1 text-blue-500" />
                      Property Count: {item.propertyCount}
                    </div>
                    <div>
                      <BadgeCheck className="inline w-4 h-4 mr-1 text-blue-500" />
                      Status: {item.status}
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
                  <h3 className="font-bold text-blue-600 mb-2 border-b border-gray-200 pb-1 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> Subscription Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <FileText className="inline w-4 h-4 mr-1 text-blue-500" />
                      Plan: {item.subscription}
                    </div>
                    <div>
                      <Calendar className="inline w-4 h-4 mr-1 text-blue-500" />
                      Duration: {item.subscriptionDuration}
                    </div>
                    <div>
                      <DollarSign className="inline w-4 h-4 mr-1 text-blue-500" />
                      Currency: {item.currency}
                    </div>
                    <div>
                      <ShieldCheck className="inline w-4 h-4 mr-1 text-blue-500" />
                      Status:
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full text-xs ${item.subscriptionStatus === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.subscriptionStatus}
                      </span>
                    </div>
                    <div>
                      <Calendar className="inline w-4 h-4 mr-1 text-blue-500" />
                      Start: {item.subscriptionStartDate?.split("T")[0]}
                    </div>
                    <div>
                      <Calendar className="inline w-4 h-4 mr-1 text-blue-500" />
                      End: {item.subscriptionEndDate?.split("T")[0]}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-600 font-medium flex items-center gap-1">
                      <FileText className="w-4 h-4 text-blue-600" /> GST:
                    </span>
                    <span className="text-gray-700">{item.gst || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-blue-600" /> Active:
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.isActive ? (
                        <CheckCircle2 className="inline w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="inline w-3 h-3 mr-1" />
                      )}
                      {item.isActive ? "Yes" : "No"}
                    </span>
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
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md">Yes</button>
              <button onClick={() => setDeleteTarget(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

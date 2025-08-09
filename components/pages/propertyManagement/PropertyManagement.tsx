'use client';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { deleteProperty, fetchPropertyById, fetchProperty } from '../../../lib/api';
import PropertyAdd from '../../forms/propertyManagementAdd/Form';

interface Floor {
  defaultName: string;
  customName?: string;
  roomCount: number;
}

interface RoomType {
  defaultName: string;
  customName?: string;
}

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
  floors: Floor[];
  roomTypes: RoomType[];
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

export default function PropertyManagement() {
  const [data, setData] = useState<PropertyData[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [editingData, setEditingData] = useState<PropertyData | null>(null);
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
      const res = await fetchProperty();
      setData(res.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
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
      const res = await fetchPropertyById(id);
      setEditingData(res);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch for edit', error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteProperty(deleteTarget);
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
              <h1 className="text-xl font-bold">Property Management</h1>
            </div>
            <div className="w-1/3 flex justify-end gap-2">
              <button
                onClick={handleOpen}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
              >
                Add Property
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
                <PropertyAdd
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

        <h1 className="text-2xl ms-2 font-bold">Properties</h1>

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
          <div className="text-center py-8 text-gray-500">No properties found.</div>
        ) : view === 'table' ? (
          <div className="overflow-x-auto shadow bg-white p-4 mt-2">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Client ID</th>
                  <th className="px-6 py-4">Property Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">CreateCount</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Ground Floor</th>
                  <th className="px-6 py-4">No Of Floors</th>
                  <th className="px-6 py-4">Room Type Count</th>
                  <th className="px-6 py-4">Floors</th>
                  <th className="px-6 py-4">roomTypes</th>
                  <th className="px-6 py-4">city</th>
                  <th className="px-6 py-4">pinCode</th>
                  <th className="px-6 py-4">starRating</th>
                  <th className="px-6 py-4">totalRooms</th>
                  <th className="px-6 py-4">facility</th>
                  <th className="px-6 py-4">policies</th>
                  <th className="px-6 py-4">status</th>
                  <th className="px-6 py-4">commonId</th>
                  <th className="px-6 py-4">createdAt</th>
                  <th className="px-6 py-4">updatedAt</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {paginatedData.map(item => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">{item.clientId}</td>
                    <td className="px-6 py-3">{item.propertyName}</td>
                    <td className="px-6 py-3">{item.propertyType}</td>
                    <td className="px-6 py-3">{item.propertyCreateCount}</td>
                    <td className="px-6 py-3">{item.propertyContact}</td>
                    <td className="px-6 py-3">{item.propertyEmail}</td>
                    <td className="px-6 py-3">
                      {item.propertyImage ? (
                        <img
                          src={item.propertyImage}
                          alt="Property"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )}
                    </td>

                    <td className="px-6 py-3">{item.propertyAddress}</td>
                    <td className="px-6 py-3">{item.includeGroundFloor}</td>
                    <td className="px-6 py-3">{item.noOfFloors}</td>
                    <td className="px-6 py-3">{item.roomTypeCount}</td>
                    <td className="px-6 py-3">
                      {item.floors.map((f, i) => (
                        <div key={i}>
                          {f.customName || f.defaultName} ({f.roomCount})
                        </div>
                      ))}
                    </td>

                    <td className="px-6 py-3">
                      {Array.isArray(item.roomTypes) && item.roomTypes.length > 0
                        ? item.roomTypes.map((r, i) => <div key={i}>{r.defaultName}</div>)
                        : '-'}
                    </td>

                    <td className="px-6 py-3">{item.city}</td>
                    <td className="px-6 py-3">{item.pinCode}</td>
                    <td className="px-6 py-3">{item.starRating}</td>
                    <td className="px-6 py-3">{item.totalRooms}</td>
                    <td className="px-6 py-3">{item.facility}</td>
                    <td className="px-6 py-3">{item.policies}</td>
                    <td className="px-6 py-3">{item.status}</td>
                    <td className="px-6 py-3">{item.commonId}</td>
                    <td className="px-6 py-3">{item.createdAt?.split('T')[0]}</td>
                    <td className="px-6 py-3">{item.updatedAt?.split('T')[0]}</td>
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
                  <h2 className="text-xl font-bold text-blue-700">{item.propertyType}</h2>
                  <p className="text-gray-600">{item.propertyName}</p>
                </div>
                <div className="text-sm text-gray-700 space-y-1">

                  <p><b>CreateCount:</b> {item.clientId}</p>
                  <p><b>CreateCount:</b> {item.propertyContact}</p>
                  <p><b>Contact:</b> {item.propertyContact}</p>
                  <p><b>Email:</b> {item.propertyEmail}</p>
                  <p><b>Image:</b></p>
                  {item.propertyImage ? (
                    <img
                      src={item.propertyImage}
                      alt="Property"
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ) : (
                    <p className="text-gray-400 italic">No Image</p>
                  )}

                  <p><b>Address:</b> {item.propertyAddress}</p>
                  <p><b>Ground Floor:</b> {item.includeGroundFloor}</p>
                  <p><b>No Of Floors :</b> {item.noOfFloors}</p>
                  <p><b>Room Type Count :</b> {item.roomTypeCount}</p>
                  <p><b>Floors:</b> {item.floors.map(f => f.customName || f.defaultName).join(', ')}</p>
                  <p><b>Room Types:</b> {item.roomTypes.map(r => r.defaultName).join(', ')}</p>

                  <p><b>city :</b> {item.city}</p>
                  <p><b>pinCode :</b> {item.pinCode}</p>
                  <p><b>starRating :</b> {item.starRating}</p>
                  <p><b>totalRooms :</b> {item.totalRooms}</p>
                  <p><b>facility :</b> {item.facility}</p>
                  <p><b>policies :</b> {item.policies}</p>
                  <p><b>status :</b> {item.status}</p>
                  <p><b>commonId :</b> {item.commonId}</p>
                  <p><b>createdAt :</b> {item.createdAt?.split('T')[0]}</p>
                  <p><b>updatedAt :</b> {item.updatedAt?.split('T')[0]}</p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <button onClick={() => handleEdit(item.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md">
                    <FaEdit className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">
                    <MdDelete className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete this property?</h2>
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
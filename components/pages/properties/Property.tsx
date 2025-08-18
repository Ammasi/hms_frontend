"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteProperty, fetchHotelOwnerById, fetchProperty, fetchPropertyById } from "../../../lib/api";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import PropertyAdd from "../../forms/propertyManagementAdd/Form";
import { get } from 'lodash';

type ClientDetails = {
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


interface Floor {
    defaultName: string;
    customName?: string;
    roomCount: number;
}

interface RoomType {
    isDefault(isDefault: any): import("react").ReactNode;
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

export default function PropertyDetails() {
    const { propertyId } = useParams<{ propertyId: string }>();
    const [client, setClient] = useState<ClientDetails | null>(null);
    const [loading, setLoading] = useState(true);


    const [data, setData] = useState<PropertyData[]>([]);
    const [view, setView] = useState<'table' | 'grid'>('table');
    const [editingData, setEditingData] = useState<PropertyData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData =
        pageSize === -1 ? data : data.slice((page - 1) * pageSize, page * pageSize);

    useEffect(() => {
        if (!propertyId) return;

        const loadData = async () => {
            try {
                const res = await fetchHotelOwnerById(propertyId);
                setClient(res);
            } catch (err) {
                console.error("Error fetching client details:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [propertyId]);


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
            const propertyData = get(res, 'data', []);
            // Filter by the given ID
            const filteredData = propertyData.filter(
                (item: { clientId: string; id: string }) => item.clientId === propertyId
            );
            setData(filteredData);
        } catch (err) {
            console.error("Error fetching properties:", err);
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

    if (loading) {
        return <div className="p-6 text-gray-600">Loading...</div>;
    }

    if (!client) {
        return <div className="p-6 text-red-500">No client found.</div>;
    }

    return (
        <div className="bg-gray-50 p-6 min-h-screen">
            {/* Client Details */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 mb-8">
                <div className="text-center font-semibold text-lg text-gray-800 border-b pb-2">Client Details</div>
                <h1 className="text-2xl font-bold mb-4 text-blue-800 text-center">{client.companyName}</h1>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-gray-700 mt-4">
                    <p><span className="font-semibold text-gray-800">Client Name:</span> {client.clientName}</p>
                    <p><span className="font-semibold text-gray-800">Email:</span> {client.clientEmail}</p>
                    <p><span className="font-semibold text-gray-800">Mobile:</span> {client.clientMobileNo}</p>
                    <p><span className="font-semibold text-gray-800">GST:</span> {client.gst}</p>
                    <p><span className="font-semibold text-gray-800">Currency:</span> {client.currency}</p>
                    <p><span className="font-semibold text-gray-800">Address:</span> {client.clientAddress}</p>
                    <p><span className="font-semibold text-gray-800">Status:</span> {client.status}</p>
                    <p><span className="font-semibold text-gray-800">Property Count:</span> {client.propertyCount}</p>
                    <p><span className="font-semibold text-gray-800">Subscription:</span> {client.subscription}</p>
                    <p><span className="font-semibold text-gray-800">Subscription Status:</span> {client.subscriptionStatus}</p>
                    <p><span className="font-semibold text-gray-800">Duration:</span> {client.subscriptionDuration}</p>
                    <p><span className="font-semibold text-gray-800">Documents:</span> {client.clientDocuments}</p>
                </div>
            </div>

            {/* Property Section */}
            <div className="flex flex-col items-center">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl overflow-hidden">
                    {/* Top Bar */}
                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 text-white flex items-center justify-between rounded-t-xl">
                        <h1 className="text-lg font-bold flex-1 text-center">Property</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={handleOpen}
                                className="bg-blue-900 hover:bg-blue-700 transition px-4 py-2 rounded-lg shadow-md"
                            >
                                Add Property
                            </button>
                            <button
                                onClick={() => setView('table')}
                                className={`px-4 py-2 rounded-lg shadow-md transition ${view === 'table' ? 'bg-blue-500' : 'bg-blue-900 hover:bg-blue-700'}`}
                            >
                                Table View
                            </button>
                            <button
                                onClick={() => setView('grid')}
                                className={`px-4 py-2 rounded-lg shadow-md transition ${view === 'grid' ? 'bg-blue-500' : 'bg-blue-900 hover:bg-blue-700'}`}
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

                    {/* Pagination Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 border-b bg-gray-50">
                        <div>
                            <label className="text-sm text-gray-600 font-medium mr-2">Show:</label>
                            <select
                                value={pageSize === -1 ? 'all' : pageSize}
                                onChange={handlePageSizeChange}
                                className="p-1 rounded border border-gray-300 text-sm focus:ring-2 focus:ring-blue-400"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                        <div className="flex gap-2 items-center mt-3 md:mt-0">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className="px-3 py-1 text-sm rounded bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">Page {page} of {totalPages || 1}</span>
                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages || totalPages === 0}
                                className="px-3 py-1 text-sm rounded bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    {isLoading ? (
                        <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
                    ) : paginatedData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No properties found.</div>
                    ) : view === 'table' ? (
                        <div className="overflow-x-auto shadow-inner bg-white p-4">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Property Name</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">CreateCount</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Image</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">No Of Floors</th>
                                        <th className="px-6 py-4">Room Type Count</th>
                                        <th className="px-6 py-4">Floors</th>
                                        <th className="px-6 py-4">Room Types</th>
                                        <th className="px-6 py-4">City</th>
                                        <th className="px-6 py-4">Pin Code</th>
                                        <th className="px-6 py-4">Star Rating</th>
                                        <th className="px-6 py-4">Total Rooms</th>
                                        <th className="px-6 py-4">Facility</th>
                                        <th className="px-6 py-4">Policies</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Created At</th>
                                        <th className="px-6 py-4">Updated At</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {paginatedData.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t border-gray-200 hover:bg-blue-50 transition cursor-pointer"
                                            onClick={() => router.push(`/rooms/${item.commonId}`)}
                                        >
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
                                                        className="w-16 h-16 object-cover rounded-md shadow-sm"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 italic">No Image</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3">{item.propertyAddress}</td>
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
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-3">{item.city}</td>
                                            <td className="px-6 py-3">{item.pinCode}</td>
                                            <td className="px-6 py-3">{item.starRating}</td>
                                            <td className="px-6 py-3">{item.totalRooms}</td>
                                            <td className="px-6 py-3">{item.facility}</td>
                                            <td className="px-6 py-3">{item.policies}</td>
                                            <td className="px-6 py-3">{item.status}</td>
                                            <td className="px-6 py-3">{item.createdAt?.split("T")[0]}</td>
                                            <td className="px-6 py-3">{item.updatedAt?.split("T")[0]}</td>


                                            <td
                                                className="px-6 py-3 flex items-center gap-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md shadow-sm"
                                                >
                                                    <FaEdit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(item.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md shadow-sm"
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
                        /* Grid View */
                        <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50">
                            {paginatedData.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => router.push(`/rooms/${item.commonId}`)}
                                    className="p-5 border rounded-lg shadow-md bg-white space-y-3 hover:shadow-lg hover:border-blue-400 transition cursor-pointer"
                                >
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold text-blue-700">{item.propertyType}</h2>
                                        <p className="text-gray-600">{item.propertyName}</p>
                                    </div>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p><b>Contact:</b> {item.propertyContact}</p>
                                        <p><b>Email:</b> {item.propertyEmail}</p>
                                        {item.propertyImage ? (
                                            <img src={item.propertyImage} alt="Property" className="w-24 h-24 object-cover rounded border" />
                                        ) : (
                                            <p className="text-gray-400 italic">No Image</p>
                                        )}
                                        <p><b>Address:</b> {item.propertyAddress}</p>
                                        <p><b>Floors:</b> {item.floors.map(f => f.customName || f.defaultName).join(', ')}</p>
                                        <p><b>Room Types:</b> {item.roomTypes.map(r => r.defaultName).join(', ')}</p>
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

                {/* Delete Confirmation */}
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
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
        </div>

    );
}

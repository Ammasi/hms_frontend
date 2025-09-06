"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteProperty, fetchHotelOwnerById, fetchProperty, fetchPropertyById } from "../../../lib/api";
import { MdDelete } from "react-icons/md";
import { FaBed, FaBuilding, FaCheckCircle, FaDoorOpen, FaEdit, FaEnvelope, FaFileAlt, FaMapMarkerAlt, FaPhone, FaStar } from "react-icons/fa";
import PropertyAdd from "../../forms/propertyAdd/Form";
import { get } from 'lodash';
import { ClientList } from "../../interface/Client";
import { PropertyData } from "../../interface/property";
import {
    User,
    Mail,
    Phone,
    Building2,
    Landmark,
    DollarSign,
    MapPin,
    CheckCircle2,
    XCircle,
    FileText,
    Clock,
    CreditCard,
} from "lucide-react";
export default function PropertyDetails() {
    const { propertyId } = useParams<{ propertyId: string }>();
    const [client, setClient] = useState<ClientList | null>(null);
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
        // console.log("Property ID:66666666666666666666666666", propertyId);
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
        <div className="bg-gray-50 p-2 min-h-screen">
            <div className="shadow-lg rounded-xl m-2 overflow-hidden border border-gray-200">


                <div className="shadow-lg rounded-xl m-2 overflow-hidden border border-gray-200">

                    <div className="text-center py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white">

                        <h1 className="text-xl font-bold mt-1 flex justify-center items-center gap-2">
                            <Building2 className="w-7 h-7" /> {client.companyName}
                        </h1>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 text-base leading-relaxed">

                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-600">Client Name:</span>
                            <span className="font-bold text-gray-900 text-lg">{client.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-600">Email:</span>
                            <span className="font-bold text-gray-900 text-lg">{client.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-600">Mobile:</span>
                            <span className="font-bold text-gray-900 text-lg">{client.clientMobileNo}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Landmark className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-600">GST:</span>
                            <span className="font-bold text-gray-900 text-lg">{client.gst}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-600">Currency:</span>
                            <span className="font-bold text-gray-900 text-lg">{client.currency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-600">Property Count:</span>
                            <span className="font-bold text-gray-900 text-lg">{client.propertyCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {client.subscriptionStatus === "Active" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="font-semibold text-gray-600">Status:</span>
                            <span
                                className={`font-bold text-lg ${client.subscriptionStatus === "Active" ? "text-green-700" : "text-red-700"
                                    }`}
                            >
                                {client.subscriptionStatus}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-600">Subscription:</span>
                            <span className="font-bold text-gray-900 text-lg">{client.subscription}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 col-span-1 md:col-span-2 lg:col-span-4">

                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-gray-600">Subscription Status:</span>
                                <span className="font-bold text-gray-900 text-lg">{client.subscriptionStatus}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-gray-600">Duration:</span>
                                <span className="font-bold text-gray-900 text-lg">{client.subscriptionDuration}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-gray-600">Address:</span>
                                <span className="font-bold text-gray-900 text-lg break-words">
                                    {client.clientAddress}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex flex-col items-center">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl overflow-hidden">
                    {/* Top Bar */}
                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-2 text-white flex items-center justify-between rounded-t-lg">
                        <h1 className="text-sm font-semibold flex-1 text-center">Property</h1>
                        <div className="flex gap-1">
                            <button
                                onClick={handleOpen}
                                className="bg-blue-900 hover:bg-blue-700 transition px-2 py-1 rounded-md text-xs shadow"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setView('table')}
                                className={`px-2 py-1 rounded-md text-xs shadow transition ${view === 'table'
                                    ? 'bg-blue-500'
                                    : 'bg-blue-900 hover:bg-blue-700'
                                    }`}
                            >
                                Table
                            </button>
                            <button
                                onClick={() => setView('grid')}
                                className={`px-2 py-1 rounded-md text-xs shadow transition ${view === 'grid'
                                    ? 'bg-blue-500'
                                    : 'bg-blue-900 hover:bg-blue-700'
                                    }`}
                            >
                                Grid
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

                    {/* Table View */}
                    {isLoading ? (

                        <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
                    ) : paginatedData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No properties found.</div>
                    ) : view === 'table' ? (
                        <div>
                            <div className="overflow-x-auto shadow-inner bg-white p-2">
                                <table className="min-w-full   border-collapse text-[11px]">
                                    <thead className="bg-blue-100 text-gray-800 font-semibold text-[11px]">
                                        <tr>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Name</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Type</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Count</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Contact</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Email</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Image</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Address</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Floors</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Room Types</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">City</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Pin</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Star</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Rooms</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Facility</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Policies</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Status</th>
                                            <th className="px-3 py-3 whitespace-nowrap text-center">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="text-gray-700 divide-y divide-gray-200   text-[11px]">
                                        {paginatedData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-blue-50 transition cursor-pointer"
                                                onClick={() => router.push(`/rooms/${item.commonId}`)}
                                            >
                                                {/* Name */}
                                                <td className="px-3 py-2 whitespace-nowrap max-w-[150px] overflow-x-auto text-center">
                                                    <div className="truncate">{item.propertyName}</div>
                                                </td>

                                                {/* Type */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">{item.propertyType}</td>

                                                {/* Count */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">{item.propertyCreateCount}</td>

                                                {/* Contact */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">{item.propertyContact}</td>

                                                {/* Email */}
                                                <td className="px-3 py-2 whitespace-nowrap max-w-[150px] overflow-x-auto text-center">
                                                    <div className="truncate">{item.propertyEmail}</div>
                                                </td>

                                                {/* Image */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                                    {item.propertyImage ? (
                                                        <img
                                                            src={item.propertyImage}
                                                            alt="Property"
                                                            className="w-[70px] h-[55px] object-cover rounded shadow-sm mx-auto"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400 italic text-xs">No</span>
                                                    )}
                                                </td>

                                                {/* Address */}
                                                <td className="px-3 py-2 whitespace-nowrap max-w-[200px] overflow-x-auto text-center">
                                                    <div className="truncate">{item.propertyAddress}</div>
                                                </td>

                                                {/* Floors */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">{item.noOfFloors}</td>

                                                {/* Room Types */}
                                                <td className="px-3 py-2 whitespace-nowrap max-w-[150px] overflow-x-auto text-center">
                                                    {Array.isArray(item.roomTypes) && item.roomTypes.length > 0 ? (
                                                        <div className="flex flex-col gap-1 items-center">
                                                            {item.roomTypes.slice(0, 2).map((r, i) => (
                                                                <div key={i} className="truncate bg-gray-100 px-1 rounded">{r.defaultName}</div>
                                                            ))}
                                                            {item.roomTypes.length > 2 && (
                                                                <div className="text-xs text-gray-500">+{item.roomTypes.length - 2} more</div>
                                                            )}
                                                        </div>
                                                    ) : "-"}
                                                </td>

                                                {/* City */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">{item.city}</td>

                                                {/* Pin */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">{item.pinCode}</td>

                                                {/* Star */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">{item.starRating}</td>

                                                {/* Rooms */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">{item.totalRooms}</td>

                                                {/* Facility */}
                                                <td className="px-3 py-2 whitespace-nowrap max-w-[150px] overflow-x-auto text-center">
                                                    <div className="truncate">{item.facility}</div>
                                                </td>

                                                {/* Policies */}
                                                <td className="px-3 py-2 whitespace-nowrap max-w-[150px] overflow-x-auto text-center">
                                                    <div className="truncate">{item.policies}</div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${item.status === "Active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td
                                                    className="px-3 py-2 whitespace-nowrap text-center"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleEdit(item.id)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteTarget(item.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"
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


                            {/* Pagination Controls */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                                <div className="flex items-center mb-2 md:mb-0">
                                    <label className="text-sm text-gray-600 mr-2">Show:</label>
                                    <select
                                        value={pageSize === -1 ? 'all' : pageSize}
                                        onChange={handlePageSizeChange}
                                        className="border border-gray-300 rounded text-sm p-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value="all">All</option>
                                    </select>
                                    <span className="text-sm text-gray-600 ml-2">entries</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={page === 1}
                                        className={`px-3 py-1 rounded text-sm ${page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {page} of {totalPages || 1}
                                    </span>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={page === totalPages || totalPages === 0}
                                        className={`px-3 py-1 rounded text-sm ${page === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>


                    ) : (
                        /* Grid View */
                        <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50">
                            {paginatedData.map(item => (
                                <div key={item.id} className="group">
                                    <div className="relative overflow-hidden rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">

                                        <div
                                            onClick={() => router.push(`/rooms/${item.commonId}`)}
                                            className="cursor-pointer flex-grow"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                {item.propertyImage ? (
                                                    <img
                                                        src={item.propertyImage}
                                                        alt="Property"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                                                        <p className="text-gray-400 italic">No Image Available</p>
                                                    </div>
                                                )}
                                                {item.starRating && (
                                                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                                        <FaStar className="mr-1" /> {item.starRating}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <div className="mb-3">
                                                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                        {item.propertyName}
                                                    </h2>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-blue-600 font-medium text-sm">{item.propertyType}</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                                    <div className="flex items-center">
                                                        <FaMapMarkerAlt className="text-gray-500 mr-2 min-w-4" />
                                                        <span className="truncate">{item.city}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaPhone className="text-gray-500 mr-2 min-w-4" />
                                                        <span className="truncate">{item.propertyContact}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaEnvelope className="text-gray-500 mr-2 min-w-4" />
                                                        <span className="truncate">{item.propertyEmail}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                                    <div className="flex items-center">
                                                        <FaBuilding className="text-gray-500 mr-2 min-w-4" />
                                                        <span>{item.noOfFloors} {item.noOfFloors === 1 ? 'Floor' : 'Floors'}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaBed className="text-gray-500 mr-2 min-w-4" />
                                                        <span>{item.totalRooms} Rooms</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaDoorOpen className="text-gray-500 mr-2 min-w-4" />
                                                        <span>{item.roomTypeCount} Types</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaCheckCircle className="text-gray-500 mr-2 min-w-4" />
                                                        <span>GF: {item.includeGroundFloor ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </div>
                                                <div className="mb-3 text-sm space-y-2">
                                                    {item.facility && (
                                                        <div className="flex items-start">
                                                            <FaCheckCircle className="text-gray-500 mr-2 mt-0.5 min-w-4" />
                                                            <span className="line-clamp-2">{item.facility}</span>
                                                        </div>
                                                    )}
                                                    {item.policies && (
                                                        <div className="flex items-start">
                                                            <FaFileAlt className="text-gray-500 mr-2 mt-0.5 min-w-4" />
                                                            <span className="line-clamp-2">{item.policies}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-sm">
                                                    <div className="flex items-start text-gray-600">
                                                        <FaMapMarkerAlt className="text-gray-500 mr-2 mt-0.5 min-w-4" />
                                                        <span className="line-clamp-2">{item.propertyAddress}, {item.pinCode}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 flex justify-between items-center border-t border-gray-100 bg-gray-50">
                                            <div className="text-xs text-gray-500">
                                                {item.propertyCreateCount} Properties
                                            </div>
                                            {/* <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleEdit(item.id);
                                                    }}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1 transition-colors"
                                                >
                                                    <FaEdit className="h-4 w-4" /> Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setDeleteTarget(item.id);
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center gap-1 transition-colors"
                                                >
                                                    <MdDelete className="h-4 w-4" /> Delete
                                                </button>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
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

'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { deleteCustomerInfo, fetchCustomerInfoById, fetchCustomerInfo } from '../../../lib/api';

interface IGuest {
    guestName?: string[];
    phoneNo?: string;
    emailId?: string;
    city?: string;
    address?: string;
    pincode?: string;
    state?: string;
    country?: string;
    payPerRoom?: string;
    specialInstructions?: string;
}

interface IStayDetails {
    roomNo?: string;
    bedType?: string;
    roomType?: string;
    roomFacility?: string[];
    planFood?: string;
    mealPlan?: string;
    ratePlan?: string;
    tariff?: string;
    newRentTariff?: string;
    applyTariff?: string;
    numberOfGuests?: {
        adult?: number;
        child?: number;
        seniors?: number;
    };
    noOfPax?: number;
    childPax?: number;
    extraPax?: number;
    isActive?: boolean;
    status?: string;
    guests?: IGuest[];
}

interface IExtra {
    serviceName?: string;
    hsncode?: string;
    amount?: string;
    roomNo?: string;
}

interface ICustomerInfoRegister {
    _id: string;
    hotelDetails?: {
        clientId?: string;
        propertyId?: string;
        customerId?: string;
        hotelName?: string;
        hotelAddress?: string;
        hotelMobileNo?: string;
        gstin?: string;
        hsnCode?: string;
    };
    bookingDetails?: {
        isReservation?: boolean;
        bookingId?: string;
        noOfDays?: string;
        noOfRooms?: string;
        graceTime?: string;
        checkInType?: string;
        checkInMode?: string;
        checkInUser?: string;
        roomStatus?: string;
        arrivalMode?: string;
        otaName?: string;
        bookingInstruction?: string;
        enableRoomSharing?: boolean;
        bookingThrough?: string;
        preferredRooms?: string;
        reservedBy?: string;
        reservedStatus?: string;
        reservationNo?: string;
    };
    checkin?: {
        checkinDate?: Date | string;
        checkoutDate?: Date | string;
        arrivalDate?: Date | string;
        depatureDate?: Date | string;
    };
    stayDetails?: IStayDetails[];
    guestInfo?: {
        numberOfGuests?: {
            child?: number;
            adult?: number;
            seniors?: number;
        };
        noOfPax?: number;
        childPax?: number;
        extraPax?: number;
        specialRequests?: string;
        complimentary?: string;
        vechileDetails?: string;
    };
    paymentDetails?: {
        paymentType?: string;
        paymentBy?: string;
        allowCredit?: string;
        paidAmount?: number;
        balanceAmount?: number;
        discType?: string;
        discValue?: string;
        netRate?: string;
        allowChargesPosting?: string;
        enablePaxwise?: boolean;
        paxwiseBillAmount?: string;
    };
    addressInfo?: {
        city?: string;
        pinCode?: string;
        state?: string;
        country?: string;
    };
    gstInfo?: {
        gstNumber?: string;
        gstType?: string;
    };
    personalInfo?: {
        dob?: string;
        age?: string;
        companyAnniversary?: string;
    };
    businessInfo?: {
        segmentName?: string;
        bussinessSource?: string;
        customerComapny?: string;
        purposeOfVisit?: string;
        visitRemark?: string;
    };
    invoiceOptions?: {
        printOption?: boolean;
        pdfSaveOption?: boolean;
    };
    extra?: IExtra[];
    meta?: {
        rating?: string;
        isCancelled?: boolean;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    };
}

export default function CustomerInfoDashboard() {
    const [customerInfoData, setCustomerInfoData] = useState<ICustomerInfoRegister[]>([]);
    const [view, setView] = useState<'table' | 'grid'>('table');
    const [editingCustomer, setEditingCustomer] = useState<ICustomerInfoRegister | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = () => setShowModal(true);

    const loadCustomerData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchCustomerInfo();
            setCustomerInfoData(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error fetching customer info:", err);
            setError("Failed to fetch customer data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCustomerData();
    }, []);

    const handleEdit = async (id: string) => {
        try {
            const response = await fetchCustomerInfoById(id);
            if (response) {
                setEditingCustomer(response);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Failed to fetch customer for edit', error);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCustomerInfo(deleteTarget);
            setCustomerInfoData(prev => prev.filter(item => item._id !== deleteTarget));
            setDeleteTarget(null);
        } catch (error) {
            setError('Failed to delete the record');
        }
    };

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
        setExpandedRows(newExpanded);
    };

    const filteredData = customerInfoData.filter(customer => {
        const searchLower = searchTerm.toLowerCase();
        return (
            customer.bookingDetails?.bookingId?.toLowerCase().includes(searchLower) ||
            customer.hotelDetails?.hotelName?.toLowerCase().includes(searchLower) ||
            customer.hotelDetails?.customerId?.toLowerCase().includes(searchLower)
        );
    });

    const renderStayDetails = (stayDetails: IStayDetails[] = []) => {
        return stayDetails.map((stay, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div><span className="font-medium">Room No:</span> {stay.roomNo || 'N/A'}</div>
                    <div><span className="font-medium">Room Type:</span> {stay.roomType || 'N/A'}</div>
                    <div><span className="font-medium">Tariff:</span> ₹{stay.tariff || '0'}</div>
                    <div><span className="font-medium">Guests:</span> {(stay.numberOfGuests?.adult ?? 0)} Adults, {(stay.numberOfGuests?.child ?? 0)} Children</div>
                    <div><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded text-xs ${stay.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{stay.isActive ? 'Active' : 'Inactive'}</span></div>
                </div>
            </div>
        ));
    };

    const renderPaymentDetails = (payment: ICustomerInfoRegister["paymentDetails"]) => (
        <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Type:</span> {payment?.paymentType || 'N/A'}</div>
            <div><span className="font-medium">Paid:</span> ₹{payment?.paidAmount?.toLocaleString() ?? '0'}</div>
            <div><span className="font-medium">Balance:</span> ₹{payment?.balanceAmount?.toLocaleString() ?? '0'}</div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 flex flex-col items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl overflow-hidden">
                {/* Header Section */}
                <div className="mb-6 bg-gradient-to-r from-blue-800 to-blue-600 p-4 md:p-6 rounded-t-xl text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">Customer Information Dashboard</h1>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-grow max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={handleOpenModal}
                                    className="bg-white text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg shadow font-medium flex items-center gap-2"
                                >
                                    <span>+</span> Add Customer
                                </button>
                                <div className="flex border rounded-lg overflow-hidden bg-white">
                                    <button
                                        onClick={() => setView('table')}
                                        className={`px-3 py-2 ${view === 'table' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`}
                                    >
                                        Table
                                    </button>
                                    <button
                                        onClick={() => setView('grid')}
                                        className={`px-3 py-2 ${view === 'grid' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`}
                                    >
                                        Grid
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No customers found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try a different search term' : 'Get started by adding a new customer'}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={handleOpenModal}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                     
                                    Add Customer
                                </button>
                            </div>
                        </div>
                    ) : view === 'table' ? (
                        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.map((customer) => (
                                        <tbody key={customer._id}>
                                            <tr className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-blue-600">{customer.bookingDetails?.bookingId || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{customer.hotelDetails?.hotelName || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{customer.hotelDetails?.customerId || ''}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {customer.checkin?.checkinDate ? new Date(customer.checkin.checkinDate).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {customer.checkin?.checkoutDate ? new Date(customer.checkin.checkoutDate).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {customer.bookingDetails?.noOfRooms || '0'} rooms
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <span className={`px-2 py-1 rounded text-xs ${(customer.paymentDetails?.balanceAmount ?? 0) > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                            ₹{customer.paymentDetails?.paidAmount?.toLocaleString() ?? '0'} paid
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => toggleRow(customer._id)}
                                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                                        >
                                                            {expandedRows.has(customer._id) ? 'Hide' : 'View'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(customer._id)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteTarget(customer._id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <MdDelete className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedRows.has(customer._id) && (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                                        <div className="space-y-4">
                                                            <div className="border-l-4 border-blue-500 pl-4">
                                                                <h3 className="text-lg font-medium text-gray-900">Stay Details</h3>
                                                                {renderStayDetails(customer.stayDetails)}
                                                            </div>

                                                            <div className="border-l-4 border-green-500 pl-4">
                                                                <h3 className="text-lg font-medium text-gray-900">Guest Information</h3>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                                    <div><span className="font-medium">Adults:</span> {customer.guestInfo?.numberOfGuests?.adult ?? 0}</div>
                                                                    <div><span className="font-medium">Children:</span> {customer.guestInfo?.numberOfGuests?.child ?? 0}</div>
                                                                    <div><span className="font-medium">Special Requests:</span> {customer.guestInfo?.specialRequests || 'None'}</div>
                                                                    <div><span className="font-medium">Vehicle:</span> {customer.guestInfo?.vechileDetails || 'None'}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredData.map((customer) => (
                                <div key={customer._id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">{customer.hotelDetails?.hotelName || 'N/A'}</h3>
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {customer.bookingDetails?.bookingId || 'N/A'}
                                            </span>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Check-In</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {customer.checkin?.checkinDate ? new Date(customer.checkin.checkinDate).toLocaleDateString() : 'N/A'}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Check-Out</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {customer.checkin?.checkoutDate ? new Date(customer.checkin.checkoutDate).toLocaleDateString() : 'N/A'}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Rooms</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {customer.bookingDetails?.noOfRooms || '0'}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Payment</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        <span className={`px-2 py-1 rounded ${(customer.paymentDetails?.balanceAmount ?? 0) > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                            ₹{customer.paymentDetails?.paidAmount?.toLocaleString() ?? '0'}
                                                        </span>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => toggleRow(customer._id)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    {expandedRows.has(customer._id) ? 'Hide Details' : 'View Details'}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(customer._id)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {expandedRows.has(customer._id) && (
                                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Stay Details</h4>
                                            {renderStayDetails(customer.stayDetails)}

                                            <h4 className="text-md font-medium text-gray-900 mb-3 mt-4">Guest Info</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div><span className="font-medium">Adults:</span> {customer.guestInfo?.numberOfGuests?.adult ?? 0}</div>
                                                <div><span className="font-medium">Children:</span> {customer.guestInfo?.numberOfGuests?.child ?? 0}</div>
                                                <div className="col-span-2"><span className="font-medium">Requests:</span> {customer.guestInfo?.specialRequests || 'None'}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
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
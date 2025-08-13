'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { deleteCustomerInfo, fetchCustomerInfoById, fetchCustomerInfo } from '../../../lib/api';
import React from "react";

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
        if (stayDetails.length === 0) {
            return (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                    No stay details available
                </div>
            );
        }

        return stayDetails.map((stay, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                {/* Room Header */}
                <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                        Room #{stay.roomNo || 'N/A'} - {stay.roomType || 'Standard'}
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full  
                            }`}>
                            {stay.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full  
                            }`}>
                            {stay.status || 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Room Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Room Information */}
                    <div className="space-y-2">
                        <h5 className="font-medium text-gray-700 border-b pb-1">Room Information</h5>
                        <div><span className="font-medium text-gray-600">Bed Type:</span> {stay.bedType || 'N/A'}</div>
                        <div><span className="font-medium text-gray-600">Facilities:</span> {stay.roomFacility?.join(', ') || 'None'}</div>
                        <div><span className="font-medium text-gray-600">Meal Plan:</span> {stay.mealPlan || 'N/A'}</div>
                        <div><span className="font-medium text-gray-600">Plan Food:</span> {stay.planFood || 'N/A'}</div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                        <h5 className="font-medium text-gray-700 border-b pb-1">Pricing</h5>
                        <div><span className="font-medium text-gray-600">Rate Plan:</span> {stay.ratePlan || 'N/A'}</div>
                        <div><span className="font-medium text-gray-600">Base Tariff:</span> ₹{stay.tariff || '0'}</div>
                        <div><span className="font-medium text-gray-600">Current Tariff:</span> ₹{stay.newRentTariff || '0'}</div>
                        <div><span className="font-medium text-gray-600">Tariff Applied:</span> {stay.applyTariff ? 'Yes' : 'No'}</div>
                    </div>

                    {/* Guest Count */}
                    <div className="space-y-2">
                        <h5 className="font-medium text-gray-700 border-b pb-1">Occupancy</h5>
                        <div><span className="font-medium text-gray-600">Adults:</span> {stay.numberOfGuests?.adult ?? 0}</div>
                        <div><span className="font-medium text-gray-600">Children:</span> {stay.numberOfGuests?.child ?? 0}</div>
                        <div><span className="font-medium text-gray-600">Seniors:</span> {stay.numberOfGuests?.seniors ?? 0}</div>
                        <div><span className="font-medium text-gray-600">Total Pax:</span> {stay.noOfPax ?? 0}</div>
                        <div><span className="font-medium text-gray-600">Extra Pax:</span> {stay.extraPax ?? 0}</div>
                    </div>
                </div>

                {/* Guest Details */}
                {stay.guests && stay.guests.length > 0 && (
                    <div className="mt-4">
                        <h5 className="font-semibold text-gray-800 mb-3 border-b pb-1">
                            Guest{stay.guests.length > 1 ? 's' : ''} Details
                        </h5>
                        <div className="space-y-3">
                            {stay.guests.map((guest, gIndex) => (
                                <div key={gIndex} className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                                    {/* Guest Header */}
                                    <div className="flex justify-between items-start mb-2">
                                        <h6 className="font-medium text-gray-700">
                                            Guest {gIndex + 1}
                                        </h6>
                                        <div className="text-sm text-gray-600">
                                            ₹{guest.payPerRoom || '0'} per room
                                        </div>
                                    </div>

                                    {/* Guest Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <div><span className="font-medium text-gray-600">Name:</span> {guest.guestName?.join(', ') || 'N/A'}</div>
                                        <div><span className="font-medium text-gray-600">Phone:</span> {guest.phoneNo || 'N/A'}</div>
                                        <div><span className="font-medium text-gray-600">Email:</span> {guest.emailId || 'N/A'}</div>
                                        <div><span className="font-medium text-gray-600">Address:</span> {guest.address || 'N/A'}</div>
                                        <div><span className="font-medium text-gray-600">City:</span> {guest.city || 'N/A'}</div>
                                        <div><span className="font-medium text-gray-600">State:</span> {guest.state || 'N/A'}</div>
                                        <div><span className="font-medium text-gray-600">Country:</span> {guest.country || 'N/A'}</div>
                                        <div><span className="font-medium text-gray-600">Pincode:</span> {guest.pincode || 'N/A'}</div>
                                        <div className="sm:col-span-2">
                                            <span className="font-medium text-gray-600">Special Instructions:</span> {guest.specialInstructions || 'None'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ));
    };



    return (
        <div className="p-4 md:p-6 flex flex-col items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl overflow-hidden">
                {/* Header Section */}
                <div className="mb-6 bg-gradient-to-r from-blue-800 to-blue-600 p-4 md:p-6 rounded-t-xl text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">Customer Info</h1>
                        <div className="w-1/3 flex justify-end gap-2">
                            <button
                                onClick={handleOpenModal}
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

                    </div>
                </div>


                {isLoading ? (
                    <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No Notification found.</div>
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
                    <div className="overflow-x-auto shadow bg-white p-4 mt-2 w-full">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Hotel Name</th>
                                    <th className="px-6 py-3 font-semibold">Address</th>
                                    <th className="px-6 py-3 font-semibold">Mobile No</th>
                                    <th className="px-6 py-3 font-semibold">GSTIN</th>
                                    <th className="px-6 py-3 font-semibold">HSN Code</th>
                                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-gray-700 divide-y divide-gray-200">
                                {filteredData.map((customer) => (
                                    <React.Fragment key={customer._id}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium">
                                                {customer.hotelDetails?.hotelName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.hotelDetails?.hotelAddress || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.hotelDetails?.hotelMobileNo || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.hotelDetails?.gstin || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.hotelDetails?.hsnCode || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => toggleRow(customer._id)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                                >
                                                    {expandedRows.has(customer._id) ? 'Hide' : 'View'}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(customer._id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(customer._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow transition-colors"
                                                    title="Delete"
                                                >
                                                    <MdDelete className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>

                                        {expandedRows.has(customer._id) && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={6} className="px-6 py-4">
                                                    <div className="space-y-6">
                                                        {/* Hotel Details */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Hotel Details</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Name:</span> {customer.hotelDetails?.hotelName || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Address:</span> {customer.hotelDetails?.hotelAddress || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Mobile:</span> {customer.hotelDetails?.hotelMobileNo || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">GSTIN:</span> {customer.hotelDetails?.gstin || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">HSN Code:</span> {customer.hotelDetails?.hsnCode || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Stay Details */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Stay Details</h3>
                                                            {renderStayDetails(customer.stayDetails)}
                                                        </div>

                                                        {/* Payment Details */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Payment Details</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Type:</span> {customer.paymentDetails?.paymentType || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Payment By:</span> {customer.paymentDetails?.paymentBy || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Allow Credit:</span> {customer.paymentDetails?.allowCredit ? 'Yes' : 'No'}</div>
                                                                <div><span className="font-medium text-gray-600">Paid Amount:</span> ₹{customer.paymentDetails?.paidAmount || '0'}</div>
                                                                <div><span className="font-medium text-gray-600">Balance Amount:</span> ₹{customer.paymentDetails?.balanceAmount || '0'}</div>
                                                                <div><span className="font-medium text-gray-600">Discount Type:</span> {customer.paymentDetails?.discType || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Discount Value:</span> {customer.paymentDetails?.discValue || '0'}</div>
                                                                <div><span className="font-medium text-gray-600">Net Rate:</span> ₹{customer.paymentDetails?.netRate || '0'}</div>
                                                                <div><span className="font-medium text-gray-600">Allow Charges Posting:</span> {customer.paymentDetails?.allowChargesPosting ? 'Yes' : 'No'}</div>
                                                                <div><span className="font-medium text-gray-600">Enable Paxwise:</span> {customer.paymentDetails?.enablePaxwise ? 'Yes' : 'No'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Guest Information */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Guest Information</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Adults:</span> {customer.guestInfo?.numberOfGuests?.adult ?? 0}</div>
                                                                <div><span className="font-medium text-gray-600">Children:</span> {customer.guestInfo?.numberOfGuests?.child ?? 0}</div>
                                                                <div><span className="font-medium text-gray-600">No. of Pax:</span> {customer.guestInfo?.noOfPax ?? 0}</div>
                                                                <div><span className="font-medium text-gray-600">Child Pax:</span> {customer.guestInfo?.childPax ?? 0}</div>
                                                                <div><span className="font-medium text-gray-600">Extra Pax:</span> {customer.guestInfo?.extraPax ?? 0}</div>
                                                                <div><span className="font-medium text-gray-600">Special Requests:</span> {customer.guestInfo?.specialRequests || 'None'}</div>
                                                                <div><span className="font-medium text-gray-600">Vehicle:</span> {customer.guestInfo?.vechileDetails || 'None'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Booking Details */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Booking Details</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Reservation:</span> {customer.bookingDetails?.isReservation ? 'Yes' : 'No'}</div>
                                                                <div><span className="font-medium text-gray-600">Booking ID:</span> {customer.bookingDetails?.bookingId || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">No. of Days:</span> {customer.bookingDetails?.noOfDays || '0'}</div>
                                                                <div><span className="font-medium text-gray-600">No. of Rooms:</span> {customer.bookingDetails?.noOfRooms || '0'}</div>
                                                                <div><span className="font-medium text-gray-600">Check-in Type:</span> {customer.bookingDetails?.checkInType || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Check-in Mode:</span> {customer.bookingDetails?.checkInMode || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Check-in User:</span> {customer.bookingDetails?.checkInUser || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Room Status:</span> {customer.bookingDetails?.roomStatus || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Arrival Mode:</span> {customer.bookingDetails?.arrivalMode || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">OTA Name:</span> {customer.bookingDetails?.otaName || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Booking Instruction:</span> {customer.bookingDetails?.bookingInstruction || 'None'}</div>
                                                                <div><span className="font-medium text-gray-600">Enable Room Sharing:</span> {customer.bookingDetails?.enableRoomSharing ? 'Yes' : 'No'}</div>
                                                                <div><span className="font-medium text-gray-600">Booking Through:</span> {customer.bookingDetails?.bookingThrough || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Preferred Rooms:</span> {customer.bookingDetails?.preferredRooms || 'None'}</div>
                                                                <div><span className="font-medium text-gray-600">Reserved By:</span> {customer.bookingDetails?.reservedBy || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Reserved Status:</span> {customer.bookingDetails?.reservedStatus || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Reservation No:</span> {customer.bookingDetails?.reservationNo || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Check-in/Check-out Dates */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Dates</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Check-in:</span> {customer.checkin?.checkinDate ? new Date(customer.checkin.checkinDate).toLocaleDateString() : 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Check-out:</span> {customer.checkin?.checkoutDate ? new Date(customer.checkin.checkoutDate).toLocaleDateString() : 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Arrival:</span> {customer.checkin?.arrivalDate ? new Date(customer.checkin.arrivalDate).toLocaleDateString() : 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Departure:</span> {customer.checkin?.depatureDate ? new Date(customer.checkin.depatureDate).toLocaleDateString() : 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Address Information */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Address Information</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">City:</span> {customer.addressInfo?.city || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Pin Code:</span> {customer.addressInfo?.pinCode || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">State:</span> {customer.addressInfo?.state || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Country:</span> {customer.addressInfo?.country || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* GST Information */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">GST Information</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">GST Number:</span> {customer.gstInfo?.gstNumber || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">GST Type:</span> {customer.gstInfo?.gstType || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Personal Information */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Personal Information</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Date of Birth:</span> {customer.personalInfo?.dob?.split('T')[0] || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Age:</span> {customer.personalInfo?.age || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Company Anniversary:</span> {customer.personalInfo?.companyAnniversary?.split('T')[0] || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Business Information */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Business Information</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Segment Name:</span> {customer.businessInfo?.segmentName || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Business Source:</span> {customer.businessInfo?.bussinessSource || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Customer Company:</span> {customer.businessInfo?.customerComapny || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Purpose of Visit:</span> {customer.businessInfo?.purposeOfVisit || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Visit Remark:</span> {customer.businessInfo?.visitRemark || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Invoice Options */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Invoice Options</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Print Option:</span> {customer.invoiceOptions?.printOption || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">PDF Save Option:</span> {customer.invoiceOptions?.pdfSaveOption || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Extra Services */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Extra Services</h3>
                                                            {customer.extra && customer.extra.length > 0 ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                                    {customer.extra.map((item, idx) => (
                                                                        <div key={idx} className="bg-gray-50 p-3 rounded">
                                                                            <div><span className="font-medium text-gray-600">Service:</span> {item.serviceName || 'N/A'}</div>
                                                                            <div><span className="font-medium text-gray-600">HSN Code:</span> {item.hsncode || 'N/A'}</div>
                                                                            <div><span className="font-medium text-gray-600">Amount:</span> ₹{item.amount || '0'}</div>
                                                                            <div><span className="font-medium text-gray-600">Room No:</span> {item.roomNo || 'N/A'}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500">No extra services added</p>
                                                            )}
                                                        </div>

                                                        {/* Meta Information */}
                                                        <div className="bg-white p-4 rounded-lg shadow">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Meta Information</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                                <div><span className="font-medium text-gray-600">Rating:</span> {customer.meta?.rating || 'N/A'}</div>
                                                                <div><span className="font-medium text-gray-600">Active:</span> {customer.meta?.isActive ? 'Yes' : 'No'}</div>
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Created:</span>{" "}
                                                                    {customer.meta?.createdAt
                                                                        ? new Date(customer.meta.createdAt).toLocaleDateString()
                                                                        : "N/A"}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Updated:</span>{" "}
                                                                    {customer.meta?.updatedAt
                                                                        ? new Date(customer.meta.updatedAt).toLocaleDateString()
                                                                        : "N/A"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredData.map((customer) => (
                            <div key={customer._id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                {/* Card Header */}
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                                            {customer.hotelDetails?.hotelName || 'Unnamed Hotel'}
                                        </h3>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full">
                                            {customer.bookingDetails?.bookingId || 'No ID'}
                                        </span>
                                    </div>

                                    {/* Key Information */}
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                                            {/* Dates */}
                                            <div className="col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Check-In</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {customer.checkin?.checkinDate ?
                                                        new Date(customer.checkin.checkinDate).toLocaleDateString() :
                                                        'Not specified'}
                                                </dd>
                                            </div>
                                            <div className="col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Check-Out</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {customer.checkin?.checkoutDate ?
                                                        new Date(customer.checkin.checkoutDate).toLocaleDateString() :
                                                        'Not specified'}
                                                </dd>
                                            </div>

                                            {/* Room and Guest Info */}
                                            <div className="col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Rooms</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {customer.bookingDetails?.noOfRooms || '0'}
                                                </dd>
                                            </div>
                                            <div className="col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Guests</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {customer.guestInfo?.noOfPax || '0'} (A: {customer.guestInfo?.numberOfGuests?.adult ?? 0}, C: {customer.guestInfo?.numberOfGuests?.child ?? 0})
                                                </dd>
                                            </div>

                                            {/* Payment Status */}
                                            <div className="col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                                                <dd className="mt-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
                                                                    {customer.paymentDetails?.paymentType || 'Unknown'}
                                                                </span>
                                                                <span className="ml-2 text-sm text-gray-500">
                                                                    {customer.paymentDetails?.paymentBy || ''}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                ₹{customer.paymentDetails?.paidAmount?.toLocaleString() ?? '0'}
                                                                {(customer.paymentDetails?.balanceAmount ?? 0) > 0 && (
                                                                    <span className="text-red-500 ml-1">
                                                                        (₹{customer.paymentDetails?.balanceAmount?.toLocaleString()})
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6">
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => toggleRow(customer._id)}
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                {expandedRows.has(customer._id) ? (
                                                    <>
                                                        <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                        </svg>
                                                        Hide
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                        Details
                                                    </>
                                                )}
                                            </button>
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedRows.has(customer._id) && (
                                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50 space-y-6">
                                        {/* Hotel Information */}
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Hotel Information</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div><span className="font-medium text-gray-600">Address:</span> {customer.hotelDetails?.hotelAddress || 'N/A'}</div>
                                                <div><span className="font-medium text-gray-600">Contact:</span> {customer.hotelDetails?.hotelMobileNo || 'N/A'}</div>
                                                <div><span className="font-medium text-gray-600">GSTIN:</span> {customer.hotelDetails?.gstin || 'N/A'}</div>
                                                <div><span className="font-medium text-gray-600">HSN Code:</span> {customer.hotelDetails?.hsnCode || 'N/A'}</div>
                                            </div>
                                        </div>

                                        {/* Stay Details */}
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Stay Details</h4>
                                            {renderStayDetails(customer.stayDetails)}
                                        </div>

                                        {/* Guest Information */}
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Guest Information</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div><span className="font-medium text-gray-600">Adults:</span> {customer.guestInfo?.numberOfGuests?.adult ?? 0}</div>
                                                <div><span className="font-medium text-gray-600">Children:</span> {customer.guestInfo?.numberOfGuests?.child ?? 0}</div>
                                                <div><span className="font-medium text-gray-600">Seniors:</span> {customer.guestInfo?.numberOfGuests?.seniors ?? 0}</div>
                                                <div><span className="font-medium text-gray-600">Total Pax:</span> {customer.guestInfo?.noOfPax ?? 0}</div>
                                                <div className="col-span-2">
                                                    <span className="font-medium text-gray-600">Special Requests:</span> {customer.guestInfo?.specialRequests || 'None'}
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="font-medium text-gray-600">Vehicle:</span> {customer.guestInfo?.vechileDetails || 'None'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Booking Details</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div><span className="font-medium text-gray-600">Status:</span> {customer.bookingDetails?.roomStatus || 'N/A'}</div>
                                                <div><span className="font-medium text-gray-600">Days:</span> {customer.bookingDetails?.noOfDays || '0'}</div>
                                                <div><span className="font-medium text-gray-600">Check-in Type:</span> {customer.bookingDetails?.checkInType || 'N/A'}</div>
                                                <div><span className="font-medium text-gray-600">Arrival Mode:</span> {customer.bookingDetails?.arrivalMode || 'N/A'}</div>
                                                <div className="col-span-2">
                                                    <span className="font-medium text-gray-600">Booking Through:</span> {customer.bookingDetails?.bookingThrough || 'N/A'}
                                                </div>
                                                {customer.bookingDetails?.otaName && (
                                                    <div className="col-span-2">
                                                        <span className="font-medium text-gray-600">OTA:</span> {customer.bookingDetails.otaName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Delete Confirmation Modal */}
            {
                deleteTarget && (
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
                )
            }
        </div >
    );
}
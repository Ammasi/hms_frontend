'use client';

import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import {
    fetchHotelFacility,
    fetchHotelFacilityById,
    deleteHotelFacility
} from '../../../lib/api';
import HotelFacilityForm from '../../forms/hotelFacility/Form';

type HotelFacilityData = {
    id: string;
    clientId: string;
    propertyId: string;
    propertyName: string;
    facilityType: string;
    facilityDescription: string;
    status: string;
    facilityImages: string[];
    createdAt: string;
    updatedAt: string;
    append?: (arg0: string, file: File) => unknown;
};

export default function HotelFacility() {
    const [data, setData] = useState<HotelFacilityData[]>([]);
    const [view, setView] = useState<'table' | 'grid'>('table');
    const [editingData, setEditingData] = useState<HotelFacilityData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleOpen = () => setShowModal(true);

    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetchHotelFacility();
            setData(res.data);
        } catch (err) {
            console.error('Error fetching facilities:', err);
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
            const res = await fetchHotelFacilityById(id);
            setEditingData(res);
            setShowModal(true);
        } catch (error) {
            console.error('Failed to fetch for edit', error);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteHotelFacility(deleteTarget);
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
                            <h1 className="text-xl font-bold">Hotel Facility</h1>
                        </div>
                        <div className="w-1/3 flex justify-end gap-2">
                            <button onClick={handleOpen} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow">
                                Add Facility
                            </button>
                            <button onClick={() => setView('table')} className={`px-4 py-2 rounded-lg ${view === 'table' ? 'bg-blue-700' : 'bg-blue-900'} text-white`}>
                                Table View
                            </button>
                            <button onClick={() => setView('grid')} className={`px-4 py-2 rounded-lg ${view === 'grid' ? 'bg-blue-700' : 'bg-blue-900'} text-white`}>
                                Grid View
                            </button>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
                        <HotelFacilityForm
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

                {isLoading ? (
                    <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No hotel facilities found.</div>
                ) : view === 'table' ? (
                    <div className="overflow-x-auto shadow bg-white p-4 mt-2">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Client ID</th>
                                    <th className="px-6 py-4">Property ID</th>
                                    <th className="px-6 py-4">Property Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4">Updated</th>

                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {data.map(item => (
                                    <tr key={item.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-3">{item.clientId}</td>
                                        <td className="px-6 py-3">{item.propertyId}</td>
                                        <td className="px-6 py-3">{item.propertyName}</td>
                                        <td className="px-6 py-3">{item.facilityType}</td>
                                        <td className="px-6 py-3">{item.facilityDescription}</td>
                                        <td className="px-6 py-3">{item.status}</td>
                                        <div className="flex gap-1 flex-wrap">
                                            {item.facilityImages?.slice(0, 5).map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Facility ${index}`}
                                                    className="w-12 h-12 rounded object-cover border"
                                                />
                                            ))}
                                        </div>

                                        <td className="px-6 py-3">{item.createdAt?.split('T')[0]}</td>
                                        <td className="px-6 py-3">{item.updatedAt?.split('T')[0]}</td>

                                        <td className="px-6 py-3 flex gap-2">
                                            <button onClick={() => handleEdit(item.id)} className="bg-blue-600 text-white p-1 rounded"><FaEdit /></button>
                                            <button onClick={() => setDeleteTarget(item.id)} className="bg-red-600 text-white p-1 rounded"><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                        {data.map(item => (
                            <div key={item.id} className="bg-white border rounded-lg shadow p-4 space-y-2">
                                <h2 className="text-xl font-semibold text-blue-700">{item.propertyName}</h2>
                                <p><strong>Client ID:</strong> {item.clientId}</p>
                                <p><strong>Type:</strong> {item.facilityType}</p>
                                <p><strong>Description:</strong> {item.facilityDescription}</p>
                                <p><strong>Status:</strong> {item.status}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {item.facilityImages?.slice(0, 5).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Facility ${index}`}
                                            className="w-20 h-20 rounded object-cover border"
                                        />
                                    ))}
                                </div>

                                <p><strong>Created:</strong> {item.createdAt?.split('T')[0]}</p>
                                <p><strong>Updated:</strong> {item.updatedAt?.split('T')[0]}</p>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this facility?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Yes</button>
                            <button onClick={() => setDeleteTarget(null)} className="bg-gray-300 text-black px-4 py-2 rounded">No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { useEffect, useState } from 'react';
import { deleteCustomer, fetchCustomerById, fetchCustomer } from '../../../lib/api';
import CustomerAdd from "../../forms/customerAdd/Form";

type CustomerData = {

    id: string;
    clientId: string;
    propertyId: string;
    firstName: string;
    lastName: string;
    title :string;
    isVIP:boolean;
    isForeignCustomer:boolean;
    email: string;
    gender: string;
    mobileNo: string;
    nationality: string;
    idType: string;
    idNumber: string;
    image: string;
    idProof: string;
    address: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function CustomerManagement() {
    const [data, setData] = useState<CustomerData[]>([]);
    const [view, setView] = useState<'table' | 'grid'>('table');
    const [editingData, setEditingData] = useState<CustomerData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleOpen = () => setShowModal(true);


    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetchCustomer();
            setData(res.data);
        } catch (err) {
            console.error('Error fetching customers:', err);
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
            const res = await fetchCustomerById(id);
            setEditingData(res);
            setShowModal(true);
        } catch (error) {
            console.error('Failed to fetch for edit', error);
        }
    };
    // Delete handler
    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            await deleteCustomer(deleteTarget);
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
                            <h1 className="text-xl font-bold"> Customer Management </h1>
                        </div>

                        <div className="w-1/3 flex justify-end gap-2">
                            <button
                                onClick={handleOpen}
                                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
                            >
                                Add Customer
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
                                <CustomerAdd
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
                <h1 className="text-2xl ms-2 font-bold">Customer List</h1>
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
                                    <th className="px-6 py-4">firstName</th>
                                    <th className="px-6 py-4">lastName</th>
                                    <th className="px-6 py-4">VIP</th>
                                    <th className="px-6 py-4">Foreign Customer</th>
                                    <th className="px-6 py-4">email</th>
                                    <th className="px-6 py-4">gender</th>
                                    <th className="px-6 py-4">mobileNo</th>
                                    <th className="px-6 py-4">nationality</th>
                                    <th className="px-6 py-4">idType</th>
                                    <th className="px-6 py-4">idNumber</th>
                                    <th className="px-6 py-4">image</th>
                                    <th className="px-6 py-4">idProof</th>
                                    <th className="px-6 py-4">address</th>
                                    <th className="px-6 py-4">createdAt</th>
                                    <th className="px-6 py-4">updatedAt</th>
                                    <th className="px-6 py-4">isActive</th>
                                    <th className="px-6 py-4">Action </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {data.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">

                                        <td className="px-6 py-3">{item.clientId}</td>
                                        <td className="px-6 py-3">{item.propertyId}</td>
                                        <td className="px-6 py-3">{item.firstName}</td>
                                        <td className="px-6 py-3">{item.lastName}</td>
                                        <td className="px-6 py-3">{item.isVIP ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-3">{item.isForeignCustomer ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-3">{item.email}</td>
                                        <td className="px-6 py-3">{item.gender}</td>
                                        <td className="px-6 py-3">{item.mobileNo}</td>
                                        <td className="px-6 py-3">{item.nationality}</td>
                                        <td className="px-6 py-3">{item.idType?.split('T')[0]}</td>
                                        <td className="px-6 py-3">{item.idNumber?.split('T')[0]}</td>
                                        <td className="px-6 py-3">  <img src={item.image} alt="Customer" className="w-20 h-20 rounded object-cover" /></td>
                                        <td className="px-6 py-3"><img src={item.idProof} alt="ID Proof" className="w-20 h-20 rounded object-cover" /></td>
                                        <td className="px-6 py-3">{item.address}</td>
                                        <td className="px-6 py-3">{item.updatedAt?.split('T')[0]}</td>
                                        <td className="px-6 py-3">{item.createdAt?.split('T')[0]}</td>
                                        <td className="px-6 py-3">{item.isActive ? 'Yes' : 'No'}</td>
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
                                    <h2 className="text-2xl font-semibold text-blue-700">{item.firstName}</h2>
                                    <p className="text-lg text-gray-600"> {item.lastName}  </p>
                                </div>


                                <div className="space-y-1">
                                    <p className="text-sm text-gray-700"><span className="font-medium">clientId:</span> {item.clientId}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">propertyId:</span> {item.propertyId}</p>

                                </div>
                                <div className="border-t border-gray-200 pt-2 space-y-1">
                                    <p className="text-sm text-gray-700"><span className="font-medium">email:</span> {item.email}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">gender:</span> {item.gender}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">mobile No:</span> {item.mobileNo}</p>

                                    <p className="text-sm text-gray-700"><span className="font-medium">nationality:</span> {item.nationality}</p>
                                </div>

                                <div className="border-t border-gray-200 pt-2 space-y-1">
                                    <p className="text-sm text-gray-700"><span className="font-medium">idType:</span> {item.idType}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">idNumber:</span> {item.idNumber}</p>
                                    <div className="flex gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Image:</p>
                                            <img src={item.image} alt="Customer" className="w-20 h-20 rounded object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">ID Proof:</p>
                                            <img src={item.idProof} alt="ID Proof" className="w-20 h-20 rounded object-cover" />
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700"><span className="font-medium">address:</span> {item.address}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">createdAt:</span> {item.createdAt?.split('T')[0]}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">updatedAt:</span> {item.updatedAt?.split('T')[0]}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">Active:</span> {item.isActive ? 'Yes' : 'No'}</p>
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

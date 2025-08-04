'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { deleteGSTRegister, fetchGSTRegisterById, fetchGSTRegister } from '../../../lib/api';
import GSTRegisterAdd from "../../forms/GSTRegisterAdd/Form";


type GSTRegisterData = {
  id?: string;
  clientId: string;
  propertyId: string;
  legalName: string;
  tradeName: string;
  gstNumber: string;
  panNumber: string;
  gstType: string;
  businessType: string;
  email: string;
  phoneNo: string;
  gstStateCode: string;
  cgst: string;
  sgst: string;
  igst: string;                 // ✅ change to string
  registrationDate: string;
  taxJurisdiction: string;     // ✅ change to string
  propertyAddress: string;     // ✅ change to string
  gstCertificateUrl?: string;
  isActive: boolean;
};

export default function GSTRegister() {
    const [data, setData] = useState<GSTRegisterData[]>([]);
    const [view, setView] = useState<'table' | 'grid'>('table');
    const [editingData, setEditingData] = useState<GSTRegisterData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleOpen = () => setShowModal(true);


    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetchGSTRegister();
            setData(res.data);
        } catch (err) {
            console.error('Error fetching GST data:', err);
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
            const res = await fetchGSTRegisterById(id);
            if (!res || !res.id) {
                throw new Error('Record not found');
            }
            setEditingData(res);
            setShowModal(true);
        } catch (error) {
            console.error('Failed to fetch for edit', error);
            alert('Record not found or error fetching data');
        }
    };
    // Delete handler
    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            await deleteGSTRegister(deleteTarget);
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
                            <h1 className="text-xl font-bold">GST Registration</h1>
                        </div>

                        <div className="w-1/3 flex justify-end gap-2">
                            <button
                                onClick={handleOpen}
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
                        {/* Popup Modal */}
                        {showModal && (
                            <div className="fixed inset-0 flex text-black items-center justify-center bg-opacity-50 z-50">
                                <GSTRegisterAdd
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
                <h1 className="text-2xl ms-2 font-bold">GST Registration list</h1>
                {isLoading ? (
                    <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No GST registrations found.</div>
                ) : view === 'table' ? (
                    <div className="overflow-x-auto  shadow bg-white p-4 mt-2">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">client Id</th>
                                    <th className="px-6 py-4">property Id</th>
                                    <th className="px-6 py-4">legalName</th>
                                    <th className="px-6 py-4">tradeName</th>
                                    <th className="px-6 py-4">gstNumber</th>
                                    <th className="px-6 py-4">panNumber</th>
                                    <th className="px-6 py-4">gstType</th>
                                    <th className="px-6 py-4">businessType</th>
                                    <th className="px-6 py-4">email</th>
                                    <th className="px-6 py-4">phoneNo</th>
                                    <th className="px-6 py-4">gstStateCode</th>
                                    <th className="px-6 py-4">cgst</th>
                                    <th className="px-6 py-4">sgst</th>
                                    <th className="px-6 py-4">igst</th>
                                    <th className="px-6 py-4">registrationDate</th>
                                    <th className="px-6 py-4">taxJurisdiction</th>
                                    <th className="px-6 py-4">propertyAddress</th>
                                    <th className="px-6 py-4">gstCertificateUrl</th>
                                    <th className="px-6 py-4">Active</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {data.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">

                                        <td className="px-6 py-3">{item.clientId}</td>
                                        <td className="px-6 py-3">{item.propertyId}</td>
                                        <td className="px-6 py-3">{item.legalName}</td>
                                        <td className="px-6 py-3">{item.tradeName}</td>
                                        <td className="px-6 py-3">{item.gstNumber}</td>
                                        <td className="px-6 py-3">{item.panNumber}</td>
                                        <td className="px-6 py-3">{item.gstType}</td>
                                        <td className="px-6 py-3">{item.businessType}</td>
                                        <td className="px-6 py-3">{item.email}</td>
                                        <td className="px-6 py-3">{item.phoneNo}</td>
                                        <td className="px-6 py-3">{item.gstStateCode}</td>
                                        <td className="px-6 py-3">{item.cgst}</td>
                                        <td className="px-6 py-3">{item.sgst}</td>
                                        <td className="px-6 py-3">{item.igst}</td>
                                        <td className="px-6 py-3">{item.registrationDate?.split('T')[0]}</td>
                                        <td className="px-6 py-3">{item.taxJurisdiction}</td>
                                        <td className="px-6 py-3">{item.propertyAddress}</td>
                                        <td className="px-6 py-3">{item.gstCertificateUrl}</td>
                                        <td className="px-6 py-3">{item.isActive ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-3 flex rounded-b-2xl items-center gap-2">
                                            <button
                                                onClick={() => item.id && handleEdit(item.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md shadow transition duration-200"
                                                title="Edit"
                                            >
                                                <FaEdit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => item.id ? setDeleteTarget(item.id) : undefined}
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
                                    <p className="text-sm text-gray-700"><span className="font-medium">Legal Name:</span> {item.legalName}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">tradeName:</span> {item.tradeName}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">gstNumber:</span> {item.gstNumber}</p>
                                </div>

                                <div className="border-t border-gray-200 pt-2 space-y-1">
                                    <p className="text-sm text-gray-700"><span className="font-medium">panNumber:</span> {item.panNumber}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">gstType:</span> {item.gstType}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">businessType:</span> {item.businessType}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">email :</span> {item.email}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">phoneNo:</span> {item.phoneNo}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">gstStateCode:</span> {item.gstStateCode}</p>
                                </div>

                                <div className="border-t border-gray-200 pt-2 space-y-1">
                                    <p className="text-sm text-gray-700"><span className="font-medium">cgst:</span> {item.cgst}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">sgst:</span> {item.sgst}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">igst:</span> {item.igst}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">registrationDate:</span> {item.registrationDate?.split('T')[0]}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">taxJurisdiction:</span> {item.taxJurisdiction}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">propertyAddress:</span> {item.propertyAddress}</p>
                                    <p className="text-sm text-gray-700"><span className="font-medium">gstCertificateUrl:</span> {item.gstCertificateUrl}</p>
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

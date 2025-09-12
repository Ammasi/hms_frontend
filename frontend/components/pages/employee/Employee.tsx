'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { deleteEmployee, fetchEmployeeById, fetchEmployee } from '../../../lib/api';
import EmployeeAdd from "../../forms/employeeAdd/Form";
import { get } from "lodash";

type EmployeeData = {
  id: string;
  clientId: string;
  propertyId: string;
  name: string;
  email: string;
  mobileNo: string;
  gender: string;
  department: string;
  maritalstatus: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function Employee() {
  const [data, setData] = useState<EmployeeData[]>([]); 
  const [editingData, setEditingData] = useState<EmployeeData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleOpen = () => setShowModal(true);


  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchEmployee();
      const employees = get(res, 'data', []);
      setData(employees);
    } catch (err) {
      console.error('Error fetching employees:', err);
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
      const res = await fetchEmployeeById(id);
      const safeEmployee = {
        id: get(res, 'id', ''),
        clientId: get(res, 'clientId', ''),
        propertyId: get(res, 'propertyId', ''),
        name: get(res, 'name', ''),
        email: get(res, 'email', ''),
        mobileNo: get(res, 'mobileNo', ''),
        gender: get(res, 'gender', ''),
        department: get(res, 'department', ''),
        maritalstatus: get(res, 'maritalstatus', ''),
        address: get(res, 'address', ''),
        isActive: get(res, 'isActive', true),
        createdAt: get(res, 'createdAt', ''),
        updatedAt: get(res, 'updatedAt', ''),
      };
      setEditingData(safeEmployee);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch for edit', error);
    }
  };

  // Delete handler
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteEmployee(deleteTarget);
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
          <h1 className="text-xl font-bold">Employee Management</h1>
        </div>

        <div className="w-1/3 flex justify-end gap-2">
          <button
            onClick={handleOpen}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
          >
            Add
          </button>
        </div>

        {/* Popup Modal */}
        {showModal && (
          <div className="fixed inset-0 flex text-black items-center justify-center bg-opacity-50 z-50">
            <EmployeeAdd
              setShowModal={(val) => {
                setShowModal(val);
                if (!val) setEditingData(null);
              }}
              editingData={editingData}
              onSaved={() => {
                setShowModal(false);
                setEditingData(null);
              }}
              load={load}
            />
          </div>
        )}
      </div>
    </div>

    <h1 className="text-2xl ms-2 font-bold">Employees</h1>

    {isLoading ? (
      <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
    ) : error ? (
      <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
    ) : data.length === 0 ? (
      <div className="text-center py-8 text-gray-500">No Employee found.</div>
    ) : (
      <div className="overflow-x-auto shadow bg-white p-4 mt-2">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
           
              <th className="px-6 py-4">name</th>
              <th className="px-6 py-4">email</th>
              <th className="px-6 py-4">mobileNo</th>
              <th className="px-6 py-4">gender</th>
              <th className="px-6 py-4">department</th>
              <th className="px-6 py-4">maritalstatus</th>
              <th className="px-6 py-4">address</th>
              <th className="px-6 py-4">Active</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data.map((item) => (
              <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
        
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">{item.email}</td>
                <td className="px-6 py-3">{item.mobileNo}</td>
                <td className="px-6 py-3">{item.gender}</td>
                <td className="px-6 py-3">{item.department}</td>
                <td className="px-6 py-3">{item.maritalstatus}</td>
                <td className="px-6 py-3">{item.address}</td>
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
    )}
  </div>

  {deleteTarget && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to delete this record?
        </h2>
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

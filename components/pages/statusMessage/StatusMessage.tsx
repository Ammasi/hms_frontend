'use client';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { deleteStatusMessage, fetchStatusMessageById, fetchStatusMessage } from "../../../lib/api";
import StatusMessageAdd from "../../forms/statusMessageAdd/Form";
import { StatusMessageItem } from "../../interface/StatusMessage";

export default function StatusMessagePage() {
  const [data, setData] = useState<StatusMessageItem[]>([]);
  const [view, setView] = useState<"table" | "grid">("table");
  const [editingData, setEditingData] = useState<StatusMessageItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list: StatusMessageItem[] = await fetchStatusMessage();
      setData(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching Status messages:", err);
      setError("Failed to fetch data");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = async (id: string) => {
    try {
      const res = await fetchStatusMessageById(id);
      const item: StatusMessageItem = res?.data ?? res;
      setEditingData(item);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch for edit", error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteStatusMessage(deleteTarget);
      setData((prev) => prev.filter((item) => item.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (error) {
      setError("Failed to delete the record");
    }
  };

  const StatusBadge = ({ disabled }: { disabled: boolean }) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        disabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }`}
    >
      {disabled ? "Disabled" : "Enabled"}
    </span>
  );

  const renderCard = (item: StatusMessageItem) => (
    <div key={item.id} className="p-5 border rounded-lg shadow-md bg-white flex flex-col">
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <span className="font-medium">Default Name:</span> {item.defaultStatusName}
        </div>
        <div>
          <span className="font-medium">Custom Name:</span> {item.customStatusName}
        </div>
        <div>
          <span className="font-medium">Status:</span>{" "}
          <StatusBadge disabled={item.isEnableOrDisable} />
        </div>
      </div>
      <div className="mt-4 pt-3 flex justify-end gap-2">
        <button
          onClick={() => handleEdit(item.id!)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => setDeleteTarget(item.id!)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-7xl">
        {/* Header */}
        <div className="mb-4 bg-blue-800 p-4 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="w-1/3" />
            <div className="w-1/3 text-center">
              <h1 className="text-xl font-bold">Status Message</h1>
            </div>
            <div className="w-1/3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingData(null);
                  setShowModal(true);
                }}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
              >
                Add
              </button>
              <button
                onClick={() => setView("table")}
                className={`px-4 py-2 rounded-lg ${
                  view === "table" ? "bg-blue-700 text-white" : "bg-blue-900 text-white"
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setView("grid")}
                className={`px-4 py-2 rounded-lg ${
                  view === "grid" ? "bg-blue-700 text-white" : "bg-blue-900 text-white"
                }`}
              >
                Grid View
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <StatusMessageAdd
              setShowModal={(val: boolean) => {
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

        {/* Body */}
        <h2 className="text-2xl ms-2 font-bold mb-2">Status Message</h2>

        {isLoading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No Status Message found.</div>
        ) : view === "table" ? (
          <div className="overflow-x-auto shadow bg-white p-4 mt-2 w-full">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Default Name</th>
                  <th className="px-6 py-4">Custom Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">{item.defaultStatusName}</td>
                    <td className="px-6 py-3">{item.customStatusName}</td>
                    <td className="px-6 py-3">
                      <StatusBadge disabled={item.isEnableOrDisable} />
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id!)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md shadow"
                        title="Edit"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item.id!)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md shadow"
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
            {data.map(renderCard)}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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

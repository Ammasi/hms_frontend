'use client';
import axios from 'axios';
import HotelOwnerAdd from '../../forms/hotelOwnerAdd/Form';
import { useEffect, useState } from 'react';
import { fetchSubscriptions } from '../../../lib/api';

type SubscriptionData = {
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

export default function HotelManagement() {
  const [data, setData] = useState<SubscriptionData[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('table');

  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted');
    handleClose();
  };


  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSubscriptions();
        setData(res.data);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-7xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hotel Owners</h1>
          <button
            onClick={handleOpen}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add
          </button>
          {/* Popup Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">

              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center   bg-opacity-50 z-50">
                  <HotelOwnerAdd setShowModal={setShowModal} />
                </div>
              )}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                &times;
              </button>

            </div>
          )}
          <div>
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 mr-2 rounded ${view === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Grid View
            </button>
          </div>
        </div>

        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Company</th>
                  <th className="border px-4 py-2">Client</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Mobile</th>
                  <th className="border px-4 py-2">GST</th>
                  <th className="border px-4 py-2">Currency</th>
                  <th className="border px-4 py-2">Subscription</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Start Date</th>
                  <th className="border px-4 py-2">End Date</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Docs</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.companyName}</td>
                    <td className="border px-4 py-2">{item.clientName}</td>
                    <td className="border px-4 py-2">{item.clientEmail}</td>
                    <td className="border px-4 py-2">{item.clientMobileNo}</td>
                    <td className="border px-4 py-2">{item.gst}</td>
                    <td className="border px-4 py-2">{item.currency}</td>
                    <td className="border px-4 py-2">{item.subscription}</td>
                    <td className="border px-4 py-2">{item.subscriptionStatus}</td>
                    <td className="border px-4 py-2">{item.subscriptionStartDate?.split('T')[0]}</td>
                    <td className="border px-4 py-2">{item.subscriptionEndDate?.split('T')[0]}</td>
                    <td className="border px-4 py-2">{item.clientAddress}</td>
                    <td className="border px-4 py-2">{item.clientDocuments}</td>
                    <td className="border px-4 py-2">{item.status}</td>
                    <td className="border px-4 py-2">{item.isActive ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.map((item) => (
              <div key={item.id} className="p-4 border rounded shadow-md bg-white">
                <h2 className="text-lg font-bold">{item.companyName}</h2>
                <p>Client: {item.clientName}</p>
                <p>Email: {item.clientEmail}</p>
                <p>Mobile: {item.clientMobileNo}</p>
                <p>GST: {item.gst}</p>
                <p>Currency: {item.currency}</p>
                <p>Subscription: {item.subscription}</p>
                <p>Status: {item.subscriptionStatus}</p>
                <p>Start Date: {item.subscriptionStartDate?.split('T')[0]}</p>
                <p>End Date: {item.subscriptionEndDate?.split('T')[0]}</p>
                <p>Address: {item.clientAddress}</p>
                <p>Docs: {item.clientDocuments}</p>
                <p>Status: {item.status}</p>
                <p>Active: {item.isActive ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

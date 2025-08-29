'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type ReportItem = {
  customerName: string;
  customerAddress: string;
  roomNo: string;
  roomType: string;
  status: string;
  paidAmount: string;
  checkInDate: string;
  checkOutDate: string;
  expectedCheckOut: string;
  graceTime: string;
  reservationId: string;
  customerId: string;
  mobileNumber: string;
  customerEmail: string;
  totalGuests: string;
  checkinMode: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMode: string;
  bedType: string;
  isVip: boolean;
  isForeignCustomer: boolean;
  noOfPax: number;
  childPax: number;
  extraPax: number;
  complimentary: string;
  expectedCheckOutDate: string;
  balanceAmount: string;
  extraServicesUsed: string[];
  feedbackRating: string;
  idProofSubmitted: string;
};

const API_BASE = 'http://192.168.1.8:8000/api/v1/reports/get';
 
function toBackendDate(d?: string): string | undefined {
  return d || undefined;
}

export default function BookingReportClient() {
  const { user } = useAuth();
 
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
 
  const [fromDate, setFromDate] = useState<string>(todayISO);
  const [toDate, setToDate] = useState<string>(todayISO);
  const [roomType, setRoomType] = useState<string>('');

  const [data, setData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>('');

  const fetchReport = async () => {
    if (!user?.clientId || !user?.propertyId) {
      setErr('Missing clientId/propertyId from user context.');
      return;
    }

    setLoading(true);
    setErr('');

    try {
      const params = new URLSearchParams();
 
      if (user.clientId) params.set('clientId', user.clientId);
      if (user.propertyId) params.set('propertyId', user.propertyId);

      const fd = toBackendDate(fromDate);
      const td = toBackendDate(toDate);
      if (fd) params.set('fromDate', fd);
      if (td) params.set('toDate', td);
      if (roomType) params.set('roomType', roomType);

      const url = `${API_BASE}?${params.toString()}`;
      console.log('GET:', url);

      const res = await axios.get<ReportItem[]>(url, {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      });

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to fetch booking report.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (user?.clientId && user?.propertyId) {
      fetchReport();
    }
     
  }, [user]);

  if (!user) return <div className="p-6">Loading user…</div>;

  return (
    <div className="bg-amber-50 min-h-full h-full p-6">
      <h1 className="text-2xl font-semibold mb-4">Booking Report</h1>
 
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Room Type</label>
            <input
              type="text"
              placeholder="e.g., 2"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={fetchReport}
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
            disabled={loading}
          >
            {loading ? 'Fetching…' : 'Execute'}
          </button>

          <button
            onClick={() => {
              setFromDate(todayISO);
              setToDate(todayISO);
              setRoomType('2');
              setErr('');
              setData([]);
              fetchReport();  
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {err}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Room No</th>
              <th className="px-3 py-2 text-left">Room Type</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Paid</th>
              <th className="px-3 py-2 text-left">Total</th>
              <th className="px-3 py-2 text-left">Payment</th>
              <th className="px-3 py-2 text-left">Check-In</th>
              <th className="px-3 py-2 text-left">Expected Check-Out</th>
              <th className="px-3 py-2 text-left">Mobile</th>
              <th className="px-3 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !loading ? (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-gray-500">
                  No data. Adjust filters and click <b>Execute</b>.
                </td>
              </tr>
            ) : (
              data.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2">{r.customerName}</td>
                  <td className="px-3 py-2">{r.roomNo}</td>
                  <td className="px-3 py-2">{r.roomType}</td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2">{r.paidAmount}</td>
                  <td className="px-3 py-2">{r.totalAmount}</td>
                  <td className="px-3 py-2">{r.paymentMode}</td>
                  <td className="px-3 py-2">{r.checkInDate}</td>
                  <td className="px-3 py-2">{r.expectedCheckOutDate || r.expectedCheckOut}</td>
                  <td className="px-3 py-2">{r.mobileNumber}</td>
                  <td className="px-3 py-2">{r.customerEmail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          Showing <b>{data.length}</b> record{data.length > 1 ? 's' : ''}.
        </div>
      )}
    </div>
  );
}

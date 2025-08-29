'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type StayReportItem = {
  customerName: string;
  customerAddress: string;
  customerId: string;
  mobileNumber: string;
  customerEmail?: string;
  totalGuests: string;
  checkinMode: string;
  reservationId: string;
  paymentStatus: string;
  totalAmount: number | string;
  paymentMode: string;
  roomNo: string;
  roomType: string;
  bedType: string;
  isVip: boolean;
  isForeignCustomer: boolean;
  noOfPax: number;
  childPax: number;
  extraPax: number;
  complimentary: string;
  status: string;
  paidAmount: string;
  checkInDate: string;
  checkOutDate: string;
  expectedCheckOutDate: string;
  graceTime: string;
  balanceAmount: number | string;
  extraServicesUsed: string[];
  feedbackRating?: string;
  idProofSubmitted: string;
};

const API_BASE_STAY = 'http://192.168.1.8:8000/api/v1/stay-report/';

function toBackendDate(d?: string): string | undefined {
  return d || undefined;
}

export default function StayReport() {
  const { user } = useAuth();
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [fromDate, setFromDate] = useState<string>(todayISO);
  const [toDate, setToDate] = useState<string>(todayISO);
  const [roomType, setRoomType] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');

  const [data, setData] = useState<StayReportItem[]>([]);
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

      params.set('clientId', user.clientId);
      params.set('propertyId', user.propertyId);

      if (fromDate && fromDate !== todayISO) params.set('fromDate', fromDate);
      if (toDate && toDate !== todayISO) params.set('toDate', toDate);
      if (roomType && roomType !== 'all') params.set('roomType', roomType);
      if (customerName.trim()) params.set('customerName', customerName.trim());

      const url = `${API_BASE_STAY}?${params.toString()}`;
      console.log('GET:', url);

      type ApiResponse = { success: boolean; message: string; data: StayReportItem[] };
      const res = await axios.get<ApiResponse>(url, {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      });

      setData(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to fetch stay report.');
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
      <h1 className="text-2xl font-semibold mb-4">Stay Report</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
              placeholder="e.g., 1"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              placeholder="Search by name"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
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
              setRoomType('1');
              setCustomerName('');
              setErr('');
              setData([]);
              fetchReport(); // refetch with defaults
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
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Address</th>
              <th className="px-3 py-2 text-left">Mobile</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Room No</th>
              <th className="px-3 py-2 text-left">Room Type</th>
              <th className="px-3 py-2 text-left">Bed</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Paid</th>
              <th className="px-3 py-2 text-left">Total</th>
              <th className="px-3 py-2 text-left">Payment</th>
              <th className="px-3 py-2 text-left">Check-In</th>
              <th className="px-3 py-2 text-left">Expected Check-Out</th>
              <th className="px-3 py-2 text-left">Check-Out</th>
              <th className="px-3 py-2 text-left">Balance</th>
              <th className="px-3 py-2 text-left">VIP</th>
              <th className="px-3 py-2 text-left">Foreign</th>
              <th className="px-3 py-2 text-left">PAX</th>
              <th className="px-3 py-2 text-left">Child</th>
              <th className="px-3 py-2 text-left">Extra</th>
              <th className="px-3 py-2 text-left">Complimentary</th>
              <th className="px-3 py-2 text-left">Grace</th>
              <th className="px-3 py-2 text-left">Extra Services</th>
              <th className="px-3 py-2 text-left">Feedback</th>
              <th className="px-3 py-2 text-left">ID Proof</th>
              <th className="px-3 py-2 text-left">Reservation</th>
              <th className="px-3 py-2 text-left">Checkin Mode</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !loading ? (
              <tr>
                <td colSpan={27} className="px-3 py-8 text-center text-gray-500">
                  No data. Adjust filters and click <b>Execute</b>.
                </td>
              </tr>
            ) : (
              data.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2">{r.customerName}</td>
                  <td className="px-3 py-2">{r.customerAddress}</td>
                  <td className="px-3 py-2">{r.mobileNumber}</td>
                  <td className="px-3 py-2">{r.customerEmail || '-'}</td>
                  <td className="px-3 py-2">{r.roomNo}</td>
                  <td className="px-3 py-2">{r.roomType}</td>
                  <td className="px-3 py-2">{r.bedType}</td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2">{r.paidAmount}</td>
                  <td className="px-3 py-2">{r.totalAmount}</td>
                  <td className="px-3 py-2">{r.paymentMode}</td>
                  <td className="px-3 py-2">{r.checkInDate}</td>
                  <td className="px-3 py-2">
                    {r.expectedCheckOutDate}
                  </td>
                  <td className="px-3 py-2">{r.checkOutDate || '-'}</td>
                  <td className="px-3 py-2">{r.balanceAmount}</td>
                  <td className="px-3 py-2">{r.isVip ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2">{r.isForeignCustomer ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2">{r.noOfPax}</td>
                  <td className="px-3 py-2">{r.childPax}</td>
                  <td className="px-3 py-2">{r.extraPax}</td>
                  <td className="px-3 py-2">{r.complimentary || '-'}</td>
                  <td className="px-3 py-2">{r.graceTime}</td>
                  <td className="px-3 py-2">
                    {Array.isArray(r.extraServicesUsed) && r.extraServicesUsed.length > 0
                      ? r.extraServicesUsed.join(', ')
                      : '-'}
                  </td>
                  <td className="px-3 py-2">{r.feedbackRating || '-'}</td>
                  <td className="px-3 py-2">{r.idProofSubmitted}</td>
                  <td className="px-3 py-2">{r.reservationId}</td>
                  <td className="px-3 py-2">{r.checkinMode}</td>
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

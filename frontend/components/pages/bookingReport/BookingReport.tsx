// 24-09-2025 format data time function add in 12 AM or PM , No. row add in table 

'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { fetchReport } from '../../../lib/api';
import { ReportItem } from '../../interface/bookingReport';

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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-IN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const handleFetch = async () => {
    if (!user?.clientId || !user?.propertyId) {
      setErr("Missing clientId/propertyId from user context.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const fd = toBackendDate(fromDate);
      const td = toBackendDate(toDate);

      const data = await fetchReport({
        clientId: user.clientId,
        propertyId: user.propertyId,
        fromDate: fd,
        toDate: td,
        roomType,
      });

      setData(data);
    } catch (e: any) {
      setErr(e.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.clientId && user?.propertyId) {
      handleFetch();
    }

  }, [user]);

  if (!user) return <div className="p-6">Loading user…</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
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
            onClick={handleFetch}
            className="px-4 py-2 rounded-lg bg-black  text-white hover:opacity-90"
            disabled={loading}
          >
           Execute
          </button>

          <button
            onClick={() => {
              setFromDate(todayISO);
              setToDate(todayISO);
              setRoomType('2');
              setErr('');
              setData([]);
              handleFetch();
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

      <div className="bg-white rounded-xl shadow ">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">No.</th>
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

                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{r.customerName}</td>
                  <td className="px-3 py-2">{r.roomNo}</td>
                  <td className="px-3 py-2">{r.roomType}</td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2">{r.paidAmount}</td>
                  <td className="px-3 py-2">{r.totalAmount}</td>
                  <td className="px-3 py-2">{r.paymentMode}</td>
                  <td className="px-3 py-2">{formatDateTime(r.checkInDate)}</td>
                  <td className="px-3 py-2">{formatDateTime(r.expectedCheckOut)}</td>
                  <td className="px-3 py-2">{r.mobileNumber}</td>
                  <td className="px-3 py-2">{r.customerEmail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

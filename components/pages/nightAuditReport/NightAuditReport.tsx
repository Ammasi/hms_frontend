'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type NightAuditCustomer = {
  customerName: string;
  customerAddress: string;
  customerId: string;
  mobileNumber: string;
  customerEmail: string;
  totalGuests: string;
  checkInDate: string;
  checkOutDate: string;
  expectedCheckOutDate: string;
  graceTime: string;
};

type NightAuditResponse = {
  date: string; // e.g., "2025-08-29"
  totalCheckouts: number;
  customers: NightAuditCustomer[];
};

const API_BASE_NIGHT = 'http://192.168.1.8:8000/api/v1/reports/night-audit';

 
function toBackendDate(d?: string): string | undefined {
  return d || undefined;
}

export default function NightAuditReportClient() {
  const { user } = useAuth();

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

 
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const [data, setData] = useState<NightAuditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

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

 
      if (fromDate) params.set('fromDate', toBackendDate(fromDate)!);
      if (toDate) params.set('toDate', toBackendDate(toDate)!);

      const url = `${API_BASE_NIGHT}?${params.toString()}`;
      console.log('GET:', url);

      const res = await axios.get<NightAuditResponse>(url, {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      });

      setData(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to fetch night audit report.');
      setData(null);
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

  const dateLabel = data?.date ?? '-';
  const totalCheckouts = data?.totalCheckouts ?? 0;
  const customers = data?.customers ?? [];

  return (
    <div className="bg-amber-50 min-h-full h-full p-6">
      <h1 className="text-2xl font-semibold mb-4">Night Audit – Checkout Report</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder={todayISO}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder={todayISO}
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={fetchReport}
              className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Fetching…' : 'Execute'}
            </button>
            <button
              onClick={() => {
                setFromDate('');
                setToDate('');
                setErr('');
                setData(null);
                fetchReport();  
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              disabled={loading}
            >
              Reset (All)
            </button>
          </div>
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {err}
        </div>
      )}

      {/* Summary */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Report Date</div>
            <div className="text-xl font-semibold">{dateLabel}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Total Checkouts</div>
            <div className="text-2xl font-extrabold">{totalCheckouts}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Address</th>
              <th className="px-3 py-2 text-left">Mobile</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Total Guests</th>
              <th className="px-3 py-2 text-left">Check-In</th>
              <th className="px-3 py-2 text-left">Expected Check-Out</th>
              <th className="px-3 py-2 text-left">Check-Out</th>
              <th className="px-3 py-2 text-left">Grace Time</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && !loading ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                  No checkouts found. Adjust filters and click <b>Execute</b>.
                </td>
              </tr>
            ) : (
              customers.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2">{r.customerName}</td>
                  <td className="px-3 py-2">{r.customerAddress}</td>
                  <td className="px-3 py-2">{r.mobileNumber}</td>
                  <td className="px-3 py-2">{r.customerEmail || '-'}</td>
                  <td className="px-3 py-2">{r.totalGuests}</td>
                  <td className="px-3 py-2">{r.checkInDate}</td>
                  <td className="px-3 py-2">{r.expectedCheckOutDate || '-'}</td>
                  <td className="px-3 py-2">{r.checkOutDate || '-'}</td>
                  <td className="px-3 py-2">{r.graceTime || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {customers.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          Showing <b>{customers.length}</b> checkout{customers.length > 1 ? 's' : ''}.
        </div>
      )}
    </div>
  );
}

// 24-9-2025  Select Date add if you choose date that values show in data. formatDateTime India ,handle FetchNightAudit update.

'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { NightAuditResponse } from '../../interface/nightAuditReport';
import { fetchNightAuditReport } from '../../../lib/api';

function formatDateTimeIndia(dateString?: string) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}

function todayYMD() {
  const d = new Date();
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export default function NightAuditReportClient() {
  const { user } = useAuth();

  const [data, setData] = useState<NightAuditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Default to today's date (no localStorage)
  const [selectedDate, setSelectedDate] = useState<string>(todayYMD());

  const handleFetchNightAudit = async () => {
    if (!user?.clientId || !user?.propertyId) {
      setErr('Missing clientId/propertyId from user context.');
      return;
    }

    setLoading(true);
    setErr('');

    try {
      const params: any = {
        clientId: user.clientId,
        propertyId: user.propertyId,
      };

      const report = await fetchNightAuditReport(params);
      setData(report);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load report');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.clientId && user?.propertyId) handleFetchNightAudit();
  }, [user]);

  if (!user) return <div className="p-6">Loading user…</div>;

  const customers = data?.customers ?? [];

  // If API returns a date and the user hasn't changed the date (still today's),
  // adopt the server date. Otherwise keep user's selection.
  useEffect(() => {
    if (!data) return;
    try {
      const apiDate = data.date;
      if (!apiDate) return;
      if (selectedDate === todayYMD()) {
        setSelectedDate(apiDate);
      }
    } catch { }
  }, [data]);

  const filteredCustomers = useMemo(() => {
    if (!customers || customers.length === 0) return [];

    return customers.filter((c) => {
      const dateStr = c.checkOutDate ?? c.expectedCheckOutDate ?? null;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      const ymd = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      return ymd === selectedDate;
    });
  }, [customers, selectedDate]);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-2xl font-semibold mb-4">Night Audit - Checkout Report</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="ml-auto text-sm text-gray-600">Showing results for: <b>{selectedDate}</b></div>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{err}</div>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-center">No</th>
              <th className="px-3 py-2 text-center">Customer</th>
              <th className="px-3 py-2 text-center">Address</th>
              <th className="px-3 py-2 text-center">Mobile</th>
              <th className="px-3 py-2 text-center">Email</th>
              <th className="px-3 py-2 text-center">Total Guests</th>
              <th className="px-3 py-2 text-center">Check-In</th>
              <th className="px-3 py-2 text-center">Expected Check-Out</th>
              <th className="px-3 py-2 text-center">Check-Out</th>
              <th className="px-3 py-2 text-center">Grace Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 && !loading ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-gray-500">
                  No checkouts for <b>{selectedDate}</b>.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((r, idx) => (
                <tr key={r.customerId ?? idx} className="border-t text-center">
                  <td className="px-3 py-2">{idx + 1}.</td>
                  <td className="px-3 py-2">{r.customerName}</td>
                  <td className="px-3 py-2">{r.customerAddress}</td>
                  <td className="px-3 py-2">{r.mobileNumber}</td>
                  <td className="px-3 py-2">{r.customerEmail || '-'}</td>
                  <td className="px-3 py-2">{r.totalGuests}</td>
                  <td className="px-3 py-2">{formatDateTimeIndia(r.checkInDate)}</td>
                  <td className="px-3 py-2">{formatDateTimeIndia(r.expectedCheckOutDate)}</td>
                  <td className="px-3 py-2">{formatDateTimeIndia(r.checkOutDate)}</td>
                  <td className="px-3 py-2">{r.graceTime || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

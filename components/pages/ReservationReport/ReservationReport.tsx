'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { IReservationList } from '../../interface/reservationReport';
import { fetchReservationReport } from '../../../lib/api';

type ReservationRow = Record<string, any>;

function toBackendDate(d?: string): string | undefined {
    return d || undefined;
}

function toNumber(n: any, fallback = 0): number {
    const v = typeof n === 'number' ? n : parseFloat(n ?? '');
    return Number.isFinite(v) ? v : fallback;
}

function fixDateString(d: any): string {

    if (!d) return '';
    const t = new Date(d);
    return isNaN(+t) ? String(d) : t.toISOString().slice(0, 10);
}

function normalizeReservationRow(row: ReservationRow): IReservationList {
    return {
        reservationNo: String(row.reservationNo ?? row.res_no ?? ''),
        bookingId: String(row.bookingId ?? row.booking_id ?? ''),
        bookedOn: fixDateString(row.bookedOn ?? row.booked_on ?? row.bookedDate),
        name: String(row.name ?? row.customerName ?? ''),
        contact: String(row.contact ?? row.mobile ?? row.phone ?? ''),
        status: String(row.status ?? ''),
        arrivalDate: fixDateString(row.arrivalDate ?? row.arrival_date),

        departureDate: fixDateString(row.departureDate ?? row.depatureDate ?? row.departure_date),
        arrivalMode: String(row.arrivalMode ?? row.modeOfArrival ?? ''),
        advanceAmount: toNumber(row.advanceAmount ?? row.advance ?? 0),
        noOfRooms: toNumber(row.noOfRooms ?? row.rooms ?? 0),
    };
}

export default function ReservationReportClient() {
    const { user } = useAuth();


    const [arrivalFrom, setArrivalFrom] = useState<string>('');
    const [arrivalTo, setArrivalTo] = useState<string>('');
    const [bookedFrom, setBookedFrom] = useState<string>('');
    const [bookedTo, setBookedTo] = useState<string>('');
    const [cancelFrom, setCancelFrom] = useState<string>('');
    const [cancelTo, setCancelTo] = useState<string>('');
    const [showList, setShowList] = useState<string>('');
    const [arrivalMode, setArrivalMode] = useState<string>('');
    const [timewise, setTimewise] = useState<string>('');

    const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const [data, setData] = useState<IReservationList[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const handleFetchReservation = async () => {
        if (!user?.clientId || !user?.propertyId) {
            setErr("Missing clientId/propertyId from user context.");
            return;
        }

        setLoading(true);
        setErr("");

        try {
            const data = await fetchReservationReport({
                clientId: user.clientId,
                propertyId: user.propertyId,
                arrivalFrom: arrivalFrom ? toBackendDate(arrivalFrom)! : undefined,
                arrivalTo: arrivalTo ? toBackendDate(arrivalTo)! : undefined,
                bookedFrom: bookedFrom ? toBackendDate(bookedFrom)! : undefined,
                bookedTo: bookedTo ? toBackendDate(bookedTo)! : undefined,
                cancelFrom: cancelFrom ? toBackendDate(cancelFrom)! : undefined,
                cancelTo: cancelTo ? toBackendDate(cancelTo)! : undefined,
                showList: showList.trim() || undefined,
                arrivalMode: arrivalMode.trim() || undefined,
                timewise: timewise.trim() || undefined,
            });

            setData(data.map(normalizeReservationRow));
        } catch (e: any) {
            setErr(e.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user?.clientId && user?.propertyId) {
            handleFetchReservation();
        }

    }, [user]);

    if (!user) return <div className="p-6">Loading user…</div>;


    const columns: Array<keyof IReservationList> = useMemo(
        () => [
            'reservationNo',
            'bookingId',
            'bookedOn',
            'name',
            'contact',
            'status',
            'arrivalDate',
            'departureDate',
            'arrivalMode',
            'advanceAmount',
            'noOfRooms',
        ],
        []
    );

    const hasAnyFilter =
        arrivalFrom ||
        arrivalTo ||
        bookedFrom ||
        bookedTo ||
        cancelFrom ||
        cancelTo ||
        showList ||
        arrivalMode ||
        timewise;

    return (
        <div className="bg-amber-50 min-h-full h-full p-6">
            <h1 className="text-2xl font-semibold mb-4">Reservation Report</h1>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Arrival From</label>
                        <input
                            type="date"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={arrivalFrom}
                            onChange={(e) => setArrivalFrom(e.target.value)}
                            placeholder={todayISO}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Arrival To</label>
                        <input
                            type="date"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={arrivalTo}
                            onChange={(e) => setArrivalTo(e.target.value)}
                            placeholder={todayISO}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Booked From</label>
                        <input
                            type="date"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={bookedFrom}
                            onChange={(e) => setBookedFrom(e.target.value)}
                            placeholder={todayISO}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Booked To</label>
                        <input
                            type="date"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={bookedTo}
                            onChange={(e) => setBookedTo(e.target.value)}
                            placeholder={todayISO}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Cancel From</label>
                        <input
                            type="date"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={cancelFrom}
                            onChange={(e) => setCancelFrom(e.target.value)}
                            placeholder={todayISO}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Cancel To</label>
                        <input
                            type="date"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={cancelTo}
                            onChange={(e) => setCancelTo(e.target.value)}
                            placeholder={todayISO}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Show List</label>
                        <input
                            type="text"
                            placeholder="e.g., arrivals, cancellations…"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={showList}
                            onChange={(e) => setShowList(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Arrival Mode</label>
                        <input
                            type="text"
                            placeholder="e.g., walkin, online…"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={arrivalMode}
                            onChange={(e) => setArrivalMode(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Timewise</label>
                        <input
                            type="text"
                            placeholder="e.g., yes/no or a mode"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={timewise}
                            onChange={(e) => setTimewise(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleFetchReservation}
                        className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
                        disabled={loading}
                    >
                        {loading ? 'Fetching…' : 'Execute'}
                    </button>

                    <button
                        onClick={() => {
                            setArrivalFrom('');
                            setArrivalTo('');
                            setBookedFrom('');
                            setBookedTo('');
                            setCancelFrom('');
                            setCancelTo('');
                            setShowList('');
                            setArrivalMode('');
                            setTimewise('');
                            setErr('');
                            setData([]);
                            handleFetchReservation();
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        disabled={loading}
                    >
                        Reset (All)
                    </button>
                </div>

            </div>

            {err && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{err}</div>
            )}

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-[1100px] w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            {columns.map((col) => (
                                <th key={col as string} className="px-3 py-2 text-left">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-500">
                                    No data. Adjust filters and click <b>Execute</b>.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={idx} className="border-t">
                                    {columns.map((col) => (
                                        <td key={col as string} className="px-3 py-2">
                                            {fmt(row[col], col)}
                                        </td>
                                    ))}
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

/** Pretty-print values for the fixed table */
function fmt(val: any, key?: keyof IReservationList) {
    if (val == null || val === '') return '-';
    if (key === 'bookedOn' || key === 'arrivalDate' || key === 'departureDate') {
        const d = new Date(val);
        return isNaN(+d) ? String(val) : d.toLocaleDateString();
    }
    if (key === 'advanceAmount') return `₹${val}`;
    return String(val);
}

"use client";

import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://192.168.1.4:8000";
const DEFAULT_COMMON_ID = "cf41cf3e-bb06-409a-84de-4814eba8cf4f";

type Room = {
  id?: string;
  floorName?: string;
  roomNumber?: string | number;
  roomName?: string;
  roomType?: string;
  roomStatus?: string;
  category?: string;
  roomRentPerDay?: string | number;
  maxOccupancy?: number;
  guestName?: string;
  bookingAmount?: string | number;
  meta?: any;
};

/* ---------- helpers ---------- */
function statusPalette(status?: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("vacant") || s.includes("available"))
    return { bg: "bg-yellow-400", dot: "bg-green-400", label: "Vacant" };
  if (s.includes("occupied") || s.includes("booked") || s.includes("reserved"))
    return { bg: "bg-red-400", dot: "bg-red-400", label: "Occupied" };
  if (s.includes("dirty")) return { bg: "bg-sky-400", dot: "bg-sky-400", label: "Dirty" };
  if (s.includes("block") || s.includes("blocked"))
    return { bg: "bg-violet-500", dot: "bg-violet-500", label: "Blocked" };
  if (s.includes("maint") || s.includes("maintenance"))
    return { bg: "bg-gray-400", dot: "bg-gray-400", label: "Maint" };
  return { bg: "bg-green-400", dot: "bg-green-400", label: (status || "Vacant").toUpperCase() };
}

function timeFromISO(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isSameLocalDay(iso?: string, ref = new Date()) {
  if (!iso) return false;
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}

/* ---------- RoomCard ---------- */
function RoomCard({ room }: { room: Room }) {
  const pal = statusPalette(room.roomStatus);

  const guest =
    room.guestName ||
    room.meta?.guestName ||
    room.meta?.guest?.name ||
    room.meta?.customerName ||
    room.meta?.primaryGuest ||
    undefined;

  const amount =
    room.bookingAmount || room.meta?.bookingAmount || room.roomRentPerDay || room.meta?.amount || undefined;
  const occupied = Boolean(guest || (room.roomStatus || "").toLowerCase().includes("occupied"));

  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node | null;
      if (
        popupRef.current &&
        containerRef.current &&
        target &&
        !popupRef.current.contains(target) &&
        !containerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  function handleKeyToggle(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((s) => !s);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`h-25 w-55 relative ${pal.bg} flex items-center gap-3 p-2 rounded-lg shadow-sm transition-all duration-150 cursor-pointer`}
      tabIndex={0}
      role="button"
      aria-expanded={open}
      aria-label={`Room ${room.roomNumber} ${room.roomType ?? ""} ${room.roomStatus ?? ""}`}
      onClick={() => setOpen((s) => !s)}
      onKeyDown={handleKeyToggle}
    >
      <div className="flex-shrink-0 w-14 flex items-center justify-center">
        <div
          className="relative w-15 h-15 rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, #ffffff 0%, #cbd5e1 20%, #94a3b8 60%, #475569 100%)",
            boxShadow:
              "inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -6px 12px rgba(0,0,0,0.28), 0 8px 20px rgba(2,6,23,0.25)",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              inset: 1,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.15)",
            }}
          />
          <span className="relative z-10 text-black font-extrabold text-2xl drop-shadow-sm">{room.roomNumber}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-lg font-bold text-slate-900 truncate">{room.roomType}</div>

        {occupied ? (
          <>
            <div className="mt-0.5 px-2 py-0.5 rounded-md text-xl font-medium text-slate-700">
              <span className="block truncate">{guest ?? "Name"}</span>
            </div>
            {amount && <div className="mt-1 text-xl text-slate-800 font-medium truncate">{amount}</div>}
          </>
        ) : (
          <div className="mt-1">
            <span
              className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${pal.bg} bg-opacity-90`}
            >
              {room.roomStatus ?? pal.label}
            </span>
          </div>
        )}
      </div>

      {open && (
        <div
          ref={popupRef}
          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50"
          style={{ width: 220 }}
          role="dialog"
          aria-label={`Details for room ${room.roomNumber}`}
        >
          <div className="relative">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white" />
            <div className="bg-white rounded-md shadow-lg p-3 text-[12px] border border-slate-100">
              <div className="font-semibold mb-1 text-sm">Room {room.roomNumber}</div>
              <div className="mb-0.5 text-xs text-slate-700">
                <span className="font-medium">Type:</span> {room.roomType ?? "—"}
              </div>
              <div className="mb-0.5 text-xs text-slate-700">
                <span className="font-medium">Status:</span> {room.roomStatus ?? "—"}
              </div>
              {occupied && guest && (
                <div className="mb-0.5 text-xs text-slate-700">
                  <span className="font-medium">Guest:</span> {guest}
                </div>
              )}
              {occupied && amount && (
                <div className="text-xs text-slate-700">
                  <span className="font-medium">Amount:</span> {amount}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Page component (rooms scroll inside left column) ---------- */
export default function Page(): JSX.Element {
  const searchParams = useSearchParams();
  const commonId = searchParams?.get("commonId") ?? DEFAULT_COMMON_ID;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  const [checkouts, setCheckouts] = useState<Array<{ roomNo: string; time: string }>>([]);
  const [loadingCheckouts, setLoadingCheckouts] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingRooms(true);
    setRoomsError(null);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/room/property/${commonId}`);
        if (!res.ok) throw new Error(`Failed to load rooms (${res.status})`);
        const data = await res.json();
        if (!mounted) return;
        setRooms(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!mounted) return;
        setRoomsError(err?.message ?? "Error loading rooms");
      } finally {
        if (mounted) setLoadingRooms(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [commonId]);

  useEffect(() => {
    let mounted = true;
    setLoadingCheckouts(true);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/customer-info/`);
        if (!res.ok) throw new Error("Failed to load customer-info");
        const data = await res.json();
        if (!mounted) return;
        const today = new Date();
        const list: Array<{ roomNo: string; time: string }> = [];
        data.forEach((item: any) => {
          const checkoutIso = item.checkin?.checkoutDate ?? item.bookingDetails?.checkoutDate;
          if (checkoutIso && isSameLocalDay(checkoutIso, today)) {
            const sd = item.stayDetails?.[0];
            const roomNo = sd?.roomNo ?? "—";
            const time = timeFromISO(checkoutIso) || "";
            list.push({ roomNo, time });
          }
        });
        if (list.length === 0) {
          list.push({ roomNo: "19", time: "15:50" });
          list.push({ roomNo: "17", time: "15:50" });
          list.push({ roomNo: "8", time: "17:47" });
        }
        setCheckouts(list);
      } catch {
        setCheckouts([
          { roomNo: "19", time: "15:50" },
          { roomNo: "17", time: "15:50" },
          { roomNo: "8", time: "17:47" },
        ]);
      } finally {
        if (mounted) setLoadingCheckouts(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [commonId]);

  const grouped = useMemo(() => {
    return rooms.reduce<Record<string, Room[]>>((acc, r) => {
      const key = r.floorName ?? "No Floor";
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});
  }, [rooms]);

  const floorKeys = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      const la = a.toLowerCase();
      const lb = b.toLowerCase();
      if (la.includes("ground") && !lb.includes("ground")) return -1;
      if (lb.includes("ground") && !la.includes("ground")) return 1;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
    });
  }, [grouped]);

  const informatics = useMemo(() => {
    const info = {
      vacant: 0,
      occupied: 0,
      dirty: 0,
      blocked: 0,
      maintenance: 0,
      cleaning: 0,
      total: rooms.length,
      pax: 0,
      chkIn: 0,
      chkOut: 0,
    };
    rooms.forEach((r) => {
      const s = (r.roomStatus || "").toLowerCase();
      if (s.includes("vacant") || s.includes("available")) info.vacant++;
      else if (s.includes("occupied") || s.includes("booked") || s.includes("reserved")) {
        info.occupied++;
        if (typeof r.maxOccupancy === "number") info.pax += r.maxOccupancy;
        info.chkIn++;
      } else if (s.includes("dirty")) info.dirty++;
      else if (s.includes("block")) info.blocked++;
      else if (s.includes("maint")) info.maintenance++;
      else if (s.includes("clean")) info.cleaning++;
      else info.vacant++;
    });
    return info;
  }, [rooms]);

  const reservationDays = [
    { date: "Sat,14-Jun", count: 2 },
    { date: "Sun,15-Jun", count: 0 },
    { date: "Mon,16-Jun", count: 0 },
    { date: "Tue,17-Jun", count: 0 },
    { date: "Wed,18-Jun", count: 0 },
    { date: "Thu,19-Jun", count: 0 },
  ];

  return (

    <div className=" min-h-[calc(100vh-64px)] bg-gray-100 p-3   overflow-hidden">
      <div className="grid grid-cols-12  ">

        <div className="col-span-9 h-full">
          <div className="max-h-[calc(100vh-220px)] overflow-auto pr-4 h-full">
            {loadingRooms && <div className="p-8 bg-white rounded shadow text-center">Loading rooms...</div>}
            {roomsError && <div className="p-4 bg-red-50 text-red-700 rounded">{roomsError}</div>}

            <div className="space-y-2">
              {floorKeys.map((floor) => {
                const list = grouped[floor] ?? [];
                return (
                  <div key={floor} className="bg-white ab rounded-2xl p-2 shadow-sm border border-gray-200 relative">
                    {/* Floor label */}
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-sky-500 rounded-l-md" />
                      <div className="bg-sky-50 px-2 py-1 rounded text-sky-700 font-medium text-xs border border-sky-200 shadow-sm">
                        {floor.toUpperCase()}
                      </div>
                    </div>

                    {/* Rooms list */}
                    <div className="flex flex-wrap gap-3 items-center mt-2">
                      {list.map((room, idx) => {
                        const key = room.id ?? `${room.roomNumber ?? room.roomName ?? idx}-${idx}`;
                        return (
                          <div key={key}>
                            <RoomCard room={room} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Fixed right widgets (hidden on small screens) */}
      <div className="">
        <div className="fixed right-6 top-15 z-40 w-52">
          {/* Search */}
          <div className="  rounded   p-2   ">
            <input placeholder="search" className="px-3 py-2 rounded-full border    text-sm" />
            <div className="mt-3 flex justify-end">
              <button className="px-3 py-1 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-full text-xs">Floor Wise</button>
            </div>
          </div>

          {/* Rooms In Grace Time */}
          <div className="bg-white rounded shadow p-4   border border-gray-200">
            <h3 className="text-sm font-semibold mb-2">Rooms In Grace Time</h3>
            <div className="h-28 border rounded p-2 text-xs text-gray-500 overflow-auto">No items</div>
          </div>

          {/* Today's Expected Checkout */}
          <div className="bg-white rounded shadow p-4 border border-gray-200">
            <h3 className="text-sm font-semibold mb-2">Today's Expected Checkout</h3>
            <div className="text-xs text-gray-500 mb-2">{loadingCheckouts ? "Loading..." : ""}</div>
            <ul className="mt-3 space-y-2 text-sm">
              {checkouts.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span>{c.roomNo}</span>
                  <span className="text-gray-500">{c.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
 
      <div
        className="fixed left-4 right-4 bottom-4 "
       
        aria-label="Quick informatics and reservation panel"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200 p-4">
            <div className="grid grid-cols-12  ">

              {/* Left: Informatics (spans 9 on md+, full width on small screens) */}
              <div className="col-span-12 md:col-span-9">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold bg-sky-100 text-sky-700 px-3 py-1 rounded-md">Informatics</span>
                </div>

                {/* Make the stats horizontally scrollable on narrow screens to avoid layout break */}
                <div className="text-xs mb-3">
                  <div className="overflow-x-auto">
                    <div className="min-w-[720px]">   
                      <div className="flex items-center gap-4 mb-2 whitespace-nowrap">
                        <div className="font-semibold">Type</div>
                        <div className="font-semibold">Vacant</div>
                        <div className="font-semibold">Occupied</div>
                        <div className="font-semibold">Dirty</div>
                        <div className="font-semibold">Block</div>
                        <div className="font-semibold">Maint.</div>
                        <div className="font-semibold">Cleaning</div>
                        <div className="font-semibold">Total</div>
                        <div className="font-semibold">Avail Rooms</div>
                        <div className="font-semibold">ChkIn/ChkOut</div>
                        <div className="font-semibold">Pax</div>
                      </div>

                      <div className="flex items-center gap-4 whitespace-nowrap">
                        <div className="text-sm font-medium">Total</div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-green-400" /> {informatics.vacant}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-red-400" /> {informatics.occupied}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-sky-400" /> {informatics.dirty}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-violet-500" /> {informatics.blocked}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-gray-400" /> {informatics.maintenance}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-slate-200" /> {informatics.cleaning}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-slate-200" /> {informatics.total}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-slate-200" /> {informatics.vacant}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-slate-200" /> {informatics.chkIn}/{informatics.chkOut}
                        </div>

                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full bg-slate-200" />{informatics.pax}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md">Reservation</span>
                </div>

                <div className="grid grid-cols-6 gap-2 text-sm mb-3">
                  {reservationDays.map((d) => (
                    <div key={d.date} className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-xs">{d.date.split(",")[0]}</div>
                      <div className="font-semibold text-sm">{d.count}</div>
                    </div>
                  ))}
                </div>

                
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

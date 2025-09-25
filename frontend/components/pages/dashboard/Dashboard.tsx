// 16-9-2025 If status is "vacant" or "available"  show Check-in button. If status is "occupied" or "reserved"   show Check-out button.
// 20-9-2025 function useEffect change 
// 23-9-2025  room number, customer name and customer room number matching item  get in filter show in name amount ,  Search function add If search particular room number show , checkout function

"use client";

import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchPropertyById,
  fetchRoomsForPropertyApi,
  CheckOut,
  getCustomerInfos,
} from "../../../lib/api";
import { useRouter } from "next/navigation";
import { PropertyData } from "../../interface/property";
import { useAuth } from "@/app/context/AuthContext";

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
  bedType?: string;
};

// typed payload - use string for checkoutDate (ISO)
interface CheckoutPayload {
  clientId: string;
  propertyId: string;
  checkoutDate: string; // ISO string
  roomNumber: string;
}

/* ---------- helpers ---------- */
function statusPalette(status?: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("vacant") || s.includes("available"))
    return { bg: "bg-yellow-400", dot: "bg-green-400", label: "Vacant" };
  if (s.includes("occupied") || s.includes("booked") || s.includes("reserved"))
    return { bg: "bg-red-500", dot: "bg-red-500", label: "Occupied" };
  if (s.includes("dirty")) return { bg: "bg-sky-400", dot: "bg-sky-400", label: "Dirty" };
  if (s.includes("block") || s.includes("blocked"))
    return { bg: "bg-violet-500", dot: "bg-violet-500", label: "Blocked" };
  if (s.includes("maint") || s.includes("maintenance"))
    return { bg: "bg-gray-400", dot: "bg-gray-400", label: "Maint" };
  return { bg: "bg-green-400", dot: "bg-green-400", label: (status || "Vacant").toUpperCase() };
}

/* ---------- RoomCard ---------- */
function RoomCard({
  room,
  customersData,
  onCheckoutSuccess,
}: {
  room: Room;
  customersData: any[];
  onCheckoutSuccess?: () => void;
}) {
  const pal = statusPalette(room.roomStatus);
  const router = useRouter();

  const originalGuest =
    room.guestName ||
    room.meta?.guestName ||
    room.meta?.guest?.name ||
    room.meta?.customerName ||
    room.meta?.primaryGuest ||
    undefined;

  const originalAmount =
    room.bookingAmount || room.meta?.bookingAmount || room.roomRentPerDay || room.meta?.amount || undefined;

  const matchKey = String(room.roomNumber ?? "").trim().toLowerCase();

  const matched = useMemo(() => {
    if (!Array.isArray(customersData) || customersData.length === 0) return undefined;
    return customersData.find((c: any) =>
      Array.isArray(c?.stayDetails) &&
      c.stayDetails.some((sd: any) => String(sd?.roomNo ?? "").trim().toLowerCase() === matchKey)
    );
  }, [customersData, matchKey]);

  const matchedStay = useMemo(() => {
    if (!matched) return undefined;
    return (matched.stayDetails || []).find(
      (sd: any) => String(sd?.roomNo ?? "").trim().toLowerCase() === matchKey
    );
  }, [matched, matchKey]);

  const matchedGuest = useMemo(() => {
    const normalize = (val: any): string | undefined => {
      if (!val && val !== 0) return undefined;
      if (typeof val === "string" && val.trim()) return val.trim();
      if (Array.isArray(val) && val.length) {
        const first = val[0];
        if (typeof first === "string" && first.trim()) return first.trim();
        if (first?.name) return String(first.name).trim();
        if (Array.isArray(first) && first.length && typeof first[0] === "string") return first[0].trim();
      }
      return undefined;
    };

    if (matchedStay) {
      const g0 = normalize(matchedStay.guestName);
      if (g0) return g0;

      if (Array.isArray(matchedStay.guests) && matchedStay.guests.length) {
        for (const guestEntry of matchedStay.guests) {
          if (typeof guestEntry === "string") {
            const s = guestEntry.trim();
            if (s) return s;
          } else if (guestEntry) {
            if (guestEntry.name && typeof guestEntry.name === "string" && guestEntry.name.trim()) return guestEntry.name.trim();
            const g1 = normalize(guestEntry.guestName);
            if (g1) return g1;
            if (Array.isArray(guestEntry.guestName) && guestEntry.guestName.length) {
              const first = guestEntry.guestName[0];
              if (first?.name) return String(first.name).trim();
              if (typeof first === "string" && first.trim()) return first.trim();
            }
          }
        }
      }
    }

    if (matched) {
      if (matched.personalInfo?.name) return String(matched.personalInfo.name).trim();
      const fn = matched.personalInfo?.firstName ?? "";
      const ln = matched.personalInfo?.lastName ?? "";
      const full = `${fn} ${ln}`.trim();
      if (full) return full;
      if (matched.guestInfo?.name) return String(matched.guestInfo.name).trim();

      const alt = normalize(matched.guestInfo?.guestName ?? matched.bookingDetails?.guestName ?? matched.guestName);
      if (alt) return alt;
    }

    return originalGuest;
  }, [matchedStay, matched, originalGuest]);

  const matchedAmount = useMemo(() => {
    if (matchedStay && typeof matchedStay.paidAmount !== "undefined") return matchedStay.paidAmount;
    if (matched && matched.paymentDetails && typeof matched.paymentDetails.paidAmount !== "undefined")
      return matched.paymentDetails.paidAmount;
    return originalAmount;
  }, [matchedStay, matched, originalAmount]);

  const occupied = Boolean(
    matchedGuest ||
    ((room.roomStatus || "").toLowerCase().includes("occupied") ||
      (room.roomStatus || "").toLowerCase().includes("reserved"))
  );

  const matchedCustomerId = useMemo(() => {
    if (!matched) return undefined;
    const hd = matched.hotelDetails ?? {};
    if (hd.customerId) return String(hd.customerId);
    if (hd.customerID) return String(hd.customerID);
    if (hd.CustomerId) return String(hd.CustomerId);
    if (matched.customerId) return String(matched.customerId);
    if (hd.customerId === 0) return "0";
    return undefined;
  }, [matched]);

  const checkoutId = useMemo(() => {
    if (matched?.bookingDetails?.bookingId) return String(matched.bookingDetails.bookingId);
    if (matchedStay?.bookingId) return String(matchedStay.bookingId);
    if (matchedStay?.stayId) return String(matchedStay.stayId);
    if (matched?.hotelDetails?.customerId) return String(matched.hotelDetails.customerId);
    if (room.id) return String(room.id);
    return undefined;
  }, [matched, matchedStay, room.id]);

  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

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

  async function handleCheckOut(roomNo?: string, id?: string) {
    try {
      if (!user) {
        alert("Not authenticated");
        return;
      }

      const clientId = String(user.clientId);
      const propertyId = String(user.propertyId);

      const rawId = id ?? checkoutId ?? matchedCustomerId;
      const idToUse = rawId != null ? String(rawId) : undefined;
      if (!idToUse) {
        alert("Missing booking/stay/customer id for checkout (URL id)");
        return;
      }

      const payload: CheckoutPayload = {
        clientId,
        propertyId,
        checkoutDate: new Date().toISOString(), // send ISO string
        roomNumber: roomNo ?? "",
      };

      const res = await CheckOut(idToUse, payload);
      // if backend returns success flag, you can check res.success here
      alert("Checkout successful!");
      onCheckoutSuccess?.();
    } catch (err: any) {
      console.error("Checkout failed:", err);
      alert("Checkout failed");
    }
  }

  function handleKeyToggle(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((s) => !s);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`h-20 w-52 relative ${pal.bg} flex items-center gap-3 p-2 rounded-lg shadow-sm transition-all duration-150 cursor-pointer`}
      tabIndex={0}
      role="button"
      aria-expanded={open}
      aria-label={`Room ${room.roomNumber} ${room.roomType ?? ""} ${room.roomStatus ?? ""}`}
      onClick={() => setOpen((s) => !s)}
      onKeyDown={handleKeyToggle}
    >
      {/* avatar / number */}
      <div className="flex-shrink-0 w-14 flex items-center justify-center">
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
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
          <span className="relative z-10 text-black font-extrabold text-xl drop-shadow-sm">{room.roomNumber}</span>
        </div>
      </div>

      {/* body */}
      <div className="flex-1 flex flex-col items-end text-right">
        <div className="text-xl font-bold text-white truncate">
          {room.roomType}
        </div>

        {occupied ? (
          <>
            <div className="px-2 rounded-md text-xl font-medium text-slate-700">
              <span className="block text-white truncate">{matchedGuest ?? "Name"}</span>
            </div>
            {matchedAmount != null && (
              <div className="text-white font-medium truncate">{matchedAmount}</div>
            )}
          </>
        ) : (
          <div className="mt-1">
            <span
              className={`inline-flex items-center text-xl font-semibold px-2 py-0.5 rounded-full text-white ${pal.bg} bg-opacity-90`}
            >
              {room.roomStatus ?? pal.label}
            </span>
          </div>
        )}
      </div>

      {/* popup */}
      {open && (
        <div
          ref={popupRef}
          className="absolute ml-3 top-1/2 -translate-y-1/2 z-50"
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

              {matchedGuest && (
                <div className="mb-0.5 text-xs text-slate-700">
                  <span className="font-medium">Guest:</span> {matchedGuest}
                </div>
              )}

              {matchedAmount != null && (
                <div className="text-xs text-slate-700">
                  <span className="font-medium">Amount:</span> {matchedAmount}
                </div>
              )}

              <div className="mt-3 flex justify-end gap-2">
                {(room.roomStatus?.toLowerCase().includes("vacant") ||
                  room.roomStatus?.toLowerCase().includes("available")) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const payload = {
                          roomNo: room.roomNumber,
                          roomType: room.roomType,
                          bedType: (room as any).bedType || "",
                        };
                        sessionStorage.setItem("selectedRoom", JSON.stringify(payload));
                        router.push("/checkin");
                      }}
                      className="px-2 py-1 text-xs bg-sky-600 text-white rounded hover:bg-sky-700"
                    >
                      Check-in
                    </button>
                  )}

                {(room.roomStatus?.toLowerCase().includes("occupied") ||
                  room.roomStatus?.toLowerCase().includes("reserved")) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const roomNoStr = room.roomNumber != null ? String(room.roomNumber) : undefined;
                        const customerIdStr = matchedCustomerId != null ? String(matchedCustomerId) : undefined;
                        handleCheckOut(roomNoStr, customerIdStr);
                      }}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Check-out
                    </button>
                  )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 text-slate-700 rounded hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Page component (rooms scroll inside left column) ---------- */
export default function Page(): JSX.Element {
  const { user } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [, setPropertyDetails] = useState<PropertyData | null>(null);

  // customers data (fetched on timer)
  const [customersData, setCustomersData] = useState<any[]>([]);

  // --- Search / filter state ---
  const [query, setQuery] = useState<string>(""); // controlled input
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null); // null = all floors

  // load customers once and then poll every N ms
  useEffect(() => {
    if (!user || !user.propertyId) {
      setCustomersData([]);
      return;
    }
    const propertyId = user.propertyId;
    let intervalId: number | undefined;

    async function loadCustomers() {
      try {
        const res: unknown = await getCustomerInfos();
        let list: any[] = [];
        if (Array.isArray(res)) list = res;
        else if (res && typeof res === "object" && Array.isArray((res as any).data)) list = (res as any).data;

        const filtered = list.filter(
          (item: any) =>
            item?.hotelDetails?.propertyId === propertyId &&
            (item?.meta?.isActive === true || item?.isActive === true)
        );

        setCustomersData(filtered);
      } catch (err: any) {
        console.error("getCustomerInfos failed:", err);
        setCustomersData([]);
      }
    }

    loadCustomers();
    intervalId = window.setInterval(loadCustomers, 60000);

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [user?.propertyId]);

  // fetch rooms (and a refresh function to be called after checkout)
  const fetchRooms = async () => {
    try {
      if (!user?.propertyId) return;
      setLoadingRooms(true);
      setRoomsError(null);

      const res = await fetchPropertyById(user.propertyId);
      setPropertyDetails(res);
      if (!res?.commonId) {
        setRooms([]);
        return;
      }

      const data = await fetchRoomsForPropertyApi(res.commonId);
      const roomsArray: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setRooms(roomsArray);
    } catch (err: any) {
      console.error("fetchRooms error:", err);
      setRoomsError(err?.message ?? "Error loading rooms");
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (!user?.propertyId) return;

    (async () => {
      if (!mounted) return;
      await fetchRooms();
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.propertyId]);

  // refreshRooms callback (pass to RoomCard so it can request a reload after checkout)
  const refreshRooms = () => {
    fetchRooms();
  };

  // compute set of roomNumbers that match the current query by scanning customersData
  const matchingRoomNumbersByGuest = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !Array.isArray(customersData) || customersData.length === 0) return new Set<string>();

    const set = new Set<string>();

    const normalize = (v: any): string | undefined => {
      if (!v && v !== 0) return undefined;
      if (typeof v === "string" && v.trim()) return v.trim();
      if (Array.isArray(v) && v.length) {
        const first = v[0];
        if (typeof first === "string" && first.trim()) return first.trim();
        if (first?.name) return String(first.name).trim();
      }
      return undefined;
    };

    for (const c of customersData) {
      // check direct personal names
      const personalName = c?.personalInfo?.name ?? `${c?.personalInfo?.firstName ?? ""} ${c?.personalInfo?.lastName ?? ""}`.trim();
      if (personalName && String(personalName).toLowerCase().includes(q)) {
        // add all stay roomNos for this customer
        if (Array.isArray(c?.stayDetails)) {
          for (const sd of c.stayDetails) {
            const rn = String(sd?.roomNo ?? "").trim();
            if (rn) set.add(rn.toLowerCase());
          }
        }
        continue;
      }

      // inspect stayDetails
      if (Array.isArray(c?.stayDetails)) {
        for (const sd of c.stayDetails) {
          // check stay-level guestName, guests list, bookingDetails.guestName
          const candidates = [
            normalize(sd?.guestName),
            normalize(sd?.guestName?.[0]),
            normalize(sd?.guests),
            normalize(c?.bookingDetails?.guestName),
          ];

          // also check guests array of objects
          if (Array.isArray(sd?.guests)) {
            for (const g of sd.guests) {
              if (typeof g === "string") {
                if (g.toLowerCase().includes(q)) {
                  const rn = String(sd?.roomNo ?? "").trim();
                  if (rn) set.add(rn.toLowerCase());
                  break;
                }
              } else if (g && (g.name || g.guestName)) {
                const gname = (g.name ?? g.guestName ?? "").toString().trim().toLowerCase();
                if (gname && gname.includes(q)) {
                  const rn = String(sd?.roomNo ?? "").trim();
                  if (rn) set.add(rn.toLowerCase());
                  break;
                }
              }
            }
          }

          // check candidate strings
          for (const cand of candidates) {
            if (cand && cand.toLowerCase().includes(q)) {
              const rn = String(sd?.roomNo ?? "").trim();
              if (rn) set.add(rn.toLowerCase());
              break;
            }
          }
        }
      }

      // fallback: check top-level guestName fields on customer
      const topCandidates = [
        normalize(c?.guestInfo?.name),
        normalize(c?.guestName),
        normalize(c?.guestInfo?.guestName),
        normalize(c?.meta?.primaryGuest),
      ];
      for (const t of topCandidates) {
        if (t && t.toLowerCase().includes(q)) {
          if (Array.isArray(c?.stayDetails)) {
            for (const sd of c.stayDetails) {
              const rn = String(sd?.roomNo ?? "").trim();
              if (rn) set.add(rn.toLowerCase());
            }
          }
          break;
        }
      }
    }

    return set;
  }, [customersData, query]);

  // Apply text + floor filters to get the list to render (now includes guest-name matches)
  const grouped = useMemo(() => {
    return rooms.reduce<Record<string, Room[]>>((acc, r) => {
      const key = r.floorName ?? "No Floor";
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});
  }, [rooms]);

  // Floor keys sorted
  const floorKeys = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      const la = a.toLowerCase();
      const lb = b.toLowerCase();
      if (la.includes("ground") && !lb.includes("ground")) return -1;
      if (lb.includes("ground") && !la.includes("ground")) return 1;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
    });
  }, [grouped]);

  const filteredGrouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const floorFilter = selectedFloor;

    if (!q && !floorFilter) return grouped;

    const out: Record<string, Room[]> = {};
    for (const [floor, list] of Object.entries(grouped)) {
      if (floorFilter && floor !== floorFilter) continue;

      const filteredList = list.filter((r) => {
        if (!q) return true;
        const rn = String(r.roomNumber ?? "").toLowerCase();
        const rt = String(r.roomType ?? "").toLowerCase();

        // 1) match by room number
        if (rn.includes(q)) return true;
        // 2) match by room type
        if (rt.includes(q)) return true;
        // 3) match by guest name (computed set)
        if (matchingRoomNumbersByGuest.has(rn)) return true;

        return false;
      });

      if (filteredList.length > 0) out[floor] = filteredList;
    }

    return out;
  }, [grouped, query, selectedFloor, matchingRoomNumbersByGuest]);

  const refreshCustomers = async () => {
    if (!user?.propertyId) return;
    try {
      const res: unknown = await getCustomerInfos();
      let list: any[] = [];
      if (Array.isArray(res)) list = res;
      else if (res && typeof res === "object" && Array.isArray((res as any).data)) list = (res as any).data;

      const filtered = list.filter(
        (item: any) =>
          item?.hotelDetails?.propertyId === user.propertyId &&
          (item?.meta?.isActive === true || item?.isActive === true)
      );

      setCustomersData(filtered);
    } catch (err: any) {
      console.error("refreshCustomers failed:", err);
      setCustomersData([]);
    }
  };

  // informatics (unchanged)
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
    } as {
      vacant: number;
      occupied: number;
      dirty: number;
      blocked: number;
      maintenance: number;
      cleaning: number;
      total: number;
      pax: number;
      chkIn: number;
      chkOut: number;
    };
    // Group rooms by status and count them
    const statusCounts = rooms.reduce((acc: Record<string, number>, room) => {
      const status = room.roomStatus?.toLowerCase() || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    console.log("Room Status Counts:", statusCounts);
    rooms.forEach((r) => {
      const s = (r.roomStatus || "").toLowerCase();
      if (s.includes("vacant") || s.includes("available")) info.vacant++;
      else if (s.includes("occupied") || s.includes("booked") || s.includes("reserved") || s.includes("checkin")) {
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

  // Reservation days (unchanged)
  const reservationDays = [
    { date: "Sat,14-Jun", count: 0 },
    { date: "Sun,15-Jun", count: 0 },
    { date: "Mon,16-Jun", count: 0 },
    { date: "Tue,17-Jun", count: 0 },
    { date: "Wed,18-Jun", count: 0 },
    { date: "Thu,19-Jun", count: 0 },
  ];
  return (
    <>
      <div className="main min-h-[calc(100vh-64px)] bg-white flex flex-col">
        <div className="flex flex-[9] overflow-hidden">
          <div className="left w-[80%] h-full flex flex-col">
            <div className="flex-1 overflow-auto p-4">
              <div className="min-h-[100%] rounded-lg p-2">
                <div className="col-span-10">
                  <div className="max-h-[calc(110vh-220px)] overflow-auto pr-4">
                    {loadingRooms && <div className="p-8 bg-white rounded shadow text-center">Loading rooms...</div>}
                    {roomsError && <div className="p-4 bg-red-50 text-red-700 rounded">{roomsError}</div>}

                    <div className="space-y-2">
                      {Object.keys(filteredGrouped).length === 0 ? (
                        <div className="p-6 bg-white rounded shadow text-center text-sm text-gray-600">
                          No rooms matched your search.
                        </div>
                      ) : (
                        Object.keys(filteredGrouped).map((floor) => {
                          const list = filteredGrouped[floor] ?? [];
                          return (
                            <div key={floor} className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200 relative">
                              <div className="flex items-center gap-3">
                                <div className="w-1 h-6 bg-sky-500 rounded-l-md" />
                                <div className="bg-sky-50 px-2 py-1 rounded text-sky-700 font-medium text-xs border border-sky-200 shadow-sm">
                                  {floor.toUpperCase()}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3 items-center mt-2">
                                {list.map((room, idx) => {
                                  const key = room.id ?? `${room.roomNumber ?? room.roomName ?? idx}-${idx}`;
                                  return (
                                    <div key={key}>
                                      <RoomCard
                                        room={room}
                                        customersData={customersData}
                                        onCheckoutSuccess={() => {
                                          refreshRooms();
                                          refreshCustomers();
                                        }}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="right w-[20%] h-full">
            <div className="sticky top-2 space-y-2">
              <div className="rounded p-2">
                <label htmlFor="roomSearch" className="sr-only">Search rooms</label>
                <input
                  id="roomSearch"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                />

                {/* floor quick-filters */}
                <div className="mt-3">
                  <select
                    id="floorSelect"
                    value={selectedFloor ?? ""}
                    onChange={(e) => setSelectedFloor(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 text-sm"
                  >
                    <option value="">Floor Wise</option>
                    {floorKeys.map((fk) => (
                      <option key={fk} value={fk}>
                        {fk}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded shadow p-2 border border-gray-200">
                <h3 className="text-sm font-semibold mb-2">Rooms In Grace Time</h3>
                <div className="h-28 border rounded p-2 text-xs text-gray-500 overflow-auto">No items</div>
              </div>

              <div className="bg-white rounded shadow p-4 border border-gray-200">
                <h3 className="text-sm font-semibold mb-2">Today's Expected Checkout</h3>
              </div>
            </div>
          </aside>
        </div>

        <footer className="bottom-0 flex w-full p-2 gap-2 rounded-xl">
          <div className="w-[70%] bg-white p-2 rounded-xl shadow">
            <div className="flex items-center bg-gray-300 justify-center mb-2 rounded-md">
              <span className="text-sm font-semibold text-sky-700 px-3 py-1">Informatics</span>
            </div>

            <div className="text-xs">
              <div className="grid grid-cols-11 gap-2 font-semibold border-b border-gray-200 pb-1 mb-2">
                <div>Type</div>
                <div>Vacant</div>
                <div>Occupied</div>
                <div>Dirty</div>
                <div>Block</div>
                <div>Maint.</div>
                <div>Cleaning</div>
                <div>Total</div>
                <div>Avail Rooms</div>
                <div>ChkIn/ChkOut</div>
                <div>Pax</div>
              </div>

              <div className="grid grid-cols-11 gap-2 text-sm">
                <div className="font-medium">Total</div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  {informatics.vacant}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  {informatics.occupied}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-sky-400"></span>
                  {informatics.dirty}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                  {informatics.blocked}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  {informatics.maintenance}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                  {informatics.cleaning}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                  {informatics.total}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                  {informatics.vacant}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                  {informatics.chkIn}/{informatics.chkOut}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                  {informatics.pax}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[30%] bg-white p-2 rounded-xl shadow">
            <div className="flex items-center bg-gray-300 justify-center mb-2 rounded-md">
              <span className="text-sm font-semibold text-sky-700 px-3 py-1">Reservation</span>
            </div>

            <div className="flex items-center justify-between text-sm gap-2">
              {reservationDays.map((d) => (
                <div key={d.date} className="flex-1 px-2 py-1 rounded text-center border border-gray-200">
                  <div className="text-xs truncate">{d.date.split(",")[0]}</div>
                  <div className="font-semibold">{d.count}</div>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

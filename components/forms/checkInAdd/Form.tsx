"use client";
import React, { useMemo, useState } from "react";
 

type BasicGuest = {
  clientId: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  gender: string;
  mobileNo: string;
  nationality: string;
  idType: string;
  idNumber: string;
  address: string;
};

type BookingPayload = {
  hotelDetails: {
    clientId: string;
    propertyId: string;
    customerId: string;
    hotelName: string;
    hotelAddress: string;
    hotelMobileNo: string;
    gstin: string;
    hsnCode: string;
  };
  bookingDetails: {
    isReservation: boolean;
    bookingId: string;
    noOfDays: string;
    noOfRooms: string;
    graceTime: string;
    checkInType: string;
    checkInMode: string;
    checkInUser: string;
    roomStatus: string;
    arrivalMode: string;
    otaName: string;
    bookingInstruction: string;
    enableRoomSharing: boolean;
    bookingThrough: string;
    preferredRooms: string;
    reservedBy: string;
    reservedStatus: string;
    reservationNo: string;
  };
  checkin: {
    checkinDate: string; // ISO
    checkoutDate: string; // ISO
    arrivalDate: string; // ISO
    depatureDate: string; // ISO
  };
 
  stayDetails: string[];
  guestInfo: {
    numberOfGuests: { adult: number; child: number; seniors: number };
    noOfPax: number;
    childPax: number;
    extraPax: number;
    specialRequests: string;
    complimentary: string;
    vechileDetails: string;
  };
  paymentDetails: {
    paymentType: string;
    paymentBy: string;
    allowCredit: string;
    paidAmount: number;
    balanceAmount: number;
    discType: string;
    discValue: string;
    netRate: string;
    allowChargesPosting: string;
    enablePaxwise: boolean;
    paxwiseBillAmount: string;
  };
  addressInfo: {
    city: string;
    pinCode: string;
    state: string;
    country: string;
  };
  gstInfo: {
    gstNumber: string;
    gstType: string;
  };
  personalInfo: {
    dob: string;
    age: string;
    companyAnniversary: string;
  };
  businessInfo: {
    segmentName: string;
    bussinessSource: string;
    customerComapny: string;
    purposeOfVisit: string;
    visitRemark: string;
  };
  invoiceOptions: { printOption: boolean; pdfSaveOption: boolean };
  extra: Array<{ serviceName: string; hsncode: string; amount: string }>;
  meta: {
    rating: string;
    isCancelled: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};
 
export type RoomRow = {
  roomType: string;
  roomNo: string;
  ratePlan: string;
  mealPlan: string;
  guestName: string;
  contact: string;
  male: number;
  female: number;
  adult: number;
  child: number;
  extra: number;
  netRate: string;
  discType: string;
  discVal: string;
  tariff: string;
  applyTariff: string;
  planFood: string;
};

 
const initialGuest: BasicGuest = {
  clientId: "",
  propertyId: "",
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  gender: "",
  mobileNo: "",
  nationality: "",
  idType: "",
  idNumber: "",
  address: "",
};

const initialBooking: BookingPayload = {
  hotelDetails: {
    clientId: "",
    propertyId: "",
    customerId: "",
    hotelName: "",
    hotelAddress: "",
    hotelMobileNo: "",
    gstin: "",
    hsnCode: "",
  },
  bookingDetails: {
    isReservation: false,
    bookingId: "",
    noOfDays: "",
    noOfRooms: "",
    graceTime: "",
    checkInType: "",
    checkInMode: "",
    checkInUser: "",
    roomStatus: "",
    arrivalMode: "",
    otaName: "",
    bookingInstruction: "",
    enableRoomSharing: false,
    bookingThrough: "",
    preferredRooms: "",
    reservedBy: "",
    reservedStatus: "",
    reservationNo: "",
  },
  checkin: {
    checkinDate: new Date().toISOString().slice(0, 16),
    checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    arrivalDate: new Date().toISOString(),
    depatureDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  stayDetails: [],
  guestInfo: {
    numberOfGuests: { adult: 1, child: 0, seniors: 0 },
    noOfPax: 0,
    childPax: 0,
    extraPax: 0,
    specialRequests: "",
    complimentary: "",
    vechileDetails: "",
  },
  paymentDetails: {
    paymentType: "",
    paymentBy: "",
    allowCredit: "",
    paidAmount: 0,
    balanceAmount: 0,
    discType: "",
    discValue: "",
    netRate: "",
    allowChargesPosting: "",
    enablePaxwise: false,
    paxwiseBillAmount: "",
  },
  addressInfo: { city: "", pinCode: "", state: "Tamil Nadu", country: "India" },
  gstInfo: { gstNumber: "", gstType: "" },
  personalInfo: { dob: "", age: "", companyAnniversary: "" },
  businessInfo: {
    segmentName: "",
    bussinessSource: "",
    customerComapny: "",
    purposeOfVisit: "",
    visitRemark: "",
  },
  invoiceOptions: { printOption: true, pdfSaveOption: true },
  extra: [{ serviceName: "", hsncode: "", amount: "" }],
  meta: {
    rating: "",
    isCancelled: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const initialRooms: RoomRow[] = [

  {
    roomType: "",
    roomNo: "",
    ratePlan: "",
    mealPlan: "",
    guestName: "",
    contact: "",
    male: 0,
    female: 0,
    adult: 1,
    child: 0,
    extra: 0,
    netRate: "",
    discType: "",
    discVal: "",
    tariff: "",
    applyTariff: "",
    planFood: "",
  },
];


function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Section({ title, children, color = "blue" }: { title: string; children: React.ReactNode; color?: "blue" | "green" }) {
  const isGreen = color === "green";
  return (
    <div className={cx("rounded-lg border shadow-sm", isGreen ? "bg-green-50 border-green-200" : "bg-white border-slate-200")}>
      <div className={cx("px-3 py-2 rounded-t-lg text-sm font-semibold", isGreen ? "bg-green-100 text-green-900" : "bg-slate-100 text-slate-900")}>{title}</div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-slate-700">{children}</label>;
}

function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-sky-400",
        props.className || ""
      )}
    />
  );
}

function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }
) {
  return (
    <select
      {...props}
      className={cx(
        "w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-sky-400",
        props.className || ""
      )}
    />
  );
}

function Checkbox({ checked, onChange }: { checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
      checked={!!checked}
      onChange={(e) => onChange?.(e.target.checked)}
    />
  );
}

const encodeRooms = (rows: RoomRow[]): string[] =>
  rows.map((r) => JSON.stringify(r));


export default function Form() {
  const [guest, setGuest] = useState<BasicGuest>(initialGuest);
  const [booking, setBooking] = useState<BookingPayload>(initialBooking);
  const [rooms, setRooms] = useState<RoomRow[]>(initialRooms);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ---- camera state (add next to your other states) ----
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const totalAdults = useMemo(() => rooms.reduce((sum, r) => sum + (Number(r.adult) || 0), 0), [rooms]);
  const totalChildren = useMemo(() => rooms.reduce((sum, r) => sum + (Number(r.child) || 0), 0), [rooms]);

  // Handlers
  const onGuest = (key: keyof BasicGuest, value: any) => setGuest((g) => ({ ...g, [key]: value }));
  const onBooking = <K extends keyof BookingPayload>(key: K, value: BookingPayload[K]) => setBooking((b) => ({ ...b, [key]: value }));

  const updateBookingDetails = (key: keyof BookingPayload["bookingDetails"], value: any) =>
    onBooking("bookingDetails", { ...booking.bookingDetails, [key]: value });

  const updateCheckin = (key: keyof BookingPayload["checkin"], value: any) =>
    onBooking("checkin", { ...booking.checkin, [key]: value });

  const updateGuestInfo = (key: keyof BookingPayload["guestInfo"], value: any) =>
    onBooking("guestInfo", { ...booking.guestInfo, [key]: value });

  // const updateGuestCounts = (key: keyof BookingPayload["guestInfo"]["numberOfGuests"], value: number) =>
  //   onBooking("guestInfo", { ...booking.guestInfo, numberOfGuests: { ...booking.guestInfo.numberOfGuests, [key]: value } });

  const updatePayment = (key: keyof BookingPayload["paymentDetails"], value: any) =>
    onBooking("paymentDetails", { ...booking.paymentDetails, [key]: value });

  const updateAddress = (key: keyof BookingPayload["addressInfo"], value: any) =>
    onBooking("addressInfo", { ...booking.addressInfo, [key]: value });

  const updateGST = (key: keyof BookingPayload["gstInfo"], value: any) =>
    onBooking("gstInfo", { ...booking.gstInfo, [key]: value });

  const updateBusiness = (key: keyof BookingPayload["businessInfo"], value: any) =>
    onBooking("businessInfo", { ...booking.businessInfo, [key]: value });

  const addRoom = () => setRooms((rs) => [...rs, {
    roomType: "",
    roomNo: "",
    ratePlan: "",
    mealPlan: " ",
    guestName: "",
    contact: "",
    male: 0,
    female: 0,
    adult: 0,
    child: 0,
    extra: 0,
    netRate: "",
    discType: "",
    discVal: "",
    tariff: "",
    applyTariff: "",
    planFood: "",
  }]);

  const removeRoom = (index: number) => setRooms((rs) => rs.filter((_, i) => i !== index));

  const updateRoom = (index: number, key: keyof RoomRow, value: any) =>
    setRooms((rs) => rs.map((r, i) => (i === index ? { ...r, [key]: value } : r)));

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const payload: BookingPayload & { basicGuest: BasicGuest; rooms: RoomRow[] } = {
        ...booking,
        stayDetails: encodeRooms(rooms),
        basicGuest: guest,
        rooms,
      } as any;

 
      console.log("Submitting payload", payload);
      setMessage("Check-in draft prepared. (Console has payload)");
    } catch (e: any) {
      console.error(e);
      setMessage("Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };
 
  const startCamera = async () => {
    try {
      setCamError(null);
      await ensureGetUserMedia();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      const video = videoRef.current!;
      video.srcObject = stream;
      await new Promise<void>((res) => {
        const onLoaded = () => { video.removeEventListener("loadedmetadata", onLoaded); res(); };
        video.addEventListener("loadedmetadata", onLoaded);
      });
      await video.play();
      setIsCameraOn(true);
      setCapturedDataUrl(null); // clear any previous capture
    } catch (err: any) {
      console.error(err);
      setCamError(err?.message || "Camera access denied/unavailable.");
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (video) video.srcObject = null;
    setIsCameraOn(false);
  };

  React.useEffect(() => () => stopCamera(), []);

 
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    setIsCapturing(true);
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setCapturedDataUrl(dataUrl);
    } finally {
      setIsCapturing(false);
    }
  };

 
  // const dataURLToFile = (dataUrl: string, fileName = "capture.jpg") => {
  //   const arr = dataUrl.split(","), mime = arr[0].match(/:(.*?);/)![1];
  //   const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n);
  //   while (n--) u8arr[n] = bstr.charCodeAt(n);
  //   return new File([u8arr], fileName, { type: mime });
  // };

 
  const useCapturedPhoto = () => {
    if (!capturedDataUrl) return;
 
    alert("Captured image ready to use!");
  };

 
const ensureGetUserMedia = async () => {
  if (typeof navigator === "undefined") throw new Error("Navigator not available");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Camera API not supported in this browser.");
  }
};
  const retake = () => setCapturedDataUrl(null);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Check-in</h1>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Create Check-in"}
        </button>
      </div>

      {/* QUICK CHECK-IN (green) */}
      <Section title="Quick Check-In" color="green">
        <div className="grid grid-cols-12 gap-3">
          {/* Left block inputs */}
          <div className="col-span-9 grid grid-cols-12 gap-3">
            <div className="col-span-3 flex items-end gap-2">
              <div>
                <Label>Is Reservation</Label>
                <div className="mt-1"><Checkbox checked={booking.bookingDetails.isReservation} onChange={(v) => updateBookingDetails("isReservation", v)} /></div>
              </div>
            </div>

            <div className="col-span-3">
              <Label>Reservation Number</Label>
              <TextInput value={booking.bookingDetails.reservationNo} onChange={(e) => updateBookingDetails("reservationNo", e.target.value)} placeholder="Enter Reservation No" />
            </div>

            <div className="col-span-3">
              <Label>Arrival Mode</Label>
              <Select value={booking.bookingDetails.arrivalMode} onChange={(e) => updateBookingDetails("arrivalMode", e.target.value)}>
                <option>Walk-In/Direct</option>
                <option>Airport</option>
                <option>Railway</option>
                <option>Travel Desk</option>
              </Select>
            </div>

            <div className="col-span-3">
              <Label>OTA</Label>
              <TextInput value={booking.bookingDetails.otaName} onChange={(e) => updateBookingDetails("otaName", e.target.value)} placeholder="Enter OTA Name" />
            </div>

            <div className="col-span-3">
              <Label>Booking ID</Label>
              <TextInput value={booking.bookingDetails.bookingId} onChange={(e) => updateBookingDetails("bookingId", e.target.value)} placeholder="Enter Booking ID" />
            </div>

            <div className="col-span-3">
              <Label>Contact No.</Label>
              <div className="flex gap-2">
                <TextInput defaultValue="91" className="w-14" readOnly />
                <TextInput value={guest.mobileNo} onChange={(e) => onGuest("mobileNo", e.target.value)} placeholder="Enter Contact No" />
              </div>
            </div>

            <div className="col-span-2">
              <Label>Title</Label>
              <Select value={guest.title} onChange={(e) => onGuest("title", e.target.value)}>
                <option>Mr</option>
                <option>Ms</option>
                <option>Mrs</option>
                <option>Dr</option>
              </Select>
            </div>

            <div className="col-span-3">
              <Label>First Name</Label>
              <TextInput value={guest.firstName} onChange={(e) => onGuest("firstName", e.target.value)} placeholder="Enter First Name" />
            </div>

            <div className="col-span-3">
              <Label>Last Name</Label>
              <TextInput value={guest.lastName} onChange={(e) => onGuest("lastName", e.target.value)} placeholder="Enter Last Name" />
            </div>

            <div className="col-span-3">
              <Label>Gender</Label>
              <Select value={guest.gender} onChange={(e) => onGuest("gender", e.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </div>

            <div className="col-span-3">
              <Label>City</Label>
              <TextInput value={booking.addressInfo.city} onChange={(e) => updateAddress("city", e.target.value)} placeholder="Enter City" />
            </div>

            <div className="col-span-3">
              <Label>ID No. (Aadhaar, Other)</Label>
              <TextInput value={guest.idNumber} onChange={(e) => onGuest("idNumber", e.target.value)} placeholder="Enter ID No" />
            </div>

            <div className="col-span-3">
              <Label>Email</Label>
              <TextInput type="email" value={guest.email} onChange={(e) => onGuest("email", e.target.value)} placeholder="Enter Email ID" />
            </div>

            <div className="col-span-3">
              <Label>Check-In Mode</Label>
              <Select value={booking.bookingDetails.checkInMode} onChange={(e) => updateBookingDetails("checkInMode", e.target.value)}>
                <option>Day</option>
                <option>Night</option>
              </Select>
            </div>

            <div className="col-span-3">
              <Label>Allow Credit</Label>
              <Select value={booking.paymentDetails.allowCredit} onChange={(e) => updatePayment("allowCredit", e.target.value)}>
                <option>No</option>
                <option>Yes</option>
              </Select>
            </div>

            <div className="col-span-3">
              <Label>Foreign Guest</Label>
              <Select value={guest.nationality === "Indian" ? "No" : "Yes"} onChange={(e) => onGuest("nationality", e.target.value === "Yes" ? "Foreign" : "Indian")}>
                <option>No</option>
                <option>Yes</option>
              </Select>
            </div>

            <div className="col-span-3">
              <Label>Segment Name</Label>
              <Select value={booking.businessInfo.segmentName} onChange={(e) => updateBusiness("segmentName", e.target.value)}>
                <option>CORPORATE</option>
                <option>RETAIL</option>
                <option>OTA</option>
              </Select>
            </div>

            <div className="col-span-3">
              <Label>Business Source</Label>
              <TextInput value={booking.businessInfo.bussinessSource} onChange={(e) => updateBusiness("bussinessSource", e.target.value)} placeholder="Enter Business Source" />
            </div>
          </div>

          {/* Right side actions */}
          <div className="col-span-3 flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-40 w-52 rounded-md border border-slate-300 bg-black overflow-hidden">
                {capturedDataUrl ? (
                  <img src={capturedDataUrl} alt="Captured" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <video ref={videoRef} playsInline muted autoPlay className="h-full w-full object-cover" />
                    {!isCameraOn && (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs px-2 text-center">
                        {camError ? camError : "Camera is off"}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {!isCameraOn ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="rounded bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-700"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Stop
                  </button>
                )}

                {!capturedDataUrl && isCameraOn && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={isCapturing}
                    className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isCapturing ? "Capturing..." : "Capture"}
                  </button>
                )}

                {capturedDataUrl && (
                  <>
                    <button
                      type="button"
                      onClick={retake}
                      className="rounded bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700"
                    >
                      Retake
                    </button>
                    <button
                      type="button"
                      onClick={useCapturedPhoto}
                      className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Use Photo
                    </button>
                  </>
                )}
              </div>

              <div className="text-[10px] text-slate-500">
                Tip: Use HTTPS (or localhost). iOS requires tapping buttons (user gesture).
              </div>
            </div>

            <div className="text-xs font-medium text-slate-600">Scan Files</div>
            <div className="flex items-center justify-center h-32 w-40 rounded-md border border-dashed border-slate-300 bg-white">
              <div className="text-center text-xs text-slate-400">Document Placeholder</div>
            </div>
          </div>

          {/* Rooms grid */}
          <div className="col-span-12">
            <div className="overflow-auto rounded-md border border-slate-200">
              <table className="min-w-[1000px] w-full text-sm">
                <thead className="bg-slate-100 text-left">
                  <tr>
                    {[
                      "Room Type",
                      "Room No.",
                      "Rate Plan",
                      "Meal Plan",
                      "Guest Name",
                      "Contact",
                      "Male",
                      "Female",
                      "Adult",
                      "Child",
                      "Extra",
                      "Net Rate",
                      "Disc. Type",
                      "Disc. Val",
                      "Tariff",
                      "Apply Tariff",
                      "Plan Food",
                      "",
                    ].map((h) => (
                      <th key={h} className="whitespace-nowrap px-2 py-2 font-semibold text-slate-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-slate-50">
                      <td className="px-2 py-1"><TextInput value={r.roomType} onChange={(e) => updateRoom(idx, "roomType", e.target.value)} /></td>
                      <td className="px-2 py-1"><TextInput value={r.roomNo} onChange={(e) => updateRoom(idx, "roomNo", e.target.value)} /></td>
                      <td className="px-2 py-1"><TextInput value={r.ratePlan} onChange={(e) => updateRoom(idx, "ratePlan", e.target.value)} /></td>
                      <td className="px-2 py-1">
                        <Select value={r.mealPlan} onChange={(e) => updateRoom(idx, "mealPlan", e.target.value)}>
                          <option>EP</option><option>CP</option><option>MAP</option><option>AP</option>
                        </Select>
                      </td>
                      <td className="px-2 py-1"><TextInput value={r.guestName} onChange={(e) => updateRoom(idx, "guestName", e.target.value)} /></td>
                      <td className="px-2 py-1"><TextInput value={r.contact} onChange={(e) => updateRoom(idx, "contact", e.target.value)} /></td>
                      <td className="px-2 py-1"><TextInput type="number" value={r.male} onChange={(e) => updateRoom(idx, "male", Number(e.target.value))} /></td>
                      <td className="px-2 py-1"><TextInput type="number" value={r.female} onChange={(e) => updateRoom(idx, "female", Number(e.target.value))} /></td>
                      <td className="px-2 py-1"><TextInput type="number" value={r.adult} onChange={(e) => updateRoom(idx, "adult", Number(e.target.value))} /></td>
                      <td className="px-2 py-1"><TextInput type="number" value={r.child} onChange={(e) => updateRoom(idx, "child", Number(e.target.value))} /></td>
                      <td className="px-2 py-1"><TextInput type="number" value={r.extra} onChange={(e) => updateRoom(idx, "extra", Number(e.target.value))} /></td>
                      <td className="px-2 py-1"><TextInput value={r.netRate} onChange={(e) => updateRoom(idx, "netRate", e.target.value)} /></td>
                      <td className="px-2 py-1"><Select value={r.discType} onChange={(e) => updateRoom(idx, "discType", e.target.value)}><option>No Disc</option><option>Flat</option><option>% Percent</option></Select></td>
                      <td className="px-2 py-1"><TextInput value={r.discVal} onChange={(e) => updateRoom(idx, "discVal", e.target.value)} /></td>
                      <td className="px-2 py-1"><Select value={r.tariff} onChange={(e) => updateRoom(idx, "tariff", e.target.value)}><option>Inclusive</option><option>Exclusive</option></Select></td>
                      <td className="px-2 py-1"><Select value={r.applyTariff} onChange={(e) => updateRoom(idx, "applyTariff", e.target.value)}><option>Rent</option><option>Complimentary</option></Select></td>
                      <td className="px-2 py-1"><TextInput value={r.planFood} onChange={(e) => updateRoom(idx, "planFood", e.target.value)} /></td>
                      <td className="px-2 py-1">
                        <button onClick={() => removeRoom(idx)} className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
              <button onClick={addRoom} className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium hover:bg-slate-100">+ Add Room</button>
              <div className="flex gap-4"><span>Total Adults: <b>{totalAdults}</b></span><span>Total Children: <b>{totalChildren}</b></span></div>
            </div>
          </div>
        </div>
      </Section>

      {/* CHECK-IN DETAILS */}
      <div className="mt-4 grid grid-cols-12 gap-3">
        <div className="col-span-12">
          <Section title="Check-in Details">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3">
                <Label>Check-in Type</Label>
                <Select value={booking.bookingDetails.checkInType} onChange={(e) => updateBookingDetails("checkInType", e.target.value)}>
                  <option>24 Hours CheckIn</option>
                  <option>Fixed 12PM</option>
                </Select>
              </div>
              <div className="col-span-3">
                <Label>Check-in Date & Time</Label>
                <TextInput type="datetime-local" value={booking.checkin.checkinDate} onChange={(e) => updateCheckin("checkinDate", e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>No.of Days</Label>
                <TextInput type="number" value={booking.bookingDetails.noOfDays} onChange={(e) => updateBookingDetails("noOfDays", e.target.value)} />
              </div>
              <div className="col-span-3">
                <Label>Check-out Date & Time</Label>
                <TextInput type="datetime-local" value={booking.checkin.checkoutDate} onChange={(e) => updateCheckin("checkoutDate", e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Check-out Grace Time</Label>
                <TextInput value={booking.bookingDetails.graceTime} onChange={(e) => updateBookingDetails("graceTime", e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Payment By</Label>
                <Select value={booking.paymentDetails.paymentBy} onChange={(e) => updatePayment("paymentBy", e.target.value)}>
                  <option>Direct</option>
                  <option>Company</option>
                  <option>OTA</option>
                </Select>
              </div>
              <div className="col-span-3">
                <Label>Check-in User</Label>
                <TextInput value={booking.bookingDetails.checkInUser} onChange={(e) => updateBookingDetails("checkInUser", e.target.value)} readOnly />
              </div>
              <div className="col-span-3 flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={booking.paymentDetails.allowChargesPosting === "Yes"} onChange={(v) => updatePayment("allowChargesPosting", v ? "Yes" : "No")} /> Allow Charges Posting</label>
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={booking.paymentDetails.enablePaxwise} onChange={(v) => updatePayment("enablePaxwise", v)} /> Enable Paxwise</label>
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={booking.bookingDetails.enableRoomSharing} onChange={(v) => updateBookingDetails("enableRoomSharing", v)} /> Enable Room Sharing</label>
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* ADDRESS DETAILS */}
      <div className="mt-4">
        <Section title="Address Details">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3">
              <Label>GST Number</Label>
              <TextInput value={booking.gstInfo.gstNumber} onChange={(e) => updateGST("gstNumber", e.target.value)} />
            </div>
            <div className="col-span-3">
              <Label>GST Type</Label>
              <Select value={booking.gstInfo.gstType} onChange={(e) => updateGST("gstType", e.target.value)}>
                <option>UNREGISTERED</option>
                <option>REGISTERED</option>
              </Select>
            </div>
            <div className="col-span-6">
              <Label>Address</Label>
              <TextInput value={guest.address} onChange={(e) => onGuest("address", e.target.value)} placeholder="Enter Address" />
            </div>
            <div className="col-span-3">
              <Label>City</Label>
              <TextInput value={booking.addressInfo.city} onChange={(e) => updateAddress("city", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>Pin Code</Label>
              <TextInput value={booking.addressInfo.pinCode} onChange={(e) => updateAddress("pinCode", e.target.value)} />
            </div>
            <div className="col-span-3">
              <Label>State</Label>
              <TextInput value={booking.addressInfo.state} onChange={(e) => updateAddress("state", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>Country</Label>
              <TextInput value={booking.addressInfo.country} onChange={(e) => updateAddress("country", e.target.value)} />
            </div>
            <div className="col-span-3">
              <Label>Guest Company *</Label>
              <TextInput value={booking.businessInfo.customerComapny} onChange={(e) => updateBusiness("customerComapny", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>Date of Birth</Label>
              <TextInput type="date" value={booking.personalInfo.dob} onChange={(e) => onBooking("personalInfo", { ...booking.personalInfo, dob: e.target.value })} />
            </div>
            <div className="col-span-1">
              <Label>Age</Label>
              <TextInput value={booking.personalInfo.age} onChange={(e) => onBooking("personalInfo", { ...booking.personalInfo, age: e.target.value })} />
            </div>
            <div className="col-span-3">
              <Label>Purpose of Visit</Label>
              <Select value={booking.businessInfo.purposeOfVisit} onChange={(e) => updateBusiness("purposeOfVisit", e.target.value)}>
                <option value="">Select Visiting Purpose</option>
                <option>Business</option>
                <option>Leisure</option>
                <option>Conference</option>
              </Select>
            </div>
            <div className="col-span-3">
              <Label>Visit Remark</Label>
              <TextInput value={booking.businessInfo.visitRemark} onChange={(e) => updateBusiness("visitRemark", e.target.value)} placeholder="Enter Visiting Remark" />
            </div>
            <div className="col-span-6">
              <Label>Booking Instructions</Label>
              <textarea className="h-20 w-full rounded-md border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-sky-400" value={booking.bookingDetails.bookingInstruction} onChange={(e) => updateBookingDetails("bookingInstruction", e.target.value)} />
            </div>
            <div className="col-span-6">
              <Label>Guest Special Instructions</Label>
              <textarea className="h-20 w-full rounded-md border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-sky-400" value={booking.guestInfo.specialRequests} onChange={(e) => updateGuestInfo("specialRequests", e.target.value)} />
            </div>
          </div>
        </Section>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">Totals – Adults: {totalAdults}, Children: {totalChildren}</div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} disabled={submitting} className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-50">{submitting ? "Processing..." : "Create Check-in"}</button>
          <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100">Save as Draft</button>
        </div>
      </div>

      {message && (
        <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800">{message}</div>
      )}
    </div>
  );
}
 


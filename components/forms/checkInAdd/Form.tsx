"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchCheckInMode } from "../../../lib/api";
import { BasicGuest, BookingPayload, initialBooking, initialGuest, initialRooms, RoomRow, StayDetailsDto } from "../../interface/Customer";


/** Component **/
export default function Form() {
  // main state
  const [guest, setGuest] = useState<BasicGuest>(initialGuest);
  const [booking, setBooking] = useState<BookingPayload>(initialBooking);
  const [rooms, setRooms] = useState<RoomRow[]>(initialRooms);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submittedPayload, setSubmittedPayload] = useState<any | null>(null);

  // rooms
  const [availableRooms, setAvailableRooms] = useState<Array<any>>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // check-in modes
  const [checkInModeList, setCheckInModeList] = useState<string[]>([]);
  const [checkInModesLoading, setCheckInModesLoading] = useState(false);



  // camera + files
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const idProofInputRef = useRef<HTMLInputElement | null>(null);

  const imageFileRef = useRef<File | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");


  const [scannedFileName, setScannedFileName] = useState<string | null>(null);
  const [scannedFilePreview, setScannedFilePreview] = useState<string | null>(null);


  const totalAdults = useMemo(() => rooms.reduce((s, r) => s + (Number(r.adult) || 0), 0), [rooms]);
  const totalChildren = useMemo(() => rooms.reduce((s, r) => s + (Number(r.child) || 0), 0), [rooms]);


  const [imageFile, setImageFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [newCustomerId, setNewCustomerId] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://192.168.1.4:8000";
  const DEFAULT_COMMON_ID = "906e4354-1117-4e25-b423-8dd5930b15cb";
  const DEFAULT_CLIENT_ID = "68105f14d6c8c8454185556b";
  const DEFAULT_PROPERTY_ID = "68105f24d6c8c8454185556d";

  /** Basic setters **/
  const onGuest = (key: keyof BasicGuest, value: any) => setGuest((g) => ({ ...g, [key]: value }));
  const onBooking = <K extends keyof BookingPayload>(key: K, value: BookingPayload[K]) => setBooking((b) => ({ ...b, [key]: value }));
  const updateBookingDetails = (key: keyof BookingPayload["bookingDetails"], value: any) =>
    onBooking("bookingDetails", { ...booking.bookingDetails, [key]: value });
  const updateCheckin = (key: keyof BookingPayload["checkin"], value: any) => onBooking("checkin", { ...booking.checkin, [key]: value });
  const updateGuestInfo = (key: keyof BookingPayload["guestInfo"], value: any) => onBooking("guestInfo", { ...booking.guestInfo, [key]: value });
  const updatePayment = (key: keyof BookingPayload["paymentDetails"], value: any) =>
    onBooking("paymentDetails", { ...booking.paymentDetails, [key]: value });
  const updateAddress = (key: keyof BookingPayload["addressInfo"], value: any) =>
    onBooking("addressInfo", { ...booking.addressInfo, [key]: value });
  const updateGST = (key: keyof BookingPayload["gstInfo"], value: any) => onBooking("gstInfo", { ...booking.gstInfo, [key]: value });
  const updateBusiness = (key: keyof BookingPayload["businessInfo"], value: any) =>
    onBooking("businessInfo", { ...booking.businessInfo, [key]: value });

  /** Rooms helpers **/
  const addRoom = () =>
    setRooms((rs) => [
      ...rs,
      {
        roomType: "",
        roomNo: "",
        ratePlan: "",
        mealPlan: "",
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
      },
    ]);

  const removeRoom = (index: number) => setRooms((rs) => rs.filter((_, i) => i !== index));
  const updateRoom = (index: number, key: keyof RoomRow, value: any) =>
    setRooms((rs) => rs.map((r, i) => (i === index ? { ...r, [key]: value } : r)));



  // capture and optionally auto-stop / auto-send
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    setIsCapturing(true);
    try {
      const video = videoRef.current;
      // give a tiny delay to let user remove finger/hand after pressing button
      await new Promise((res) => setTimeout(res, 150));

      // ensure video has valid dimensions
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

      // Sync preview + File creation
      setCapturedDataUrl(dataUrl);
      const file = dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`);

      // store in ref immediately (avoid relying on setState finishing)
      imageFileRef.current = file;

      // update state for UI/form
      setImageFile(file);

      // clear any previously selected file inputs so backend won't get old file
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (idProofInputRef.current) idProofInputRef.current.value = "";

      // optional UX: stop camera after capture
      stopCamera();
    } catch (err) {
      console.error("capture error", err);
    } finally {
      setIsCapturing(false);
    }
  };

  // retake: clear captured data and restart camera
  const retake = async () => {
    // clear the captured preview and the in-memory file
    setCapturedDataUrl(null);
    setImageFile(null);
    setScannedFilePreview(null);

    // restart camera (give the browser a tiny moment)
    try {
      await startCamera(); // startCamera will set facingMode and isCameraOn
    } catch (err) {
      // if start fails, show the message but keep the cleared state
      console.warn("Failed to restart camera:", err);
    }
  };

  // toggle camera (keep as before) but ensure stream is cleaned up
  const switchCamera = async () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    // stop current stream (stopCamera handles cleaning)
    stopCamera();
    // small delay to let hardware settle on some devices
    setTimeout(() => startCamera(newMode), 150);
  };



  /** Fetch rooms (minimal) **/
  const fetchRoomsForProperty = async (commonId: string = DEFAULT_COMMON_ID) => {
    setRoomsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/room/property/${commonId}`);
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();
      const available = (data || []).filter((r: any) => (r.roomStatus || "").toLowerCase() === "available");
      setAvailableRooms(available);
    } catch (e) {
      console.warn(e);
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsForProperty(DEFAULT_COMMON_ID);
  }, []);

  /** Checkin modes **/
  const loadCheckInModes = async () => {
    setCheckInModesLoading(true);
    try {
      const res = await fetchCheckInMode();
      const data = Array.isArray(res) ? res : (res as any)?.data || [];
      setCheckInModeList((data || []).map((d: any) => String(d.checkInMode || "")));
    } catch (e) {
      console.warn(e);
    } finally {
      setCheckInModesLoading(false);
    }
  };
  useEffect(() => {
    loadCheckInModes();
  }, []);


  /** File validation helper **/
  function validateFilesLocal(image: File | null, idproof: File | null) {
    // Make files optional: only validate if provided
    const MAX_BYTES = 5 * 1024 * 1024; // 5MB
    if (image) {
      if (!image.type.startsWith("image/")) return { ok: false, message: "Customer photo must be an image (jpg/png)." };
      if (image.size > MAX_BYTES) return { ok: false, message: "Customer photo must be less than 5MB." };
    }
    if (idproof) {
      if (!(idproof.type.startsWith("image/") || idproof.type === "application/pdf")) return { ok: false, message: "ID proof must be an image or PDF." };
      if (idproof.size > MAX_BYTES) return { ok: false, message: "ID proof must be less than 5MB." };
    }
    return { ok: true };
  }

  // tiny 1x1 PNG placeholder
  const PLACEHOLDER_PNG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9o6YkQAAAABJRU5ErkJggg==";

  function makePlaceholderImageFile(name = "no-photo.png") {
    return dataURLtoFile(PLACEHOLDER_PNG, name);
  }

  // minimal PDF placeholder
  function makePlaceholderPdfFile(name = "no-id.pdf") {
    const pdfText = `%PDF-1.1
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [3 0 R] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT /F1 12 Tf 72 120 Td (ID) Tj ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000061 00000 n 
0000000116 00000 n 
0000000231 00000 n 
0000000300 00000 n 
trailer
<< /Root 1 0 R >>
startxref
360
%%EOF`;
    const uint8 = new TextEncoder().encode(pdfText);
    return new File([uint8], name, { type: "application/pdf" });
  }



  /** Main submit: create customer -> then customer-info with returned id **/
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && typeof (e as any).preventDefault === "function") (e as any).preventDefault();
    setSubmitting(true);
    setMessage(null);
    setFileError(null);

    try {
      // local validation of required guest fields (simple)
      if (!guest.firstName) throw new Error("First name is required.");
      if (!guest.lastName) throw new Error("Last name is required.");
      if (!guest.mobileNo) throw new Error("Mobile number is required.");

      // validate files
      const validation = validateFilesLocal(imageFile, idProofFile);
      if (!validation.ok) {
        setFileError(validation.message ?? null);
        setSubmitting(false);
        return;
      }


      // 1. create customer (multipart)
      const customerId = await createCustomer();

      // 2. create customer-info using returned id
      // after createCustomerInfo(customerId) (inside try)
      await createCustomerInfo(customerId);

      // show success
      setMessage(" Customer and customer-info created successfully.");

      // reset UI form to initial states
      setGuest(initialGuest);
      setBooking(initialBooking);
      setRooms(initialRooms);

      // clear files + previews + camera
      setImageFile(null);
      setIdProofFile(null);
      setCapturedDataUrl(null);
      setScannedFilePreview(null);
      setScannedFileName(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (idProofInputRef.current) idProofInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      stopCamera();

      setMessage("Customer and customer-info created successfully.");
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Unknown error";
      setMessage(`X ${msg}`);
      if (msg.toLowerCase().includes("image") || msg.toLowerCase().includes("id proof") || msg.toLowerCase().includes("missing")) {
        setFileError(msg);
      } else {
        alert(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /** Create customer (multipart/form-data) **/
  const createCustomer = async (): Promise<string> => {
    // still validate any provided files
    const v = validateFilesLocal(imageFile, idProofFile);
    if (!v.ok) throw new Error(v.message);

    const url = `${API_BASE}/api/v1/customers/create`;
    const fd = new FormData();

    const clientId = booking.hotelDetails.clientId || DEFAULT_CLIENT_ID;
    const propertyId = booking.hotelDetails.propertyId || DEFAULT_PROPERTY_ID;

    fd.append("clientId", clientId);
    fd.append("propertyId", propertyId);
    fd.append("firstName", guest.firstName || "");
    fd.append("lastName", guest.lastName || "");
    fd.append("title", guest.title || "");
    fd.append("email", guest.email || "");
    fd.append("gender", guest.gender || "");
    fd.append("mobileNo", guest.mobileNo || "");
    fd.append("nationality", guest.nationality || "");
    fd.append("idType", guest.idType || "");
    fd.append("idNumber", guest.idNumber || "");
    fd.append("address", guest.address || "");
    fd.append("isVIP", "true");
    fd.append("isForeignCustomer", guest.nationality && guest.nationality.toLowerCase() === "indian" ? "false" : "true");
    fd.append("isActive", "true");

    // Append image and idproof — use provided files or placeholders
    if (imageFile) {
      fd.append("image", imageFile);
    } else {
      fd.append("image", makePlaceholderImageFile("no-photo.png"));
    }

    if (idProofFile) {
      fd.append("idproof", idProofFile);
    } else {
      // prefer a PDF placeholder, but if your server expects an image you can use makePlaceholderImageFile instead
      fd.append("idproof", makePlaceholderPdfFile("no-id.pdf"));
    }

    const res = await fetch(url, {
      method: "POST",
      body: fd,
      credentials: "include",
    });

    if (!res.ok) {
      let errMsg = `Customer create failed: ${res.status}`;
      try {
        const j = await res.json();
        if (j.message) errMsg = j.message;
      } catch (e) { }
      throw new Error(errMsg);
    }

    const json = await res.json();
    const newId = json.id || json._id || json.data?.id || json.data?.customerId || json.customerId;
    if (!newId) throw new Error("Customer created but server did not return an id.");
    setNewCustomerId(newId);
    return newId;
  };
  /** Create customer-info (JSON) **/
  // replace your createCustomerInfo with this implementation
  /** Create customer-info (JSON) **/
  const createCustomerInfo = async (customerId: string) => {
    const infoUrl = `${API_BASE}/api/v1/customer-info/create`;

    const stayDetails = rooms.map((r, idx) => {
      const adult = Number(r.adult || 0);
      const child = Number(r.child || 0);
      const extra = Number(r.extra || 0);
      const seniors = 0;
      const guestsArr = [
        {
          guestName: [(r.guestName && String(r.guestName).trim()) || `${guest.firstName || ""} ${guest.lastName || ""}`.trim()].filter(Boolean),
          phoneNo: r.contact || guest.mobileNo || "",
          emailId: guest.email || "",
          city: booking.addressInfo?.city || "",
          address: guest.address || "",
          pincode: booking.addressInfo?.pinCode || "",
          state: booking.addressInfo?.state || "",
          country: booking.addressInfo?.country || "",
          payPerRoom: "",
          specialInstructions: booking.guestInfo?.specialRequests || "",
        },
      ];

      return {
        roomNo: String(r.roomNo || `R${idx + 1}`),
        bedType: (r as any).bedType || "Single",
        roomType: r.roomType || "",
        roomFacility: (r as any).roomFacility || [],
        planFood: r.planFood || "",
        mealPlan: r.mealPlan || "",
        ratePlan: r.ratePlan || "",
        tariff: r.tariff || "Inclusive",
        newRentTariff: (r as any).newRentTariff || undefined,
        applyTariff: r.applyTariff || "Rent",
        numberOfGuests: { adult, child, seniors },
        noOfPax: adult + child + extra,
        childPax: child,
        extraPax: extra,
        isActive: true,
        status: (r as any).status || "CheckedIn",
        guests: guestsArr,
      } as unknown as StayDetailsDto;
    });

    const noOfPax = rooms.reduce((s, r) => s + (Number(r.adult || 0) + Number(r.child || 0) + Number(r.extra || 0)), 0);

    const toDateOrUndefined = (v?: string) => (v ? new Date(v) : undefined);

    const payload = {
      hotelDetails: {
        clientId: booking.hotelDetails.clientId || DEFAULT_CLIENT_ID,
        propertyId: booking.hotelDetails.propertyId || DEFAULT_PROPERTY_ID,
        customerId: customerId || "",
        hotelName: booking.hotelDetails.hotelName || "CJ",
        hotelAddress: booking.hotelDetails.hotelAddress || "salem",
        hotelMobileNo: booking.hotelDetails.hotelMobileNo || "0987654321",
        gstin: booking.hotelDetails.gstin || undefined,
        hsnCode: booking.hotelDetails.hsnCode || undefined,
      },
      bookingDetails: {
        isReservation: Boolean(booking.bookingDetails.isReservation),
        bookingId: booking.bookingDetails.bookingId || "",
        noOfDays: String(booking.bookingDetails.noOfDays || ""),
        noOfRooms: String(rooms.length || booking.bookingDetails.noOfRooms || ""),
        graceTime: booking.bookingDetails.graceTime || undefined,
        checkInType: booking.bookingDetails.checkInType || "",
        checkInMode: booking.bookingDetails.checkInMode || "",
        checkInUser: booking.bookingDetails.checkInUser || "",
        roomStatus: booking.bookingDetails.roomStatus || undefined,
        arrivalMode: booking.bookingDetails.arrivalMode || undefined,
        otaName: booking.bookingDetails.otaName || undefined,
        bookingInstruction: booking.bookingDetails.bookingInstruction || undefined,
        enableRoomSharing: Boolean(booking.bookingDetails.enableRoomSharing),
        bookingThrough: booking.bookingDetails.bookingThrough || undefined,
        preferredRooms: booking.bookingDetails.preferredRooms || undefined,
        reservedBy: booking.bookingDetails.reservedBy || undefined,
        reservedStatus: booking.bookingDetails.reservedStatus || undefined,
        reservationNo: booking.bookingDetails.reservationNo || undefined,
      },
      checkin: {
        checkinDate: toDateOrUndefined(booking.checkin.checkinDate),
        checkoutDate: toDateOrUndefined(booking.checkin.checkoutDate),
        arrivalDate: toDateOrUndefined(booking.checkin.arrivalDate),
        depatureDate: toDateOrUndefined(booking.checkin.depatureDate),
      },
      stayDetails,
      guestInfo: {
        numberOfGuests: {
          adult: totalAdults || 0,
          child: totalChildren || 0,
          seniors: booking.guestInfo?.numberOfGuests?.seniors || 0,
        },
        noOfPax,
        childPax: booking.guestInfo?.childPax || 0,
        extraPax: booking.guestInfo?.extraPax || 0,
        specialRequests: booking.guestInfo?.specialRequests || "",
        complimentary: booking.guestInfo?.complimentary || "",
        vechileDetails: booking.guestInfo?.vechileDetails || "",
      },
      paymentDetails: {
        paymentType: booking.paymentDetails?.paymentType || "",
        paymentBy: booking.paymentDetails?.paymentBy || "",
        allowCredit: booking.paymentDetails?.allowCredit || undefined,
        paidAmount: Number(booking.paymentDetails?.paidAmount || 0),
        balanceAmount: Number(booking.paymentDetails?.balanceAmount || 0),
        discType: booking.paymentDetails?.discType || undefined,
        discValue: booking.paymentDetails?.discValue || undefined,
        netRate: booking.paymentDetails?.netRate || undefined,
        allowChargesPosting: booking.paymentDetails?.allowChargesPosting || undefined,
        enablePaxwise: Boolean(booking.paymentDetails?.enablePaxwise),
        paxwiseBillAmount: booking.paymentDetails?.paxwiseBillAmount || undefined,
      },
      addressInfo: {
        city: booking.addressInfo?.city || "",
        pinCode: booking.addressInfo?.pinCode || "",
        state: booking.addressInfo?.state || "",
        country: booking.addressInfo?.country || "",
      },
      gstInfo: {
        gstNumber: booking.gstInfo?.gstNumber || undefined,
        gstType: booking.gstInfo?.gstType || undefined,
      },
      personalInfo: {
        dob: booking.personalInfo?.dob || undefined,
        age: booking.personalInfo?.age || undefined,
        companyAnniversary: booking.personalInfo?.companyAnniversary || undefined,
      },
      businessInfo: {
        segmentName: booking.businessInfo?.segmentName || undefined,
        bussinessSource: booking.businessInfo?.bussinessSource || undefined,
        customerComapny: booking.businessInfo?.customerComapny || undefined,
        purposeOfVisit: booking.businessInfo?.purposeOfVisit || undefined,
        visitRemark: booking.businessInfo?.visitRemark || undefined,
      },
      invoiceOptions: {
        printOption: booking.invoiceOptions?.printOption ?? true,
        pdfSaveOption: booking.invoiceOptions?.pdfSaveOption ?? true,
      },
      extra: booking.extra || [],
      meta: {
        rating: booking.meta?.rating || undefined,
        isCancelled: booking.meta?.isCancelled ?? false,
        isActive: booking.meta?.isActive ?? true,
        createdAt: booking.meta?.createdAt || new Date().toISOString(),
        updatedAt: booking.meta?.updatedAt || new Date().toISOString(),
      },
    };

    // set payload into state for preview (so UI can show values)
    setSubmittedPayload(payload);

    console.debug("createCustomerInfo payload:", payload);

    const res = await fetch(infoUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errMsg = `Customer-info create failed: ${res.status}`;
      try {
        const j = await res.json();
        if (j.message) errMsg = j.message;
      } catch (e) { }
      throw new Error(errMsg);
    }

    return res.json();
  };




  /** Camera behavior **/
  const ensureGetUserMedia = async () => {
    if (typeof navigator === "undefined") throw new Error("Navigator not available");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Camera API not supported.");
  };

  /** Files & previews **/
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "idProof") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        if (type === "image") {
          setImageFile(file);
          setCapturedDataUrl(URL.createObjectURL(file));
        } else {
          setIdProofFile(file);
          if (file.type.startsWith("image/")) setScannedFilePreview(URL.createObjectURL(file));
          setScannedFileName(file.name);
        }
        setFileError(null);
      } else {
        setFileError("File type not supported. Use an image for photo and image/pdf for id proof.");
      }
    }
  };

  const startCamera = async (useFacing?: "environment" | "user") => {
    try {
      setCamError(null);
      await ensureGetUserMedia();
      const mode = useFacing || facingMode;
      const constraints: MediaStreamConstraints = {
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = videoRef.current!;
      video.srcObject = stream;
      await new Promise<void>((res) => {
        const onLoaded = () => {
          video.removeEventListener("loadedmetadata", onLoaded);
          res();
        };
        video.addEventListener("loadedmetadata", onLoaded);
      });
      await video.play();
      setIsCameraOn(true);
      setCapturedDataUrl(null);
      setFacingMode(mode);
    } catch (err: any) {
      console.error(err);
      setCamError(err?.message || "Camera access denied/unavailable.");
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (video) video.srcObject = null;
    setIsCameraOn(false);
  };

  useEffect(() => () => stopCamera(), []);

  // convert data URL -> File
  function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new File([u8], filename, { type: mime });
  }


  const onUploadClick = () => fileInputRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScannedFileName(file.name);
    if (file.type.startsWith("image/")) {
      setScannedFilePreview(URL.createObjectURL(file));
    } else {
      setScannedFilePreview(null);
    }
    // attach uploaded file as idProof
    setIdProofFile(file);
  };

  /** Small UI helpers (kept minimal) **/
  function RoundIconButton({ title, onClick, children }: { title?: string; onClick?: () => void; children: React.ReactNode }) {
    return (
      <button
        type="button"
        title={title}
        onClick={onClick}
        className="h-8 w-8 rounded-full bg-white ring-2 ring-sky-300/70 shadow-sm flex items-center justify-center text-sky-700 hover:scale-105 transition-transform"
      >
        {children}
      </button>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Check-in</h1>
        <div className="flex gap-2">
          <button onClick={handleSubmit} disabled={submitting} className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-50">
            {submitting ? "Processing..." : "Create Check-in"}
          </button>

        </div>
      </div>

      {/* QUICK CHECK-IN (green) */}
      <div className="rounded-lg border bg-green-50 border-green-200">
        <div className="px-3 py-2 rounded-t-lg bg-green-100 text-sm font-semibold text-green-900">Quick Check-In</div>
        <div className="p-3">
          <div className="grid grid-cols-12 gap-3">
            {/* Left block inputs (each input rendered using your requested div/label/input pattern) */}
            <div className="col-span-9 grid grid-cols-12 gap-3">
              {/* Is Reservation */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Is Reservation</label>
                <div className="w-full p-2 border border-gray-300 rounded flex items-center">
                  <input
                    type="checkbox"
                    checked={booking.bookingDetails.isReservation}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateBookingDetails("isReservation", checked);
                      if (!checked) {
                        // clear reservationNo if unchecked
                        updateBookingDetails("reservationNo", "");
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{booking.bookingDetails.isReservation ? "Yes" : "No"}</span>
                </div>
              </div>

              {/* Reservation Number */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Reservation Number</label>
                <input
                  type="text"
                  name="reservationNo"
                  value={booking.bookingDetails.reservationNo}
                  onChange={(e) => updateBookingDetails("reservationNo", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={!booking.bookingDetails.isReservation}
                />
              </div>


              {/* Arrival Mode */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Arrival Mode</label>
                <select
                  value={booking.bookingDetails.arrivalMode}
                  onChange={(e) => updateBookingDetails("arrivalMode", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option>Walk-In/Direct</option>
                  <option>OTA</option>
                  <option>Travel Desk</option>
                  <option>BE</option>
                  <option>Company</option>
                </select>
              </div>

              {/* OTA */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">OTA</label>
                <input type="text" name="otaName" value={booking.bookingDetails.otaName} onChange={(e) => updateBookingDetails("otaName", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              {/* Booking ID */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Booking ID</label>
                <input type="text" name="bookingId" value={booking.bookingDetails.bookingId} onChange={(e) => updateBookingDetails("bookingId", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              {/* Contact No (country code + number) */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Contact No.</label>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3">
                    <input type="text" readOnly value="91" className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div className="col-span-9">
                    <input type="text" name="mobileNo" value={guest.mobileNo} onChange={(e) => onGuest("mobileNo", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="col-span-2">
                <label className="block text-sm font-medium">Title</label>
                <select value={guest.title} onChange={(e) => onGuest("title", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                  <option>Mr</option>
                  <option>Dr</option>
                  <option>Ms</option>
                  <option>Captain</option>
                  <option>Miss</option>
                  <option>Master</option>
                  <option>Others</option>
                </select>
              </div>

              {/* First Name */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">firstName</label>
                <input
                  type="text"
                  name="firstName"
                  value={guest.firstName}
                  onChange={(e) => onGuest("firstName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">lastName</label>
                <input type="text" name="lastName" value={guest.lastName} onChange={(e) => onGuest("lastName", e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />
              </div>

              {/* Gender */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Gender</label>
                <select value={guest.gender} onChange={(e) => onGuest("gender", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              {/* City */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">City</label>
                <input type="text" name="city" value={booking.addressInfo.city} onChange={(e) => updateAddress("city", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              {/* ID No */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">ID No. (Aadhaar, Other)</label>
                <input type="text" name="idNumber" value={guest.idNumber} onChange={(e) => onGuest("idNumber", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              {/* Email */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Email</label>
                <input type="email" name="email" value={guest.email} onChange={(e) => onGuest("email", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              {/* Check-In Mode */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Check-In Mode</label>
                <select value={booking.bookingDetails.checkInMode || ""} onChange={(e) => updateBookingDetails("checkInMode", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select Mode</option>
                  {checkInModeList.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {checkInModesLoading && <div className="text-xs text-slate-500 mt-1">Loading modes...</div>}
              </div>

              {/* Allow Credit */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Allow Credit</label>
                <select value={booking.paymentDetails.allowCredit} onChange={(e) => updatePayment("allowCredit", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              {/* Foreign Guest */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Foreign Guest</label>
                <select value={guest.nationality === "Indian" ? "No" : "Yes"} onChange={(e) => onGuest("nationality", e.target.value === "Yes" ? "Foreign" : "Indian")} className="w-full p-2 border border-gray-300 rounded">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              {/* Segment Name */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Segment Name</label>
                <select value={booking.businessInfo.segmentName} onChange={(e) => updateBusiness("segmentName", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select Segment</option>
                  <option>CORPORATE</option>
                  <option>RETAIL</option>
                  <option>OTA</option>
                </select>
              </div>

              {/* Business Source */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Business Source</label>
                <input type="text" value={booking.businessInfo.bussinessSource} onChange={(e) => updateBusiness("bussinessSource", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium">Id Type</label>
                <select value={guest.idType} onChange={(e) => onGuest("idType", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select ID Type</option>
                  <option>Aadhar Card</option>
                  <option>Pan Card</option>
                  <option>Election Card</option>
                  <option>Licence Card</option>
                </select>
              </div>
            </div>

            {/* Right side actions (camera + scan files) — unchanged visuals */}
            <div className="col-span-3 flex flex-col items-center gap-6">
              {/* TAKE PHOTO */}
              <div className="flex flex-col items-center gap-3 relative w-full">
                <div className="text-sm font-medium text-slate-600 self-start">Take Photo <span className="text-rose-600">*</span></div>

                <div className="absolute -top-4 right-3 flex gap-2 z-20">
                  <RoundIconButton title="Toggle camera (front/back)" onClick={switchCamera}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" />
                      <rect x="3" y="6" width="12" height="12" rx="2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </RoundIconButton>

                  <RoundIconButton title="Upload photo file" onClick={() => imageInputRef.current?.click()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
                      <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4 4 4" />
                      <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M21 21H3" />
                    </svg>
                  </RoundIconButton>
                </div>

                <div className="relative h-40 w-32 rounded-md border border-slate-300 bg-slate-100 overflow-hidden flex items-center justify-center">
                  {capturedDataUrl ? (
                    <img src={capturedDataUrl} alt="Captured" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <video ref={videoRef} playsInline muted autoPlay className="h-full w-full object-cover" />
                      {!isCameraOn && <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs px-2 text-center">{camError ? camError : "Camera is off"}</div>}
                    </>
                  )}
                </div>

                {/* Camera action buttons */}
                <div className="flex flex-wrap gap-2">
                  {/* Start / Stop camera toggle */}
                  {!isCameraOn ? (
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="rounded bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-700"
                      disabled={isCapturing || submitting}
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700"
                      disabled={isCapturing || submitting}
                    >
                      Stop
                    </button>
                  )}

                  {/* Take Image (auto-send) */}
                  {isCameraOn && !capturedDataUrl && (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={isCapturing || submitting}
                      className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isCapturing ? "Taking..." : "Take Image"}
                    </button>
                  )}

                  {/* Retake */}
                  {capturedDataUrl && (
                    <button
                      type="button"
                      onClick={retake}
                      disabled={isCapturing || submitting}
                      className="rounded bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700"
                    >
                      Retake
                    </button>
                  )}
                </div>



                <div className="text-[10px] text-slate-500 self-start">Tip: Use HTTPS (or localhost). iOS requires tapping buttons (user gesture).</div>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e as any, "image")} />
                <input ref={idProofInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileChange(e as any, "idProof")} />
              </div>

              {/* SCAN FILES */}
              <div className="flex flex-col items-center gap-3 relative w-full">
                <div className="text-sm font-medium text-slate-600 self-start">Scan Files <span className="text-rose-600">*</span></div>

                <div className="absolute -top-4 right-3 flex gap-2 z-20">
                  <RoundIconButton title="Upload document" onClick={onUploadClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M7 10l5-5 5 5" />
                      <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14" />
                    </svg>
                  </RoundIconButton>
                </div>

                <div className="flex items-center justify-center h-40 w-32 rounded-md border border-dashed border-slate-300 bg-slate-50 overflow-hidden">
                  {scannedFilePreview ? (
                    <img src={scannedFilePreview} alt="Scanned preview" className="h-full w-full object-contain bg-white p-2" />
                  ) : (
                    <div className="text-center text-xs text-slate-400 flex flex-col items-center px-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h13M5 17h2m4 0h2m4 0h2m-8 4h8a2 2 0 002-2v-8.586a1 1 0 00-.293-.707l-6.414-6.414A1 1 0 0012.586 3H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {scannedFileName ? <div className="text-xs text-slate-600 truncate w-28">{scannedFileName}</div> : <div>Document Placeholder</div>}
                    </div>
                  )}
                </div>

                <input ref={fileInputRef} type="file" className="hidden" onChange={onFileChange} />
              </div>

              {/* file error */}
              {fileError && <div className="text-xs text-rose-600 mt-1">{fileError}</div>}
            </div>

            {/* Rooms grid (kept same structure but using simpler inputs) */}
            <div className="col-span-12">
              <div className="overflow-auto rounded-md border border-slate-200">
                <table className="min-w-[1600px] w-full text-sm">
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
                        <td className="px-2 py-1">
                          <select
                            value={r.roomType || ""}
                            onChange={(e) => {
                              const selectedType = e.target.value;
                              updateRoom(idx, "roomType", selectedType);
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="">Select Room Type</option>
                            {Array.from(new Set(availableRooms.map((a: any) => a.roomType))).map((t: any) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-2 py-1">
                          <select
                            value={r.roomNo || ""}
                            onChange={(e) => updateRoom(idx, "roomNo", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="">Select Room No</option>
                            {availableRooms.map((room: any) => (
                              <option key={room.roomNumber} value={room.roomNumber}>
                                {room.roomNumber}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-2 py-1">
                          <input value={r.ratePlan} onChange={(e) => updateRoom(idx, "ratePlan", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <select value={r.mealPlan} onChange={(e) => updateRoom(idx, "mealPlan", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                            <option>EP</option>
                            <option>CP</option>
                            <option>MAP</option>
                            <option>AP</option>
                          </select>
                        </td>
                        <td className="px-2 py-1">
                          <input value={r.guestName} onChange={(e) => updateRoom(idx, "guestName", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <input value={r.contact} onChange={(e) => updateRoom(idx, "contact", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" value={r.male} onChange={(e) => updateRoom(idx, "male", Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" value={r.female} onChange={(e) => updateRoom(idx, "female", Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" value={r.adult} onChange={(e) => updateRoom(idx, "adult", Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" value={r.child} onChange={(e) => updateRoom(idx, "child", Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" value={r.extra} onChange={(e) => updateRoom(idx, "extra", Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <input value={r.netRate} onChange={(e) => updateRoom(idx, "netRate", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <select value={r.discType} onChange={(e) => updateRoom(idx, "discType", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                            <option>No Disc</option>
                            <option>Flat</option>
                            <option>% Percent</option>
                          </select>
                        </td>
                        <td className="px-2 py-1">
                          <input value={r.discVal} onChange={(e) => updateRoom(idx, "discVal", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <select value={r.tariff} onChange={(e) => updateRoom(idx, "tariff", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                            <option>Inclusive</option>
                            <option>Exclusive</option>
                          </select>
                        </td>
                        <td className="px-2 py-1">
                          <select value={r.applyTariff} onChange={(e) => updateRoom(idx, "applyTariff", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                            <option>Rent</option>
                            <option>Complimentary</option>
                          </select>
                        </td>
                        <td className="px-2 py-1">
                          <input value={r.planFood} onChange={(e) => updateRoom(idx, "planFood", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <button onClick={() => removeRoom(idx)} className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                <button onClick={addRoom} className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium hover:bg-slate-100">
                  + Add Room
                </button>
                <div className="flex gap-4">
                  <span>
                    Total Adults: <b>{totalAdults}</b>
                  </span>
                  <span>
                    Total Children: <b>{totalChildren}</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Details (kept compact) */}
      <div className="mt-4 grid grid-cols-12 gap-3">
        <div className="col-span-12">
          <div className="rounded-lg border bg-white border-slate-200">
            <div className="px-3 py-2 rounded-t-lg bg-slate-100 text-sm font-semibold text-slate-900">Check-in Details</div>
            <div className="p-3">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <label className="block text-sm font-medium">Check-in Type</label>
                  <select value={booking.bookingDetails.checkInType} onChange={(e) => updateBookingDetails("checkInType", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                    <option>24 Hours CheckIn</option>
                    <option>Fixed 12PM</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium">Check-in Date & Time</label>
                  <input type="datetime-local" value={booking.checkin.checkinDate} onChange={(e) => updateCheckin("checkinDate", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">No.of Days</label>
                  <input type="number" value={booking.bookingDetails.noOfDays} onChange={(e) => updateBookingDetails("noOfDays", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium">Check-out Date & Time</label>
                  <input type="datetime-local" value={booking.checkin.checkoutDate} onChange={(e) => updateCheckin("checkoutDate", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Check-out Grace Time</label>
                  <input value={booking.bookingDetails.graceTime} onChange={(e) => updateBookingDetails("graceTime", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Payment By</label>
                  <select value={booking.paymentDetails.paymentBy} onChange={(e) => updatePayment("paymentBy", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                    <option>Direct</option>
                    <option>Company</option>
                    <option>OTA</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium">Check-in User</label>
                  <input value={booking.bookingDetails.checkInUser} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-50" />
                </div>

                <div className="col-span-6 flex items-end gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={booking.paymentDetails.allowChargesPosting === "Yes"} onChange={(e) => updatePayment("allowChargesPosting", e.target.checked ? "Yes" : "No")} />
                    <span className="text-sm">Allow Charges Posting</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={booking.paymentDetails.enablePaxwise} onChange={(e) => updatePayment("enablePaxwise", e.target.checked)} />
                    <span className="text-sm">Enable Paxwise</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={booking.bookingDetails.enableRoomSharing} onChange={(e) => updateBookingDetails("enableRoomSharing", e.target.checked)} />
                    <span className="text-sm">Enable Room Sharing</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Details (simpler inputs) */}
      <div className="mt-4">
        <div className="rounded-lg border bg-white border-slate-200">
          <div className="px-3 py-2 rounded-t-lg bg-slate-100 text-sm font-semibold text-slate-900">Address Details</div>
          <div className="p-3">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3">
                <label className="block text-sm font-medium">GST Number</label>
                <input value={booking.gstInfo.gstNumber} onChange={(e) => updateGST("gstNumber", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium">GST Type</label>
                <select value={booking.gstInfo.gstType} onChange={(e) => updateGST("gstType", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                  <option>UNREGISTERED</option>
                  <option>REGISTERED</option>
                </select>
              </div>
              <div className="col-span-6">
                <label className="block text-sm font-medium">Address</label>
                <input value={guest.address} onChange={(e) => onGuest("address", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium">City</label>
                <input value={booking.addressInfo.city} onChange={(e) => updateAddress("city", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Pin Code</label>
                <input value={booking.addressInfo.pinCode} onChange={(e) => updateAddress("pinCode", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium">State</label>
                <input value={booking.addressInfo.state} onChange={(e) => updateAddress("state", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Country</label>
                <input value={booking.addressInfo.country} onChange={(e) => updateAddress("country", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium">Guest Company *</label>
                <input value={booking.businessInfo.customerComapny} onChange={(e) => updateBusiness("customerComapny", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">Date of Birth</label>
                <input type="date" value={booking.personalInfo.dob} onChange={(e) => onBooking("personalInfo", { ...booking.personalInfo, dob: e.target.value })} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">Age</label>
                <input value={booking.personalInfo.age} onChange={(e) => onBooking("personalInfo", { ...booking.personalInfo, age: e.target.value })} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium">Purpose of Visit</label>
                <select value={booking.businessInfo.purposeOfVisit} onChange={(e) => updateBusiness("purposeOfVisit", e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select Visiting Purpose</option>
                  <option>Business</option>
                  <option>Leisure</option>
                  <option>Conference</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium">Visit Remark</label>
                <input value={booking.businessInfo.visitRemark} onChange={(e) => updateBusiness("visitRemark", e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium">Booking Instructions</label>
                <textarea value={booking.bookingDetails.bookingInstruction} onChange={(e) => updateBookingDetails("bookingInstruction", e.target.value)} className="h-20 w-full p-2 border border-gray-300 rounded" />
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium">Guest Special Instructions</label>
                <textarea value={booking.guestInfo.specialRequests} onChange={(e) => updateGuestInfo("specialRequests", e.target.value)} className="h-20 w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Submitted payload preview */}
      {submittedPayload && (
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-3 text-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Last submitted payload</div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded bg-white px-2 py-1 text-xs border"
                onClick={() => {
                  setSubmittedPayload(null);
                }}
              >
                Clear preview
              </button>
            </div>
          </div>
          <pre className="max-h-64 overflow-auto text-xs leading-5 p-2 bg-slate-50 rounded">
            {JSON.stringify(submittedPayload, null, 2)}
          </pre>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">Totals – Adults: {totalAdults}, Children: {totalChildren}</div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} disabled={submitting} className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-50">
            {submitting ? "Processing..." : "Create Check-in"}
          </button>

        </div>
      </div>

      {message && <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800">{message}</div>}
    </div>
  );
}
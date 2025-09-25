// 15-9-2025  Room Type, Room Number, and Bed Type select add ,customer info paymenttype deatils add in input and label  ,old custom image id proof check in not update   suriya
// 15-9-2025 guestinfo adult child senios  total count funcation add
// 16-9-2025 gstInfo input and label add , toggle  function add in show or not,   function change to common code in API ,
// 18-9-2025 check in form toggle button hide and show  Quick Check-In , Check in Details .Address Details, checkin form / Success — navigate to /dashboard. input box color.
// 19-9-2025 checkboxes to update  
// 20-9-2025  hotel Details to pass hotel datas 
// 24-9-2025   Filter by logged-in user's clientId + propertyId

"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createCustomerApi, createCustomerInfoApi, fetchCheckInMode, fetchHotelOwnerById, fetchPropertyById, fetchRoomsForPropertyApi, getMergedCustomersAndInfos } from "../../../lib/api";
import { BasicGuest, BookingPayload, initialBooking, initialGuest, initialRooms, RoomRow, StayDetails } from "../../interface/Customer";
import { Book, ChevronDownIcon, DeleteIcon, FileText, PrinterIcon, Upload, User, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { IoAdd } from "react-icons/io5";
import { useAuth } from "@/app/context/AuthContext";
import { PropertyData } from "../../interface/property";

/** Component **/
export default function Form() {
  // main state
  const [guest, setGuest] = useState<BasicGuest>(initialGuest);
  const [booking, setBooking] = useState<BookingPayload>(initialBooking);
  const [rooms, setRooms] = useState<RoomRow[]>(initialRooms);

  const [message, setMessage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);


  // rooms
  const [availableRooms, setAvailableRooms] = useState<Array<any>>([]);

  // check-in modes
  const [checkInModeList, setCheckInModeList] = useState<string[]>([]);


  // camera + files
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const idProofInputRef = useRef<HTMLInputElement | null>(null);

  const imageFileRef = useRef<File | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");


  const [scannedFileName, setScannedFileName] = useState<string | null>(null);
  const [scannedFilePreview, setScannedFilePreview] = useState<string | null>(null);

  // Hid
  const [showPayment, setShowPayment] = useState(true);
  const [showCheckinDetails, setCheckinDetails] = useState(true);
  const [showAddressDetails, setAddressDetails] = useState(true);
  const [showCheckin, setshowCheckin] = useState(true);


  const totalAdults = useMemo(() => rooms.reduce((s, r) => s + (Number(r.adult) || 0), 0), [rooms]);
  const totalChildren = useMemo(() => rooms.reduce((s, r) => s + (Number(r.child) || 0), 0), [rooms]);
  const totalSeniors = useMemo(() => rooms.reduce((s, r) => s + (Number(r.seniors) || 0), 0), [rooms]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [, setNewCustomerId] = useState<string | null>(null);


  // old data show 
  const [oldCustomersListOpen, setOldCustomersListOpen] = useState(false);
  const [oldCustomersLoading, setOldCustomersLoading] = useState(false);
  const [oldCustomersMerged, setOldCustomersMerged] = useState<Array<any>>([]);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user, } = useAuth();

  const [HotelsDetails, setHotelsDetails] = useState(false);
  const [PropertyDetails, setPropertyDetails] = useState<PropertyData | null>(null);

  const COMMON_ID =  PropertyDetails?.commonId;

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
  const updateInvoiceOptions = (key: keyof BookingPayload["invoiceOptions"], value: any) => onBooking("invoiceOptions", { ...booking.invoiceOptions, [key]: value, });

  const removeRoom = (index: number) => setRooms((rs) => rs.filter((_, i) => i !== index));
  const updateRoom = (index: number, key: keyof RoomRow, value: any) =>
    setRooms((rs) => rs.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  // unique id generator (module scope)
  let __nextIdCounter = Date.now();
  const nextId = () => {
    __nextIdCounter += 1;
    return __nextIdCounter;
  };

  const addRoom = () =>
    setRooms((rs) => [
      ...rs,
      {
        id: nextId(),
        roomType: "",
        roomNo: "",
        ratePlan: "",
        mealPlan: "",
        guestName: [""],
        contact: "",
        adult: 0,
        child: 0,
        seniors: 0,
        extra: 0,
        netRate: "",
        discType: "",
        discVal: "",
        tariff: "",
        applyTariff: "",
        planFood: "",
        bedType: "",
        roomFacility: [],
        status: "",
        newRentTariff: "",
        emailId: "",
        city: "",
        address: "",
        pincode: "",
        state: "",
        country: "",
        specialInstructions: "",
      },
    ]); 

useEffect(() => {
  let mounted = true;

  // click-outside (attach only when open)
  function handleClickOutside(event: MouseEvent) {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setOldCustomersListOpen(false);
    }
  }

  const run = async () => {
    // 1) sessionStorage → apply selected room once
    try {
      const raw = sessionStorage.getItem("selectedRoom");
      if (raw) {
        const data = JSON.parse(raw);
        setRooms((rs) => {
          if (rs.length > 0) {
            const updated = [...rs];
            updated[0] = {
              ...updated[0],
              roomNo: data.roomNo ?? updated[0].roomNo,
              roomType: data.roomType ?? updated[0].roomType,
              bedType: data.bedType ?? updated[0].bedType,
            };
            return updated;
          }
          return [
            {
              id: nextId(),
              roomType: data.roomType || "",
              roomNo: data.roomNo || "",
              ratePlan: "",
              mealPlan: "",
              guestName: [""],
              contact: "",
              adult: 0,
              child: 0,
              seniors: 0,
              extra: 0,
              netRate: "",
              discType: "",
              discVal: "",
              tariff: "",
              applyTariff: "",
              planFood: "",
              bedType: data.bedType || "",
              roomFacility: [],
              status: "",
              newRentTariff: "",
              emailId: "",
              city: "",
              address: "",
              pincode: "",
              state: "",
              country: "",
              specialInstructions: "",
            },
          ];
        });
        sessionStorage.removeItem("selectedRoom");
      }
    } catch (err) {
      console.warn("sessionStorage read error", err);
    }

    // 2) fetch property (to get commonId) and owner (gst, etc.)
    let commonIdToUse: string | undefined = undefined;

    try {
      if (user?.propertyId) {
        const prop = await fetchPropertyById(user.propertyId);
        if (!mounted) return;
        setPropertyDetails(prop);
        commonIdToUse = prop?.commonId ?? commonIdToUse;
      }
    } catch (e) {
      console.warn("fetchPropertyById failed:", e);
    }

    try {
      if (user?.clientId) {
        const owner = await fetchHotelOwnerById(user.clientId);
        if (!mounted) return;
        setHotelsDetails(owner);
      }
    } catch (e) {
      console.warn("fetchHotelOwnerById failed:", e);
    }

    // 3) fallback to existing COMMON_ID from state if property fetch didn’t set it
    commonIdToUse = commonIdToUse ?? COMMON_ID;

    // 4) fetch rooms only when we have a valid commonId
    if (commonIdToUse) {
      try {
        await fetchRoomsForProperty(commonIdToUse);
      } catch (e) {
        console.warn("fetchRoomsForProperty failed:", e);
      }
    }

    // 5) other startup tasks
    loadCheckInModes().catch((e) => console.warn("loadCheckInModes failed:", e));
  };

  // run sequence
  run();

  // attach/detach outside-click listener based on popup state
  if (oldCustomersListOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  // cleanup
  return () => {
    mounted = false;
    document.removeEventListener("mousedown", handleClickOutside);
    try {
      stopCamera();
    } catch {}
  };
// deps: user ids + popup open state (COMMON_ID derived inside; prevents double fetch)
}, [user?.propertyId, user?.clientId, oldCustomersListOpen]);


 
  async function fetchFileFromUrl(url: string) {
    try {
      // try to fetch remote file as blob
      const res = await fetch(url, { mode: "cors" }); // mode:cors - might still fail due to CORS
      if (!res.ok) throw new Error(`fetch failed ${res.status}`);
      const blob = await res.blob();
      // derive a sensible filename and type
      const filename = fileNameFromUrl(url) || `file-${Date.now()}`;
      const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
      return file;
    } catch (err) {
      console.warn("Could not fetch remote file:", err);
      return null;
    }
  }

  function fileNameFromUrl(url: string) {
    try {
      const parsed = new URL(url, window.location.href);
      const parts = parsed.pathname.split("/");
      const last = parts.pop() || "";
      // if last contains query params fallback
      return last.split("?")[0] || null;
    } catch (e) {
      // fallback: try simple split
      return url.split("/").pop()?.split("?")[0] ?? null;
    }
  }


  const applyOldCustomer = async (mergedItem: any) => {
    const { guestFromApi, hotelDetailsFromApi, bookingDetailsFromApi, mappedRooms } = mapCustomerInfoToForm(mergedItem);
    const customer = mergedItem.customer || {};
    const info = mergedItem.info || {};

    // Apply guest (atomic)
    setGuest((g) => ({ ...g, ...guestFromApi }));

    // Apply hotel + booking details
    onBooking("hotelDetails", { ...booking.hotelDetails, ...hotelDetailsFromApi });
    onBooking("bookingDetails", { ...booking.bookingDetails, ...bookingDetailsFromApi });

    // Apply mapped rooms (if any) else single empty row
    // setRooms(mappedRooms && mappedRooms.length ? mappedRooms : initialRooms);

    // Show previews for customer's image and idProof (if available)
    const imageUrl = customer?.image || info?.image || customer?.photo || null;
    const idProofUrl = customer?.idProof || info?.idProof || customer?.idproof || null;

    // set previews immediately (fast UI feedback) — only set capturedDataUrl for images
    if (imageUrl && /(jpg|jpeg|png|gif|bmp|webp)$/i.test(imageUrl)) {
      setCapturedDataUrl(imageUrl);
    } else {
      setCapturedDataUrl(null);
    }

    if (idProofUrl) {
      setScannedFilePreview(idProofUrl);
      setScannedFileName(fileNameFromUrl(idProofUrl) || `idproof-${Date.now()}.pdf`);
    } else {
      setScannedFilePreview(null);
      setScannedFileName(null);
    }

    // Try to fetch remote files in parallel (may fail due to CORS)
    try {
      const [fetchedImage, fetchedId] = await Promise.all([
        imageUrl ? fetchFileFromUrl(imageUrl) : Promise.resolve(null),
        idProofUrl ? fetchFileFromUrl(idProofUrl) : Promise.resolve(null),
      ]);

      if (fetchedImage) {
        setImageFile(fetchedImage);
      } else {
        setImageFile(null);
      }

      if (fetchedId) {
        setIdProofFile(fetchedId);
        if (fetchedId.type.startsWith("image/")) {
          setScannedFilePreview(URL.createObjectURL(fetchedId));
        }
      } else {
        setIdProofFile(null);
      }
    } catch (err) {
      console.warn("applyOldCustomer: error fetching remote files", err);
    }

    setOldCustomersListOpen(false);
  };
  const fetchCustomersAndInfos = async () => {
    setOldCustomersLoading(true);
    try {
      const merged = await getMergedCustomersAndInfos();
      setOldCustomersMerged(merged);
      
      setOldCustomersListOpen(true);
    } catch (err: any) {
      console.error("Failed to load old customers:", err);
      alert("Failed to load old customers. See console for details.");
    } finally {
      setOldCustomersLoading(false);
    }
  };


  /** Convert API result → your UI form shapes.
   *  This maps primary pieces: guest, booking.hotelDetails.customerId, booking.bookingDetails (reservation etc),
   *  and rooms from info.stayDetails (if present).
   */
  const mapCustomerInfoToForm = (mergedItem: { customer: any; info: any }) => {
    const { customer, info } = mergedItem;

    // guest fields (BasicGuest)
    const guestFromApi: Partial<BasicGuest> = {
      id: customer?.id || customer?._id || "",
      clientId: customer?.clientId || "",
      propertyId: customer?.propertyId || "",
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      title: customer?.title || "",
      isVIP: Boolean(customer?.isVIP),
      isForeignCustomer: Boolean(customer?.isForeignCustomer),
      email: customer?.email || "",
      gender: customer?.gender || "",
      mobileNo: customer?.mobileNo || "",
      nationality: customer?.nationality || "",
      idType: customer?.idType || "",
      idNumber: customer?.idNumber || "",
      image: customer?.image || "",
      idProof: customer?.idProof || "",
      address: customer?.address || "",
      isActive: customer?.isActive ?? true,
    };

    // booking.hotelDetails (keep existing hotelDetails but set clientId/propertyId/customerId)
    const hotelDetailsFromApi = {
      clientId: (info?.hotelDetails?.clientId || customer?.clientId) || booking.hotelDetails.clientId || user?.clientId,
      propertyId: (info?.hotelDetails?.propertyId || customer?.propertyId) || booking.hotelDetails.propertyId || user?.propertyId,
      customerId: info?.hotelDetails?.customerId || customer?.id || booking.hotelDetails.customerId || PropertyDetails?.commonId,
      hotelName: info?.hotelDetails?.hotelName || booking.hotelDetails.hotelName || PropertyDetails?.propertyName,
      hotelAddress: info?.hotelDetails?.hotelAddress || booking.hotelDetails.hotelAddress || PropertyDetails?.propertyAddress,
      hotelMobileNo: info?.hotelDetails?.hotelMobileNo || booking.hotelDetails.hotelMobileNo || PropertyDetails?.propertyContact,
      gstin: booking.hotelDetails.gstin || "",
      hsnCode: booking.hotelDetails.hsnCode || "",
    };

    // bookingDetails: copy existing from info.bookingDetails if present
    const bookingDetailsFromApi = {
      ...booking.bookingDetails,
      ...(info?.bookingDetails ?? {}),
    };

    // stayDetails -> rooms mapping (convert stayDetails into your RoomRow[] UI shape)
    const stayDetailsApi: any[] = info?.stayDetails ?? [];
    const mappedRooms: RoomRow[] = (stayDetailsApi.length ? stayDetailsApi : []).map((sd: any, idx: number) => {
      // pick first guest entry for names/contact
      const firstGuest = Array.isArray(sd.guests) && sd.guests.length ? sd.guests[0] : undefined;
      const guestNameFromApi = firstGuest ? (Array.isArray(firstGuest.guestName) ? firstGuest.guestName[0] : String(firstGuest.guestName || "")) : `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();

      return {
        roomType: sd.roomType || "",
        roomNo: sd.roomNo || String(sd.roomNo || `R${idx + 1}`),
        ratePlan: sd.ratePlan || "",
        mealPlan: sd.mealPlan || sd.planFood || "",
        guestName: guestNameFromApi || "",
        contact: firstGuest?.phoneNo || customer?.mobileNo || "",
        adult: (sd.numberOfGuests?.adult && Number(sd.numberOfGuests.adult)) || 0,
        child: (sd.numberOfGuests?.child && Number(sd.numberOfGuests.child)) || 0,
        extra: sd.extraPax || 0,
        netRate: sd.ratePlan || "",
        discType: "",
        discVal: "",
        tariff: sd.tariff || " ",
        applyTariff: sd.applyTariff || " ",
        planFood: sd.planFood || "",
        bedType: sd.bedType || " ",
        roomFacility: sd.roomFacility || [],
        status: sd.status || " ",
        newRentTariff: sd.newRentTariff || "",
      } as RoomRow;
    });

    return {
      guestFromApi,
      hotelDetailsFromApi,
      bookingDetailsFromApi,
      mappedRooms,
    };
  };



  // safer capturePhoto (replace your current function)
  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video) {
      console.warn("capturePhoto: video element not available");
      setFileError("Camera not available.");
      return;
    }

    setIsCapturing(true);
    try {
      // small delay to allow video to render frames (important on slow devices)
      await new Promise((res) => setTimeout(res, 150));

      // if dimensions are not yet available, wait briefly up to 1s
      const waitForDims = async () => {
        const start = Date.now();
        while ((video.videoWidth === 0 || video.videoHeight === 0) && Date.now() - start < 1000) {
          // give video a bit of time
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 50));
        }
      };
      await waitForDims();

      // ensure we have fallback sizes
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context for capture.");

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
      setFileError((err as Error).message || "Failed to capture photo.");
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
  const fetchRoomsForProperty = async (COMMON_ID: any) => {
    try {
      // call shared API helper
      const data = await fetchRoomsForPropertyApi(COMMON_ID);

      // server might respond with an array or { data: [...] }, so normalize:
      const roomsArray: any[] =
        Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

      const available = roomsArray.filter((r: any) => ["available", "vacant"].includes((r.roomStatus || "").toLowerCase()));
      setAvailableRooms(available);
    } catch (err) {
      console.warn("fetchRoomsForProperty failed:", err);
      // optionally set an error state here
    }
  };
  // convert an ISO/date-like string (or Date) to a datetime-local value string
  function toDatetimeLocalInputValue(d?: string | Date | null): string {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    // include seconds only if you want; minutes is enough for most UIs:
    // const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  // compute selected room numbers (strings) once per render
  const selectedRoomNumbers = new Set(
    rooms.map((rr) => (rr.roomNo ?? "").toString()).filter(Boolean)
  );

  /** Checkin modes **/
const loadCheckInModes = async () => {
  try {
    const res = await fetchCheckInMode();

    // Normalize the response into an array
    const data = Array.isArray(res) ? res : (res as any)?.data || [];

    //   Filter by logged-in user's clientId + propertyId
    const filtered = (data || []).filter(
      (d: any) =>
        d.clientId === user?.clientId && d.propertyId === user?.propertyId
    );

    //  Store only the checkInMode strings
    setCheckInModeList(filtered.map((d: any) => String(d.checkInMode || "")));
  } catch (e) {
    console.warn(e);
  }
};


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
  

  /** Main submit: create customer -> then customer-info with returned id **/
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && typeof (e as any).preventDefault === "function") (e as any).preventDefault();

    setMessage(null);
    setFileError(null);

    try {

      // 1. create customer (multipart)
      const customerId = await createCustomer();

      // 2. create customer-info using returned id
      // after createCustomerInfo(customerId) (inside try)
      await createCustomerInfo(customerId);
      // Success — navigate to dashboard
      // use router.replace if you don't want back-button to return to the form.
      router.push("/dashboard");
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

    }
  };
  /** Create customer (multipart/form-data) **/
  const createCustomer = async (): Promise<string> => {
    const v = validateFilesLocal(imageFile, idProofFile);
    if (!v.ok) throw new Error(v.message);

    const fd = new FormData();
    const clientId = booking.hotelDetails.clientId || user?.clientId;
    const propertyId = booking.hotelDetails.propertyId || user?.propertyId;

    fd.append("clientId", clientId || "");
    fd.append("propertyId", propertyId || "");
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

    if (imageFile) fd.append("image", imageFile);
    else fd.append("image", makePlaceholderImageFile("no-photo.png"));

    if (idProofFile) fd.append("idproof", idProofFile); v
    try {
      const data = await createCustomerApi(fd);
      const newId = data.id || data._id || data.data?.id || data.data?.customerId || data.customerId;
      if (!newId) throw new Error("Customer created but server did not return an id.");
      setNewCustomerId(newId);
      return newId;
    } catch (err: any) {
      const msg = (err);
      throw new Error(`Customer create failed: ${msg}`);
    }
  };

  /** Create customer-info (JSON) **/
  const createCustomerInfo = async (customerId: string) => {
    const toDateOrUndefined = (v?: string) => (v ? new Date(v) : undefined);

    const stayDetails = rooms.map((r, idx) => {
      const adult = Number(r.adult || 0);
      const child = Number(r.child || 0);
      const seniors = Number(r.seniors || 0);
      const extra = Number(r.extra || 0);

      const guestsArr = [
        {
          guestName: Array.isArray(r.guestName)
            ? r.guestName.filter(Boolean)
            : [(r.guestName && String(r.guestName).trim()) || `${guest.firstName || ""} ${guest.lastName || ""}`.trim()].filter(Boolean),
          phoneNo: r.contact || guest.mobileNo || "",
          emailId: r.emailId || guest.email || "",
          city: r.city || booking.addressInfo?.city || "",
          address: r.address || guest.address || "",
          pincode: r.pincode || booking.addressInfo?.pinCode || "",
          state: r.state || booking.addressInfo?.state || "",
          country: r.country || booking.addressInfo?.country || "",
          payPerRoom: "",
          specialInstructions: r.specialInstructions || booking.guestInfo?.specialRequests || "",
        },
      ];

      return {
        roomNo: String(r.roomNo || `R${idx + 1}`),
        bedType: (r as any).bedType || "",
        roomType: r.roomType || "",
        roomFacility: (r as any).roomFacility || [],
        planFood: r.planFood || "",
        mealPlan: r.mealPlan || "",
        ratePlan: r.ratePlan || "",
        tariff: r.tariff || "",
        newRentTariff: (r as any).newRentTariff || "",
        applyTariff: r.applyTariff || "",
        numberOfGuests: { adult, child, seniors },
        noOfPax: adult + child + seniors + extra,
        childPax: child,
        extraPax: child + seniors,
        isActive: true,
        status: (r as any).status || "",
        guests: guestsArr,
      } as unknown as StayDetails;
    });

    const noOfPax = rooms.reduce((s, r) => s + (Number(r.adult || 0) + Number(r.child || 0) + Number(r.extra || 0)), 0);

    const payload = {
      hotelDetails: {
        clientId: booking.hotelDetails.clientId || user?.clientId,
        propertyId: booking.hotelDetails.propertyId || user?.propertyId,
        customerId: customerId || PropertyDetails?.commonId,
        hotelName: booking.hotelDetails.hotelName || PropertyDetails?.propertyName,
        hotelAddress: booking.hotelDetails.hotelAddress || PropertyDetails?.propertyAddress,
        hotelMobileNo: booking.hotelDetails.hotelMobileNo || PropertyDetails?.propertyContact,
        gstin: booking.hotelDetails.gstin || "",
        hsnCode: booking.hotelDetails.hsnCode || "",
      },
      bookingDetails: {
        isReservation: Boolean(booking.bookingDetails.isReservation),
        bookingId: booking.bookingDetails.bookingId || "",
        noOfDays: String(booking.bookingDetails.noOfDays || ""),
        noOfRooms: String(rooms.length || booking.bookingDetails.noOfRooms || ""),
        graceTime: booking.bookingDetails.graceTime || "",
        checkInType: booking.bookingDetails.checkInType || "",
        checkInMode: booking.bookingDetails.checkInMode || "",
        checkInUser: booking.bookingDetails.checkInUser || "",
        roomStatus: booking.bookingDetails.roomStatus || "",
        arrivalMode: booking.bookingDetails.arrivalMode || "",
        otaName: booking.bookingDetails.otaName || "",
        bookingInstruction: booking.bookingDetails.bookingInstruction || "",
        enableRoomSharing: Boolean(booking.bookingDetails.enableRoomSharing),
        bookingThrough: booking.bookingDetails.bookingThrough || "",
        preferredRooms: booking.bookingDetails.preferredRooms || "",
        reservedBy: booking.bookingDetails.reservedBy || "",
        reservedStatus: booking.bookingDetails.reservedStatus || "",
        reservationNo: booking.bookingDetails.reservationNo || "",
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
          seniors: totalSeniors || 0,
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
        allowCredit: booking.paymentDetails?.allowCredit || "",
        paidAmount: Number(booking.paymentDetails?.paidAmount || 0),
        balanceAmount: Number(booking.paymentDetails?.balanceAmount || 0),
        discType: booking.paymentDetails?.discType || "",
        discValue: booking.paymentDetails?.discValue || "",
        netRate: booking.paymentDetails?.netRate || "",
        allowChargesPosting: booking.paymentDetails?.allowChargesPosting || "",
        enablePaxwise: Boolean(booking.paymentDetails?.enablePaxwise),
        paxwiseBillAmount: booking.paymentDetails?.paxwiseBillAmount || "",
      },
      addressInfo: {
        city: booking.addressInfo?.city || "",
        pinCode: booking.addressInfo?.pinCode || "",
        state: booking.addressInfo?.state || "",
        country: booking.addressInfo?.country || "",
      },
      gstInfo: {
        gstNumber: booking.gstInfo?.gstNumber || "",
        gstType: booking.gstInfo?.gstType || "",
      },
      personalInfo: {
        dob: booking.personalInfo?.dob || "",
        age: booking.personalInfo?.age || "",
        companyAnniversary: booking.personalInfo?.companyAnniversary || "",
      },
      businessInfo: {
        segmentName: booking.businessInfo?.segmentName || "",
        bussinessSource: booking.businessInfo?.bussinessSource || "",
        customerComapny: booking.businessInfo?.customerComapny || "",
        purposeOfVisit: booking.businessInfo?.purposeOfVisit || "",
        visitRemark: booking.businessInfo?.visitRemark || "",
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

    try {
      const result = await createCustomerInfoApi(payload);
      return result;
    } catch (err: any) {
      const msg = (err);
      throw new Error(`Customer-info create failed: ${msg}`);
    }
  };


  // put near other helpers in the component
  function clearGuest() {
    // revoke any blob object URLs we created (only revoke blob: URLs)
    try {
      if (capturedDataUrl && capturedDataUrl.startsWith("blob:")) URL.revokeObjectURL(capturedDataUrl);
      if (scannedFilePreview && scannedFilePreview.startsWith("blob:")) URL.revokeObjectURL(scannedFilePreview);
    } catch (e) {
      console.warn("Failed to revoke object URLs", e);
    }
    // reset form pieces
    setGuest(initialGuest);
    setRooms(initialRooms);
    onBooking("bookingDetails", initialBooking.bookingDetails);
    onBooking("hotelDetails", initialBooking.hotelDetails);

    // clear file state + refs + previews
    setImageFile(null);
    setIdProofFile(null);
    imageFileRef.current = null;
    setCapturedDataUrl(null);
    setScannedFilePreview(null);
    setScannedFileName(null);
    setNewCustomerId(null);

    // clear hidden file inputs (so browser won't keep selected file)
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (idProofInputRef.current) idProofInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  }


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

  // safer startCamera (replace your current function)
  const startCamera = async (useFacing?: "environment" | "user") => {
    try {

      await ensureGetUserMedia();
      const mode = useFacing || facingMode;
      const constraints: MediaStreamConstraints = {
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const video = videoRef.current;
      if (!video) {
        // Video element not mounted — stop stream to avoid leak and exit
        stream.getTracks().forEach((t) => t.stop());


        setIsCameraOn(false);
        return;
      }

      // attach stream
      video.srcObject = stream;

      // wait until metadata loaded (but with timeout fallback)
      await new Promise<void>((res, rej) => {
        let settled = false;
        const onLoaded = () => {
          if (settled) return;
          settled = true;
          video.removeEventListener("loadedmetadata", onLoaded);
          res();
        };
        video.addEventListener("loadedmetadata", onLoaded);

        // fallback timeout (in case loadedmetadata never fires)
        const to = window.setTimeout(() => {
          if (settled) return;
          settled = true;
          video.removeEventListener("loadedmetadata", onLoaded);
          // still resolve — we will try to play, but dims may be default
          res();
        }, 2000);

        // clean timeout when resolved
        res = ((origRes) => () => {
          clearTimeout(to);
          origRes();
        })(res) as any;
      });

      // attempt to play
      try {
        await video.play();
      } catch (playErr) {
        // some browsers require user gesture to play; that's OK — we still consider camera active
        console.warn("video.play() failed:", playErr);
      }

      setIsCameraOn(true);
      setCapturedDataUrl(null);
      setFacingMode(mode);
    } catch (err: any) {
      console.error(err);

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

  const handleReservationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    const newBookingDetails = {
      ...booking.bookingDetails,
      isReservation: checked,
      reservationNo: checked ? booking.bookingDetails.reservationNo : "", // clear when unchecked
    };

    onBooking("bookingDetails", newBookingDetails);
  };

  /** Small UI helpers (kept minimal) **/
  function RoundIconButton({
    title,
    onClick,
    children,
    size = "sm",
    className = "",
  }: {
    title?: string;
    onClick?: () => void;
    children: React.ReactNode;
    size?: "xs" | "sm" | "md";
    className?: string;
  }) {
    const sizes: Record<string, string> = {
      xs: "h-6 w-6 text-xs",
      sm: "h-7 w-7 text-sm",
      md: "h-10 w-10 text-base",
    };
    const sizeCls = sizes[size] ?? sizes.sm;

    return (
      <button
        type="button"
        title={title}
        aria-label={title}
        onClick={onClick}
        className={`rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-sm hover:scale-105 transition-transform ${sizeCls} ${className}`}
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
          <button onClick={handleSubmit} className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-50">
            Create Check-in
          </button>
        </div>
      </div>

      {/* QUICK CHECK-IN (green) */}

      <div className="rounded-lg border  bg-green-50 border-green-200">

        <div className="rounded-lg   bg-green-50 ">
          <div className="flex items-center bg-green-100 justify-between pb-2">

            <div className="px-3 py-2 rounded-t-lg  text-sm font-semibold text-green-900">Quick Check-In</div>
            <button
              type="button"
              onClick={() => setshowCheckin(!showCheckin)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-shadow
                 bg-white border border-slate-200 hover:shadow-sm focus:outline-none"
              aria-expanded={showCheckin}
            >
              <ChevronDownIcon
                className={`h-4 w-4 transform transition-transform duration-200 ${showCheckin ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>
          {showCheckin && (
            <div className="grid grid-cols-5   p-2">
              {/* Left block inputs (each input rendered using your requested div/label/input pattern) */}
              <div className="col-span-9 grid grid-cols-15 gap-3">
                {/* Is Reservation */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Is Reservation</label>
                  <div className="w-full p-2   rounded flex items-center">
                    <input
                      type="checkbox"
                      checked={!!booking.bookingDetails.isReservation}
                      onChange={handleReservationToggle}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {booking.bookingDetails.isReservation ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Reservation Number</label>
                  <input
                    type="text"
                    name="reservationNo"
                    value={booking.bookingDetails.reservationNo || ""}
                    onChange={(e) =>
                      onBooking("bookingDetails", {
                        ...booking.bookingDetails,
                        reservationNo: e.target.value,
                      })
                    }
                    className={`w-full p-2 border border-gray-300 rounded
                         ${booking.bookingDetails.isReservation
                        ? "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                        : "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all cursor-not-allowed"
                      }`}
                    placeholder="Is Reservation Yes"
                    disabled={!booking.bookingDetails.isReservation}
                  />
                </div>

                {/* Arrival Mode */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Arrival Mode</label>
                  <select
                    value={booking.bookingDetails.arrivalMode}
                    onChange={(e) => updateBookingDetails("arrivalMode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  >
                    <option value="">Select Arrival Mode</option>
                    <option value="WALKIN">Walk-In/Direct</option>
                    <option value="OTA">OTA</option>
                    <option value="TRAVEL_DESK">Travel Desk</option>
                    <option value="BE">BE</option>
                    <option value="COMPANY">Company</option>
                  </select>
                </div>


                {/* OTA */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">OTA</label>
                  <input
                    type="text"
                    name="otaName"
                    value={booking.bookingDetails.otaName}
                    onChange={(e) => updateBookingDetails("otaName", e.target.value)}
                    className={`w-full p-2 border border-gray-300 rounded 
                         ${booking.bookingDetails.arrivalMode === "OTA"
                        ? "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                        : "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all cursor-not-allowed"
                      }`}
                    disabled={booking.bookingDetails.arrivalMode !== "OTA"}
                    placeholder="OTA Selet Type "
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Contact No.<span className="text-red-500">*</span></label>
                  <input type="text" name="bookingId" value={guest.mobileNo} onChange={(e) => onGuest("mobileNo", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Enter Mobile Number" />
                </div>
                {/* Booking ID */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Booking ID</label>
                  <input type="text" name="bookingId" value={booking.bookingDetails.bookingId} onChange={(e) => updateBookingDetails("bookingId", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Booking Number" />
                </div>
                {/* Right side actions (camera + scan files) — unchanged visuals */}
                {/* camera + idproof row: responsive + tiny-screen friendly */}

                <div className="col-span-3 col-start-13 row-start-1 row-end-3">
                  <div className="grid grid-cols-2 gap-3 items-start">
                    {/* ----- LEFT: Camera preview ----- */}
                    <div className="sm:col-span-1 flex flex-col items-center gap-2">
                      <div className="text-sm mb-3 font-medium text-slate-600 self-start">
                        Take Photo <span className="text-rose-600">*</span>
                      </div>

                      {/* preview container (grouped so icons can appear above) */}
                      <div className="relative group">
                        {/* lift icons visually above the preview by translating up */}
                        <div className="absolute -top-5 right-0 z-40 flex w-full justify-between px-2">
                          {/* small camera icon (switch) */}
                          <RoundIconButton
                            title="Switch camera"
                            onClick={switchCamera}
                            size="xs"
                            className="shadow-md"
                          >
                            <Video className="h-4 w-4 text-gray-600" />
                          </RoundIconButton>

                          {/* upload image icon */}
                          <RoundIconButton
                            title="Upload photo"
                            onClick={() => imageInputRef.current?.click()}
                            size="xs"
                            className="shadow-md"
                          >
                            <Upload className="h-4 w-4 text-gray-600" />
                          </RoundIconButton>
                        </div>


                        <div className="relative h-15 w-full max-w-[100px] sm:h-20 sm:max-w-[80px] rounded-md border border-slate-300 bg-slate-100 overflow-hidden flex items-center justify-center">
                          {capturedDataUrl ? (
                            <img src={capturedDataUrl} alt="Captured" className="h-full w-full object-cover" />
                          ) : (
                            <>
                              <video ref={videoRef} playsInline muted autoPlay className="h-full w-full object-cover" />
                              {!isCameraOn && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-[11px] px-1 text-center">
                                  <User className="h-12 w-12 text-slate-400" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* camera small controls (below preview) */}
                      <div className="flex gap-2 mt-1">
                        {!isCameraOn ? (
                          <button
                            type="button"
                            onClick={() => startCamera()}
                            className="rounded bg-sky-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-sky-700"
                          >
                            Start
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="rounded bg-slate-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-slate-700"
                          >
                            Stop
                          </button>
                        )}

                        {isCameraOn && !capturedDataUrl && (
                          <button
                            type="button"
                            onClick={capturePhoto}
                            className="rounded bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {isCapturing ? "Taking..." : "Take"}
                          </button>
                        )}

                        {capturedDataUrl && (
                          <button
                            type="button"
                            onClick={retake}
                            className="rounded bg-amber-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-amber-700"
                          >
                            Retake
                          </button>
                        )}
                      </div>


                      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e as any, "image")} />


                      {/* ----- MIDDLE (optional helper column) ----- */}
                      <div className="sm:col-span-1 flex flex-col items-center justify-center gap-2">
                        {/* small label or keep empty — icons live above previews now */}
                        {/* on xs show compact duplicates (useful if top icons are off-screen) */}
                        <div className="flex sm:hidden gap-2">
                          <button
                            type="button"
                            onClick={switchCamera}
                            aria-label="Switch camera"
                            className="h-7 w-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm"
                          >
                            <Video className="h-4 w-4 text-gray-600" />
                          </button>

                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            aria-label="Upload photo"
                            className="h-7 w-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm"
                          >
                            <Upload className="h-4 w-4 text-gray-600" />
                          </button>

                          <button
                            type="button"
                            onClick={onUploadClick}
                            aria-label="Upload document"
                            className="h-7 w-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm"
                          >
                            <FileText className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ----- RIGHT: scanned-file preview ----- */}
                    <div className="sm:col-span-1 flex flex-col items-center gap-2">
                      <div className="w-full mb-3 text-sm font-medium text-slate-600 self-start">
                        Scan Files <span className="text-rose-600">*</span>
                        <PrinterIcon className="h-4 w-4  inline text-gray-600" />
                        <HiOutlineDocumentArrowUp className="h-5 w-5 inline text-gray-600" />
                      </div>

                      <div className="relative group">
                        {/* single small icon above preview */}
                        <div className="absolute -top-5 right-0 z-40 pointer-coarse">
                          <RoundIconButton title="Upload document" onClick={onUploadClick} size="xs" className="shadow-md">
                            <Upload className="h-4 w-4 text-gray-600" />
                          </RoundIconButton>
                        </div>

                        <div className="flex items-center justify-center h-15 w-full max-w-[160px] sm:h-20 sm:max-w-[200px] rounded-md border border-dashed border-slate-300 bg-slate-50 overflow-hidden">
                          {scannedFilePreview ? (
                            <img src={scannedFilePreview} alt="Scanned preview" className="h-full w-full object-contain bg-white p-2" />
                          ) : (
                            <div className="text-center text-xs text-slate-400 flex flex-col items-center px-2">
                              <FileText className="h-8 w-8 mb-1 text-slate-400" />
                              {scannedFileName ? <div className="text-xs text-slate-600 truncate w-28">{scannedFileName}</div> : <div>Document</div>}
                            </div>
                          )}
                        </div>
                      </div>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={onFileChange} />
                    </div>
                  </div>

                  {/* file error (full width below the columns) */}
                  {fileError && <div className="mt-2 text-xs text-rose-600">{fileError}</div>}
                </div>
                {/* Title */}
                <div className="col-span-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={guest.title}
                    onChange={(e) => onGuest("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Dr">Dr</option>
                    <option value="Ms">Ms</option>
                    <option value="Captain">Captain</option>
                    <option value="Miss">Miss</option>
                    <option value="Master">Master</option>
                    <option value="Others">Others</option>
                  </select>
                </div>


                {/* First Name */}
                {/* First Name with old-customer + clear icons */}
                <div className="col-span-3 relative" ref={/* optional ref if you want click-outside behavior */ null}>
                  <label className="text-sm font-semibold text-gray-700">First Name <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="firstName"
                      value={guest.firstName}
                      onChange={(e) => onGuest("firstName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                      required placeholder="Enter First Name "
                    />

                    {/* Old-customer icon (fetch + open list) */}
                    <button
                      type="button"
                      title="Choose old customer"
                      onClick={async () => {
                        // load then toggle open
                        if (oldCustomersMerged.length === 0) await fetchCustomersAndInfos();
                        else setOldCustomersListOpen((s) => !s);
                      }}
                      className="h-4 w-4 rounded-full bg-white ring-2 ring-sky-300/70 shadow-sm flex items-center justify-center text-sky-700 hover:scale-105 transition-transform"
                    >
                      {/* search svg */}
                      <Book className="h-4 w-4 text-gray-600" />
                    </button>

                    {/* Clear / New customer icon */}
                    <button
                      type="button"
                      title="Clear guest"
                      onClick={clearGuest}
                      className="h-4 w-4 rounded-full bg-white ring-2 ring-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:scale-105 transition-transform"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>

                  </div>

                  {/* Dropdown list (simple) */}
                  {oldCustomersListOpen && (
                    <div
                      ref={popupRef}
                      className="absolute z-50 mt-2 w-full max-h-64 overflow-auto bg-white border border-gray-200 rounded shadow p-2"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <strong>Previous customers</strong>
                        {oldCustomersLoading ? <span className="text-xs text-slate-500">Loading…</span> : null}
                      </div>

                      {oldCustomersMerged.length === 0 && !oldCustomersLoading && (
                        <div className="text-xs text-slate-500">No customers found.</div>
                      )}
                      <ul>
                        {Array.from(
                          new Map(
                            oldCustomersMerged.map((m: any) => [
                              // use mobileNo as key, fallback to email
                              m.customer?.mobileNo || m.customer?.email || m.customer?.id,
                              m,
                            ])
                          ).values()
                        ).map((m: any, i: number) => {
                          const c = m.customer;

                          return (
                            <li
                              key={c?.id ?? c?._id ?? i}
                              className="p-2 rounded hover:bg-slate-100 flex flex-col gap-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">
                                    {c?.firstName} {c?.lastName}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {c?.mobileNo ?? c?.email}
                                  </div>
                                </div>
                                <button
                                  title="select"
                                  type="button"
                                  onClick={() => applyOldCustomer(m)}
                                  className="text-xs rounded bg-sky-600 text-white px-2 py-1 hover:bg-sky-700"
                                >
                                  Select
                                </button>
                              </div>
                            </li>

                          );
                        })}
                      </ul>

                    </div>
                  )}

                </div>

                {/* Last Name */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">lastName <span className="text-red-500">*</span></label>
                  <input type="text" name="lastName" value={guest.lastName} onChange={(e) => onGuest("lastName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Enter Last Name " required />
                </div>

                {/* Gender */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={guest.gender}
                    onChange={(e) => onGuest("gender", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>



                {/* ID No */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">ID No.(Aadhaar)<span className="text-red-500">*</span></label>
                  <input type="text" name="idNumber" value={guest.idNumber} onChange={(e) => onGuest("idNumber", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Aadhaar or Other " />
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Email<span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={guest.email} onChange={(e) => onGuest("email", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Enter Email" />
                </div>

                {/* Check-In Mode */}
                <div className="col-span-3">
                  <label className="text-sm font-semibold text-gray-700">Check-In Mode</label>
                  <select value={booking.bookingDetails.checkInMode || ""} onChange={(e) => updateBookingDetails("checkInMode", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all">
                    <option value="">Select Mode</option>
                    {checkInModeList.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Instructions</label>
                  <input type="text" value={booking.bookingDetails.bookingInstruction} onChange={(e) => updateBookingDetails("bookingInstruction", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Booking Instructions" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Reserved By</label>
                  <input type="text" value={booking.bookingDetails.reservedBy} onChange={(e) => updateBookingDetails("reservedBy", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Booking Reserved By" />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Booking Through</label>
                  <input type="text" value={booking.bookingDetails.bookingThrough} onChange={(e) => updateBookingDetails("bookingThrough", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Booking Through" />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Preferred Rooms</label>
                  <input type="text" value={booking.bookingDetails.preferredRooms} onChange={(e) => updateBookingDetails("preferredRooms", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Preferred Rooms" />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Reserved Status</label>
                  <input type="text" value={booking.bookingDetails.reservedStatus} onChange={(e) => updateBookingDetails("reservedStatus", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Reserved status" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">  Room Status</label>
                  <input type="text" value={booking.bookingDetails.roomStatus} onChange={(e) => updateBookingDetails("roomStatus", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Room Status " />
                </div>

                {/* Foreign Guest (checkbox + nationality input) */}
                <div className="col-span-3">
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Foreign Guest
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* checkbox + Yes/No */}
                    <label className="flex items-center gap-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={!!guest.isForeignCustomer}
                        onChange={(e) => {
                          const isForeign = e.target.checked;
                          onGuest("isForeignCustomer", isForeign);
                          onGuest("nationality", isForeign ? "" : "Indian");
                        }}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">
                        {guest.isForeignCustomer ? "Yes" : "No"}
                      </span>
                    </label>

                    {/* nationality input */}
                    <input
                      type="text"
                      value={guest.nationality || ""}
                      onChange={(e) => onGuest("nationality", e.target.value)}
                      placeholder="Nationality (e.g. India, USA)"
                      className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>


                {/* VIP*/}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Is VIP <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={guest.isVIP ? "Yes" : "No"}
                    onChange={(e) => onGuest("isVIP", e.target.value === "Yes")}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none transition-all shadow-sm"
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Id Type</label>
                  <select value={guest.idType} onChange={(e) => onGuest("idType", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all">
                    <option value="">Select ID Type</option>
                    <option>Aadhar Card</option>
                    <option>Pan Card</option>
                    <option>Election Card</option>
                    <option>Licence Card</option>
                  </select>
                </div>

                {/* business Info */}
                {/* Segment Name */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Segment Name</label>
                  <select
                    value={booking.businessInfo.segmentName}
                    onChange={(e) => updateBusiness("segmentName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  >
                    <option value="">Select Segment</option>
                    <option value="CORPORATE">CORPORATE</option>
                    <option value="RETAIL">RETAIL</option>
                    <option value="OTA">OTA</option>
                  </select>
                </div>
                {/* Business Source */}

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Business Source</label>
                  <input type="text" value={booking.businessInfo.bussinessSource} onChange={(e) => updateBusiness("bussinessSource", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Source Name" />
                </div>
                {/* Guest Company */}

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Guest Company</label>
                  <input value={booking.businessInfo.customerComapny} onChange={(e) => updateBusiness("customerComapny", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Company Name" />
                </div>
                {/* Visiting Purpose*/}

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Purpose of Visit</label>
                  <select
                    value={booking.businessInfo.purposeOfVisit}
                    onChange={(e) => updateBusiness("purposeOfVisit", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  >
                    <option value="">Select Visiting Purpose</option>
                    <option value="Business">Business</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>


                {/*visitRemark */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Visit Remark</label>
                  <input value={booking.businessInfo.visitRemark} onChange={(e) => updateBusiness("visitRemark", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Here place" />
                </div>
                {/* Special Requests */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Special Requests</label>
                  <input
                    value={booking.guestInfo?.specialRequests || ""}
                    onChange={(e) => updateGuestInfo("specialRequests", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Any special requests"
                  />
                </div>

                {/* Complimentary */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Complimentary</label>
                  <input
                    value={booking.guestInfo?.complimentary || ""}
                    onChange={(e) => updateGuestInfo("complimentary", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Complimentary items / notes"
                  />
                </div>

                {/* Vehicle Details */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Vehicle Details</label>
                  <input
                    value={booking.guestInfo?.vechileDetails || ""}
                    onChange={(e) => updateGuestInfo("vechileDetails", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Vehicle no"
                  />
                </div>

              </div>
              <div className="col-span-12 mt-2">
                {/* Rooms table (corrected) */}
                <div className="overflow-auto rounded-md border border-slate-200">
                  <table className="min-w-[2500px] w-full text-sm">
                    <thead className="bg-slate-100 text-left  text-sm font-semibold text-gray-700">
                      <tr>
                        {[
                          "Room No",
                          "Room Type",
                          "Bed Type",
                          "Room Facility",
                          "Rate Plan",
                          "Meal Plan",
                          "Plan Food",
                          "Tariff",
                          "New Rent Tariff",
                          "Apply Tariff",
                          "Adult",
                          "Child",
                          "Seniors",
                          "No Of Pax",
                          "Guest Names",
                          "Contact",
                          "Email",
                          "City",
                          "Address",
                          "Pincode",
                          "State",
                          "Country",
                          "Special Instructions",
                          "Status",
                          "Action",
                        ].map((h) => (
                          <th key={h} className="whitespace-nowrap px-1 py-2 font-semibold text-slate-700">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {rooms.map((r, idx) => (
                        <tr key={r.id ?? idx} className="odd:bg-white even:bg-slate-50">
                          {/* Room No */}
                          <td className="px-1 py-1">
                            <select
                              value={r.roomNo || ""}
                              onChange={(e) => {
                                const roomNumber = e.target.value;
                                updateRoom(idx, "roomNo", roomNumber);

                                const roomObj = availableRooms.find(
                                  (room: any) => String(room.roomNumber) === String(roomNumber)
                                );
                                if (roomObj) {
                                  updateRoom(idx, "roomType", roomObj.roomType);
                                  updateRoom(idx, "bedType", roomObj.bedType);
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                            >
                              <option value="">Select Room No</option>

                              {availableRooms
                                .filter((room: any) => (r.roomType ? room.roomType === r.roomType : true))
                                .map((room: any) => {
                                  const roomNumStr = String(room.roomNumber);
                                  const takenByOther = selectedRoomNumbers.has(roomNumStr) && String(r.roomNo) !== roomNumStr;
                                  return (
                                    <option key={room.roomNumber} value={room.roomNumber} disabled={takenByOther}>
                                      {room.roomNumber}
                                      {takenByOther ? " — selected" : ""}
                                    </option>
                                  );
                                })}
                            </select>
                          </td>

                          {/* Room Type */}
                          <td className="px-2 py-1">
                            <select
                              value={r.roomType || ""}
                              onChange={(e) => {
                                const newType = e.target.value;
                                updateRoom(idx, "roomType", newType);

                                if (r.roomNo) {
                                  const stillValid = availableRooms.some(
                                    (room: any) => String(room.roomNumber) === String(r.roomNo) && room.roomType === newType
                                  );
                                  if (!stillValid) updateRoom(idx, "roomNo", "");
                                }

                                const bedForType = availableRooms.find((room: any) => room.roomType === newType)?.bedType;
                                if (bedForType) updateRoom(idx, "bedType", bedForType);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                            >
                              <option value="">Select Room Type</option>
                              {Array.from(new Set(availableRooms.map((a: any) => a.roomType))).map((t: any) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Bed Type */}
                          <td className="px-2 py-1">
                            {(() => {
                              const bedOptions = Array.from(
                                new Set(
                                  availableRooms
                                    .filter((room: any) => (r.roomType ? room.roomType === r.roomType : true))
                                    .map((room: any) => room.bedType || "")
                                    .filter(Boolean)
                                )
                              );

                              return (
                                <select
                                  value={r.bedType || ""}
                                  onChange={(e) => updateRoom(idx, "bedType", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                                >
                                  <option value="">Select Bed Type</option>
                                  {bedOptions.map((b: any) => (
                                    <option key={b} value={b}>
                                      {b}
                                    </option>
                                  ))}
                                </select>
                              );
                            })()}
                          </td>


                          {/* Room Facility */}
                          <td className="px-2 py-1">
                            <input
                              value={(r.roomFacility || []).join(", ")}
                              onChange={(e) =>
                                updateRoom(idx, "roomFacility", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Comma separated"
                            />
                          </td>

                          {/* Rate Plan */}
                          <td className="px-2 py-1">
                            <input value={r.ratePlan} onChange={(e) => updateRoom(idx, "ratePlan", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Rate Plan" />
                          </td>

                          {/* Meal Plan */}
                          <td className="px-2 py-1">
                            <select value={r.mealPlan || ""} onChange={(e) => updateRoom(idx, "mealPlan", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all">
                              <option value="">Select Meal Plan</option>
                              <option value="EP">EP</option>
                              <option value="CP">CP</option>
                              <option value="MAP">MAP</option>
                              <option value="AP">AP</option>
                            </select>
                          </td>

                          {/* Plan Food */}
                          <td className="px-2 py-1">
                            <input value={r.planFood} onChange={(e) => updateRoom(idx, "planFood", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Plan Food" />
                          </td>

                          {/* Tariff */}
                          <td className="px-2 py-1">
                            <select value={r.tariff || ""} onChange={(e) => updateRoom(idx, "tariff", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all">
                              <option value="">Select Tariff</option>
                              <option value="Inclusive">Inclusive</option>
                              <option value="Exclusive">Exclusive</option>
                            </select>
                          </td>

                          {/* New Rent Tariff */}
                          <td className="px-2 py-1">
                            <input value={r.newRentTariff || ""} onChange={(e) => updateRoom(idx, "newRentTariff", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="New Rent Tariff " />
                          </td>

                          {/* Apply Tariff */}
                          <td className="px-2 py-1">
                            <select value={r.applyTariff || ""} onChange={(e) => updateRoom(idx, "applyTariff", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all">
                              <option value="">Select Apply Tariff</option>
                              <option value="Rent">Rent</option>
                              <option value="Complimentary">Complimentary</option>
                            </select>
                          </td>

                          {/* Adult */}
                          <td className="px-2 py-1">
                            <input type="number" value={r.adult} onChange={(e) => updateRoom(idx, "adult", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              min={0}
                              onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(/^0+(?=\d)/, '');
                              }} />
                          </td>

                          {/* Child */}
                          <td className="px-2 py-1">
                            <input type="number" value={r.child} onChange={(e) => updateRoom(idx, "child", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              min={0}
                              onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(/^0+(?=\d)/, '');
                              }} />
                          </td>

                          {/* Seniors */}
                          <td className="px-2 py-1">
                            <input type="number" value={r.seniors || 0} onChange={(e) => updateRoom(idx, "seniors", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              min={0}
                              onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(/^0+(?=\d)/, '');
                              }} />
                          </td>

                          {/* No Of Pax */}
                          <td className="px-2 py-1">
                            {Number(r.adult || 0) + Number(r.child || 0) + Number(r.seniors || 0) + Number(r.extra || 0)}
                          </td>

                          {/* Guest Names */}
                          <td className="px-2 py-1">
                            <input
                              value={Array.isArray(r.guestName) ? r.guestName.join(", ") : (r.guestName || "")}
                              onChange={(e) =>
                                updateRoom(idx, "guestName", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Comma separated"
                            />
                          </td>

                          {/* Contact */}
                          <td className="px-2 py-1">
                            <input value={r.contact} onChange={(e) => updateRoom(idx, "contact", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Mobile Number" />
                          </td>

                          {/* Email */}
                          <td className="px-2 py-1">
                            <input value={r.emailId || ""} onChange={(e) => updateRoom(idx, "emailId", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Email Address " />
                          </td>

                          {/* City */}
                          <td className="px-2 py-1">
                            <input value={r.city || ""} onChange={(e) => updateRoom(idx, "city", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="City Name" />
                          </td>

                          {/* Address */}
                          <td className="px-2 py-1">
                            <input value={r.address || ""} onChange={(e) => updateRoom(idx, "address", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Address " />
                          </td>

                          {/* Pincode */}
                          <td className="px-2 py-1">
                            <input value={r.pincode || ""} onChange={(e) => updateRoom(idx, "pincode", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Enter The Pincode" />
                          </td>

                          {/* State */}
                          <td className="px-2 py-1">
                            <input value={r.state || ""} onChange={(e) => updateRoom(idx, "state", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Enter The State Name" />
                          </td>

                          {/* Country */}
                          <td className="px-2 py-1">
                            <input value={r.country || ""} onChange={(e) => updateRoom(idx, "country", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Enter The Country Name" />
                          </td>

                          {/* Special Instructions */}
                          <td className="px-2 py-1">
                            <input value={r.specialInstructions || ""} onChange={(e) => updateRoom(idx, "specialInstructions", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                              placeholder="Enter The Special Instructions " />
                          </td>

                          {/* Status */}
                          <td className="px-2 py-1">
                            <select value={r.status || ""} onChange={(e) => updateRoom(idx, "status", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                            >
                              <option value="">Select Status</option>
                              <option value="CheckedIn">CheckedIn</option>
                              <option value="Reserved">Reserved</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Remove */}
                          <td className="px-2 py-1">
                            <button onClick={() => removeRoom(idx)} className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700">
                              <DeleteIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>


                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <button onClick={addRoom} className="rounded-md border border-green-700 bg-green-300 text-green-800 px-2 py-1 text-xs font-medium hover:bg-green-400">
                    <IoAdd className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="flex gap-4">
                    <span>
                      Total Adults: <b>{totalAdults}</b>
                    </span>
                    <span>
                      Total Children: <b>{totalChildren}</b>
                    </span>
                    <span>
                      Total : <b>{totalAdults + totalChildren + totalSeniors}</b>
                    </span>
                  </div>
                </div>
              </div>

            </div>)}
        </div>

      </div>

      <div className="col-span-12 rounded-lg border border-slate-200 p-1 bg-white shadow-sm">

        <div className="rounded-lg border bg-white border-slate-200">
          <div className="flex items-center bg-blue-200 justify-between pb-2">

            <div className="px-3 py-2 rounded-t-lg   text-sm font-semibold text-slate-900">Check in Details</div>
            <button
              type="button"
              onClick={() => setCheckinDetails(!showCheckinDetails)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-shadow
                 bg-white border border-slate-200 hover:shadow-sm focus:outline-none"
              aria-expanded={showCheckinDetails}
            >
              <ChevronDownIcon
                className={`h-4 w-4 transform transition-transform duration-200 ${showCheckinDetails ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {showCheckinDetails && (
            <div className="grid grid-cols-12 gap-3 p-3">
              <div className="col-span-3">
                <label className="block text-sm font-medium">Check-in Type</label>
                <select
                  value={booking.bookingDetails.checkInType || ""}
                  onChange={(e) => updateBookingDetails("checkInType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                >
                  <option value="">Select Check-in Type</option>
                  <option value="24 Hours CheckIn">24 Hours CheckIn</option>
                  <option value="Fixed 12PM">Fixed 12PM</option>
                </select>
              </div>

              {/* Arrival Date */}
              <div className="col-span-3">
                <label className="block text-sm font-medium"> Arrival Date</label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocalInputValue(booking.checkin.arrivalDate)}
                  onChange={(e) => updateCheckin("arrivalDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>

              { }
              <div className="col-span-3">
                <label className="block text-sm font-medium">Check-in Date & Time</label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocalInputValue(booking.checkin.checkinDate)}
                  onChange={(e) => updateCheckin("checkinDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>

              {/* Check-out */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Check-out  Date & Time</label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocalInputValue(booking.checkin.checkoutDate)}
                  onChange={(e) => updateCheckin("checkoutDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>

              {/* Depature */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Depature Date</label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocalInputValue(booking.checkin.depatureDate)}
                  onChange={(e) => updateCheckin("depatureDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">No.of Days</label>
                <input type="number" value={booking.bookingDetails.noOfDays} onChange={(e) => updateBookingDetails("noOfDays", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  min={0}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/^0+(?=\d)/, '');
                  }}
                  placeholder="Enter Number Of Days" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">Check-out Grace Time</label>
                <input value={booking.bookingDetails.graceTime} onChange={(e) => updateBookingDetails("graceTime", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Grace Time" />
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium">Check-in User</label>
                <input value={booking.bookingDetails.checkInUser} onChange={(e) => updateBookingDetails("checkInUser", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Check In User Name" />
              </div>

              <div className="col-span-2 flex items-end gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={booking.bookingDetails.enableRoomSharing} onChange={(e) => updateBookingDetails("enableRoomSharing", e.target.checked)} />
                  <span className="text-sm">Enable Room Sharing</span>
                </label>
              </div>
            </div>

          )}
        </div>

      </div>

      <div className="col-span-12 rounded-lg border border-slate-200 p-1 bg-white shadow-sm">
        <div className="rounded-lg border bg-white border-slate-200">
          <div className="flex items-center bg-blue-200 justify-between pb-2">
            <div className="px-3 py-2 rounded-t-lg   text-sm font-semibold text-slate-900">Payment Details</div>
            <button
              type="button"
              onClick={() => setShowPayment(!showPayment)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-shadow
                 bg-white border border-slate-200 hover:shadow-sm focus:outline-none"
              aria-expanded={showPayment}
            >
              <ChevronDownIcon
                className={`h-4 w-4 transform transition-transform duration-200 ${showPayment ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {showPayment && (
            <div className="mt-3 p-4">
              <div className="grid grid-cols-12 gap-3">

                {/* Payment type & by */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Payment Type</label>
                  <select
                    value={booking.paymentDetails?.paymentType || ""}
                    onChange={(e) => updatePayment("paymentType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  >
                    <option value="">Select Payment Type</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Payment By</label>
                  <input
                    value={booking.paymentDetails?.paymentBy || ""}
                    onChange={(e) => updatePayment("paymentBy", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Guest / Agent / Company"
                  />
                </div>

                {/* toggles */}
                <div className="col-span-6 grid grid-cols-3 gap-6">
                  {/* Allow Credit */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Allow Credit</label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={booking.paymentDetails?.allowCredit === "Yes"}
                        onChange={(e) => updatePayment("allowCredit", e.target.checked ? "Yes" : "No")}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </div>

                  {/* Allow Charges Posting */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Allow Charges Posting</label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={booking.paymentDetails?.allowChargesPosting === "Yes"}
                        onChange={(e) => updatePayment("allowChargesPosting", e.target.checked ? "Yes" : "No")}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </div>

                  {/* Enable Paxwise */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Enable Paxwise</label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!booking.paymentDetails?.enablePaxwise}
                        onChange={(e) => updatePayment("enablePaxwise", e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">
                        {booking.paymentDetails?.enablePaxwise ? "Enabled" : "Disabled"}
                      </span>
                    </label>
                  </div>
                </div>



                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Paxwise Bill Amount</label>
                  <div className="relative">

                    <input
                      type="number"
                      value={booking.paymentDetails?.paxwiseBillAmount || ""}
                      onChange={(e) => updatePayment("paxwiseBillAmount", e.target.value)}
                      min={0}
                      placeholder="Optional paxwise amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/^0+(?=\d)/, '');
                      }}
                    />
                  </div>
                </div>

                {/* Money inputs: Paid / Balance / Net Rate */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Paid Amount</label>
                  <div className="relative">

                    <input
                      type="number"
                      value={booking.paymentDetails?.paidAmount ?? 0}
                      onChange={(e) => updatePayment("paidAmount", Number(e.target.value || 0))}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/^0+(?=\d)/, '');
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Balance Amount</label>
                  <div className="relative">

                    <input
                      type="number"
                      value={booking.paymentDetails?.balanceAmount ?? 0}
                      onChange={(e) => updatePayment("balanceAmount", Number(e.target.value || 0))}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/^0+(?=\d)/, '');
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Net Rate</label>
                  <div className="relative">

                    <input
                      value={booking.paymentDetails?.netRate || ""}
                      onChange={(e) => updatePayment("netRate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="Net rate"
                    />
                  </div>
                </div>

                {/* Discounts */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <input
                    value={booking.paymentDetails?.discType || ""}
                    onChange={(e) => updatePayment("discType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Flat / % / None"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Discount Value</label>
                  <input
                    value={booking.paymentDetails?.discValue || ""}
                    onChange={(e) => updatePayment("discValue", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g. 100 or 10%"
                  />
                </div>



                {/* ----------------gstInfo ---------------- */}


                <div className="col-span-3">
                  <label className="block text-sm font-medium"> GST Number</label>
                  <input
                    value={booking.gstInfo?.gstNumber || ""}
                    onChange={(e) => updateGST("gstNumber", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/^0+(?=\d)/, '');
                    }}
                    placeholder="Enter The GST Number"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium">GST type</label>
                  <input
                    value={booking.gstInfo?.gstType || ""}
                    onChange={(e) => updateGST("gstType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Enter The GST Type"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>


      {/* ---------------- end payment details ---------------- */}


      {/* Address Details (simpler inputs) */}
      <div className="col-span-12 rounded-lg border border-slate-200 p-1 bg-white shadow-sm">
        <div className="rounded-lg border bg-white border-slate-200">

          <div className="flex items-center bg-blue-200 justify-between pb-2">

            <div className=" rounded-t-lg  p-3  text-sm font-semibold text-slate-900">Address Details</div>
            <button
              type="button"
              onClick={() => setAddressDetails(!showAddressDetails)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-shadow
                 bg-white border border-slate-200 hover:shadow-sm focus:outline-none"
              aria-expanded={showAddressDetails}
            >
              <ChevronDownIcon
                className={`h-4 w-4 transform transition-transform duration-200 ${showAddressDetails ? "rotate-180" : ""}`}
                aria-hidden="true"
              />

            </button>
          </div>

          {showAddressDetails && (
            <div className="grid grid-cols-12 gap-3 p-3">

              <div className="col-span-4">
                <label className="block text-sm font-medium">Address<span className="text-red-500">*</span></label>
                <input value={guest.address} onChange={(e) => onGuest("address", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Full Address " />
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium">City</label>
                <input value={booking.addressInfo.city} onChange={(e) => updateAddress("city", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="City Name" />
              </div>


              <div className="col-span-2">
                <label className="block text-sm font-medium">Pin Code</label>
                <input value={booking.addressInfo.pinCode} onChange={(e) => updateAddress("pinCode", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Pin Code Number" />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium">State</label>
                <input value={booking.addressInfo.state} onChange={(e) => updateAddress("state", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Enter The State Name" />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium">Country</label>
                <input value={booking.addressInfo.country} onChange={(e) => updateAddress("country", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Enter The Country Name" />
              </div>


              <div className="col-span-2">
                <label className="block text-sm font-medium">Date of Birth</label>
                <input type="date" value={booking.personalInfo.dob} onChange={(e) => onBooking("personalInfo", { ...booking.personalInfo, dob: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">Age</label>
                <input value={booking.personalInfo.age} onChange={(e) => onBooking("personalInfo", { ...booking.personalInfo, age: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Enter the Age " />
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium">company Anniversary</label>
                <input type="date" value={booking.personalInfo.companyAnniversary} onChange={(e) => onBooking("personalInfo", { ...booking.personalInfo, companyAnniversary: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all" />
              </div>


              <div className="col-span-1">
                <label className="block text-sm font-medium">Print Option</label>
                <input
                  type="checkbox"
                  checked={!!booking.invoiceOptions?.printOption}
                  onChange={(e) => updateInvoiceOptions("printOption", e.target.checked)}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">Save as PDF</label>
                <input
                  type="checkbox"
                  checked={!!booking.invoiceOptions?.pdfSaveOption}
                  onChange={(e) => updateInvoiceOptions("pdfSaveOption", e.target.checked)}
                />
              </div>
            </div>
          )}

        </div>
      </div>


      {/* Footer actions */}
      <div className="mt-4 flex items-center justify-end">

        <div className="flex gap-2">
          <button onClick={handleSubmit} className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-50">
            Create Check-in
          </button>

        </div>
      </div>

      {message && <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800">{message}</div>}
    </div>
  );
}


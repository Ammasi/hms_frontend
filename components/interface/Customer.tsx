/** Types (updated) **/

export type BasicGuest = {
  id: string;
  clientId: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  title: string;
  isVIP: boolean;
  isForeignCustomer: boolean;
  email: string;
  gender: string;
  mobileNo: string;
  nationality: string;
  idType: string;
  idNumber: string;
  image: string;
  idProof: string;
  address: string;
  isActive: boolean;
};

/** stayDetails related types that match DTOs you posted */
export type StayGuest = {
  guestName: string[];     // DTO expects string[]
  phoneNo?: string;
  emailId?: string;
  city?: string;
  address?: string;
  pincode?: string;
  state?: string;
  country?: string;
  payPerRoom?: string;
  specialInstructions?: string;
};

export type StayNumberOfGuests = {
  adult?: number;
  child?: number;
  seniors?: number;
};

export type StayDetailsDto = {
  roomNo: string;
  bedType: string;
  roomType: string;
  roomFacility: string[];
  planFood?: string;
  mealPlan?: string;
  ratePlan?: string;
  tariff?: string;
  newRentTariff?: string;
  applyTariff?: string;
  numberOfGuests: { adult?: number; child?: number; seniors?: number };
  noOfPax?: number;
  childPax?: number;
  extraPax?: number;
  isActive?: boolean;
  status?: string;
  guests: { guestName: string[]; phoneNo?: string }[];
};

/** Existing BookingPayload but now stayDetails uses StayDetail[] */
export type BookingPayload = {
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
  // keep checkin dates as strings in the UI state (convert to Date when sending)
  checkin: { checkinDate: string; checkoutDate: string; arrivalDate: string; depatureDate: string };
  stayDetails: StayDetailsDto[];   // updated
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
  addressInfo: { city: string; pinCode?: string; state: string; country: string };
  gstInfo: { gstNumber: string; gstType: string };
  personalInfo: { dob: string; age: string; companyAnniversary: string };
  businessInfo: {
    segmentName: string;
    bussinessSource: string;
    customerComapny: string;
    purposeOfVisit: string;
    visitRemark: string;
  };
  invoiceOptions: { printOption: boolean; pdfSaveOption: boolean };
  extra: Array<{ serviceName: string; hsncode: string; amount: string }>;
  meta: { rating: string; isCancelled: boolean; isActive: boolean; createdAt: string; updatedAt: string };
};

/** RoomRow: UI editing shape (keeps same fields + some optional additions) */
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

  // optional fields that map to DTO
  bedType?: string;
  roomFacility?: string[];    // optional list of facility strings
  status?: string;
  newRentTariff?: string;
};

/** Initial states (condensed & updated) **/
export const initialGuest: BasicGuest = {
  clientId: "",
  propertyId: "",
  firstName: "",
  lastName: "",
  title: "Mr",
  email: "",
  gender: "Male",
  mobileNo: "",
  nationality: "Indian",
  idType: "",
  idNumber: "",
  address: "",
  id: "",
  isVIP: false,
  isForeignCustomer: false,
  image: "",
  idProof: "",
  isActive: false,
};

export const initialBooking: BookingPayload = {
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
    noOfDays: "1",
    noOfRooms: "1",
    graceTime: "00:30",
    checkInType: "24 Hours CheckIn",
    checkInMode: "",
    checkInUser: "Demo",
    roomStatus: "",
    arrivalMode: "Walk-In/Direct",
    otaName: "",
    bookingInstruction: "",
    enableRoomSharing: false,
    bookingThrough: "Self",
    preferredRooms: "",
    reservedBy: "Demo",
    reservedStatus: "",
    reservationNo: "",
  },
  checkin: {
    checkinDate: new Date().toISOString().slice(0, 16),
    checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    arrivalDate: new Date().toISOString(),
    depatureDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  stayDetails: [], 
  guestInfo: {
    numberOfGuests: { adult: 1, child: 0, seniors: 0 },
    noOfPax: 1,
    childPax: 0,
    extraPax: 0,
    specialRequests: "",
    complimentary: "",
    vechileDetails: "",
  },
  paymentDetails: {
    paymentType: "",
    paymentBy: "Direct",
    allowCredit: "No",
    paidAmount: 0,
    balanceAmount: 0,
    discType: "",
    discValue: "",
    netRate: "",
    allowChargesPosting: "No",
    enablePaxwise: false,
    paxwiseBillAmount: "",
  },
  addressInfo: { city: "", pinCode: "", state: "Tamil Nadu", country: "India" },
  gstInfo: { gstNumber: "", gstType: "UNREGISTERED" },
  personalInfo: { dob: "", age: "", companyAnniversary: "" },
  businessInfo: { segmentName: "", bussinessSource: "", customerComapny: "", purposeOfVisit: "", visitRemark: "" },
  invoiceOptions: { printOption: true, pdfSaveOption: true },
  extra: [{ serviceName: "", hsncode: "", amount: "" }],
  meta: { rating: "", isCancelled: false, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
};

export const initialRooms: RoomRow[] = [
  {
    roomType: "",
    roomNo: "",
    ratePlan: "",
    mealPlan: "EP",
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
    tariff: "Inclusive",
    applyTariff: "Rent",
    planFood: "",
    // optional defaults
    bedType: "Single",
    roomFacility: [],
    status: "CheckedIn",
  },
];

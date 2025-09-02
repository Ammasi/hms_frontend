import axios from 'axios';
import Cookies from 'js-cookie';
import get from 'lodash/get';
const API_BASE_URL = 'http://192.168.1.8:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


//  attach token automatically if present
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------- Auth APIs -----------------
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const verifyUser = async () => {
  const res = await api.get("/auth/verify");
  return res.data;
};

// export const verifyUser = async () => {
//   const res = await api.get("/auth/verify");

//   return get(res, "data", null);
// };

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout API error:", err);
  } finally {
    localStorage.removeItem("user");
    Cookies.remove("auth_token");
  }
};

// ----------------- Subscription APIs -----------------
export const fetchSubscriptions = async () => {
  const response = await api.get('/product-subscription');

  return get(response, 'data', []);
};

export const createHotelOwner = (fd: FormData) =>
  api.post('/product-subscription/create', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateHotelOwner = (id: string, fd: FormData) =>
  api.put(`/product-subscription/update/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteHotelOwner = (id: string) =>
  api.delete(`/product-subscription/delete/${id}`);

export const fetchHotelOwnerById = async (id: string) => {
  const response = await api.get(`/product-subscription/${id}`);

  const res = get(response, 'data', null);
  return res;
};

// ----------------- Dynamic URL & Method Helper -----------------

type EditingData = {
  id?: string;
};

export const getSubscriptionUrlAndMethod = (editingData?: EditingData) => {
  if (editingData && editingData.id) {
    return {
      url: `/product-subscription/update/${editingData.id}`,
      method: 'PUT' as const,
    };
  }

  return {
    url: '/product-subscription/create',
    method: 'POST' as const,
  };
};


// ----------------- Customer APIs -----------------

export const fetchCustomer = () => api.get('/customers');

export const createCustomer = (formData: any) =>
  api.post('/customers/create', {
    ...formData

  });

export const updateCustomer = (id: string, data: any) =>
  api.put(`/customers/update/${id}`, {
    ...data

  });

export const deleteCustomer = (id: string) =>
  api.delete(`/customers/delete/${id}`);

export const fetchCustomerById = (id: string) =>
  api.get(`/customers/${id}`).then(res => res.data);


// ----------------- TaskSheet APIs -----------------

export const fetchTaskSheet = () => api.get('/task-sheet'); //http://192.168.1.14:8000/api/v1/task-sheet

export const createTaskSheet = (formData: any) =>
  api.post('/task-sheet/create', {
    ...formData,
  });

export const updateTaskSheet = (id: string, data: any) =>
  api.put(`/task-sheet/update/${id}`, {
    ...data,

  });

export const deleteTaskSheet = (id: string) =>
  api.delete(`/task-sheet/delete/${id}`);

export const fetchTaskSheetById = (id: string) =>
  api.get(`/task-sheet/${id}`).then(res => res.data);


// ----------------- SubscriptionLimit APIs -----------------

export const fetchSubscriptionLimit = () => api.get('/subscription-limits'); //http://192.168.1.14:8000/api/v1/subscription-limits/create

export const createSubscriptionLimit = (formData: any) =>
  api.post('/subscription-limits/create', {
    ...formData,
  });

export const updateSubscriptionLimit = (id: string, data: any) =>
  api.put(`/subscription-limits/update/${id}`, {
    ...data,

  });

export const deleteSubscriptionLimit = (id: string) =>
  api.delete(`/subscription-limits/delete/${id}`);

export const fetchSubscriptionLimitById = (id: string) =>
  api.get(`/subscription-limits/${id}`).then(res => res.data);

// ----------------- HotelFacilit APIs -----------------

export const fetchHotelFacility = () => api.get('/hotel-facility');

export const createHotelFacilit = (formData: any) =>
  api.post('/hotel-facility/create', {
    ...formData

  });

export const updateHotelFacility = (id: string, data: any) =>
  api.put(`/hotel-facility/update/${id}`, {
    ...data

  });

export const deleteHotelFacility = (id: string) =>
  api.delete(`/hotel-facility/delete/${id}`);

export const fetchHotelFacilityById = (id: string) =>
  api.get(`/hotel-facility/${id}`).then(res => res.data);
// ----------------- CheckInMode APIs -----------------

export const fetchCheckInMode = () => api.get('/checkin-mode');

export const createCheckInMode = (formData: any) =>
  api.post('/checkin-mode/create', {
    ...formData

  });

export const updateCheckInMode = (id: string, data: any) =>
  api.put(`/checkin-mode/update/${id}`, {
    ...data

  });

export const deleteCheckInMode = (id: string) =>
  api.delete(`/checkin-mode/delete/${id}`);

export const fetchCheckInModeById = (id: string) =>
  api.get(`/checkin-mode/${id}`).then(res => res.data);




// ----------------- GSTRegister APIs -----------------

export const fetchGSTRegister = () => api.get('/gst');

export const createGSTRegister = (formData: any, payload: { clientId: string; propertyId: string; legalName: string; tradeName: string; gstNumber: string; panNumber: string; gstType: string; businessType: string; email: string; phoneNo: string; gstStateCode: string; cgst: string; sgst: string; igst: number; registrationDate: string; taxJurisdiction: number; propertyAddress: boolean; gstCertificateUrl: string | undefined; isActive: boolean; }) =>
  api.post('/gst/create', {
    ...formData

  });

export const updateGSTRegister = (id: string, data: any) =>
  api.put(`/gst/update/${id}`, {
    ...data

  });

export const deleteGSTRegister = (id: string) =>
  api.delete(`/gst/delete/${id}`);

export const fetchGSTRegisterById = (id: string) =>
  api.get(`/gst/${id}`).then(res => res.data);
// ----------------- Employee APIs -----------------

export const fetchEmployee = () => api.get('/employee');

export const createEmployee = (formData: any, payload: { clientId: string; propertyId: string; legalName: string; tradeName: string; gstNumber: string; panNumber: string; gstType: string; businessType: string; email: string; phoneNo: string; gstStateCode: string; cgst: string; sgst: string; igst: number; registrationDate: string; taxJurisdiction: number; propertyAddress: boolean; gstCertificateUrl: string | undefined; isActive: boolean; }) =>
  api.post('/employee/create', { //http://192.168.1.14:8000/api/v1/employee/update/
    ...formData

  });

export const updateEmployee = (id: string, data: any) =>
  api.put(`/employee/update/${id}`, {
    ...data

  });

export const deleteEmployee = (id: string) =>
  api.delete(`/employee/delete/${id}`);

export const fetchEmployeeById = (id: string) =>
  api.get(`/employee/${id}`).then(res => res.data);

// ----------------- ChargesRegister APIs -----------------

export const fetchChargesRegister = () => api.get('/manage-charge');

export const createChargesRegister = (formData: any) =>
  api.post('/manage-charge/create', {
    ...formData

  });

export const updateChargesRegister = (id: string, data: any) =>
  api.put(`/manage-charge/update/${id}`, {
    ...data

  });

export const deleteChargesRegister = (id: string) =>
  api.delete(`/manage-charge/delete/${id}`);

export const fetchChargesRegisterById = (id: string) =>
  api.get(`/manage-charge/${id}`).then(res => res.data);


// ----------------- Property APIs -----------------

export const fetchProperty = async () => {
  const response = await api.get("/property");

  return get(response, "data", []);
};

export const createProperty = (formData: FormData) =>
  api.post('/property/create', formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProperty = (id: string, formData: FormData) =>
  api.put(`/property/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProperty = (id: string) =>
  api.delete(`/property/delete/${id}`);

export const fetchPropertyById = (id: string) =>
  api.get(`/property/${id}`).then(res => res.data);

// ----------------- subscriptiomodel APIs -----------------



export const fetchSubscriptioModel = async () => {
  const response = await api.get("/subscription-model");

  return get(response, "data", []);
};

export const createSubscriptioModel = (formData: any) =>
  api.post('/subscription-model/create', formData);

export const updateSubscriptioModel = (id: string, data: any) =>
  api.put(`/subscription-model/update/${id}`, data);

export const deleteSubscriptioModel = (id: string) =>
  api.delete(`/subscription-model/delete/${id}`);


export const fetchSubscriptioModelById = async (id: string) => {
  const res = await api.get(`/subscription-model/${id}`);
  return get(res, "data", {});
};

// ----------------- Status Message APIs -----------------



export const fetchStatusMessage = async () => {
  const res = await api.get("/status-message");
  return get(res, "data", []);
};

export const createStatusMessage = (formData: any) =>
  api.post('/status-message/create', {
    ...formData

  });

export const updateStatusMessage = (id: string, data: any) =>
  api.put(`/status-message/update/${id}`, {
    ...data

  });

export const deleteStatusMessage = (id: string) =>
  api.delete(`/status-message/delete/${id}`);


export const fetchStatusMessageById = async (id: string) => {
  const res = await api.get(`/status-message/${id}`);
  return get(res, "data", {});
};
// ----------------- Call Message APIs -----------------

export const fetchCallMessage = async () => {
  const res = await api.get("/call-message");
  return get(res, "data", []);
};
export const createCallMessage = (formData: any) =>
  api.post('/call-message/create', {
    ...formData

  });

export const updateCallMessage = (id: string, data: any) =>
  api.put(`/call-message/update/${id}`, {
    ...data

  });

export const deleteCallMessage = (id: string) =>
  api.delete(`/call-message/delete/${id}`);

export const fetchCallMessageById = async (id: string) => {
  const res = await api.get(`/call-message/${id}`);
  return get(res, "data", {});
};

// ----------------- Notification APIs -----------------


export const fetchNotification = async () => {
  const res = await api.get("/notification");
  return get(res, "data", []);
};
export const createNotification = (formData: any) =>
  api.post('/notification/create', {
    ...formData

  });

export const updateNotification = (id: string, data: any) =>
  api.put(`/notification/update/${id}`, {
    ...data

  });

export const deleteNotification = (id: string) =>
  api.delete(`/notification/delete/${id}`);





export const fetchNotificationById = async (id: string) => {
  const res = await api.get(`/notification/${id}`);
  return get(res, "data", {});
};
// ----------------- CustomerInfo APIs -----------------

export const fetchCustomerInfo = () => api.get('/customer-info');

export const createCustomerInfo = (formData: any) =>
  api.post('/customer-info/create', {
    ...formData

  });

export const updateCustomerInfo = (id: string, data: any) =>
  api.put(`/customer-info/update/${id}`, {
    ...data

  });

export const deleteCustomerInfo = (id: string) =>
  api.delete(`/customer-info/delete/${id}`);

export const fetchCustomerInfoById = (id: string) =>
  api.get(`/customer-info/${id}`).then(res => res.data);
// ----------------- Rooms APIs -----------------

export const fetchRoomsByCommonId = async (commonId: string) => {
  const res = await api.get(`/room/property/${commonId}`);
  return res.data;
};
export const fetchRoomsNumber = (number: number) => {
  api.get(`/room/${number}`).then(res => res.data)
}

export const createRooms = (formData: any) =>
  api.post('/room/create', {
    ...formData

  });

export const updateRooms = async (id: string, data: FormData) => {
  const response = await axios.put(`${API_BASE_URL}/room/update/${id}`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteRooms = (id: string) =>
  api.delete(`/room/delete/${id}`);

export const fetchRoomsById = (id: string) =>
  api.get(`/room/${id}`).then(res => res.data);

// ----------------- Report APIs -----------------

export const fetchReport = async ({
  clientId,
  propertyId,
  fromDate,
  toDate,
  roomType,
}: {
  clientId: string;
  propertyId: string;
  fromDate?: string;
  toDate?: string;
  roomType?: string;
}) => {
  try {
    const params = new URLSearchParams();

    if (clientId) params.set("clientId", clientId);
    if (propertyId) params.set("propertyId", propertyId);
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    if (roomType) params.set("roomType", roomType);

    const res = await api.get(`/reports/get?${params.toString()}`);
    return get(res, "data", []);
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch booking report."
    );
  }
};

// ----------------- Night Audit Report API -----------------
export const fetchNightAuditReport = async ({
  clientId,
  propertyId,
  fromDate,
  toDate,
}: {
  clientId: string;
  propertyId: string;
  fromDate?: string;
  toDate?: string;
}) => {
  try {
    const params = new URLSearchParams();
    params.set("clientId", clientId);
    params.set("propertyId", propertyId);

    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);

    const res = await api.get(`/reports/night-audit?${params.toString()}`);
    return get(res, "data", null);
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch night audit report."
    );
  }
};

// ----------------- Reservation Report API -----------------
export const fetchReservationReport = async ({
  clientId,
  propertyId,
  arrivalFrom,
  arrivalTo,
  bookedFrom,
  bookedTo,
  cancelFrom,
  cancelTo,
  showList,
  arrivalMode,
  timewise,
}: {
  clientId: string;
  propertyId: string;
  arrivalFrom?: string;
  arrivalTo?: string;
  bookedFrom?: string;
  bookedTo?: string;
  cancelFrom?: string;
  cancelTo?: string;
  showList?: string;
  arrivalMode?: string;
  timewise?: string;
}) => {
  try {
    const params = new URLSearchParams();
    params.set("clientId", clientId);
    params.set("propertyId", propertyId);

    if (arrivalFrom) params.set("arrivalFrom", arrivalFrom);
    if (arrivalTo) params.set("arrivalTo", arrivalTo);
    if (bookedFrom) params.set("bookedFrom", bookedFrom);
    if (bookedTo) params.set("bookedTo", bookedTo);
    if (cancelFrom) params.set("cancelFrom", cancelFrom);
    if (cancelTo) params.set("cancelTo", cancelTo);
    if (showList) params.set("showList", showList);
    if (arrivalMode) params.set("arrivalMode", arrivalMode);
    if (timewise) params.set("timewise", timewise);

    const res = await api.get(`/reports/reservation?${params.toString()}`);
    return get(res, "data", []);
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch reservation report."
    );
  }
};


// ----------------- Stay Report API -----------------
export const fetchStayReport = async ({
  clientId,
  propertyId,
  fromDate,
  toDate,
  roomType,
  customerName,
}: {
  clientId: string;
  propertyId: string;
  fromDate?: string;
  toDate?: string;
  roomType?: string;
  customerName?: string;
}) => {
  try {
    const params = new URLSearchParams();
    params.set("clientId", clientId);
    params.set("propertyId", propertyId);

    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    if (roomType && roomType !== "all") params.set("roomType", roomType);
    if (customerName?.trim()) params.set("customerName", customerName.trim());

    const res = await api.get(`/reports/stay?${params.toString()}`);
    return get(res, "data.data", []);
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch stay report."
    );
  }
};

// ----------------- BillingInfo APIs -----------------


export const createBillingInfo = async (data: any) => {
  const res = await api.post('/billing-info/create', data);
  return get(res, 'data', null);
};

export const updateBillingInfo = async (id: string, payload: any) => {
  const res = await api.put(`/billing-info/update/${id}`, payload);
  return res.data;
};
 

export const fetchBillingInfos = async () => {
  const res = await api.get('/billing-info/');
  return get(res, 'data', []);
};

 
export const getBillingInfoById = async (id: string) => {
  const res = await api.get(`/billing-info/${id}`);
  return get(res, 'data', []);
};
 
export const deleteBillingInfo = async (id: string) => {
  const res = await api.delete(`/billing-info/delete/${id}`);
  return res.data;
}
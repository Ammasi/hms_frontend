import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.14:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ----------------- Auth APIs -----------------

export const login = (email: string, password: string, role: string) =>
  api.post('/auth/login', { email, password, role });

export const verifyUser = () => api.get('/auth/verify');

export const logout = () => api.post('/auth/logout');

// ----------------- Subscription APIs -----------------

export const fetchSubscriptions = () => api.get('/product-subscription');

export const createHotelOwner = (formData: any) =>
  api.post('/product-subscription/create', {
    ...formData,
    subscripton: formData.subscription,
    subscriptonStatus: formData.subscriptionStatus,
    subscriptonEndDate: formData.subscriptionEndDate,
    subscriptonDuration: formData.subscriptionDuration,
  });

export const updateHotelOwner = (id: string, data: any) =>
  api.put(`/product-subscription/update/${id}`, {
    ...data,
    subscripton: data.subscription,
    subscriptonStatus: data.subscriptionStatus,
    subscriptonEndDate: data.subscriptionEndDate,
    subscriptonDuration: data.subscriptionDuration,
  });

export const deleteHotelOwner = (id: string) =>
  api.delete(`/product-subscription/delete/${id}`);

export const fetchHotelOwnerById = (id: string) =>
  api.get(`/product-subscription/${id}`).then(res => res.data);

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

export const fetchProperty = () => api.get('/property');

export const createProperty = (formData: any) =>
  api.post('/property/create', {
    ...formData

  });

export const updateProperty = (id: string, data: any) =>
  api.put(`/property/update/${id}`, {
    ...data

  });

export const deleteProperty = (id: string) =>
  api.delete(`/property/delete/${id}`);

export const fetchPropertyById = (id: string) =>
  api.get(`/property/${id}`).then(res => res.data);

// ----------------- subscriptiomodel APIs -----------------
 
export const fetchSubscriptioModel = () => api.get('/subscription-model');

export const createSubscriptioModel = (formData: any) =>
  api.post('/subscription-model/create', {
    ...formData

  });

export const updateSubscriptioModel = (id: string, data: any) =>
  api.put(`/subscription-model/update/${id}`, {
    ...data

  });

export const deleteSubscriptioModel = (id: string) =>
  api.delete(`/subscription-model/delete/${id}`);

export const fetchSubscriptioModelById = (id: string) =>
  api.get(`/subscription-model/${id}`).then(res => res.data);

// ----------------- Status Message APIs -----------------
 
export const fetchStatusMessage = () => api.get('/status-message');

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

export const fetchStatusMessageById = (id: string) =>
  api.get(`/status-message/${id}`).then(res => res.data);

// ----------------- Call Message APIs -----------------
 
export const fetchCallMessage = () => api.get('/call-message');

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

export const fetchCallMessageById = (id: string) =>
  api.get(`/call-message/${id}`).then(res => res.data);

// ----------------- Notification APIs -----------------
 
export const fetchNotification = () => api.get('/notification');

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

export const fetchNotificationById = (id: string) =>
  api.get(`/notification/${id}`).then(res => res.data);

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

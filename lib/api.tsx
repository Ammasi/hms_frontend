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

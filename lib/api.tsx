 
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

export const logout = () => api.post('/auth/logout', {});

// ----------------- Subscription APIs -----------------

export const fetchSubscriptions = () => api.get('/product-subscription');

export const createHotelOwner = (formData: any) =>
  fetch(`${API_BASE_URL}/product-subscription/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      ...formData,
      subscripton: formData.subscription,
      subscriptonStatus: formData.subscriptionStatus,
      subscriptonEndDate: formData.subscriptionEndDate,
      subscriptonDuration: formData.subscriptionDuration,
    }),
  });

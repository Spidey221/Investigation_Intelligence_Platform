import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSharedCase = (shareToken) => api.get(`/shared/cases/${shareToken}`);
export const getSharedEvidence = (shareToken) => api.get(`/shared/cases/${shareToken}/evidence`);
export const getSharedGraph = (shareToken) => api.get(`/shared/cases/${shareToken}/graph`);

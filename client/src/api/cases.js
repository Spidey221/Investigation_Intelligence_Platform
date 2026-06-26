import api from './axios';

export const getCases = () => api.get('/cases');
export const getCaseById = (id) => api.get(`/cases/${id}`);
export const createCase = (data) => api.post('/cases', data);
export const updateCase = (id, data) => api.put(`/cases/${id}`, data);
export const deleteCase = (id) => api.delete(`/cases/${id}`);

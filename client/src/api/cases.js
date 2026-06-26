import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCases = () => api.get('/cases');
export const getCaseById = (id) => api.get(`/cases/${id}`);
export const createCase = (data) => api.post('/cases', data);
export const updateCase = (id, data) => api.put(`/cases/${id}`, data);
export const deleteCase = (id) => api.delete(`/cases/${id}`);

export const uploadEvidence = (caseId, formData) => {
  return api.post(`/cases/${caseId}/evidence`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteEvidence = (evidenceId) => api.delete(`/evidence/${evidenceId}`);

export const getIntelligenceGraph = (caseId) => api.get(`/cases/${caseId}/graph`);

// Phase 6 endpoints
export const togglePublicAccess = (caseId, isPublic) => api.put(`/cases/${caseId}/public`, { is_public: isPublic });
export const generateInvestigationReport = (caseId, graphImage) => {
  return api.post(`/cases/${caseId}/report`, { graphImage }, { responseType: 'blob' });
};

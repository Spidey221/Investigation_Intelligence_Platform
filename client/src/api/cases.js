import api from './axios';

export const getCases = () => api.get('/cases');
export const getCaseById = (id) => api.get(`/cases/${id}`);
export const createCase = (data) => api.post('/cases', data);
export const updateCase = (id, data) => api.put(`/cases/${id}`, data);
export const deleteCase = (id) => api.delete(`/cases/${id}`);

// Evidence APIs
export const getEvidence = (caseId) => api.get(`/cases/${caseId}/evidence`);
export const addEvidence = (caseId, formData) => api.post(`/cases/${caseId}/evidence`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteEvidence = (evidenceId) => api.delete(`/evidence/${evidenceId}`);

export const getEntitiesByCase = (caseId) => api.get(`/cases/${caseId}/entities`);
export const getRelationshipsByCase = (caseId) => api.get(`/cases/${caseId}/relationships`);
export const getInvestigationGraph = (caseId) => api.get(`/cases/${caseId}/graph`);

export const togglePublicAccess = (caseId) => api.put(`/cases/${caseId}/public`);
export const generateReport = (caseId, graphImage) => api.post(`/cases/${caseId}/report`, { graphImage }, { responseType: 'blob' });

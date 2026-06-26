import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCaseAudit = (caseId) => api.get(`/audit/case/${caseId}`);
export const verifyEvidenceIntegrity = (evidenceId) => api.post(`/evidence/${evidenceId}/verify`);

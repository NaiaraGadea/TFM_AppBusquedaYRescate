// Frontend/src/api.js
import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://192.168.0.19:4000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000
});

// helpers
//Casos
export const getCases = () => api.get('/cases').then(r => r.data);
export const getCasesByStatus = (status = 'all') => api.get(`/cases?status=${status}`).then(r => r.data);
export const getCasesWithAlerts = () =>api.get('/cases/with-alerts').then(r => r.data);
export const createCase = (payload) => api.post('/cases', payload).then(r => r.data);
export const getCaseByCaseId = (caseId) => api.get(`/cases/${caseId}`).then(r => r.data);


// Alertas
export const getAlerts = (limit = 50) => api.get(`/alerts?limit=${limit}`).then(r => r.data);
export const createAlert = (payload) => api.post('/alerts', payload).then(r => r.data);


//Personas Desaparecidas
export const createDesaparecido = (payload) =>
  api.post('/desaparecidos', payload).then(r => r.data);

export const getDesaparecidoByCaseId = (caseId) =>
  api.get(`/desaparecidos/${caseId}`).then(r => r.data);

export const updateDesaparecidoStatus = (caseId, status) =>
  api.patch(`/desaparecidos/${caseId}/status`, { status }).then(r => r.data);

// Búsquedas
export const getSearchs = (limit = 50) =>
  api.get(`/searchs?limit=${limit}`).then(r => r.data);

export const getSearchsByCaseId = (caseId) =>
  api.get(`/searchs/case/${caseId}`).then(r => r.data);

export const createSearch = (payload) =>
  api.post('/searchs', payload).then(r => r.data);

export const getSearchById = (id) =>
  api.get(`/searchs/${id}`).then(r => r.data);

export const deleteSearch = (id) =>
  api.delete(`/searchs/${id}`).then(r => r.data);

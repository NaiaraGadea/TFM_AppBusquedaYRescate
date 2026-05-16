// Frontend/src/api.js
import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://192.168.0.182:4000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000
});

/*
// helpers VIEJOS
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

*/
// Helpers nuevos:
// Alerts
// GET con límite
export const getAlerts = (limit) => api.get(`/alerts${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
// POST
export const createAlert = (payload) => api.post('/alerts', payload).then(r=>r.data);

// Cases
// GET con límite
export const getCases = (limit) => api.get(`/cases${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getCasesWithPublicAlerts = (limit)=> (`/cases/activePublicAlerts${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getCasesByGroup = (group_id) => api.get(`/cases/by-group/${group_id}`).then(r => r.data);
export const getCasesByStatus = (status = null) => api.get('/cases/by-status', { params: { status } }).then(r => r.data);
export const getCaseByCaseId = (caseId) => api.get(`/cases/${caseId}`).then(r => r.data);


// POST
export const createCase = (payload) => api.post('/cases', payload).then(r=>r.data);

// PUT
export const updateCase = (caseId, payload) => api.put(`/cases/${caseId}`, payload).then(r => r.data);



// Found Cases
// GET con límite
export const getFoundCases = (limit) => api.get(`/found_cases${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
// POST
export const createFoundCase = (payload) => api.post('/found_cases', payload).then(r=>r.data);


// Group Members
// GET con límite
export const getGroupMembers = (limit) => api.get(`/group_members${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
// POST
export const createGroupMember = (payload) => api.post('/group_members', payload).then(r=>r.data);

// Missing People
// GET con límite
export const getMissingPeople = (limit) => api.get(`/missing_people${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getMissingPersonById = (id) => api.get(`/missing_people/${id}`).then(r => r.data);

// POST
export const createMissingPerson = (payload) => api.post('/missing_people', payload).then(r=>r.data);

// People
// GET con límite
export const getPeople = (limit) => api.get(`/people${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getPersonById = (id) => api.get(`/people/${id}`).then(r => r.data);
// POST
export const createPerson = (payload) => api.post('/people', payload).then(r=>r.data);

// Reporters
// GET con límite
export const getReporters = (limit) => api.get(`/reporters${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
// POST
export const createReporter = (payload) => api.post('/reporters', payload).then(r=>r.data);

// Rescue Groups
// GET con límite
export const getGroups = (limit) => api.get(`/rescue_groups${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getGroupByPersonID = (person_id) => api.get(`/rescue_groups/groupByPerson/${person_id}`).then(r => r.data);
export const getGroupById = (id) => api.get(`/rescue_groups/${id}`).then(r => r.data);
// POST
export const createGroup = (payload) => api.post('/rescue_groups', payload).then(r=>r.data);

// Search Participants
// GET con límite
export const getSearchParticipants = (limit) => api.get(`/search_participants${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
// POST
export const createSearchParticipant = (payload) => api.post('/search_participants', payload).then(r=>r.data);

// Searches
// GET con límite
export const getSearches = (limit) => api.get(`/searches${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getSearchesByVisibility = (groupId) =>  api.get(`/searches/by-visibility/${groupId}`).then(r => r.data);


// POST
export const createSearch = (payload) => api.post('/searches', payload).then(r=>r.data);

// Users
// GET con límite
export const getUsers = (limit) => api.get(`/users${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getUserById = (id) => api.get(`/users/${id}`).then(r => r.data);

// POST
export const createUser = (payload) => api.post('/users', payload).then(r=>r.data);

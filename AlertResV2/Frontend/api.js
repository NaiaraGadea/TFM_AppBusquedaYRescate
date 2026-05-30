// Frontend/src/api.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Fichero donde se une el backend y el frontend, aquí se exportan las funciones 
creadas en base a las distintas peticiones definidas en el Backedn.
*/

// Importaciones
import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://192.168.0.227:4000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000
});

// Helpers nuevos:
// Alerts
// GET con límite
export const getAlerts = (limit) => api.get(`/alerts${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getPublicAlerts = (groupId) =>  api.get(`/alerts/by-visibility/${groupId}`).then(r => r.data);
// POST
export const createAlert = (payload) => api.post('/alerts', payload).then(r=>r.data);

// Cases
// GET con límite
export const getCases = (limit) => api.get(`/cases${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getCasesWithPublicAlerts = (limit) => api.get(`/cases/activePublicAlerts${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
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
export const getMembersByGroupId = (group_id) => api.get(`/group_members/by-group/${group_id}`).then(r => r.data);
export const getMemberByPersonId = (person_id) => api.get(`/group_members/by-person/${person_id}`).then(r => r.data);
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
export const getPersonByDni = (dni) => api.get(`/people/by-dni/${dni}`).then(r => r.data);
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
// PUT
export const updateSearch = (search_id, payload) => api.put(`/searches/${search_id}`, payload).then(r => r.data);
export const updateSearchesByCase = (case_id, payload) => api.put(`/searches/by-case/${case_id}`, payload).then(r => r.data);

// Users
// GET con límite
export const getUsers = (limit) => api.get(`/users${limit ? `?limit=${limit}` : ''}`).then(r => r.data);
export const getUserById = (id) => api.get(`/users/${id}`).then(r => r.data);
export const getUserByPersonId = (person_id) => api.get(`/users/by-person/${person_id}`).then(r => r.data);
// POST
export const createUser = (payload) => api.post('/users', payload).then(r=>r.data);
// PUT
//export const updateUserRole = (user_id, newRole) => api.put(`/users/${user_id}/role`, { rol: newRole }).then(r => r.data);
export const updateUser = (user_id, payload) => api.put(`/users/${user_id}`, payload).then(r => r.data);



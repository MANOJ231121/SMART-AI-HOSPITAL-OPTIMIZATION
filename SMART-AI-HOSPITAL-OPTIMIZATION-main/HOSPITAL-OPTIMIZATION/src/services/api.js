import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hospital_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global unauthorized / expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hospital_token');
      localStorage.removeItem('hospital_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Admin Services
export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getUsers: () => api.get('/admin/users'),
  getPatients: () => api.get('/admin/patients'),
  getDoctors: () => api.get('/admin/doctors'),
  getDepartments: () => api.get('/departments'),
  getQueues: () => api.get('/admin/queues'),
  createStaff: (data) => api.post('/admin/users/staff', data),
  updatePatient: (id, data) => api.put(`/admin/patients/${id}`, data),
  deletePatient: (id) => api.delete(`/admin/patients/${id}`),
};

// Doctor Services
export const doctorService = {
  getDashboard: () => api.get('/doctor/dashboard'),
  getQueue: () => api.get('/doctor/queue'),
  getPatients: () => api.get('/doctor/patients'),
  updatePatient: (id, data) => api.put(`/doctor/patients/${id}`, data),
  callNext: () => api.put('/doctor/call-next'),
  completeConsultation: (queueId) => api.put('/doctor/complete-consultation', null, { params: { queueId } }),
  setAvailability: (available) => api.put('/doctor/availability', null, { params: { available } }),
};

// Receptionist Services
export const receptionistService = {
  getDashboard: () => api.get('/receptionist/dashboard'),
  getQueue: () => api.get('/receptionist/queue'),
  registerWalkin: (data) => api.post('/receptionist/register-walkin', data),
};

// Nurse Services
export const nurseService = {
  getDashboard: () => api.get('/nurse/dashboard'),
  getBeds: () => api.get('/nurse/beds'),
  updateBedStatus: (bedId, status, assignedPatientName = '') =>
    api.put(`/nurse/beds/${bedId}/status`, null, { params: { status, assignedPatientName } }),
};

// Public directory & routing services
export const publicService = {
  getDepartments: () => api.get('/departments'),
  getDoctors: () => api.get('/doctors'),
  getAvailableDoctors: () => api.get('/doctors/available'),
  getDoctorsByDepartment: (dept) => api.get(`/doctors/department/${encodeURIComponent(dept)}`),
  getQueueStatus: (token) => api.get(`/queue/status/${token}`),
  routeSymptoms: (data) => api.post('/ai/route', data),
};

export default api;

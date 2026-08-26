const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ message: `HTTP Error ${res.status}` }));
      throw new Error(errBody.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // AI Symptom Routing
  getDepartmentRecommendation: async (text, context = {}) => {
    return request("/ai/route", {
      method: "POST",
      body: JSON.stringify({ text, context }),
    });
  },

  // Patient Registration & Token Generation
  registerPatient: async (payload) => {
    return request("/patient/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Queue Status Polling
  getQueueStatus: async (token) => {
    return request(`/queue/status/${token}`);
  },

  // Doctors & Department Directories
  getDepartments: async () => {
    return request("/departments");
  },

  getDoctorsByDepartment: async (dept) => {
    return request(`/doctors/department/${encodeURIComponent(dept)}`);
  },

  getAvailableDoctors: async () => {
    return request("/doctors/available");
  },

  getAllDoctors: async () => {
    return request("/doctors");
  },

  getDashboardStats: async () => {
    return request("/admin/dashboard-stats");
  },
};

export default api;

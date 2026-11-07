import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token or user header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('getdone_token');
    const storedUser = localStorage.getItem('getdone_user');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        config.headers['x-user-id'] = u.id;
        config.headers['x-user-role'] = u.role;
        config.headers['x-user-email'] = u.email;
      } catch (e) {}
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get('/auth/users');
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const projectAPI = {
  getProjects: async (params) => {
    const res = await api.get('/projects', { params });
    return res.data;
  },
  getProjectById: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },
  createProject: async (data) => {
    const res = await api.post('/projects', data);
    return res.data;
  },
  updateProject: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },
  tempDelete: async (id) => {
    const res = await api.patch(`/projects/${id}/temp-delete`);
    return res.data;
  },
  restore: async (id) => {
    const res = await api.patch(`/projects/${id}/restore`);
    return res.data;
  },
  permanentDelete: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
  getTrash: async () => {
    const res = await api.get('/projects/trash');
    return res.data;
  },
};

export const statsAPI = {
  getStats: async () => {
    const res = await api.get('/stats');
    return res.data;
  },
};

export default api;


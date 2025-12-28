import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authApi = {
  sendCode: (phone: string) => api.post('/auth/send-code', { phone }),
  verify: (tempToken: string, code: string) => api.post('/auth/verify', { tempToken, code }),
  me: () => api.get('/auth/me'),
};

// Folders
export const foldersApi = {
  list: (parentId?: string | null) => api.get('/folders', { params: { parentId } }),
  tree: () => api.get('/folders/tree'),
  get: (id: string) => api.get(`/folders/${id}`),
  create: (name: string, parentId?: string) => api.post('/folders', { name, parentId }),
  update: (id: string, name: string) => api.patch(`/folders/${id}`, { name }),
  move: (id: string, parentId?: string | null) => api.patch(`/folders/${id}/move`, { parentId }),
  delete: (id: string) => api.delete(`/folders/${id}`),
};

// Files
export const filesApi = {
  list: (folderId?: string | null) => api.get('/files', { params: { folderId } }),
  get: (id: string) => api.get(`/files/${id}`),
  search: (q: string) => api.get('/files/search', { params: { q } }),
  upload: (file: File, folderId?: string, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  },
  download: (id: string) => api.get(`/files/${id}/download`, { responseType: 'blob' }),
  move: (id: string, folderId?: string | null) => api.patch(`/files/${id}/move`, { folderId }),
  rename: (id: string, name: string) => api.patch(`/files/${id}/rename`, { name }),
  delete: (id: string) => api.delete(`/files/${id}`),
};

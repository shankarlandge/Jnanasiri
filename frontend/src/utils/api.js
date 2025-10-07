import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if not already on login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Use timeout to prevent immediate redirect loops
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 100);
      }
    }
    
    // Return standardized error format
    return Promise.reject({
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    });
  }
);

// Auth API
export const authAPI = {
  // Admin login
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  
  // Student login
  studentLogin: (credentials) => api.post('/auth/student/login', credentials),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Change password
  changePassword: (data) => api.put('/auth/change-password', data),
  
  // Update profile
  updateProfile: (data) => api.put('/auth/profile', data),
  
  // Get auth stats (admin only)
  getAuthStats: () => api.get('/auth/stats'),
};

// Admission API
export const admissionAPI = {
  // Submit admission form
  submit: (formData) => api.post('/admission/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Get admission status by email
  getStatus: (email) => api.get(`/admission/status/${email}`),
  
  // Get full admission application by email (for editing)
  getApplication: (email) => api.get(`/admission/application/${email}`),
  
  // Update admission application
  updateApplication: (email, formData) => api.put(`/admission/update/${email}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Get admission statistics
  getStats: () => api.get('/admission/stats'),
  
  // Validate admission data
  validate: (data) => api.post('/admission/validate', data),
};

// Admin API
export const adminAPI = {
  // Get all admissions
  getAdmissions: (params) => api.get('/admin/admissions', { params }),
  
  // Get single admission
  getAdmission: (id) => api.get(`/admin/admissions/${id}`),
  
  // Process admission (accept/reject)
  processAdmission: (data) => api.post('/admin/admissions/process', data),
  
  // Get all students
  getStudents: (params) => api.get('/admin/students', { params }),
  
  // Get single student
  getStudent: (studentId) => api.get(`/admin/students/${studentId}`),
  
  // Toggle student status
  toggleStudentStatus: (studentId) => api.patch(`/admin/students/${studentId}/toggle-status`),
  
  // Send credentials to student
  sendStudentCredentials: (studentId) => api.post(`/admin/students/${studentId}/send-credentials`),
  
  // Update student information
  updateStudent: (studentId, data) => api.put(`/admin/students/${studentId}`, data),
  
  // Delete student
  deleteStudent: (studentId) => api.delete(`/admin/students/${studentId}`),
  
  // Add new student
  addStudent: (data) => api.post('/admin/students', data),
  
  // Get dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Delete admission
  deleteAdmission: (id) => api.delete(`/admin/admissions/${id}`),
  
  // Gallery methods
  getGalleryImages: (params) => api.get('/gallery/admin', { params }),
  uploadGalleryImages: (formData) => api.post('/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateGalleryImage: (id, data) => api.put(`/gallery/${id}`, data),
  deleteGalleryImage: (id) => api.delete(`/gallery/${id}`),
  deleteGalleryImages: (imageIds) => api.delete('/gallery/bulk', { data: { imageIds } }),
  getGalleryStats: () => api.get('/gallery/admin/stats'),
};

// Student API
export const studentAPI = {
  // Get profile
  getProfile: () => api.get('/student/profile'),
  
  // Update profile
  updateProfile: (data) => api.put('/student/profile', data),
  
  // Upload profile photo
  uploadPhoto: (formData) => api.put('/student/profile/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Change password
  changePassword: (data) => api.put('/student/change-password', data),
  
  // Update notification settings
  updateNotificationSettings: (data) => api.put('/student/notification-settings', data),
  
  // Update privacy settings
  updatePrivacySettings: (data) => api.put('/student/privacy-settings', data),
  
  // Update profile photo
  updatePhoto: (formData) => api.put('/student/profile/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Get ID card data
  getIdCardData: () => api.get('/student/id-card'),
  
  // Get dashboard stats
  getDashboardStats: () => api.get('/student/dashboard/stats'),
  
  // Get student by ID
  getById: (studentId) => api.get(`/student/${studentId}`),
};

// Public API
export const publicAPI = {
  // Submit contact form
  submitContact: (data) => api.post('/public/contact', data),
  
  // Get institute info
  getInstituteInfo: () => api.get('/public/institute-info'),
  
  // Get gallery images
  getGallery: (params) => api.get('/public/gallery', { params }),
  
  // Get news and announcements
  getNews: () => api.get('/public/news'),
  
  // Admin: Get contact messages
  getContacts: (params) => api.get('/public/admin/contacts', { params }),
  
  // Admin: Get single contact
  getContact: (id) => api.get(`/public/admin/contacts/${id}`),
  
  // Admin: Respond to contact
  respondToContact: (id, data) => api.post(`/public/admin/contacts/${id}/respond`, data),
  
  // Admin: Update contact status
  updateContactStatus: (id, data) => api.patch(`/public/admin/contacts/${id}/status`, data),
};

// Notification API
export const notificationAPI = {
  // Get all notifications
  getNotifications: (page = 1, limit = 10) => 
    api.get(`/notifications?page=${page}&limit=${limit}`),
  
  // Mark notification as read
  markAsRead: (id) => 
    api.patch(`/notifications/${id}/read`),
  
  // Mark all notifications as read
  markAllAsRead: () => 
    api.patch('/notifications/mark-all-read'),
  
  // Delete notification
  deleteNotification: (id) => 
    api.delete(`/notifications/${id}`),
  
  // Get unread count
  getUnreadCount: () => 
    api.get('/notifications/unread-count')
};

export const ticketAPI = {
  // Get all tickets (Admin only)
  getAllTickets: (params = {}) => 
    api.get('/tickets', { params }),
  
  // Get tickets for current user
  getMyTickets: (params = {}) => 
    api.get('/tickets/my-tickets', { params }),
  
  // Get single ticket
  getTicket: (id) => 
    api.get(`/tickets/${id}`),
  
  // Create new ticket
  createTicket: (ticketData) => 
    api.post('/tickets', ticketData),
  
  // Update ticket status (Admin only)
  updateTicketStatus: (id, status) => 
    api.patch(`/tickets/${id}/status`, { status }),
  
  // Add response to ticket
  addResponse: (id, message) => 
    api.post(`/tickets/${id}/responses`, { message }),
  
  // Assign ticket (Admin only)
  assignTicket: (id, assignedTo) => 
    api.patch(`/tickets/${id}/assign`, { assignedTo }),
  
  // Get ticket statistics (Admin only)
  getTicketStats: () => 
    api.get('/tickets/stats/summary')
};

// Settings API
export const settingsAPI = {
  // Get system settings (Admin only)
  getSettings: () => 
    api.get('/admin/settings'),
  
  // Update system settings (Admin only)
  updateSettings: (settingsData) => 
    api.put('/admin/settings', settingsData)
};

export default api;

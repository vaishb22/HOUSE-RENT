import api from './api';

// User Services
export const userService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwords) => api.put('/users/change-password', passwords),
  getAllUsers: () => api.get('/users/all'),
  getUserById: (id) => api.get(`/users/${id}`),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Property Services
export const propertyService = {
  getAllProperties: (filters) => api.get('/properties', { params: filters }),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (propertyData) => api.post('/properties', propertyData),
  updateProperty: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getUserProperties: (userId) => api.get(`/properties/user/${userId}`),
  addReview: (id, reviewData) => api.post(`/properties/${id}/reviews`, reviewData),
  getPendingProperties: () => api.get('/properties/admin/pending'),
  approveProperty: (id) => api.put(`/properties/admin/approve/${id}`),
  rejectProperty: (id) => api.put(`/properties/admin/reject/${id}`),
};

// Booking Services
export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getAllBookings: () => api.get('/bookings'),
  getUserBookings: () => api.get('/bookings/user'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus) => api.put(`/bookings/${id}/payment`, { paymentStatus }),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  getBookingStats: () => api.get('/bookings/admin/stats'),
};

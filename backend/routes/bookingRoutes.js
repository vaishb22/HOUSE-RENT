const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Protected routes
router.post('/', verifyToken, bookingController.createBooking);
router.get('/user', verifyToken, bookingController.getUserBookings);
router.get('/:id', verifyToken, bookingController.getBookingById);
router.put('/:id/status', verifyToken, bookingController.updateBookingStatus);
router.put('/:id/payment', verifyToken, bookingController.updatePaymentStatus);
router.put('/:id/cancel', verifyToken, bookingController.cancelBooking);

// Admin routes
router.get('/', verifyToken, isAdmin, bookingController.getAllBookings);
router.delete('/:id', verifyToken, isAdmin, bookingController.deleteBooking);
router.get('/admin/stats', verifyToken, isAdmin, bookingController.getBookingStats);

module.exports = router;

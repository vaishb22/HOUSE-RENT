const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes
router.post('/', verifyToken, propertyController.createProperty);
router.put('/:id', verifyToken, propertyController.updateProperty);
router.delete('/:id', verifyToken, propertyController.deleteProperty);
router.get('/user/:userId', propertyController.getUserProperties);
router.post('/:id/reviews', verifyToken, propertyController.addReview);

// Admin routes
router.get('/admin/pending', verifyToken, isAdmin, propertyController.getPendingProperties);
router.put('/admin/approve/:id', verifyToken, isAdmin, propertyController.approveProperty);
router.put('/admin/reject/:id', verifyToken, isAdmin, propertyController.rejectProperty);

module.exports = router;

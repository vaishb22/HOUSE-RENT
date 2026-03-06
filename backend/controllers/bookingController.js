const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate } = req.body;

    // Validate input
    if (!propertyId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check property availability
    if (!property.isAvailable) {
      return res.status(400).json({ message: 'Property is not available' });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Invalid dates. Check-out must be after check-in' });
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Property is already booked for selected dates' });
    }

    // Calculate total price
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * days;

    // Create booking
    const booking = new Booking({
      property: propertyId,
      tenant: req.userId,
      landlord: property.owner,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Awaiting landlord confirmation.',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title address city price')
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User's Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ tenant: req.userId }, { landlord: req.userId }],
    })
      .populate('property', 'title address city price images')
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property')
      .populate('tenant', 'name email phone address')
      .populate('landlord', 'name email phone address');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (
      booking.tenant._id.toString() !== req.userId &&
      booking.landlord._id.toString() !== req.userId &&
      req.userRole !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Booking Status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide a status' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized
    if (
      booking.landlord.toString() !== req.userId &&
      booking.tenant.toString() !== req.userId &&
      req.userRole !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ message: 'Please provide a payment status' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized - tenant can pay, landlord/admin can update
    if (
      booking.tenant.toString() !== req.userId &&
      booking.landlord.toString() !== req.userId &&
      req.userRole !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update payment' });
    }

    booking.paymentStatus = paymentStatus;
    
    // If payment is successful, auto-confirm the booking
    if (paymentStatus === 'paid') {
      booking.status = 'confirmed';
    }
    
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized
    if (
      booking.tenant.toString() !== req.userId &&
      booking.landlord.toString() !== req.userId &&
      req.userRole !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete bookings' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Booking Statistics (Admin)
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

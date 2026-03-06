const Property = require('../models/Property');

// Create Property
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      propertyCategory,
      type,
      adType,
      bedrooms,
      bathrooms,
      squareFeet,
      address,
      city,
      state,
      zipCode,
      amenities,
      images,
      petFriendly,
      furnished,
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !type || !address || !city || !state || !zipCode) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const property = new Property({
      title,
      description,
      price,
      propertyCategory: propertyCategory || 'Residential',
      type,
      adType: adType || 'Rent',
      bedrooms,
      bathrooms,
      squareFeet,
      address,
      city,
      state,
      zipCode,
      amenities: amenities || [],
      images: images || [],
      owner: req.userId,
      petFriendly: petFriendly || false,
      furnished: furnished || false,
      isApproved: false,
    });

    await property.save();

    res.status(201).json({
      success: true,
      message: 'Property created successfully. Awaiting admin approval.',
      property,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Properties (Public - approved only)
exports.getAllProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, bathrooms } = req.query;

    // In production only show approved properties. In development allow pending for easier testing.
    let filter = { isAvailable: true };

    if (process.env.NODE_ENV === 'production') {
      filter.isApproved = true;
    }

    if (city) filter.city = { $regex: city, $options: 'i' };
    
    // Filter by property type
    if (type) filter.type = { $regex: `^${type}$`, $options: 'i' };
    
    if (minPrice || maxPrice) {
      filter.price = {};
      const cleanNumber = (val) => {
        if (val === undefined || val === null) return null;
        if (typeof val === 'number') return val;
        const digits = String(val).replace(/[^0-9]/g, '');
        return digits === '' ? null : parseInt(digits, 10);
      };

      const min = cleanNumber(minPrice);
      const max = cleanNumber(maxPrice);

      if (min !== null) filter.price.$gte = min;
      if (max !== null) filter.price.$lte = max;
    }
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: parseInt(bathrooms) };

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone address')
      .populate('reviews.user', 'name profileImage');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User's Properties
exports.getUserProperties = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const properties = await Property.find({ owner: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve Property (Admin only)
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Property approved successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject Property (Admin only)
exports.rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Property rejected and deleted',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Pending Properties (Admin only)
exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isApproved: false })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Please provide a valid rating (1-5)' });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const review = {
      user: req.userId,
      rating,
      comment: comment || '',
      createdAt: new Date(),
    };

    property.reviews.push(review);

    // Recalculate average rating
    const totalRating = property.reviews.reduce((sum, r) => sum + r.rating, 0);
    property.rating = (totalRating / property.reviews.length).toFixed(1);

    await property.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a rental price'],
    },
    // Property Type: Residential, Commercial, Land/Plot, New
    propertyCategory: {
      type: String,
      enum: ['Residential', 'Commercial', 'Land/Plot', 'New'],
      default: 'Residential',
    },
    // Property Sub-type: apartment, house, studio, etc.
    type: {
      type: String,
      enum: ['apartment', 'house', 'studio', 'condo', 'townhouse', 'villa', 'penthouse', 'land', 'plot', 'building', 'office', 'shop'],
      default: 'apartment',
    },
    // Ad Type: Rent, Resale, PG/Hostel, Flatmates
    adType: {
      type: String,
      enum: ['Rent', 'Resale', 'PG/Hostel', 'Flatmates'],
      default: 'Rent',
    },
    bedrooms: {
      type: Number,
      default: 1,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 0,
    },
    squareFeet: {
      type: Number,
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    petFriendly: {
      type: Boolean,
      default: false,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);

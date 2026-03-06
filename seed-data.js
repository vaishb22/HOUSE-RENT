const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

// Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'landlord', 'admin'], default: 'user' },
  phone: String,
  address: String,
  profileImage: String,
  createdAt: { type: Date, default: Date.now }
});

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  type: String,
  bedrooms: Number,
  bathrooms: Number,
  squareFeet: Number,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  amenities: [String],
  images: [String],
  owner: mongoose.Schema.Types.ObjectId,
  isApproved: Boolean,
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: [Object],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Property = mongoose.model('Property', PropertySchema);

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/househunt');
    console.log('Connected to MongoDB');

    // Clear existing test data
    await User.deleteMany({ email: 'owner@test.com' });
    console.log('Cleared existing test user');

    // Create test user
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    const user = await User.create({
      name: 'John Property Owner',
      email: 'owner@test.com',
      password: hashedPassword,
      role: 'landlord',
      phone: '9876543210',
      address: 'Pune, Maharashtra'
    });
    console.log('User created:', user._id);

    // Create test properties
    const properties = [
      {
        title: 'Luxury Apartment in Pune',
        description: 'Beautiful 2 BHK apartment with modern amenities in the heart of Pune city center.',
        price: 15000,
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        address: '123 MG Road',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001',
        amenities: ['WiFi', 'Parking', 'Gym', 'Security'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'],
        owner: user._id,
        isApproved: true
      },
      {
        title: 'Cozy Studio Apartment',
        description: 'Perfect for singles or couples. Studio apartment with kitchen and modern bathroom.',
        price: 8000,
        type: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 600,
        address: '456 Baner Road',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411045',
        amenities: ['WiFi', 'Security'],
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'],
        owner: user._id,
        isApproved: true
      },
      {
        title: 'Spacious House with Garden',
        description: '3 BHK independent house with large garden and parking for 2 cars.',
        price: 25000,
        type: 'house',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2000,
        address: '789 Viman Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411014',
        amenities: ['Parking', 'Garden', 'Security', 'Water Tank'],
        images: ['https://images.unsplash.com/photo-1570129477492-45c003ed2214?w=600'],
        owner: user._id,
        isApproved: true
      },
      {
        title: 'Modern Condo with Pool',
        description: 'Premium 2 BHK condo with swimming pool and gym facilities.',
        price: 18000,
        type: 'condo',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1400,
        address: '321 Kondwa Road',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '412308',
        amenities: ['WiFi', 'Pool', 'Gym', 'Parking', 'Security'],
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'],
        owner: user._id,
        isApproved: true
      },
      {
        title: 'Budget Friendly Apartment',
        description: 'Affordable 1 BHK apartment ideal for students or first-time renters.',
        price: 6000,
        type: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 500,
        address: '654 Kalyani Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411006',
        amenities: ['Security'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'],
        owner: user._id,
        isApproved: true
      },
      {
        title: 'Premium 3 BHK Penthouse',
        description: 'Luxury penthouse with panoramic city views and modern interiors.',
        price: 35000,
        type: 'apartment',
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 2500,
        address: '999 Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001',
        amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Elevator', 'Concierge'],
        images: ['https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600'],
        owner: user._id,
        isApproved: true
      }
    ];

    const createdProps = await Property.insertMany(properties);
    console.log(`${createdProps.length} properties created successfully!`);
    
    // Display property details
    createdProps.forEach(prop => {
      console.log(`- ${prop.title} (₹${prop.price}/mo) - ${prop.bedrooms} BHK`);
    });

    await mongoose.disconnect();
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

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
    await Property.deleteMany();
    console.log('Cleared existing test data');

    // Create an admin user if not present
    const adminEmail = 'admin@househunt.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedAdmin = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Site Administrator',
        email: adminEmail,
        password: hashedAdmin,
        role: 'admin',
        phone: '9999999999',
        address: 'Head Office'
      });
      console.log('Admin user created:', adminEmail, 'password Admin@123');
    } else {
      console.log('Admin user already exists:', adminEmail);
    }

    // Create multiple test users
    const owners = [];
    const ownerEmails = [
      { name: 'Raj Property Services', email: 'raj@properties.com' },
      { name: 'Mumbai Real Estate', email: 'mumbai@realestate.com' },
      { name: 'Bangalore Homes', email: 'bangalore@homes.com' }
    ];

    for (const ownerData of ownerEmails) {
      let user = await User.findOne({ email: ownerData.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash('Test@123', 10);
        user = await User.create({
          name: ownerData.name,
          email: ownerData.email,
          password: hashedPassword,
          role: 'landlord',
          phone: '9876543210',
          address: 'India'
        });
      }
      owners.push(user);
    }
    console.log(`${owners.length} test owners ready`);

    // Comprehensive property listings across India
    const properties = [
      // PUNE PROPERTIES
      {
        title: 'Luxury Apartment in MG Road, Pune',
        description: 'Beautiful 2 BHK apartment in prime location. Modern amenities, 24/7 security, power backup, and parking facilities. 5 minutes from shopping complex.',
        price: 15000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        address: '123 MG Road, Pune Downtown',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001',
        amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Power Backup', 'Water Tank'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
        ],
        owner: owners[0]._id,
        isApproved: true
      },
      {
        title: 'Cozy Studio in Baner Road',
        description: 'Perfect studio apartment for professionals. Fully furnished with kitchen, modern bathroom, and air conditioning. Near cafes and restaurants.',
        price: 8000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 600,
        address: '456 Baner Road, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411045',
        amenities: ['WiFi', 'Security', 'AC', 'Water Tank'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        owner: owners[0]._id,
        isApproved: true
      },
      {
        title: 'Spacious House with Garden - Viman Nagar',
        description: '3 BHK independent house with private garden, space for 2 cars, and independent entrance. Quiet residential area. Perfect for families.',
        price: 25000,
        propertyCategory: 'Residential',
        type: 'house',
        adType: 'Rent',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2000,
        address: '789 Viman Nagar, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411014',
        amenities: ['Parking', 'Garden', 'Security', 'Water Tank', 'Terrace'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003ed2214?w=800'
        ],
        owner: owners[0]._id,
        isApproved: true
      },
      {
        title: 'Modern Condo with Pool',
        description: 'Premium 2 BHK condo in gated community. Swimming pool, gym, security, and backup power. Monthly society charges included.',
        price: 18000,
        propertyCategory: 'Residential',
        type: 'condo',
        adType: 'Rent',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1400,
        address: '321 Kondwa Road, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '412308',
        amenities: ['WiFi', 'Pool', 'Gym', 'Parking', 'Security', 'Power Backup'],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        owner: owners[0]._id,
        isApproved: true
      },
      {
        title: 'Budget Friendly 1BHK - Kalyani Nagar',
        description: 'Affordable 1 BHK apartment ideal for students and professionals. Basic amenities and secure building. Close to market and transport.',
        price: 6000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 500,
        address: '654 Kalyani Nagar, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411006',
        amenities: ['Security', 'Water Tank'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
        ],
        owner: owners[0]._id,
        isApproved: true
      },
      {
        title: 'Premium Penthouse - Koregaon Park',
        description: 'Luxury 3 BHK penthouse with panoramic city views, modern interiors, and terrace. High-end furnishings and appliances included.',
        price: 35000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 2500,
        address: '999 Koregaon Park, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001',
        amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Elevator', 'Concierge', 'Terrace'],
        images: [
          'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800'
        ],
        owner: owners[0]._id,
        isApproved: true
      },

      // MUMBAI PROPERTIES
      {
        title: 'Beachfront Apartment - Bandra',
        description: 'Stunning 2 BHK apartment with sea view in prestigious Bandra locality. Modern amenities, 24/7 security, and concierge service.',
        price: 45000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1300,
        address: '123 Sea Shield Road, Bandra, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400050',
        amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Power Backup', 'Concierge', 'Sea View'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
        ],
        owner: owners[1]._id,
        isApproved: true
      },
      {
        title: 'Spacious 3BHK - Andheri West',
        description: 'Comfortable 3 BHK in residential area. Well-maintained building with gardens, parking, and security. 10 minutes from metro.',
        price: 32000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        address: '456 Link Road, Andheri West, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400053',
        amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Water Tank', 'Garden'],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        owner: owners[1]._id,
        isApproved: true
      },
      {
        title: 'Studio in Dadar - Budget Option',
        description: 'Compact studio apartment in central Mumbai. Good for professionals. Close to railways, restaurants, and shopping areas.',
        price: 12000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'PG/Hostel',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 550,
        address: '789 Dadar East, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400014',
        amenities: ['WiFi', 'Water Tank', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
        ],
        owner: owners[1]._id,
        isApproved: true
      },

      // BANGALORE PROPERTIES
      {
        title: 'Modern Apartment in Indiranagar',
        description: 'Trendy 2 BHK in tech hub with co-working space nearby. Swimming pool, gym, and security. Excellent connectivity.',
        price: 22000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        address: '321 100ft Road, Indiranagar, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560038',
        amenities: ['WiFi', 'Parking', 'Gym', 'Pool', 'Security', 'Power Backup'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        owner: owners[2]._id,
        isApproved: true
      },
      {
        title: 'Luxury Villa - Whitefield',
        description: '4 BHK villa with private pool and garden. Gated community with 24/7 security. Premium fitness and recreation facilities.',
        price: 55000,
        propertyCategory: 'Residential',
        type: 'villa',
        adType: 'Rent',
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 3500,
        address: '654 Sarjapur Road, Whitefield, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560066',
        amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Security', 'Garden', 'Terrace'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003ed2214?w=800'
        ],
        owner: owners[2]._id,
        isApproved: true
      },
      {
        title: 'Affordable 1BHK - Marathahalli',
        description: 'Budget-friendly 1 BHK in popular Marathahalli. Close to metro, shopping, and restaurants. Secure and maintained building.',
        price: 10000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 550,
        address: '999 Old No.83, Marathahalli, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560037',
        amenities: ['WiFi', 'Security', 'Water Tank'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
        ],
        owner: owners[2]._id,
        isApproved: true
      },
      {
        title: 'Executive Apartment - Koramangala',
        description: 'Premium 2 BHK in trendy Koramangala. Rooftop garden, co-working space, and high-speed WiFi. Perfect for IT professionals.',
        price: 28000,
        propertyCategory: 'Residential',
        type: 'apartment',
        adType: 'Rent',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1400,
        address: '111 5th Block, Koramangala, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560034',
        amenities: ['WiFi', 'Parking', 'Gym', 'Rooftop', 'Security', 'Co-Working'],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        owner: owners[2]._id,
        isApproved: true
      },
      // Commercial Property
      {
        title: 'Prime Office Space - BKC Mumbai',
        description: 'Premium commercial office space in Bandra Kurla Complex. Fully furnished, IT infrastructure, and 24/7 access.',
        price: 150000,
        propertyCategory: 'Commercial',
        type: 'office',
        adType: 'Rent',
        bedrooms: 0,
        bathrooms: 2,
        squareFeet: 2500,
        address: 'BKC Road, Bandra East, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400051',
        amenities: ['WiFi', 'Power Backup', 'Security', 'Parking', 'AC', 'Reception'],
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
        ],
        owner: owners[1]._id,
        isApproved: true
      },
      // Land/Plot Property
      {
        title: 'Residential Plot - Electronic City',
        description: 'Prime residential plot in Electronic City. Clear title, BDA approved layout, near IT hubs.',
        price: 4500000,
        propertyCategory: 'Land/Plot',
        type: 'plot',
        adType: 'Resale',
        bedrooms: 0,
        bathrooms: 0,
        squareFeet: 2400,
        address: 'Electronic City Phase 2, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560100',
        amenities: ['Electricity', 'Water', 'Road Access'],
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
        ],
        owner: owners[2]._id,
        isApproved: true
      }
    ];

    const createdProps = await Property.insertMany(properties);
    console.log(`${createdProps.length} properties created successfully!`);
    
    // Display property details
    console.log('\n📍 Properties by City:');
    const cityCounts = {};
    createdProps.forEach(prop => {
      if (!cityCounts[prop.city]) cityCounts[prop.city] = 0;
      cityCounts[prop.city]++;
      console.log(`  📌 ${prop.title} (₹${prop.price}/mo)`);
    });

    console.log('\n📊 Summary:');
    Object.entries(cityCounts).forEach(([city, count]) => {
      console.log(`  ${city}: ${count} properties`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

# HouseHunt - House Rental Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing house rentals. This platform allows users to browse properties, post listings, and manage bookings through an interactive interface.

## Features

### For Tenants
- Browse and search rental properties with advanced filters
- View detailed property information with images and reviews
- Book properties with date selection
- Leave reviews and ratings for properties
- Manage bookings and track payment status
- Edit personal profile

### For Landlords
- Post property listings with detailed information
- Manage property listings and availability
- Receive and respond to booking requests
- Track payment status for bookings
- View property reviews and ratings
- Admin dashboard with analytics

### Admin Features
- Approve/reject property listings
- Manage user accounts
- View booking statistics and revenue
- Monitor platform activity

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router for navigation
- Bootstrap 5 for styling
- Axios for API calls
- React Context API for state management

## Project Structure

```
HouseHunt/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── propertyController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── propertyRoutes.js
│   │   └── bookingRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   ├── PropertyCard.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── Properties.js
│   │   │   ├── PropertyDetail.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AddProperty.js
│   │   │   └── AdminPanel.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── services.js
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Navigation.css
│   │   │   ├── Profile.css
│   │   │   ├── PropertyCard.css
│   │   │   ├── PropertyDetail.css
│   │   │   ├── Dashboard.css
│   │   │   ├── AddProperty.css
│   │   │   ├── AdminPanel.css
│   │   │   └── Home.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/househunt
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `PUT /api/users/change-password` - Change password (protected)
- `GET /api/users/all` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user (admin only)

### Properties
- `GET /api/properties` - Get all approved properties
- `POST /api/properties` - Create new property (protected)
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)
- `GET /api/properties/user/:userId` - Get user's properties
- `POST /api/properties/:id/reviews` - Add review (protected)
- `GET /api/properties/admin/pending` - Get pending properties (admin)
- `PUT /api/properties/admin/approve/:id` - Approve property (admin)
- `PUT /api/properties/admin/reject/:id` - Reject property (admin)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/user` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get booking details (protected)
- `PUT /api/bookings/:id/status` - Update booking status (protected)
- `PUT /api/bookings/:id/payment` - Update payment status (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)
- `GET /api/bookings` - Get all bookings (admin)
- `DELETE /api/bookings/:id` - Delete booking (admin)
- `GET /api/bookings/admin/stats` - Get booking statistics (admin)

## Usage

### For Tenants
1. Register an account or login
2. Browse properties using filters
3. View property details and reviews
4. Book a property with check-in/check-out dates
5. Track bookings from dashboard
6. Leave reviews for properties

### For Landlords
1. Register as a landlord
2. Post property listings with details
3. Wait for admin approval
4. View booking requests
5. Update payment status
6. Monitor property performance

### For Admins
1. Login with admin credentials
2. Access admin panel from navigation
3. Approve/reject pending properties
4. Manage user accounts
5. View booking statistics and revenue

## Database Schema

### User
- name (String)
- email (String, unique)
- password (String, hashed)
- phone (String)
- address (String)
- city (String)
- state (String)
- zipCode (String)
- role (String: 'user' or 'admin')
- isActive (Boolean)
- profileImage (String)
- timestamps

### Property
- title (String)
- description (String)
- price (Number)
- type (String: 'apartment', 'house', 'studio', 'condo', 'townhouse')
- bedrooms (Number)
- bathrooms (Number)
- squareFeet (Number)
- address (String)
- city (String)
- state (String)
- zipCode (String)
- amenities (Array)
- images (Array)
- owner (ObjectId - User)
- isApproved (Boolean)
- isAvailable (Boolean)
- petFriendly (Boolean)
- furnished (Boolean)
- rating (Number)
- reviews (Array)
- timestamps

### Booking
- property (ObjectId - Property)
- tenant (ObjectId - User)
- landlord (ObjectId - User)
- checkInDate (Date)
- checkOutDate (Date)
- totalPrice (Number)
- status (String: 'pending', 'confirmed', 'completed', 'cancelled')
- paymentStatus (String: 'unpaid', 'paid', 'partial')
- notes (String)
- timestamps

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected routes
- CORS configuration
- Input validation
- Secure token management

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Email notifications
- Virtual property tours
- Advanced analytics
- User messaging system
- Property availability calendar
- Mobile app version
- Map integration
- Advanced search with AI
- Rental agreements generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, email support@househunt.com or create an issue in the repository.

## Authors

- Development Team - Full Stack Development
- Year: 2026

---

**HouseHunt** - Making home rental simple and secure for everyone.

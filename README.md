# 🚗 ParkEase – Smart Parking Management System (MERN Stack)

ParkEase is a full-stack Smart Parking Management System built using the MERN stack.
It provides role-based authentication, parking slot booking, admin & user dashboards,
and a modern UI.

This project is developed as part of an Infosys Internship Project.

---

## 📌 Features Overview

### 🔐 Authentication (Completed)
- Role-based authentication using JWT
- Secure login & registration
- Roles: Admin, User
- Password hashing with bcrypt
- Protected routes (frontend & backend)

### 👤 User Features
- User registration & login
- User dashboard UI
- Active parking session view
- Parking history
- Vehicle management (backend ready)

### 🧑‍💼 Admin Features
- Admin login
- Admin dashboard UI
- View bookings & revenue
- Slot & user management (backend ready)

### 💰 Pricing Logic
- Base charge: ₹19
- Additional charge: ₹50 per hour
- Calculated on slot release

---

## 🏗️ Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- Custom CSS

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT

---

## 📁 Project Structure

ParkEase/
├── backend/
├── frontend/
└── README.md

---

## ⚙️ Backend Setup

1. Install dependencies
```bash
cd backend
npm install
```

2. Create `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret
```

3. Run backend
```bash
npm run dev
```

---

## ⚙️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

---

## 🔗 API Endpoints

## 🔐 AUTHENTICATION
POST   /api/auth/register
POST   /api/auth/login

## 👤 USER SETTINGS
GET    /api/settings/me
PUT    /api/settings/profile
PUT    /api/settings/password

## 🚗 VEHICLE MANAGEMENT
POST   /api/vehicles
GET    /api/vehicles/my

## 🅿️ PARKING AREAS
POST   /api/parking-areas           (admin)
GET    /api/parking-areas           (user)

## 🧱 SLOT MANAGEMENT
POST   /api/slots/bulk-create                       (admin)
GET    /api/slots/by-parking/:areaId                (user)
DELETE /api/slots/by-parking/:areaId                (admin)
PUT    /api/slots/:slotId/type                      (admin)


**Slot Types:**

NORMAL | EV | HANDICAPPED

## 🎟️ BOOKINGS
POST   /api/bookings/book
GET    /api/bookings/my
POST   /api/bookings/release

## 💳 PAYMENTS
POST   /api/payment/create-order    (Razorpay – test mode)

## 🧾 INVOICES
GET    /api/invoices/user/:bookingId
GET    /api/invoices/admin/:bookingId

## ⚙️ ADMIN SETTINGS (PRICING)
GET    /api/settings/pricing        (admin)
PUT    /api/settings/pricing        (admin)

## 📊 ANALYTICS
GET    /api/analytics/admin
GET    /api/analytics/user

---
# Admin Dashboard - Parking Management System

## Overview
A comprehensive admin dashboard for managing parking companies, parking areas, and parking slots with real-time visualization and analytics.

## Features Implemented

### 1. **Enhanced Admin Dashboard** (`/admin`)
- Real-time statistics cards showing:
  - Total Parking Areas
  - Total Slots
  - Active Sessions
  - Total Revenue
- Live occupancy chart with beautiful area graph
- Quick stats grid with key metrics
- Recent activity feed
- Modern dark theme UI with smooth animations

### 2. **Company Management** (`/admin/companies`)
- Register new parking companies
- View all registered companies
- Display company details:
  - Company name and registration number
  - Contact information (email, phone)
  - Address
  - Company admin details
  - Status badges (ACTIVE/INACTIVE)
- Responsive grid layout

### 3. **Parking Areas Management** (`/admin/parking-areas`)
- **List View**:
  - Display all parking areas in a grid
  - Show layout type, floors, pricing
  - Status indicators (ACTIVE/INACTIVE/UNDER_MAINTENANCE)
  - Quick actions: Manage Slots, Make Live, Edit, Delete
  
- **Create Parking Area** (`/admin/parking-areas/create`):
  - Company selection dropdown
  - Basic information (name, address)
  - Layout configuration:
    - Layout type (Rectangular/Circular/Custom)
    - Number of floors
    - Pricing (base price, hourly rate)
  - Amenities selection (CCTV, Security, EV Charging, etc.)
  - Interactive map for location selection
  - Real-time coordinate display

### 4. **Slot Management** (`/admin/parking-areas/:areaId/slots`)
- **Visual Grid Layout**:
  - Display slots in a 2D grid matching actual parking layout
  - Color-coded slots by status and type:
    - Green: Available
    - Red: Booked
    - Yellow: Under Maintenance
    - Cyan: EV Charging
    - Purple: Handicapped
    - Orange: Reserved

- **Bulk Operations**:
  - Bulk create slots with custom grid dimensions
  - Select multiple slots for batch updates
  - Change status (Available/Maintenance)
  - Change type (Normal/EV/Handicapped/Reserved)

- **Floor Navigation**:
  - Easy floor selector dropdown
  - View and manage slots floor by floor

- **Slot Creation Modal**:
  - Configure rows and columns
  - Set starting letter for slot numbering
  - Choose default slot type
  - Preview total slots to be created

## Tech Stack
- **Frontend**: React 19 with Vite
- **Routing**: React Router v7
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with CSS Variables

## Color Palette
```css
--primary: #006AFF (Blue)
--success: #10B981 (Green)
--warning: #F59E0B (Orange)
--danger: #EF4444 (Red)
--background: #0F1419 (Dark)
--card: #161B22 (Dark Gray)
--border: #30363D (Border Gray)
--text: #F0F6FC (Light)
--textDim: #8B949E (Dimmed)
```

## Design Features
- **Modern Dark Theme**: Professional dark UI matching the reference design
- **Glassmorphic Cards**: Subtle borders and elevated cards
- **Smooth Animations**: Hover effects, transitions, and transforms
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Visual Feedback**: Color-coded status indicators
- **Interactive Elements**: Click-to-select slots, drag-free map interaction

## API Endpoints Used

### Companies
- `GET /api/companies` - List all companies
- `POST /api/companies/register` - Register new company

### Parking Areas
- `GET /api/parking-areas` - List all parking areas
- `POST /api/parking-areas` - Create new parking area
- `GET /api/parking-areas/:id` - Get parking area details
- `PATCH /api/parking-areas/:id/make-live` - Activate parking area
- `DELETE /api/parking-areas/:id` - Delete parking area

### Slots
- `POST /api/slots/bulk-create` - Bulk create slots
- `GET /api/slots/by-parking/:parkingAreaId?floor=X` - Get slots by parking area and floor
- `PUT /api/slots/:slotId` - Update single slot
- `PATCH /api/slots/bulk-update-status` - Bulk update slot status

### Admin Stats
- `GET /api/admin/stats` - Get dashboard statistics

## Navigation Structure
```
Admin Dashboard
├── Dashboard (/)
├── Companies (/admin/companies)
├── Parking Areas (/admin/parking-areas)
│   ├── Create (/admin/parking-areas/create)
│   └── Manage Slots (/admin/parking-areas/:id/slots)
├── Manage Slots (/admin/slots)
├── Live Sessions (/admin/live-sessions)
├── Reports (/admin/reports)
└── Back to Home (/)
```

## Workflow

### 1. Register a Company
1. Navigate to Companies page
2. Click "Register Company"
3. Fill in company details
4. Submit to create company

### 2. Create Parking Area
1. Navigate to Parking Areas
2. Click "Create Parking Area"
3. Select company from dropdown
4. Enter parking area details
5. Configure layout (type, floors, pricing)
6. Select amenities
7. Click on map to set location
8. Submit to create parking area

### 3. Create Parking Layout & Slots
1. From Parking Areas, click "Manage Slots" on a parking area
2. Click "Bulk Create Slots"
3. Select floor
4. Set grid dimensions (rows x columns)
5. Choose slot type and starting letter
6. Preview slot count
7. Create slots

### 4. Manage Slots
1. Navigate to slot management page
2. Switch between floors using floor selector
3. Click individual slots to select them
4. Use bulk actions to:
   - Set slots to maintenance
   - Change slot types
   - Mark as available
5. Visual grid updates in real-time

### 5. Make Parking Area Live
1. After creating slots, return to Parking Areas
2. Click "Make Live" on the parking area
3. Area status changes to ACTIVE
4. Now visible to users in the app

## Key Features Highlights

### Visual Slot Grid
- Real 2D grid representation of parking layout
- Intuitive drag-free selection
- Color-coded status visualization
- Empty spaces shown with dashed borders
- Responsive grid sizing

### Interactive Map
- Click-to-place marker for parking location
- Real-time coordinate display
- OpenStreetMap integration
- Smooth pan and zoom

### Smart Bulk Operations
- Create hundreds of slots in seconds
- Flexible naming convention (A1, A2, B1, etc.)
- Batch status updates
- Multi-select with visual feedback

### Dashboard Analytics
- Beautiful area chart for occupancy trends
- Real-time statistics cards
- Activity feed
- Revenue tracking
- Trend indicators

## Mobile Responsiveness
- Collapsible sidebar on mobile
- Stacked card layouts
- Touch-friendly controls
- Optimized grid for smaller screens

## Future Enhancements
- Drag-and-drop slot arrangement
- Visual parking layout designer
- Advanced analytics with date filters
- Export reports to PDF
- Real-time WebSocket updates
- Slot booking calendar view
- Revenue analytics graphs
- User management interface

## Installation
All dependencies are already installed. The admin dashboard is integrated into the existing React application.

## Running the Application
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm start
```

## Access
- Admin Dashboard: `http://localhost:5173/admin`
- Login with admin credentials to access the dashboard

---
# ParkEase - Complete Implementation Summary

## Overview
Complete parking management system with multi-floor parking, location-based search, ratings, and payment integration.

## ✅ Completed Features

### Backend Architecture

#### 1. **Database Models** (6 Models)
- **Company** - Multi-company support with admin assignment
- **ParkingArea** - Location-based parking with floors, pricing, ratings
- **Slot** - Floor-wise slots with types (Normal, EV, Handicapped, Reserved)
- **Booking** - Estimated vs actual time/pricing, payment tracking
- **Rating** - User reviews for parking areas
- **User** - Extended with company_admin role

#### 2. **API Endpoints** (30+ Routes)

**Company Management:**
- POST `/api/companies/register` - Register new company
- GET `/api/companies` - List all companies
- GET `/api/companies/:id` - Get company details
- PUT `/api/companies/:id` - Update company

**Parking Areas:**
- POST `/api/parking-areas` - Create parking area
- GET `/api/parking-areas` - List all (filtered by company for company admins)
- GET `/api/parking-areas/nearby` - Find nearby parking (geospatial)
- GET `/api/parking-areas/:id` - Get detailed info with floor stats
- PUT `/api/parking-areas/:id` - Update parking area
- PATCH `/api/parking-areas/:id/make-live` - Activate parking area
- DELETE `/api/parking-areas/:id` - Remove parking area

**Slots:**
- POST `/api/slots/bulk-create` - Create slots for floor with layout
- GET `/api/slots/by-parking/:parkingAreaId` - Get slots by floor
- PUT `/api/slots/:slotId` - Update slot type/status
- PATCH `/api/slots/bulk-update-status` - Maintenance mode for multiple slots
- DELETE `/api/slots/by-parking/:areaId` - Remove all slots

**Bookings:**
- POST `/api/bookings/book` - Book slot with estimated time
- GET `/api/bookings/my` - User's booking history
- GET `/api/bookings/active` - Current active booking
- POST `/api/bookings/complete` - End parking & calculate final amount
- POST `/api/bookings/cancel` - Cancel active booking
- GET `/api/bookings/all` - Admin view (filtered by company)

**Payments:**
- POST `/api/payment/create-order` - Create Razorpay order
- POST `/api/payment/verify` - Verify payment signature
- POST `/api/payment/mock` - Mock payment for testing

**Ratings:**
- POST `/api/ratings` - Submit/update rating
- GET `/api/ratings/parking-area/:id` - Get reviews with pagination
- GET `/api/ratings/parking-area/:id/my-rating` - User's own rating

#### 3. **Key Features Implemented**

**Geospatial Search:**
- MongoDB 2dsphere index for location queries
- Distance calculation in kilometers
- Nearby parking areas within radius

**Multi-Floor Support:**
- Separate slots per floor
- Floor-wise availability tracking
- Flexible slot numbering (A1, B1, etc.)

**Slot Types:**
- Normal parking
- EV charging slots
- Handicapped accessible
- Reserved parking
- Under maintenance status

**Pricing Logic:**
- Base price + hourly rate
- Estimated vs actual duration
- Automatic calculation on completion

**Rating System:**
- 1-5 star ratings
- Text reviews
- Average rating calculation
- One rating per user per area (updatable)

### Frontend Implementation

#### 1. **User Workflow Pages**

**FindParking.jsx** - Complete parking search
- Live location tracking with Leaflet maps
- Nearby parking areas display
- Distance calculation
- Availability indicators
- Rating display
- Direct Google Maps navigation

**ParkingAreaDetails.jsx** - Detailed area view
- Floor selection tabs
- Slot grid visualization
- Color-coded slot status
- Slot type badges
- Recent reviews
- Operating hours & amenities

**SlotBooking.jsx** - Booking flow
- Vehicle selection
- Estimated duration input
- Price breakdown preview
- Real-time amount calculation

**PaymentModal.jsx** - Payment processing
- Razorpay integration
- Mock payment for testing
- Payment status tracking
- Success confirmation

#### 2. **Admin Pages**

**CompanyManagement.jsx** - Company registration
- Register new companies
- Assign company admins
- View company status

#### 3. **Styling**
- Dark theme with CSS variables
- Responsive design
- Modern card layouts
- Interactive hover effects
- Smooth animations

## 🎯 User Flow (As Implemented)

### User Journey:
1. **Register Vehicle** → `/user/myvehicles`
2. **Search Parking** → `/user/find-parking`
   - Enable location → See nearby areas
   - View on map
   - Check ratings & availability
3. **Select Parking Area**
   - See floor-wise slots
   - View amenities & pricing
4. **Choose Slot**
   - Select floor
   - Pick available slot
5. **Book & Estimate**
   - Choose vehicle
   - Enter estimated duration
   - See price breakdown
6. **Pay**
   - Razorpay or Mock payment
   - Booking confirmed
7. **Park & Leave**
   - Active booking tracked
   - Complete booking
   - Final amount calculated
8. **Rate Experience**
   - Submit rating & review

### Admin Journey:
1. **Register Company** → `/admin/companies`
2. **Create Parking Area**
   - Set location, floors, pricing
3. **Create Parking Layout**
   - Define slot grid per floor
   - Set slot types
4. **Manage Slots**
   - Mark maintenance
   - Update slot types
5. **Make Parking Live**
   - Activate for public use
6. **Monitor Bookings**
   - View active sessions
   - Track revenue

## 🔧 Technical Highlights

### Backend:
- **Geospatial Queries**: MongoDB 2dsphere for location-based search
- **Compound Indexes**: Unique slots per parking area + floor + number
- **Aggregation Pipelines**: Complex analytics queries
- **Role-Based Access**: Super admin, company admin, user
- **Payment Integration**: Razorpay with signature verification

### Frontend:
- **Leaflet Maps**: Interactive maps with markers
- **Real-time Calculations**: Dynamic pricing updates
- **State Management**: React hooks for complex flows
- **Responsive Design**: Mobile-first approach
- **Error Handling**: User-friendly error messages

## 📦 Dependencies Added

### Backend:
- `razorpay` - Payment gateway (already present)
- All models use existing `mongoose`

### Frontend:
- `react-leaflet` & `leaflet` - Maps (already present)
- `lucide-react` - Icons (already present)

## 🚀 Next Steps / Enhancements

1. **Admin Dashboard**
   - Parking area creation UI
   - Slot layout designer
   - Analytics dashboard

2. **User Features**
   - Booking history page
   - Favorite parking areas
   - Push notifications

3. **Advanced Features**
   - Real-time slot availability (WebSocket)
   - Parking reservations
   - Monthly passes
   - Dynamic pricing (peak hours)

4. **Optimizations**
   - Redis caching for slot availability
   - Image optimization for parking photos
   - Lazy loading for maps

## 📝 Environment Variables Required

```env
# Backend (.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/parkease
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
```

## 🧪 Testing

The system includes:
- Mock payment endpoint for development
- Test mode detection for Razorpay
- Sample data creation possible

## 📚 API Documentation

All endpoints follow RESTful conventions:
- Proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Consistent error responses
- JWT authentication
- Role-based authorization

## ✨ Key Innovations

1. **Multi-Company Architecture**: Single platform for multiple parking operators
2. **Floor-Based Slot Management**: Scalable to multi-story parking
3. **Estimated vs Actual Pricing**: Fair pricing based on actual usage
4. **Location Intelligence**: Geospatial search with distance calculation
5. **Flexible Slot Types**: Support for EV, handicapped, reserved slots

---

**Status**: Core implementation complete. Backend APIs tested. Frontend components created with styling.

---
## 🎓 Internship Context
Built for Infosys Internship Program – 2025

---

## 👨‍💻 Developer
Vaibhav Bhardwaj
[portfolio](https://vaughv.netlify.app/)

---

## 📜 License
Educational & internship use only.

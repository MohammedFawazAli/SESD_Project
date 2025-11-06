# Real-Time Updates Implementation

This document explains how real-time updates are implemented in the HomeEase application.

## Overview

The application now uses Firebase Firestore with real-time subscriptions to provide instant updates across all users when:
- New technician accounts are created
- Technicians are approved/rejected by admin
- Bookings are created, accepted, rejected, or completed
- Booking statuses change

## Architecture

### Services Created

1. **TechnicianService** (`src/services/technicianService.js`)
   - Manages technician CRUD operations in Firebase
   - Provides real-time subscriptions using Firestore `onSnapshot`
   - Methods:
     - `createTechnician()` - Create new technician
     - `getTechnicianById()` - Get single technician
     - `getTechnicianByEmail()` - Get technician by email
     - `updateTechnician()` - Update technician data
     - `subscribeToApprovedTechnicians()` - Real-time list of approved technicians
     - `subscribeToAllTechnicians()` - Real-time list of all technicians (admin)
     - `subscribeToTechnician()` - Real-time updates for single technician

2. **BookingService** (`src/services/bookingService.js`)
   - Manages booking CRUD operations in Firebase
   - Provides real-time subscriptions for bookings
   - Methods:
     - `createBooking()` - Create new booking
     - `updateBooking()` - Update booking status/info
     - `getBookingById()` - Get single booking
     - `subscribeToCustomerBookings()` - Real-time customer bookings
     - `subscribeToTechnicianBookings()` - Real-time technician bookings
     - `subscribeToAllBookings()` - Real-time all bookings (admin)

### Updated Components

1. **BrowseTechnicians** (`src/pages/Browse-technicians.jsx`)
   - Uses `TechnicianService.subscribeToApprovedTechnicians()`
   - Automatically shows new technicians when they're approved
   - Updates in real-time when technician data changes

2. **CustomerDashboard** (`src/pages/CustomerDashboard.jsx`)
   - Uses `BookingService.subscribeToCustomerBookings()`
   - Shows new bookings instantly
   - Updates when technicians accept/reject bookings
   - Updates when booking status changes

3. **TechnicianDashboard** (`src/pages/TechnicianDashboard.jsx`)
   - Uses `BookingService.subscribeToTechnicianBookings()`
   - Shows new booking requests instantly
   - Updates when customers create bookings
   - Updates when booking status changes

4. **AdminPanel** (`src/pages/AdminPanel.jsx`)
   - Uses `TechnicianService.subscribeToAllTechnicians()`
   - Uses `BookingService.subscribeToAllBookings()`
   - Real-time updates for all technicians and bookings

5. **BookAppointment** (`src/pages/BookAppointment.jsx`)
   - Uses `TechnicianService.subscribeToTechnician()` for real-time technician data
   - Uses `BookingService.createBooking()` to create bookings in Firebase

6. **base44Client** (`src/api/base44Client.js`)
   - Updated to integrate with Firebase services
   - Technician and booking operations now use Firebase
   - Maintains backward compatibility with mock data fallback

## How It Works

### Real-Time Flow

1. **New Technician Registration:**
   ```
   User registers → TechnicianService.createTechnician() → Firebase Firestore
   → All subscribers to approved technicians receive update
   → BrowseTechnicians page automatically shows new technician (after approval)
   ```

2. **Booking Creation:**
   ```
   Customer creates booking → BookingService.createBooking() → Firebase Firestore
   → Technician's subscription receives update
   → TechnicianDashboard shows new booking instantly
   ```

3. **Booking Acceptance:**
   ```
   Technician accepts → BookingService.updateBooking() → Firebase Firestore
   → Customer's subscription receives update
   → CustomerDashboard shows accepted status instantly
   ```

### Technical Details

- **Firestore Listeners**: Uses `onSnapshot()` for real-time updates
- **State Management**: React `useState` and `useEffect` for managing subscriptions
- **Cleanup**: Subscriptions are properly cleaned up on component unmount
- **Error Handling**: Graceful fallback to empty arrays/null on errors
- **Data Conversion**: Firestore timestamps are converted to JavaScript Date objects where needed

## Firebase Collections

### `technicians`
```javascript
{
  id: string (auto-generated),
  user_email: string,
  full_name: string,
  service_type: string,
  experience_years: number,
  location: string,
  phone: string,
  description: string,
  rating: number,
  total_reviews: number,
  approved: boolean,
  active: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `bookings`
```javascript
{
  id: string (auto-generated),
  customer_email: string,
  customer_name: string,
  customer_phone: string,
  technician_id: string,
  technician_name: string,
  service_type: string,
  booking_date: string (ISO date),
  time_slot: string,
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'work_accepted',
  notes: string,
  rejection_reason: string (optional),
  created_date: timestamp,
  updatedAt: timestamp
}
```

## Testing Real-Time Updates

### Test Scenario 1: New Technician Appears
1. Open two browser windows/tabs
2. In Tab 1: Login as admin and approve a pending technician
3. In Tab 2: Browse technicians page should automatically show the new technician

### Test Scenario 2: Real-Time Booking
1. Open two browser windows/tabs
2. In Tab 1: Login as customer and create a booking
3. In Tab 2: Login as the technician and see the booking appear instantly in dashboard

### Test Scenario 3: Booking Acceptance
1. Open two browser windows/tabs
2. In Tab 1: Login as technician and accept a booking
3. In Tab 2: Login as customer and see the booking status update to "Accepted" instantly

## Setup Requirements

1. **Firebase Configuration**: Ensure `.env` file has Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. **Firestore Security Rules**: Update Firestore rules to allow read/write access:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /technicians/{technicianId} {
         allow read: if true; // Public read for approved technicians
         allow write: if request.auth != null;
       }
       match /bookings/{bookingId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update: if request.auth != null;
       }
     }
   }
   ```

## Benefits

1. **Instant Updates**: All users see changes immediately without refreshing
2. **Better UX**: No need to manually refresh pages or poll for updates
3. **Scalable**: Firebase handles all the real-time infrastructure
4. **Reliable**: Automatic reconnection and error handling
5. **Efficient**: Only subscribed to relevant data, reducing bandwidth

## Future Enhancements

- Add real-time notifications/notifications system
- Implement optimistic updates for better perceived performance
- Add presence indicators (online/offline status)
- Implement typing indicators for chat features
- Add real-time location tracking for technicians

import { TechnicianService } from '@/services/technicianService';
import { BookingService } from '@/services/bookingService';
import { db } from '@/config/firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';

// Get users from localStorage or initialize with default users
const getUsers = () => {
  const storedUsers = localStorage.getItem('homeease_users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  // Default users
  const defaultUsers = [
    { id: 1, email: 'admin@homeease.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: 2, email: 'john.tech@homeease.com', password: 'tech123', role: 'technician', name: 'John Smith' },
    { id: 3, email: 'sarah.tech@homeease.com', password: 'tech123', role: 'technician', name: 'Sarah Johnson' },
    { id: 4, email: 'mike.tech@homeease.com', password: 'tech123', role: 'technician', name: 'Mike Wilson' },
    { id: 5, email: 'customer@test.com', password: 'customer123', role: 'customer', name: 'Test Customer' },
  ];
  localStorage.setItem('homeease_users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem('homeease_users', JSON.stringify(users));
};

// Mock database for users (can be migrated to Firebase later)
const mockDatabase = {
  get users() {
    return getUsers();
  },
  // Technicians and bookings are now stored in Firebase
  // Keeping this for backward compatibility but operations use Firebase
  technicians: [],
  bookings: [],
};

// Mock API client for demonstration
export const base44 = {
  auth: {
    isAuthenticated: async () => {
      return localStorage.getItem('isAuthenticated') === 'true';
    },
    me: async () => {
      const user = localStorage.getItem('user');
      if (!user) throw new Error('Not authenticated');
      return JSON.parse(user);
    },
    login: async (email, password) => {
      // Check users from localStorage (includes registered users)
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      // Dispatch event to notify Layout component
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      return user;
    },
    logout: async () => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      // Dispatch event to notify Layout component
      window.dispatchEvent(new CustomEvent('authStateChanged'));
    },
    register: async (userData) => {
      // Check if user already exists
      const users = getUsers();
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = { 
        id: users.length + 1, 
        email: userData.email,
        name: userData.full_name,
        role: userData.role || 'customer',
        password: userData.password,
        full_name: userData.full_name,
        phone: userData.phone
      };
      
      // Save to localStorage
      users.push(newUser);
      saveUsers(users);
      
      // If registering as technician, create in Firebase for real-time updates
      if (userData.role === 'technician') {
        try {
          await TechnicianService.createTechnician({
            user_email: userData.email,
            full_name: userData.full_name,
            service_type: userData.service_type,
            experience_years: parseInt(userData.experience_years) || 0,
            location: userData.location,
            phone: userData.phone,
            description: userData.description || '',
            areas_served: userData.areas_served || []
          });
        } catch (error) {
          console.error('Error creating technician in Firebase:', error);
          // Continue with registration even if Firebase fails
        }
      }
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(newUser));
      // Dispatch event to notify Layout component
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      return newUser;
    },
    redirectToLogin: (returnUrl) => {
      window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
  },
  entities: {
    Technician: {
      filter: async (filters) => {
        try {
          // Use Firebase service
          if (filters.id) {
            const tech = await TechnicianService.getTechnicianById(filters.id);
            return tech ? [tech] : [];
          }
          if (filters.user_email) {
            const tech = await TechnicianService.getTechnicianByEmail(filters.user_email);
            return tech ? [tech] : [];
          }
          if (filters.approved === true || (filters.approved === undefined && !filters.user_email && !filters.id)) {
            return await TechnicianService.getApprovedTechnicians();
          }
          if (filters.approved === false) {
            return await TechnicianService.getPendingTechnicians();
          }
          return await TechnicianService.getApprovedTechnicians();
        } catch (error) {
          console.error('Error filtering technicians:', error);
          // Fallback to mock for backward compatibility
          return mockDatabase.technicians.filter(tech => {
            if (filters.user_email && tech.user_email !== filters.user_email) return false;
            if (filters.approved !== undefined && tech.approved !== filters.approved) return false;
            return true;
          });
        }
      },
      list: async () => {
        try {
          // Get all technicians from Firebase (for admin)
          const q = query(collection(db, 'technicians'));
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.error('Error listing technicians:', error);
          return [];
        }
      },
      update: async (id, data) => {
        try {
          return await TechnicianService.updateTechnician(id, data);
        } catch (error) {
          console.error('Error updating technician:', error);
          // Fallback to mock
          const tech = mockDatabase.technicians.find(t => t.id === id);
          if (tech) Object.assign(tech, data);
          return tech;
        }
      },
      delete: async (id) => {
        try {
          await TechnicianService.updateTechnician(id, { active: false });
          return { success: true };
        } catch (error) {
          console.error('Error deleting technician:', error);
          return { success: false };
        }
      }
    },
    Booking: {
      filter: async (filters) => {
        try {
          if (filters.customer_email) {
            return await BookingService.getBookingsByCustomer(filters.customer_email);
          }
          if (filters.technician_id) {
            return await BookingService.getBookingsByTechnician(filters.technician_id);
          }
          return await BookingService.getAllBookings();
        } catch (error) {
          console.error('Error filtering bookings:', error);
          // Fallback to mock
          return mockDatabase.bookings.filter(booking => {
            if (filters.customer_email && booking.customer_email !== filters.customer_email) return false;
            if (filters.technician_id && booking.technician_id !== filters.technician_id) return false;
            return true;
          });
        }
      },
      list: async () => {
        try {
          return await BookingService.getAllBookings();
        } catch (error) {
          console.error('Error listing bookings:', error);
          return [];
        }
      },
      update: async (id, data) => {
        try {
          return await BookingService.updateBooking(id, data);
        } catch (error) {
          console.error('Error updating booking:', error);
          // Fallback to mock
          const booking = mockDatabase.bookings.find(b => b.id === id);
          if (booking) Object.assign(booking, data);
          return booking;
        }
      },
      create: async (data) => {
        try {
          return await BookingService.createBooking(data);
        } catch (error) {
          console.error('Error creating booking:', error);
          // Fallback to mock
          const newBooking = {
            id: mockDatabase.bookings.length + 1,
            ...data,
            created_date: new Date().toISOString().split('T')[0]
          };
          mockDatabase.bookings.push(newBooking);
          return newBooking;
        }
      }
    },
    User: {
      list: async () => {
        return getUsers();
      }
    }
  }
};

import { db } from '@/config/firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  serverTimestamp,
  getDoc,
  orderBy
} from 'firebase/firestore';

export class BookingService {
  /**
   * Create a new booking
   */
  static async createBooking(bookingData) {
    try {
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        status: bookingData.status || 'pending',
        created_date: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: bookingRef.id, ...bookingData };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Update booking
   */
  static async updateBooking(bookingId, updateData) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return { id: bookingId, ...updateData };
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(bookingId) {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  /**
   * Get bookings by customer email
   */
  static async getBookingsByCustomer(customerEmail) {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('customer_email', '==', customerEmail),
        orderBy('created_date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      throw error;
    }
  }

  /**
   * Get bookings by technician ID
   */
  static async getBookingsByTechnician(technicianId) {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('technician_id', '==', technicianId),
        orderBy('created_date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching technician bookings:', error);
      throw error;
    }
  }

  /**
   * Get all bookings (for admin)
   */
  static async getAllBookings() {
    try {
      const q = query(
        collection(db, 'bookings'),
        orderBy('created_date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }

  /**
   * Real-time subscription to customer bookings
   * Returns an unsubscribe function
   */
  static subscribeToCustomerBookings(customerEmail, callback) {
    // Try with orderBy first
    let q = query(
      collection(db, 'bookings'),
      where('customer_email', '==', customerEmail),
      orderBy('created_date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const bookings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to date string if needed
            created_date: data.created_date?.toDate?.()?.toISOString()?.split('T')[0] || data.created_date
          };
        });
        // Sort manually as fallback
        bookings.sort((a, b) => {
          const dateA = a.created_date ? new Date(a.created_date) : new Date(0);
          const dateB = b.created_date ? new Date(b.created_date) : new Date(0);
          return dateB - dateA;
        });
        callback(bookings);
      }, 
      (error) => {
        console.error('Error in customer bookings subscription:', error);
        // If index error, try without orderBy
        if (error.code === 'failed-precondition') {
          console.warn('Firestore index missing, falling back to query without orderBy');
          const fallbackQ = query(
            collection(db, 'bookings'),
            where('customer_email', '==', customerEmail)
          );
          onSnapshot(fallbackQ, (querySnapshot) => {
            const bookings = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                created_date: data.created_date?.toDate?.()?.toISOString()?.split('T')[0] || data.created_date
              };
            });
            // Sort manually
            bookings.sort((a, b) => {
              const dateA = a.created_date ? new Date(a.created_date) : new Date(0);
              const dateB = b.created_date ? new Date(b.created_date) : new Date(0);
              return dateB - dateA;
            });
            callback(bookings);
          }, (fallbackError) => {
            console.error('Error in fallback subscription:', fallbackError);
            // Don't clear bookings on error, just log
          });
        } else {
          // For other errors, don't clear - just log
          console.error('Subscription error, keeping existing bookings');
        }
      }
    );
    
    return unsubscribe;
  }

  /**
   * Real-time subscription to technician bookings
   * Returns an unsubscribe function
   */
  static subscribeToTechnicianBookings(technicianId, callback) {
    const q = query(
      collection(db, 'bookings'),
      where('technician_id', '==', technicianId),
      orderBy('created_date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const bookings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to date string if needed
            created_date: data.created_date?.toDate?.()?.toISOString()?.split('T')[0] || data.created_date
          };
        });
        // Sort manually as fallback
        bookings.sort((a, b) => {
          const dateA = a.created_date ? new Date(a.created_date) : new Date(0);
          const dateB = b.created_date ? new Date(b.created_date) : new Date(0);
          return dateB - dateA;
        });
        callback(bookings);
      },
      (error) => {
        console.error('Error in technician bookings subscription:', error);
        // If index error, try without orderBy
        if (error.code === 'failed-precondition') {
          console.warn('Firestore index missing, falling back to query without orderBy');
          const fallbackQ = query(
            collection(db, 'bookings'),
            where('technician_id', '==', technicianId)
          );
          onSnapshot(fallbackQ, (querySnapshot) => {
            const bookings = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                created_date: data.created_date?.toDate?.()?.toISOString()?.split('T')[0] || data.created_date
              };
            });
            // Sort manually
            bookings.sort((a, b) => {
              const dateA = a.created_date ? new Date(a.created_date) : new Date(0);
              const dateB = b.created_date ? new Date(b.created_date) : new Date(0);
              return dateB - dateA;
            });
            callback(bookings);
          }, (fallbackError) => {
            console.error('Error in fallback subscription:', fallbackError);
          });
        } else {
          console.error('Subscription error, keeping existing bookings');
        }
      }
    );
    
    return unsubscribe;
  }

  /**
   * Real-time subscription to all bookings (for admin)
   */
  static subscribeToAllBookings(callback) {
    const q = query(
      collection(db, 'bookings'),
      orderBy('created_date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const bookings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to date string if needed
            created_date: data.created_date?.toDate?.()?.toISOString()?.split('T')[0] || data.created_date
          };
        });
        // Sort manually as fallback
        bookings.sort((a, b) => {
          const dateA = a.created_date ? new Date(a.created_date) : new Date(0);
          const dateB = b.created_date ? new Date(b.created_date) : new Date(0);
          return dateB - dateA;
        });
        callback(bookings);
      },
      (error) => {
        console.error('Error in all bookings subscription:', error);
        // If index error, try without orderBy
        if (error.code === 'failed-precondition') {
          console.warn('Firestore index missing, falling back to query without orderBy');
          const fallbackQ = query(collection(db, 'bookings'));
          onSnapshot(fallbackQ, (querySnapshot) => {
            const bookings = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                created_date: data.created_date?.toDate?.()?.toISOString()?.split('T')[0] || data.created_date
              };
            });
            // Sort manually
            bookings.sort((a, b) => {
              const dateA = a.created_date ? new Date(a.created_date) : new Date(0);
              const dateB = b.created_date ? new Date(b.created_date) : new Date(0);
              return dateB - dateA;
            });
            callback(bookings);
          }, (fallbackError) => {
            console.error('Error in fallback subscription:', fallbackError);
          });
        } else {
          console.error('Subscription error, keeping existing bookings');
        }
      }
    );
    
    return unsubscribe;
  }

  /**
   * Real-time subscription to a single booking by ID
   */
  static subscribeToBooking(bookingId, callback) {
    const docRef = doc(db, 'bookings', bookingId);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          id: docSnap.id,
          ...data,
          // Convert Firestore timestamp to date string if needed
          created_date: data.created_date?.toDate?.()?.toISOString()?.split('T')[0] || data.created_date
        });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in booking subscription:', error);
      callback(null);
    });
  }
}

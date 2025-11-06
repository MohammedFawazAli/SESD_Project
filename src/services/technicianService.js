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
  getDoc 
} from 'firebase/firestore';

export class TechnicianService {
  /**
   * Create a new technician in Firestore
   */
  static async createTechnician(technicianData) {
    try {
      const technicianRef = await addDoc(collection(db, 'technicians'), {
        ...technicianData,
        rating: 0,
        total_reviews: 0,
        approved: false,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: technicianRef.id, ...technicianData };
    } catch (error) {
      console.error('Error creating technician:', error);
      throw error;
    }
  }

  /**
   * Get technician by ID
   */
  static async getTechnicianById(technicianId) {
    try {
      const docRef = doc(db, 'technicians', technicianId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching technician:', error);
      throw error;
    }
  }

  /**
   * Get technician by user email
   */
  static async getTechnicianByEmail(userEmail) {
    try {
      const q = query(
        collection(db, 'technicians'),
        where('user_email', '==', userEmail)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching technician by email:', error);
      throw error;
    }
  }

  /**
   * Update technician
   */
  static async updateTechnician(technicianId, updateData) {
    try {
      const technicianRef = doc(db, 'technicians', technicianId);
      await updateDoc(technicianRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return { id: technicianId, ...updateData };
    } catch (error) {
      console.error('Error updating technician:', error);
      throw error;
    }
  }

  /**
   * Get all approved and active technicians
   */
  static async getApprovedTechnicians() {
    try {
      const q = query(
        collection(db, 'technicians'),
        where('approved', '==', true),
        where('active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching approved technicians:', error);
      throw error;
    }
  }

  /**
   * Get pending technicians (for admin)
   */
  static async getPendingTechnicians() {
    try {
      const q = query(
        collection(db, 'technicians'),
        where('approved', '==', false)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching pending technicians:', error);
      throw error;
    }
  }

  /**
   * Real-time subscription to approved technicians
   * Returns an unsubscribe function
   */
  static subscribeToApprovedTechnicians(callback) {
    const q = query(
      collection(db, 'technicians'),
      where('approved', '==', true),
      where('active', '==', true)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const technicians = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(technicians);
    }, (error) => {
      console.error('Error in technicians subscription:', error);
      callback([]);
    });
  }

  /**
   * Real-time subscription to all technicians (for admin)
   */
  static subscribeToAllTechnicians(callback) {
    const q = query(collection(db, 'technicians'));
    
    return onSnapshot(q, (querySnapshot) => {
      const technicians = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(technicians);
    }, (error) => {
      console.error('Error in all technicians subscription:', error);
      callback([]);
    });
  }

  /**
   * Real-time subscription to a single technician by ID
   */
  static subscribeToTechnician(technicianId, callback) {
    const docRef = doc(db, 'technicians', technicianId);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in technician subscription:', error);
      callback(null);
    });
  }
}

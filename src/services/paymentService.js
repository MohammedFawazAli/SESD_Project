import { loadStripe } from '@stripe/stripe-js';
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
  serverTimestamp 
} from 'firebase/firestore';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

export class PaymentService {
  static async createPayment(paymentData) {
    try {
      const paymentRef = await addDoc(collection(db, 'payments'), {
        ...paymentData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: paymentRef.id, ...paymentData };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  static async processPayment(paymentData) {
    try {
      const stripe = await stripePromise;
      
      // Create payment intent on your backend (this is a simplified version)
      // In production, you should call your backend API to create the payment intent
      const paymentIntent = await this.createPaymentIntent(paymentData);
      
      // Confirm the payment
      const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: paymentData.paymentMethodId
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Update payment status in Firestore
      await updateDoc(doc(db, 'payments', paymentData.paymentId), {
        status: 'completed',
        stripePaymentIntentId: result.paymentIntent.id,
        updatedAt: serverTimestamp()
      });

      return result.paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  static async createPaymentIntent(paymentData) {
    // In production, this should call your backend API
    // For now, returning a mock structure
    return {
      clientSecret: 'mock_client_secret',
      id: 'mock_payment_intent_id'
    };
  }

  static async updatePaymentStatus(paymentId, status) {
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  static async getPaymentsByBooking(bookingId) {
    try {
      const q = query(
        collection(db, 'payments'),
        where('bookingId', '==', bookingId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  static async getPaymentsByCustomer(customerEmail) {
    try {
      const q = query(
        collection(db, 'payments'),
        where('customerEmail', '==', customerEmail)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching customer payments:', error);
      throw error;
    }
  }

  static async getPaymentsByTechnician(technicianId) {
    try {
      const q = query(
        collection(db, 'payments'),
        where('technicianId', '==', technicianId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching technician payments:', error);
      throw error;
    }
  }

  static subscribeToPaymentUpdates(paymentId, callback) {
    return onSnapshot(doc(db, 'payments', paymentId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
  }

  static subscribeToCustomerPayments(customerEmail, callback) {
    const q = query(
      collection(db, 'payments'),
      where('customerEmail', '==', customerEmail)
    );
    return onSnapshot(q, (querySnapshot) => {
      const payments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(payments);
    });
  }
}

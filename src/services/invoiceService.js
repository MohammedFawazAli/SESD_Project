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

export class InvoiceService {
  static generateInvoiceNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
  }

  static async createInvoice(invoiceData) {
    try {
      const invoiceNumber = this.generateInvoiceNumber();
      
      const invoice = {
        invoiceNumber,
        bookingId: invoiceData.bookingId,
        customerId: invoiceData.customerId,
        customerEmail: invoiceData.customerEmail,
        customerName: invoiceData.customerName,
        technicianId: invoiceData.technicianId,
        technicianName: invoiceData.technicianName,
        serviceType: invoiceData.serviceType,
        serviceDescription: invoiceData.serviceDescription,
        
        // Pricing details
        basePrice: invoiceData.basePrice || 0,
        additionalCharges: invoiceData.additionalCharges || [],
        subtotal: invoiceData.subtotal || 0,
        tax: invoiceData.tax || 0,
        total: invoiceData.total || 0,
        
        // Payment info
        paymentStatus: 'pending',
        paymentId: null,
        
        // Service details
        serviceDate: invoiceData.serviceDate,
        completionDate: invoiceData.completionDate || serverTimestamp(),
        
        // Invoice metadata
        status: 'draft', // draft, sent, paid, cancelled
        notes: invoiceData.notes || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const invoiceRef = await addDoc(collection(db, 'invoices'), invoice);
      return { id: invoiceRef.id, ...invoice };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  static async updateInvoice(invoiceId, updates) {
    try {
      await updateDoc(doc(db, 'invoices', invoiceId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  static async getInvoiceById(invoiceId) {
    try {
      const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
      if (invoiceDoc.exists()) {
        return { id: invoiceDoc.id, ...invoiceDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }

  static async getInvoicesByCustomer(customerEmail) {
    try {
      const q = query(
        collection(db, 'invoices'),
        where('customerEmail', '==', customerEmail)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      throw error;
    }
  }

  static async getInvoicesByTechnician(technicianId) {
    try {
      const q = query(
        collection(db, 'invoices'),
        where('technicianId', '==', technicianId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching technician invoices:', error);
      throw error;
    }
  }

  static async getInvoiceByBooking(bookingId) {
    try {
      const q = query(
        collection(db, 'invoices'),
        where('bookingId', '==', bookingId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching booking invoice:', error);
      throw error;
    }
  }

  static async markInvoiceAsPaid(invoiceId, paymentId) {
    try {
      await updateDoc(doc(db, 'invoices', invoiceId), {
        paymentStatus: 'paid',
        paymentId,
        status: 'paid',
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw error;
    }
  }

  static subscribeToInvoiceUpdates(invoiceId, callback) {
    return onSnapshot(doc(db, 'invoices', invoiceId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
  }

  static subscribeToCustomerInvoices(customerEmail, callback) {
    const q = query(
      collection(db, 'invoices'),
      where('customerEmail', '==', customerEmail)
    );
    return onSnapshot(q, (querySnapshot) => {
      const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(invoices);
    });
  }

  static subscribeToTechnicianInvoices(technicianId, callback) {
    const q = query(
      collection(db, 'invoices'),
      where('technicianId', '==', technicianId)
    );
    return onSnapshot(q, (querySnapshot) => {
      const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(invoices);
    });
  }

  static calculateTotal(basePrice, additionalCharges = [], taxRate = 0.1) {
    const subtotal = basePrice + additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }
}

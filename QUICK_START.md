# Quick Start Guide - Payment & Invoicing System

## Overview
This guide will help you quickly integrate the payment and invoicing system into your HomeEase application.

## Prerequisites
- Node.js and npm installed
- Firebase project created
- Stripe account (test mode is fine)

## Setup Steps

### 1. Install Dependencies
All required packages are already in `package.json`. Run:
```bash
npm install
```

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Add your Firebase credentials (from Firebase Console):
   - Go to Firebase Console → Project Settings → General
   - Copy your Firebase configuration values
   - Paste them into `.env`

3. Add your Stripe keys (from Stripe Dashboard):
   - Go to Stripe Dashboard → Developers → API Keys
   - Copy your Publishable key and Secret key (use test mode)
   - Paste them into `.env`

### 3. Set Up Firebase Collections
The app uses these Firestore collections:
- `payments` - Payment records
- `invoices` - Invoice records
- `bookings` - Existing booking records

Collections will be created automatically when first used.

### 4. Configure Firestore Security Rules
In Firebase Console → Firestore Database → Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Payments - customers can read their own, technicians can read theirs
    match /payments/{paymentId} {
      allow read: if request.auth != null && 
        (resource.data.customerEmail == request.auth.token.email ||
         resource.data.technicianId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Invoices - similar access control
    match /invoices/{invoiceId} {
      allow read: if request.auth != null && 
        (resource.data.customerEmail == request.auth.token.email ||
         resource.data.technicianId == request.auth.uid);
      allow create, update: if request.auth != null;
    }
  }
}
```

## Integration Examples

### Customer Dashboard
Add to `src/pages/CustomerDashboard.jsx`:

```javascript
import { useState, useEffect } from "react";
import ServiceHistory from "@/components/ServiceHistory";
import PaymentGateway from "@/components/PaymentGateway";
import { PaymentService } from "@/services/paymentService";
import { InvoiceService } from "@/services/invoiceService";

// Inside your component:
const [payments, setPayments] = useState([]);
const [invoices, setInvoices] = useState([]);
const [selectedInvoice, setSelectedInvoice] = useState(null);

useEffect(() => {
  if (user?.email) {
    // Real-time payment updates
    const unsubPayments = PaymentService.subscribeToCustomerPayments(
      user.email,
      (data) => setPayments(data)
    );

    // Real-time invoice updates
    const unsubInvoices = InvoiceService.subscribeToCustomerInvoices(
      user.email,
      (data) => setInvoices(data)
    );

    return () => {
      unsubPayments();
      unsubInvoices();
    };
  }
}, [user]);

// Add a new tab for service history:
<Tabs defaultValue="bookings">
  <TabsList>
    <TabsTrigger value="bookings">My Bookings</TabsTrigger>
    <TabsTrigger value="history">Service History</TabsTrigger>
  </TabsList>
  
  <TabsContent value="history">
    <ServiceHistory 
      bookings={bookings}
      payments={payments}
      invoices={invoices}
      userRole="customer"
    />
  </TabsContent>
</Tabs>

// To show payment gateway for an unpaid invoice:
{selectedInvoice && (
  <PaymentGateway
    invoice={selectedInvoice}
    booking={bookings.find(b => b.id === selectedInvoice.bookingId)}
    onPaymentSuccess={() => {
      setSelectedInvoice(null);
      // Refresh data
    }}
  />
)}
```

### Technician Dashboard
Add to `src/pages/TechnicianDashboard.jsx`:

```javascript
import { useState, useEffect } from "react";
import InvoiceCreator from "@/components/InvoiceCreator";
import ServiceHistory from "@/components/ServiceHistory";
import { InvoiceService } from "@/services/invoiceService";
import { PaymentService } from "@/services/paymentService";

// Inside your component:
const [invoices, setInvoices] = useState([]);
const [payments, setPayments] = useState([]);
const [selectedBooking, setSelectedBooking] = useState(null);

useEffect(() => {
  if (technician?.id) {
    // Real-time updates
    const unsubInvoices = InvoiceService.subscribeToTechnicianInvoices(
      technician.id,
      (data) => setInvoices(data)
    );

    const unsubPayments = PaymentService.subscribeToTechnician(
      technician.id,
      (data) => setPayments(data)
    );

    return () => {
      unsubInvoices();
      unsubPayments();
    };
  }
}, [technician]);

// Add tabs for invoices and history:
<Tabs defaultValue="requests">
  <TabsList>
    <TabsTrigger value="requests">Requests</TabsTrigger>
    <TabsTrigger value="accepted">Accepted</TabsTrigger>
    <TabsTrigger value="invoices">Invoices</TabsTrigger>
    <TabsTrigger value="history">History</TabsTrigger>
  </TabsList>

  <TabsContent value="invoices">
    {selectedBooking && (
      <InvoiceCreator
        booking={selectedBooking}
        technician={technician}
        onInvoiceCreated={(invoice) => {
          setSelectedBooking(null);
          // Show success message
        }}
      />
    )}
  </TabsContent>

  <TabsContent value="history">
    <ServiceHistory 
      bookings={completedBookings}
      payments={payments}
      invoices={invoices}
      userRole="technician"
    />
  </TabsContent>
</Tabs>
```

### Admin Panel
Add to `src/pages/AdminPanel.jsx`:

```javascript
import { useState, useEffect } from "react";
import AdminPaymentManagement from "@/components/AdminPaymentManagement";
import { PaymentService } from "@/services/paymentService";
import { InvoiceService } from "@/services/invoiceService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

// Inside your component:
const [payments, setPayments] = useState([]);
const [invoices, setInvoices] = useState([]);

useEffect(() => {
  loadPaymentData();
}, []);

const loadPaymentData = async () => {
  try {
    // Load all payments
    const paymentsSnapshot = await getDocs(collection(db, 'payments'));
    const paymentsData = paymentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPayments(paymentsData);

    // Load all invoices
    const invoicesSnapshot = await getDocs(collection(db, 'invoices'));
    const invoicesData = invoicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setInvoices(invoicesData);
  } catch (error) {
    console.error('Error loading payment data:', error);
  }
};

// Add a new tab:
<Tabs defaultValue="technicians">
  <TabsList>
    <TabsTrigger value="technicians">Technicians</TabsTrigger>
    <TabsTrigger value="payments">Payments & Invoices</TabsTrigger>
  </TabsList>

  <TabsContent value="payments">
    <AdminPaymentManagement
      payments={payments}
      invoices={invoices}
      bookings={bookings}
    />
  </TabsContent>
</Tabs>
```

## Testing

### Test the Payment Flow
1. **As a Technician:**
   - Complete a booking
   - Navigate to the completed booking
   - Click "Create Invoice"
   - Enter service details and pricing
   - Submit invoice

2. **As a Customer:**
   - View your bookings/service history
   - Find the booking with an invoice
   - Click "Pay Now"
   - Enter test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVV
   - Submit payment

3. **As an Admin:**
   - View payment analytics
   - Filter payments by status
   - Search for specific invoices
   - Export data

### Stripe Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

## Common Issues & Solutions

### Issue: "Firebase not initialized"
**Solution:** Ensure your `.env` file has all Firebase credentials and restart the dev server.

### Issue: "Stripe publishable key not found"
**Solution:** Add `VITE_STRIPE_PUBLISHABLE_KEY` to your `.env` file. The key must start with `VITE_` to be accessible in Vite.

### Issue: Payments not appearing in real-time
**Solution:** Check that Firebase listeners are properly set up and unmounted on component cleanup.

### Issue: Permission denied on Firestore
**Solution:** Update Firestore security rules as shown in step 4.

## Production Checklist

Before deploying to production:

- [ ] Replace test Stripe keys with live keys
- [ ] Set up Stripe webhooks for payment confirmations
- [ ] Implement proper server-side payment intent creation
- [ ] Add email notifications for invoices and payments
- [ ] Implement PDF invoice generation
- [ ] Set up proper error logging and monitoring
- [ ] Review and tighten Firestore security rules
- [ ] Add rate limiting for API calls
- [ ] Implement proper user authentication checks
- [ ] Test all payment scenarios thoroughly

## Next Steps

1. **Customize Styling**: Adjust colors and layouts to match your brand
2. **Add Email Notifications**: Integrate SendGrid or similar service
3. **Implement PDF Generation**: Use libraries like jsPDF or PDFKit
4. **Add Analytics**: Track conversion rates and revenue metrics
5. **Implement Refunds**: Add refund functionality for disputes

## Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- Payment System README: `PAYMENT_INVOICING_README.md`

## Getting Help

If you encounter issues:
1. Check browser console for error messages
2. Verify environment variables are loaded correctly
3. Check Firebase console for data and security rule issues
4. Review Stripe dashboard for payment logs
5. Consult the detailed documentation in `PAYMENT_INVOICING_README.md`

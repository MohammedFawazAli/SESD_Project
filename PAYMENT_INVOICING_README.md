# Payment & Invoicing System - HomeEase

## Overview
This document describes the comprehensive payment, invoicing, and service history system integrated into HomeEase. The system enables secure payments through Stripe, invoice generation by technicians, and detailed service history tracking with real-time updates.

## Features Implemented

### 1. Payment Service (`src/services/paymentService.js`)
- **Stripe Integration**: Secure payment processing using Stripe
- **Payment Management**: Create, update, and track payment status
- **Real-time Updates**: Firebase Firestore listeners for instant payment status updates
- **Payment Queries**: Fetch payments by booking, customer, or technician

#### Key Methods:
- `createPayment(paymentData)` - Create a new payment record
- `processPayment(paymentData)` - Process payment through Stripe
- `updatePaymentStatus(paymentId, status)` - Update payment status
- `getPaymentsByBooking(bookingId)` - Get all payments for a booking
- `getPaymentsByCustomer(customerEmail)` - Get customer payment history
- `getPaymentsByTechnician(technicianId)` - Get technician payment records
- `subscribeToPaymentUpdates(paymentId, callback)` - Real-time payment updates
- `subscribeToCustomerPayments(customerEmail, callback)` - Real-time customer payment tracking

### 2. Invoice Service (`src/services/invoiceService.js`)
- **Invoice Generation**: Automatic invoice number generation
- **Pricing Calculation**: Subtotal, tax, and total calculation
- **Invoice Management**: Create, update, and query invoices
- **Payment Integration**: Link invoices with payment records
- **Real-time Sync**: Firebase listeners for invoice status updates

#### Key Methods:
- `createInvoice(invoiceData)` - Generate new invoice
- `updateInvoice(invoiceId, updates)` - Update invoice details
- `getInvoiceById(invoiceId)` - Fetch specific invoice
- `getInvoicesByCustomer(customerEmail)` - Customer invoice history
- `getInvoicesByTechnician(technicianId)` - Technician invoice records
- `getInvoiceByBooking(bookingId)` - Get invoice for a booking
- `markInvoiceAsPaid(invoiceId, paymentId)` - Update invoice payment status
- `calculateTotal(basePrice, additionalCharges, taxRate)` - Calculate invoice totals
- `subscribeToInvoiceUpdates(invoiceId, callback)` - Real-time invoice updates
- `subscribeToCustomerInvoices(customerEmail, callback)` - Real-time customer invoice tracking
- `subscribeToTechnicianInvoices(technicianId, callback)` - Real-time technician invoice tracking

### 3. Service History Component (`src/components/ServiceHistory.jsx`)
- **Comprehensive View**: Display all past services with details
- **Payment Information**: Show payment status and amounts
- **Invoice Details**: Display invoice numbers and totals
- **Filtering**: Filter by status (all, paid, unpaid, completed, etc.)
- **Sorting**: Sort by date or amount
- **Statistics**: Show totals, revenue, and payment analytics
- **Reviews**: Display service reviews and ratings
- **Invoice Download**: Download invoice PDFs (placeholder for future implementation)

#### Props:
- `bookings` - Array of booking records
- `payments` - Array of payment records
- `invoices` - Array of invoice records
- `userRole` - User type (customer, technician, admin)

### 4. Payment Gateway Component (`src/components/PaymentGateway.jsx`)
- **Stripe UI**: Secure card input interface
- **Card Validation**: Real-time card number, expiry, and CVV validation
- **Payment Processing**: Handle payment submission to Stripe
- **Invoice Display**: Show invoice summary before payment
- **Security Indicators**: Display security badges and encryption info

#### Props:
- `invoice` - Invoice object to be paid
- `booking` - Associated booking record
- `onPaymentSuccess` - Callback after successful payment

### 5. Invoice Creator Component (`src/components/InvoiceCreator.jsx`)
- **Technician Interface**: Allow technicians to set service pricing
- **Dynamic Pricing**: Base price + multiple additional charges
- **Auto Calculation**: Automatic subtotal, tax, and total calculation
- **Service Description**: Detailed work description field
- **Validation**: Form validation before invoice creation
- **Real-time Preview**: Live preview of invoice totals

#### Props:
- `booking` - Booking record for invoice generation
- `technician` - Technician details
- `onInvoiceCreated` - Callback after invoice creation

## Database Schema

### Firestore Collections

#### payments
```javascript
{
  id: string,
  bookingId: string,
  invoiceId: string,
  customerEmail: string,
  technicianId: string,
  amount: number,
  currency: string,
  paymentMethod: string,
  status: 'pending' | 'completed' | 'failed',
  stripePaymentIntentId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### invoices
```javascript
{
  id: string,
  invoiceNumber: string,
  bookingId: string,
  customerId: string,
  customerEmail: string,
  customerName: string,
  technicianId: string,
  technicianName: string,
  serviceType: string,
  serviceDescription: string,
  basePrice: number,
  additionalCharges: [
    {
      description: string,
      amount: number
    }
  ],
  subtotal: number,
  tax: number,
  total: number,
  paymentStatus: 'pending' | 'paid' | 'failed',
  paymentId: string,
  status: 'draft' | 'sent' | 'paid' | 'cancelled',
  serviceDate: string,
  completionDate: timestamp,
  paidAt: timestamp,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Integration Guide

### Environment Variables
Add these to your `.env` file:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Firebase Configuration (if not already set)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Customer Dashboard Integration

```javascript
import ServiceHistory from "@/components/ServiceHistory";
import PaymentGateway from "@/components/PaymentGateway";
import { PaymentService } from "@/services/paymentService";
import { InvoiceService } from "@/services/invoiceService";

// In your CustomerDashboard component
const [payments, setPayments] = useState([]);
const [invoices, setInvoices] = useState([]);

useEffect(() => {
  if (user) {
    // Subscribe to real-time payment updates
    const unsubscribePayments = PaymentService.subscribeToCustomerPayments(
      user.email,
      (updatedPayments) => setPayments(updatedPayments)
    );

    // Subscribe to real-time invoice updates
    const unsubscribeInvoices = InvoiceService.subscribeToCustomerInvoices(
      user.email,
      (updatedInvoices) => setInvoices(updatedInvoices)
    );

    return () => {
      unsubscribePayments();
      unsubscribeInvoices();
    };
  }
}, [user]);

// Use in component
<ServiceHistory 
  bookings={bookings}
  payments={payments}
  invoices={invoices}
  userRole="customer"
/>
```

### Technician Dashboard Integration

```javascript
import InvoiceCreator from "@/components/InvoiceCreator";
import ServiceHistory from "@/components/ServiceHistory";
import { InvoiceService } from "@/services/invoiceService";
import { PaymentService } from "@/services/paymentService";

// In your TechnicianDashboard component
const [invoices, setInvoices] = useState([]);
const [payments, setPayments] = useState([]);

useEffect(() => {
  if (technician) {
    // Subscribe to real-time invoice updates
    const unsubscribeInvoices = InvoiceService.subscribeToTechnicianInvoices(
      technician.id,
      (updatedInvoices) => setInvoices(updatedInvoices)
    );

    // Subscribe to real-time payment updates
    const unsubscribePayments = PaymentService.subscribeToTechnician(
      technician.id,
      (updatedPayments) => setPayments(updatedPayments)
    );

    return () => {
      unsubscribeInvoices();
      unsubscribePayments();
    };
  }
}, [technician]);

// Use in component
<InvoiceCreator
  booking={completedBooking}
  technician={technician}
  onInvoiceCreated={(invoice) => {
    // Handle invoice creation
    queryClient.invalidateQueries(['technician-invoices']);
  }}
/>
```

## Workflow

### Complete Service Flow
1. **Customer books service** → Booking created
2. **Technician accepts** → Booking status: "accepted"
3. **Technician completes work** → Booking status: "completed"
4. **Technician creates invoice** → Invoice generated with pricing
5. **Customer receives notification** → Real-time update via Firebase
6. **Customer makes payment** → Payment processed via Stripe
7. **Payment confirmed** → Invoice marked as paid, booking status: "work_accepted"
8. **Service history updated** → All parties see updated records

## Real-time Updates

All users (customers, technicians, and admins) receive real-time updates through Firebase Firestore listeners:

- **Payment Status Changes**: Instant notification when payment is processed
- **Invoice Creation**: Customers immediately see new invoices
- **Payment Receipt**: Technicians see when customers pay
- **Service History**: All parties see updated service records

## Security Considerations

1. **PCI Compliance**: Never store card details - use Stripe's secure tokenization
2. **Firebase Rules**: Implement proper Firestore security rules
3. **Environment Variables**: Keep Stripe keys secure and never commit to version control
4. **SSL/TLS**: Always use HTTPS for payment pages
5. **Input Validation**: Validate all payment and invoice data server-side
6. **Audit Trail**: All payment and invoice actions are logged with timestamps

## Future Enhancements

1. **PDF Generation**: Implement actual PDF invoice generation
2. **Email Notifications**: Send email when invoices are created or paid
3. **Refunds**: Add refund functionality
4. **Recurring Payments**: Support for subscription-based services
5. **Multiple Payment Methods**: Add PayPal, Apple Pay, Google Pay
6. **Payment Plans**: Allow installment payments
7. **Analytics Dashboard**: Detailed revenue and payment analytics
8. **Dispute Management**: Handle payment disputes and chargebacks
9. **Automated Reminders**: Send payment reminders for unpaid invoices
10. **Tax Management**: Support for different tax rates by location

## Testing

### Test Cards (Stripe Test Mode)
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995
- **3D Secure**: 4000 0027 6000 3184

Use any future expiry date and any 3-digit CVV.

## Support

For issues or questions:
1. Check Stripe documentation: https://stripe.com/docs
2. Check Firebase documentation: https://firebase.google.com/docs
3. Review component prop types and error messages
4. Check browser console for detailed error logs

## License

This payment and invoicing system is part of the HomeEase application.

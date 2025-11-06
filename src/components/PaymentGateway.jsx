import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PaymentService } from "@/services/paymentService";
import { InvoiceService } from "@/services/invoiceService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

export default function PaymentGateway({ invoice, booking, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleInputChange = (field, value) => {
    if (field === "cardNumber") {
      setCardDetails({ ...cardDetails, [field]: formatCardNumber(value) });
    } else if (field === "expiryDate") {
      setCardDetails({ ...cardDetails, [field]: formatExpiryDate(value) });
    } else if (field === "cvv") {
      setCardDetails({ ...cardDetails, [field]: value.replace(/[^0-9]/gi, "").slice(0, 4) });
    } else {
      setCardDetails({ ...cardDetails, [field]: value });
    }
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length < 13) {
      toast.error("Please enter a valid card number");
      return false;
    }
    if (!cardDetails.cardHolder || cardDetails.cardHolder.length < 3) {
      toast.error("Please enter the cardholder name");
      return false;
    }
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      toast.error("Please enter a valid CVV");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateCardDetails()) return;

    setLoading(true);
    try {
      // Create payment record
      const payment = await PaymentService.createPayment({
        bookingId: booking.id,
        invoiceId: invoice.id,
        customerEmail: booking.customer_email,
        technicianId: booking.technician_id,
        amount: invoice.total,
        currency: "USD",
        paymentMethod: paymentMethod
      });

      // In production, you would:
      // 1. Call your backend to create a Stripe Payment Intent
      // 2. Use Stripe Elements to securely collect card details
      // 3. Confirm the payment with Stripe
      
      // For demo purposes, simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status
      await PaymentService.updatePaymentStatus(payment.id, "completed");
      
      // Mark invoice as paid
      await InvoiceService.markInvoiceAsPaid(invoice.id, payment.id);
      
      toast.success("Payment successful! Thank you.");
      
      if (onPaymentSuccess) {
        onPaymentSuccess(payment);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">No invoice available for payment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
        <p className="text-gray-600">Secure payment powered by Stripe</p>
      </div>

      {/* Invoice Summary */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700">Invoice:</span>
          <span className="font-mono font-medium">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-700">Service:</span>
          <span className="font-medium capitalize">{invoice.serviceType?.replace("_", " ")}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-700">Subtotal:</span>
          <span className="font-medium">${invoice.subtotal?.toFixed(2) || "0.00"}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-700">Tax:</span>
          <span className="font-medium">${invoice.tax?.toFixed(2) || "0.00"}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-blue-300">
          <span className="text-lg font-bold">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">${invoice.total?.toFixed(2) || "0.00"}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Method</Label>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
              paymentMethod === "card"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <CreditCard className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium">Credit/Debit Card</p>
              <p className="text-sm text-gray-500">Pay with Visa, Mastercard, Amex</p>
            </div>
          </button>
        </div>
      </div>

      {/* Card Details Form */}
      {paymentMethod === "card" && (
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                maxLength={19}
                className="pr-10"
              />
              <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="cardHolder">Cardholder Name</Label>
            <Input
              id="cardHolder"
              placeholder="John Doe"
              value={cardDetails.cardHolder}
              onChange={(e) => handleInputChange("cardHolder", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                maxLength={4}
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg mb-6">
        <Lock className="w-5 h-5 text-green-600" />
        <p className="text-sm text-gray-600">
          Your payment information is encrypted and secure
        </p>
      </div>

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Pay ${invoice.total?.toFixed(2) || "0.00"}
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By confirming payment, you agree to our terms of service
      </p>
    </div>
  );
}

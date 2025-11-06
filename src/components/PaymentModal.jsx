import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CreditCard, CheckCircle, Loader2, Building2 } from "lucide-react";

export default function PaymentModal({ isOpen, onClose, booking, onPaymentSuccess }) {
  const [step, setStep] = useState(1); // 1: Payment details, 2: Connecting, 3: Success
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep(2); // Show connecting state

    // Simulate payment processing
    setTimeout(() => {
      setStep(3); // Show success
      
      // Call success callback after a short delay
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    if (step === 3) {
      // Reset form when closing after success
      setStep(1);
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setCardName("");
    }
    onClose();
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 && "Complete Payment"}
            {step === 2 && "Processing Payment"}
            {step === 3 && "Payment Successful"}
          </h2>
          {step !== 2 && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booking Summary */}
          {step === 1 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Service:</span> {booking?.service_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</p>
                <p><span className="font-medium">Technician:</span> {booking?.technician_name || 'N/A'}</p>
                <p><span className="font-medium">Hours:</span> {booking?.hours || 1} hour(s)</p>
                <p><span className="font-medium">Rate:</span> ${booking?.hourly_rate || 100}/hr</p>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <p className="text-lg font-bold text-gray-900">
                    <span className="font-medium">Total:</span> ${booking?.total_amount || 100}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Payment Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ${booking?.total_amount || 100}
              </Button>
            </form>
          )}

          {/* Step 2: Connecting to Bank */}
          {step === 2 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connecting to Bank...
              </h3>
              <p className="text-gray-600">
                Please wait while we process your payment securely
              </p>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your payment of ${booking?.total_amount || 100} has been processed successfully.
              </p>
              <Button
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-700"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

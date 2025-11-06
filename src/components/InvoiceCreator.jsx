import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FileText, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceService } from "@/services/invoiceService";

export default function InvoiceCreator({ booking, technician, onInvoiceCreated }) {
  const [loading, setLoading] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [notes, setNotes] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");

  const TAX_RATE = 0.1; // 10% tax rate

  const addCharge = () => {
    setAdditionalCharges([
      ...additionalCharges,
      { description: "", amount: "" }
    ]);
  };

  const removeCharge = (index) => {
    const updated = additionalCharges.filter((_, i) => i !== index);
    setAdditionalCharges(updated);
  };

  const updateCharge = (index, field, value) => {
    const updated = [...additionalCharges];
    updated[index][field] = value;
    setAdditionalCharges(updated);
  };

  const calculateTotals = () => {
    const base = parseFloat(basePrice) || 0;
    const additional = additionalCharges.reduce((sum, charge) => {
      return sum + (parseFloat(charge.amount) || 0);
    }, 0);
    
    const subtotal = base + additional;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const totals = calculateTotals();

  const validateInvoice = () => {
    if (!basePrice || parseFloat(basePrice) <= 0) {
      toast.error("Please enter a valid base price");
      return false;
    }
    if (!serviceDescription || serviceDescription.trim().length < 5) {
      toast.error("Please provide a service description (minimum 5 characters)");
      return false;
    }
    
    for (let i = 0; i < additionalCharges.length; i++) {
      const charge = additionalCharges[i];
      if (!charge.description || charge.description.trim().length === 0) {
        toast.error(`Please enter description for charge #${i + 1}`);
        return false;
      }
      if (!charge.amount || parseFloat(charge.amount) <= 0) {
        toast.error(`Please enter a valid amount for charge #${i + 1}`);
        return false;
      }
    }
    
    return true;
  };

  const handleCreateInvoice = async () => {
    if (!validateInvoice()) return;

    setLoading(true);
    try {
      const invoiceData = {
        bookingId: booking.id,
        customerId: booking.customer_id,
        customerEmail: booking.customer_email,
        customerName: booking.customer_name,
        technicianId: technician.id,
        technicianName: technician.full_name,
        serviceType: booking.service_type,
        serviceDescription: serviceDescription,
        basePrice: parseFloat(basePrice),
        additionalCharges: additionalCharges.map(charge => ({
          description: charge.description,
          amount: parseFloat(charge.amount)
        })),
        subtotal: parseFloat(totals.subtotal),
        tax: parseFloat(totals.tax),
        total: parseFloat(totals.total),
        serviceDate: booking.booking_date,
        notes: notes
      };

      const invoice = await InvoiceService.createInvoice(invoiceData);
      
      // Update invoice status to 'sent'
      await InvoiceService.updateInvoice(invoice.id, { status: 'sent' });
      
      toast.success("Invoice created and sent to customer!");
      
      if (onInvoiceCreated) {
        onInvoiceCreated(invoice);
      }

      // Reset form
      setBasePrice("");
      setAdditionalCharges([]);
      setNotes("");
      setServiceDescription("");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Create Invoice
        </h2>
        <p className="text-gray-600">Generate invoice for completed service</p>
      </div>

      {/* Booking Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Service Details</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Customer:</span>
            <span className="ml-2 font-medium">{booking.customer_name}</span>
          </div>
          <div>
            <span className="text-gray-600">Service:</span>
            <span className="ml-2 font-medium capitalize">{booking.service_type?.replace("_", " ")}</span>
          </div>
          <div>
            <span className="text-gray-600">Date:</span>
            <span className="ml-2 font-medium">{new Date(booking.booking_date).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Time:</span>
            <span className="ml-2 font-medium">{booking.time_slot}</span>
          </div>
        </div>
      </div>

      {/* Service Description */}
      <div className="mb-6">
        <Label htmlFor="serviceDescription">Service Description *</Label>
        <Textarea
          id="serviceDescription"
          placeholder="Describe the work performed in detail..."
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          rows={3}
          className="mt-2"
        />
      </div>

      {/* Base Price */}
      <div className="mb-6">
        <Label htmlFor="basePrice">Base Service Price *</Label>
        <div className="relative mt-2">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Additional Charges */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Label>Additional Charges</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCharge}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Charge
          </Button>
        </div>

        <div className="space-y-3">
          {additionalCharges.map((charge, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Description (e.g., Parts, Materials)"
                value={charge.description}
                onChange={(e) => updateCharge(index, "description", e.target.value)}
                className="flex-1"
              />
              <div className="relative w-32">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={charge.amount}
                  onChange={(e) => updateCharge(index, "amount", e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeCharge(index)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Totals */}
      <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-medium">${totals.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax (10%):</span>
            <span className="font-medium">${totals.tax}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-blue-900 pt-2 border-t border-blue-300">
            <span>Total Amount:</span>
            <span>${totals.total}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes for the customer..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-2"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleCreateInvoice}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating Invoice...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5 mr-2" />
            Create & Send Invoice
          </>
        )}
      </Button>
    </div>
  );
}

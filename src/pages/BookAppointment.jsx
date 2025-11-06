import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TechnicianService } from "@/services/technicianService";
import { BookingService } from "@/services/bookingService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function BookAppointment() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const technicianId = urlParams.get('id');

  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [technician, setTechnician] = useState(null);
  const [isLoadingTech, setIsLoadingTech] = useState(true);
  const [hours, setHours] = useState(1);
  const [hourlyRate] = useState(100); // Default $100/hr

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setCustomerName(userData.full_name || "");
      setCustomerPhone(userData.phone || "");
    } catch (error) {
      toast.error("Please login to book an appointment");
      base44.auth.redirectToLogin(window.location.pathname + window.location.search);
    }
  };

  // Real-time subscription to technician
  useEffect(() => {
    if (!technicianId) return;
    
    setIsLoadingTech(true);
    const unsubscribe = TechnicianService.subscribeToTechnician(technicianId, (tech) => {
      setTechnician(tech);
      setIsLoadingTech(false);
    });

    return () => {
      unsubscribe();
    };
  }, [technicianId]);

  const createBookingMutation = useMutation({
    mutationFn: (bookingData) => BookingService.createBooking(bookingData),
    onSuccess: () => {
      toast.success("Booking request sent! Awaiting technician confirmation.");
      navigate(createPageUrl("CustomerDashboard"));
      // Real-time subscription will automatically update the UI
    },
    onError: () => {
      toast.error("Failed to create booking. Please try again.");
    },
  });

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!timeSlot) {
      toast.error("Please select a time slot");
      return;
    }

    const bookingData = {
      customer_email: user.email,
      customer_name: customerName,
      customer_phone: customerPhone,
      technician_id: String(technician.id), // Use Firebase document ID
      technician_name: technician.full_name,
      service_type: technician.service_type,
      booking_date: selectedDate.toISOString().split('T')[0],
      time_slot: timeSlot,
      notes: notes,
      hours: parseInt(hours) || 1,
      hourly_rate: hourlyRate,
      total_amount: (parseInt(hours) || 1) * hourlyRate,
      payment_status: "pending",
      status: "pending",
    };

    createBookingMutation.mutate(bookingData);
  };

  // Loading state: check if technician is loading or user is not loaded yet
  if (isLoadingTech || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  // No technician ID or technician not found
  if (!technicianId || !technician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No technician selected or technician not found</p>
          <Link to={createPageUrl("BrowseTechnicians")}>
            <Button>Browse Technicians</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to={createPageUrl("TechnicianProfile") + `?id=${technicianId}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
            <p className="text-gray-600">Fill in the details to schedule your service</p>
          </div>

          {/* Technician Info */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                {technician?.full_name?.charAt(0) || "T"}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{technician?.full_name}</h3>
                <p className="text-blue-600 font-medium capitalize">
                  {technician?.service_type?.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
                Your Name
              </Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="h-12"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <Label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="h-12"
              />
            </div>

            {/* Date Selection */}
            <div>
              <Label className="text-gray-700 font-medium mb-2 block flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Select Date
              </Label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0,0,0,0))}
                  className="mx-auto"
                />
              </div>
              {selectedDate && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>

            {/* Time Slot */}
            <div>
              <Label className="text-gray-700 font-medium mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time Slot
              </Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hours */}
            <div>
              <Label htmlFor="hours" className="text-gray-700 font-medium mb-2 block">
                Estimated Hours
              </Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="1"
                required
                className="h-12"
              />
              <p className="mt-1 text-sm text-gray-500">
                Rate: ${hourlyRate}/hr • Total: ${(parseInt(hours) || 1) * hourlyRate}
              </p>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-gray-700 font-medium mb-2 block">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements or details..."
                className="h-24 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={createBookingMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg transition-transform hover:scale-105"
            >
              {createBookingMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Booking
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
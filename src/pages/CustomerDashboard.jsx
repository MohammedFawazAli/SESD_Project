import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BookingService } from "@/services/bookingService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Clock, User, XCircle, CheckCircle, 
  Loader2, AlertCircle, Star, Phone, ThumbsUp, CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import PaymentModal from "@/components/PaymentModal";

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      base44.auth.redirectToLogin(createPageUrl("CustomerDashboard"));
    }
  };

  // Real-time subscription to customer bookings
  useEffect(() => {
    if (!user?.email) return;
    
    setIsLoading(true);
    const unsubscribe = BookingService.subscribeToCustomerBookings(user.email, (updatedBookings) => {
      setBookings(updatedBookings);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [user]);

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId) => BookingService.updateBooking(bookingId, { status: 'cancelled' }),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      // Real-time subscription will automatically update the UI
    },
  });

  const acceptWorkMutation = useMutation({
    mutationFn: (bookingId) => BookingService.updateBooking(bookingId, { status: 'work_accepted' }),
    onSuccess: () => {
      toast.success("Work accepted! Thank you for your feedback.");
      // Real-time subscription will automatically update the UI
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ bookingId, paymentStatus }) => 
      BookingService.updateBooking(bookingId, { payment_status: paymentStatus }),
    onSuccess: () => {
      toast.success("Payment status updated!");
    },
  });

  const handlePaymentSuccess = () => {
    if (selectedBookingForPayment) {
      updatePaymentStatusMutation.mutate({
        bookingId: selectedBookingForPayment.id,
        paymentStatus: 'paid'
      });
      setIsPaymentModalOpen(false);
      setSelectedBookingForPayment(null);
    }
  };

  const handleCallTechnician = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const filteredBookings = statusFilter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const statusConfig = {
    pending: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: Clock,
      label: "Pending"
    },
    accepted: { 
      color: "bg-green-100 text-green-800 border-green-200", 
      icon: CheckCircle,
      label: "Accepted"
    },
    rejected: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      icon: XCircle,
      label: "Rejected"
    },
    completed: { 
      color: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: Star,
      label: "Completed"
    },
    work_accepted: { 
      color: "bg-purple-100 text-purple-800 border-purple-200", 
      icon: ThumbsUp,
      label: "Work Accepted"
    },
    cancelled: { 
      color: "bg-gray-100 text-gray-800 border-gray-200", 
      icon: AlertCircle,
      label: "Cancelled"
    },
  };

  const serviceLabels = {
    electrician: "Electrician",
    plumber: "Plumber",
    carpenter: "Carpenter",
    ac_repair: "AC Repair",
    painter: "Painter",
    cleaning: "Cleaning",
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-lg text-gray-600">Manage your service appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Accepted</p>
            <p className="text-3xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'accepted').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-100">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === "all" ? "No bookings yet" : `No ${statusFilter} bookings`}
            </h3>
            <p className="text-gray-600 mb-6">
              Start by booking a service from our trusted technicians
            </p>
            <Link to={createPageUrl("BrowseTechnicians")}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Technicians
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const StatusIcon = statusConfig[booking.status]?.icon || AlertCircle;
              
              return (
                <div 
                  key={booking.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {booking.technician_name?.charAt(0) || "T"}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {booking.technician_name}
                              </h3>
                              <p className="text-blue-600 font-medium capitalize">
                                {serviceLabels[booking.service_type]}
                              </p>
                            </div>
                            <Badge className={`${statusConfig[booking.status]?.color} border font-medium`}>
                              <StatusIcon className="w-4 h-4 mr-1" />
                              {statusConfig[booking.status]?.label}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-3 mt-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.booking_date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{booking.time_slot}</span>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {booking.notes}
                              </p>
                            </div>
                          )}

                          {booking.rejection_reason && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm text-red-700">
                                <span className="font-medium">Rejection Reason:</span> {booking.rejection_reason}
                              </p>
                            </div>
                          )}

                          {/* Payment Info */}
                          {(booking.total_amount || booking.hourly_rate) && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Hours:</span> {booking.hours || 1} hr
                                    {booking.hourly_rate && (
                                      <span> • <span className="font-medium">Rate:</span> ${booking.hourly_rate}/hr</span>
                                    )}
                                  </p>
                                  <p className="text-lg font-bold text-gray-900 mt-1">
                                    Total: ${booking.total_amount || booking.hourly_rate || 100}
                                  </p>
                                </div>
                                {booking.status === 'completed' && (
                                  <Badge 
                                    className={
                                      booking.payment_status === 'paid' 
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    }
                                  >
                                    {booking.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2">
                      {booking.status === 'pending' && (
                        <Button
                          variant="outline"
                          onClick={() => cancelBookingMutation.mutate(booking.id)}
                          disabled={cancelBookingMutation.isPending}
                          className="text-red-600 hover:bg-red-50 border-red-200"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          {booking.payment_status !== 'paid' && (
                            <Button
                              onClick={() => {
                                setSelectedBookingForPayment(booking);
                                setIsPaymentModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                          {booking.payment_status === 'paid' && booking.status !== 'work_accepted' && (
                            <Button
                              onClick={() => acceptWorkMutation.mutate(booking.id)}
                              disabled={acceptWorkMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Accept Work
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => handleCallTechnician(booking.technician_phone || '555-000-0000')}
                            className="text-blue-600 hover:bg-blue-50 border-blue-200"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Tech
                          </Button>
                        </>
                      )}
                      {booking.status === 'accepted' && (
                        <Button
                          variant="outline"
                          onClick={() => handleCallTechnician(booking.technician_phone || '555-000-0000')}
                          className="text-blue-600 hover:bg-blue-50 border-blue-200"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Tech
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedBookingForPayment(null);
          }}
          booking={selectedBookingForPayment}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
}
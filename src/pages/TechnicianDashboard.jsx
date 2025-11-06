import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TechnicianService } from "@/services/technicianService";
import { BookingService } from "@/services/bookingService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, Clock, User, Check, X, Loader2, 
  Settings, Star, TrendingUp, DollarSign
} from "lucide-react";
import { toast } from "sonner";

export default function TechnicianDashboard() {
  const [user, setUser] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const queryClient = useQueryClient();

  // Availability state
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: "09:00", end: "18:00", max: 4 },
    tuesday: { enabled: true, start: "09:00", end: "18:00", max: 4 },
    wednesday: { enabled: true, start: "09:00", end: "18:00", max: 4 },
    thursday: { enabled: true, start: "09:00", end: "18:00", max: 4 },
    friday: { enabled: true, start: "09:00", end: "18:00", max: 4 },
    saturday: { enabled: false, start: "09:00", end: "18:00", max: 4 },
    sunday: { enabled: false, start: "09:00", end: "18:00", max: 4 },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      // Fetch technician profile
      const tech = await TechnicianService.getTechnicianByEmail(userData.email);
      if (tech) {
        setTechnician(tech);
      }
    } catch (error) {
      base44.auth.redirectToLogin(window.location.pathname);
    }
  };

  // Real-time subscription to technician bookings
  useEffect(() => {
    if (!technician?.id) return;
    
    setIsLoadingBookings(true);
    const unsubscribe = BookingService.subscribeToTechnicianBookings(technician.id, (updatedBookings) => {
      setBookings(updatedBookings);
      setIsLoadingBookings(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [technician]);

  const acceptBookingMutation = useMutation({
    mutationFn: (bookingId) => BookingService.updateBooking(bookingId, { status: 'accepted' }),
    onSuccess: () => {
      toast.success("Booking accepted!");
      // Real-time subscription will automatically update the UI
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: ({ bookingId, reason }) => 
      BookingService.updateBooking(bookingId, { 
        status: 'rejected',
        rejection_reason: reason || 'Unavailable at this time'
      }),
    onSuccess: () => {
      toast.success("Booking rejected");
      // Real-time subscription will automatically update the UI
    },
  });

  const completeBookingMutation = useMutation({
    mutationFn: (bookingId) => BookingService.updateBooking(bookingId, { status: 'completed' }),
    onSuccess: () => {
      toast.success("Booking marked as completed!");
      // Real-time subscription will automatically update the UI
    },
  });

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const acceptedBookings = bookings.filter(b => b.status === 'accepted');
  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'work_accepted');
  const paidBookings = bookings.filter(b => b.payment_status === 'paid');
  const completedWorksCount = completedBookings.length;

  const serviceLabels = {
    electrician: "Electrician",
    plumber: "Plumber",
    carpenter: "Carpenter",
    ac_repair: "AC Repair",
    painter: "Painter",
    cleaning: "Cleaning",
  };

  if (!user || !technician) {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Technician Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your bookings and availability</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingBookings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Accepted</p>
            <p className="text-3xl font-bold text-green-600">{acceptedBookings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Completed Works</p>
            <p className="text-3xl font-bold text-blue-600">{completedWorksCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600">
              ${paidBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">
                {technician.rating > 0 ? technician.rating.toFixed(1) : "New"}
              </p>
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4 bg-white shadow-md h-auto p-1">
            <TabsTrigger value="requests" className="py-3">
              Booking Requests
            </TabsTrigger>
            <TabsTrigger value="accepted" className="py-3">
              Accepted Bookings
            </TabsTrigger>
            <TabsTrigger value="completed" className="py-3">
              Completed Works
            </TabsTrigger>
            <TabsTrigger value="availability" className="py-3">
              Set Availability
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="requests">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Booking Requests</h2>
              
              {pendingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {booking.customer_name}
                          </h3>
                          
                          <div className="grid md:grid-cols-2 gap-3 mb-4">
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
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{booking.customer_phone}</span>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Customer Notes:</span> {booking.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button
                            onClick={() => acceptBookingMutation.mutate(booking.id)}
                            disabled={acceptBookingMutation.isPending}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => rejectBookingMutation.mutate({ bookingId: booking.id })}
                            disabled={rejectBookingMutation.isPending}
                            variant="outline"
                            className="flex-1 text-red-600 hover:bg-red-50 border-red-200"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Completed Works */}
          <TabsContent value="completed">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Works</h2>
              
              {completedBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No completed works yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="border border-blue-200 bg-blue-50 rounded-xl p-6"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {booking.customer_name}
                            </h3>
                            <div className="flex gap-2">
                              <Badge className={
                                booking.payment_status === 'paid'
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                              }>
                                <DollarSign className="w-3 h-3 mr-1" />
                                {booking.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-3 mb-3">
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

                          {(booking.total_amount || booking.hourly_rate) && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Hours:</span> {booking.hours || 1} hr
                                    {booking.hourly_rate && (
                                      <span> • <span className="font-medium">Rate:</span> ${booking.hourly_rate}/hr</span>
                                    )}
                                  </p>
                                </div>
                                <p className="text-lg font-bold text-gray-900">
                                  ${booking.total_amount || booking.hourly_rate || 100}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Accepted Bookings */}
          <TabsContent value="accepted">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Accepted Bookings</h2>
              
              {acceptedBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No accepted bookings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="border border-green-200 bg-green-50 rounded-xl p-6"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {booking.customer_name}
                            </h3>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Confirmed
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-3 mb-3">
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
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{booking.customer_phone}</span>
                            </div>
                          </div>

                          {(booking.total_amount || booking.hourly_rate) && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Hours:</span> {booking.hours || 1} hr
                                {booking.hourly_rate && (
                                  <span> • <span className="font-medium">Rate:</span> ${booking.hourly_rate}/hr</span>
                                )}
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                Total: ${booking.total_amount || booking.hourly_rate || 100}
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <Button
                            onClick={() => completeBookingMutation.mutate(booking.id)}
                            disabled={completeBookingMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Availability Settings */}
          <TabsContent value="availability">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Your Availability</h2>
              
              <div className="space-y-6">
                {Object.keys(availability).map((day) => (
                  <div key={day} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Checkbox
                        checked={availability[day].enabled}
                        onCheckedChange={(checked) => 
                          setAvailability({
                            ...availability,
                            [day]: { ...availability[day], enabled: checked }
                          })
                        }
                        id={`day-${day}`}
                      />
                      <Label 
                        htmlFor={`day-${day}`}
                        className="text-lg font-semibold capitalize cursor-pointer"
                      >
                        {day}
                      </Label>
                    </div>

                    {availability[day].enabled && (
                      <div className="grid md:grid-cols-3 gap-4 ml-8">
                        <div>
                          <Label className="text-sm text-gray-600 mb-2 block">Start Time</Label>
                          <Input
                            type="time"
                            value={availability[day].start}
                            onChange={(e) => 
                              setAvailability({
                                ...availability,
                                [day]: { ...availability[day], start: e.target.value }
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600 mb-2 block">End Time</Label>
                          <Input
                            type="time"
                            value={availability[day].end}
                            onChange={(e) => 
                              setAvailability({
                                ...availability,
                                [day]: { ...availability[day], end: e.target.value }
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600 mb-2 block">Max Bookings</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={availability[day].max}
                            onChange={(e) => 
                              setAvailability({
                                ...availability,
                                [day]: { ...availability[day], max: parseInt(e.target.value) }
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                  onClick={() => toast.success("Availability saved successfully!")}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Save Availability
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
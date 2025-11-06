import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TechnicianService } from "@/services/technicianService";
import { BookingService } from "@/services/bookingService";
import { useMutation } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, CheckCircle, XCircle, Loader2, 
  Shield, Calendar, TrendingUp 
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [pendingTechnicians, setPendingTechnicians] = useState([]);
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await base44.auth.me();
      if (userData.role !== 'admin') {
        toast.error("Access denied. Admin only.");
        window.location.href = '/';
        return;
      }
      setUser(userData);
    } catch (error) {
      base44.auth.redirectToLogin(window.location.pathname);
    }
  };

  // Real-time subscription to all technicians
  useEffect(() => {
    const unsubscribe = TechnicianService.subscribeToAllTechnicians((technicians) => {
      setAllTechnicians(technicians);
      setPendingTechnicians(technicians.filter(t => !t.approved));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Real-time subscription to all bookings
  useEffect(() => {
    const unsubscribe = BookingService.subscribeToAllBookings((bookings) => {
      setAllBookings(bookings);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Note: Users are still managed via mock database, can be migrated to Firebase later
  const [allUsers, setAllUsers] = useState([]);

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await base44.entities.User.list();
        setAllUsers(users);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, []);

  const approveTechnicianMutation = useMutation({
    mutationFn: (techId) => TechnicianService.updateTechnician(techId, { approved: true }),
    onSuccess: () => {
      toast.success("Technician approved!");
      // Real-time subscription will automatically update the UI
    },
  });

  const rejectTechnicianMutation = useMutation({
    mutationFn: (techId) => TechnicianService.updateTechnician(techId, { active: false }),
    onSuccess: () => {
      toast.success("Technician application rejected");
      // Real-time subscription will automatically update the UI
    },
  });

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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-lg text-gray-600">Manage users, technicians, and bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{allUsers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Technicians</p>
            <p className="text-3xl font-bold text-blue-600">{allTechnicians.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-green-600">{allBookings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingTechnicians.length}</p>
          </div>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-md h-auto p-1">
            <TabsTrigger value="approvals" className="py-3">
              Pending Approvals
            </TabsTrigger>
            <TabsTrigger value="technicians" className="py-3">
              All Technicians
            </TabsTrigger>
            <TabsTrigger value="bookings" className="py-3">
              All Bookings
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals */}
          <TabsContent value="approvals">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Technician Applications
              </h2>
              
              {pendingTechnicians.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending applications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTechnicians.map((tech) => (
                    <div 
                      key={tech.id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {tech.full_name}
                          </h3>
                          <div className="space-y-2 text-gray-600">
                            <p><strong>Service:</strong> {serviceLabels[tech.service_type]}</p>
                            <p><strong>Experience:</strong> {tech.experience_years} years</p>
                            <p><strong>Location:</strong> {tech.location}</p>
                            <p><strong>Phone:</strong> {tech.phone}</p>
                            <p><strong>Email:</strong> {tech.user_email}</p>
                            {tech.description && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm">{tech.description}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button
                            onClick={() => approveTechnicianMutation.mutate(tech.id)}
                            disabled={approveTechnicianMutation.isPending}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => rejectTechnicianMutation.mutate(tech.id)}
                            disabled={rejectTechnicianMutation.isPending}
                            variant="outline"
                            className="flex-1 text-red-600 hover:bg-red-50 border-red-200"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
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

          {/* All Technicians */}
          <TabsContent value="technicians">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Technicians ({allTechnicians.length})
              </h2>
              
              <div className="space-y-3">
                {allTechnicians.map((tech) => (
                  <div 
                    key={tech.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-lg font-bold">
                        {tech.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{tech.full_name}</h4>
                        <p className="text-sm text-gray-600">
                          {serviceLabels[tech.service_type]} • {tech.location}
                        </p>
                      </div>
                    </div>
                    <Badge className={tech.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {tech.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* All Bookings */}
          <TabsContent value="bookings">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Bookings ({allBookings.length})
              </h2>
              
              <div className="space-y-3">
                {allBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {booking.customer_name} → {booking.technician_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {serviceLabels[booking.service_type]} • {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                      {(booking.total_amount || booking.hourly_rate) && (
                        <p className="text-sm text-gray-600 mt-1">
                          ${booking.total_amount || booking.hourly_rate || 100} 
                          {booking.hours && ` (${booking.hours} hr${booking.hours > 1 ? 's' : ''})`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge 
                        className={
                          booking.status === 'completed' ? "bg-blue-100 text-blue-800" :
                          booking.status === 'accepted' ? "bg-green-100 text-green-800" :
                          booking.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {booking.status}
                      </Badge>
                      {booking.status === 'completed' && (
                        <Badge 
                          className={
                            booking.payment_status === 'paid' 
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {booking.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
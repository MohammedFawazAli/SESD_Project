import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, DollarSign, FileText, Star, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ServiceHistory({ bookings, payments, invoices, userRole }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const serviceLabels = {
    electrician: "Electrician",
    plumber: "Plumber",
    carpenter: "Carpenter",
    ac_repair: "AC Repair",
    painter: "Painter",
    cleaning: "Cleaning",
  };

  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
    accepted: { color: "bg-green-100 text-green-800 border-green-200", label: "Accepted" },
    rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
    completed: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Completed" },
    work_accepted: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Work Accepted" },
    cancelled: { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Cancelled" },
  };

  const paymentStatusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", label: "Payment Pending" },
    completed: { color: "bg-green-100 text-green-800", label: "Paid" },
    failed: { color: "bg-red-100 text-red-800", label: "Payment Failed" },
  };

  // Enrich bookings with payment and invoice data
  const enrichedBookings = bookings.map(booking => {
    const bookingPayments = payments?.filter(p => p.bookingId === booking.id) || [];
    const bookingInvoice = invoices?.find(inv => inv.bookingId === booking.id);
    
    return {
      ...booking,
      payments: bookingPayments,
      invoice: bookingInvoice,
      totalPaid: bookingPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0)
    };
  });

  // Filter bookings
  const filteredBookings = enrichedBookings.filter(booking => {
    if (filter === "all") return true;
    if (filter === "paid") return booking.invoice?.paymentStatus === "paid";
    if (filter === "unpaid") return booking.invoice?.paymentStatus !== "paid" && booking.status === "completed";
    return booking.status === filter;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.booking_date) - new Date(a.booking_date);
    } else if (sortBy === "date-asc") {
      return new Date(a.booking_date) - new Date(b.booking_date);
    } else if (sortBy === "amount-desc") {
      return (b.invoice?.total || 0) - (a.invoice?.total || 0);
    }
    return 0;
  });

  // Calculate statistics
  const stats = {
    total: enrichedBookings.length,
    completed: enrichedBookings.filter(b => b.status === "completed" || b.status === "work_accepted").length,
    totalRevenue: enrichedBookings.reduce((sum, b) => sum + (b.invoice?.total || 0), 0),
    totalPaid: enrichedBookings.reduce((sum, b) => sum + b.totalPaid, 0),
    pending: enrichedBookings.filter(b => b.invoice?.paymentStatus === "pending").length
  };

  const downloadInvoice = (invoice) => {
    // In production, this would generate a PDF
    console.log("Downloading invoice:", invoice);
    alert(`Invoice ${invoice.invoiceNumber} download functionality would be implemented here`);
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Services</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
          <p className="text-3xl font-bold text-purple-600">${stats.totalPaid.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Tabs value={filter} onValueChange={setFilter} className="flex-1">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-100">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Service History List */}
      {sortedBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No service history</h3>
          <p className="text-gray-600">Your service history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left side - Service Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {userRole === "customer" ? booking.technician_name : booking.customer_name}
                      </h3>
                      <p className="text-blue-600 font-medium capitalize">
                        {serviceLabels[booking.service_type]}
                      </p>
                    </div>
                    <Badge className={`${statusConfig[booking.status]?.color} border font-medium`}>
                      {statusConfig[booking.status]?.label}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time_slot}</span>
                    </div>
                    {userRole === "technician" && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{booking.customer_phone}</span>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </p>
                    </div>
                  )}

                  {/* Reviews section (placeholder) */}
                  {booking.status === "work_accepted" && (
                    <div className="flex items-center gap-2 text-amber-500">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <Star className="w-5 h-5 fill-amber-400" />
                      <Star className="w-5 h-5 fill-amber-400" />
                      <Star className="w-5 h-5 fill-amber-400" />
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span className="text-sm text-gray-600 ml-2">Reviewed</span>
                    </div>
                  )}
                </div>

                {/* Right side - Payment & Invoice Info */}
                {booking.invoice && (
                  <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Invoice</p>
                        <p className="font-mono text-sm font-medium text-gray-900">
                          {booking.invoice.invoiceNumber}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">${booking.invoice.subtotal?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-medium">${booking.invoice.tax?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span className="text-blue-600">${booking.invoice.total?.toFixed(2) || "0.00"}</span>
                        </div>
                      </div>

                      <Badge className={`${paymentStatusConfig[booking.invoice.paymentStatus]?.color} w-full justify-center py-2`}>
                        {paymentStatusConfig[booking.invoice.paymentStatus]?.label}
                      </Badge>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => downloadInvoice(booking.invoice)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { 
  DollarSign, TrendingUp, FileText, Users, 
  Calendar, Download, Eye, Filter 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminPaymentManagement({ 
  payments = [], 
  invoices = [], 
  bookings = [] 
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const paymentStatusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    completed: { color: "bg-green-100 text-green-800", label: "Completed" },
    failed: { color: "bg-red-100 text-red-800", label: "Failed" },
  };

  const invoiceStatusConfig = {
    draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
    sent: { color: "bg-blue-100 text-blue-800", label: "Sent" },
    paid: { color: "bg-green-100 text-green-800", label: "Paid" },
    cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
  };

  // Calculate analytics
  const analytics = {
    totalRevenue: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    completedPayments: payments.filter(p => p.status === 'completed').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(i => i.paymentStatus === 'paid').length,
    unpaidInvoices: invoices.filter(i => i.paymentStatus === 'pending').length,
    averageInvoiceAmount: invoices.length > 0
      ? invoices.reduce((sum, i) => sum + (i.total || 0), 0) / invoices.length
      : 0,
  };

  // Enrich data
  const enrichedPayments = payments.map(payment => {
    const invoice = invoices.find(inv => inv.id === payment.invoiceId);
    const booking = bookings.find(b => b.id === payment.bookingId);
    return { ...payment, invoice, booking };
  });

  const enrichedInvoices = invoices.map(invoice => {
    const payment = payments.find(p => p.invoiceId === invoice.id);
    const booking = bookings.find(b => b.id === invoice.bookingId);
    return { ...invoice, payment, booking };
  });

  // Filter payments
  const filteredPayments = enrichedPayments.filter(payment => {
    if (filterStatus !== "all" && payment.status !== filterStatus) return false;
    
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      if (
        !payment.customerEmail?.toLowerCase().includes(search) &&
        !payment.invoice?.invoiceNumber?.toLowerCase().includes(search) &&
        !payment.booking?.customer_name?.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    if (dateRange.start && dateRange.end) {
      const paymentDate = new Date(payment.createdAt?.seconds * 1000 || Date.now());
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      if (paymentDate < start || paymentDate > end) return false;
    }

    return true;
  });

  // Filter invoices
  const filteredInvoices = enrichedInvoices.filter(invoice => {
    if (filterStatus !== "all" && invoice.status !== filterStatus) return false;
    
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      if (
        !invoice.customerEmail?.toLowerCase().includes(search) &&
        !invoice.invoiceNumber?.toLowerCase().includes(search) &&
        !invoice.customerName?.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    return true;
  });

  const exportData = (type) => {
    // In production, this would generate CSV/Excel export
    alert(`${type} export functionality would be implemented here`);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment & Invoice Analytics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${analytics.totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Total Invoices</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {analytics.totalInvoices}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600">Avg Invoice</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              ${analytics.averageInvoiceAmount.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {analytics.completedPayments}
            </p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
            <p className="text-2xl font-bold text-yellow-600">{analytics.pendingPayments}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Failed Payments</p>
            <p className="text-2xl font-bold text-red-600">{analytics.failedPayments}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Paid Invoices</p>
            <p className="text-2xl font-bold text-green-600">{analytics.paidInvoices}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Unpaid Invoices</p>
            <p className="text-2xl font-bold text-red-600">{analytics.unpaidInvoices}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Customer, invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="dateStart">Start Date</Label>
            <Input
              id="dateStart"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="dateEnd">End Date</Label>
            <Input
              id="dateEnd"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md h-auto p-1">
          <TabsTrigger value="payments" className="py-3">
            Payments ({payments.length})
          </TabsTrigger>
          <TabsTrigger value="invoices" className="py-3">
            Invoices ({invoices.length})
          </TabsTrigger>
        </TabsList>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">All Payments</h3>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => exportData('payments')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 text-sm font-semibold text-gray-600">Date</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Customer</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Invoice #</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 text-sm text-gray-600">
                        {payment.createdAt?.seconds 
                          ? new Date(payment.createdAt.seconds * 1000).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.booking?.customer_name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">{payment.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-mono text-sm text-gray-900">
                          {payment.invoice?.invoiceNumber || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-gray-900">
                        ${payment.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-4">
                        <Badge className={paymentStatusConfig[payment.status]?.color}>
                          {paymentStatusConfig[payment.status]?.label}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`View payment details: ${payment.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No payments found</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">All Invoices</h3>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => exportData('invoices')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 text-sm font-semibold text-gray-600">Invoice #</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Customer</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Technician</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Service</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </span>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.customerName}</p>
                          <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {invoice.technicianName}
                      </td>
                      <td className="py-4 text-sm text-gray-900 capitalize">
                        {invoice.serviceType?.replace("_", " ")}
                      </td>
                      <td className="py-4 font-semibold text-gray-900">
                        ${invoice.total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-4">
                        <Badge className={invoiceStatusConfig[invoice.status]?.color}>
                          {invoiceStatusConfig[invoice.status]?.label}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`View invoice details: ${invoice.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No invoices found</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

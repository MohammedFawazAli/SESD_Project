import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Layout from './Layout';

const queryClient = new QueryClient();
import Homepage from './pages/Homepage';
import About from './pages/About';
import Contact from './pages/Contact';
import BrowseTechnicians from './pages/Browse-technicians';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import CustomerDashboard from './pages/CustomerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminPanel from './pages/AdminPanel';
import TechnicianProfile from './pages/TechnicianProfile';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <Router>
      <Routes>
        <Route path="/" element={<Layout><Homepage /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/browse-technicians" element={<Layout><BrowseTechnicians /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/book-appointment/:id?" element={<Layout><BookAppointment /></Layout>} />
        <Route path="/customer-dashboard" element={<Layout><CustomerDashboard /></Layout>} />
        <Route path="/technician-dashboard" element={<Layout><TechnicianDashboard /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
        <Route path="/technician-profile/:id?" element={<Layout><TechnicianProfile /></Layout>} />
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;

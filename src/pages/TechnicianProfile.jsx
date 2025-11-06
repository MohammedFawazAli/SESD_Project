import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { 
  Star, MapPin, Briefcase, Phone, Mail, ArrowLeft,
  Calendar, Clock, Award, Loader2 
} from "lucide-react";
import { toast } from "sonner";

export default function TechnicianProfile() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const technicianId = urlParams.get('id');

  const { data: technician, isLoading } = useQuery({
    queryKey: ['technician', technicianId],
    queryFn: async () => {
      const techs = await base44.entities.Technician.filter({ id: technicianId });
      return techs[0];
    },
    enabled: !!technicianId,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', technicianId],
    queryFn: () => base44.entities.Review.filter({ technician_id: technicianId }, '-created_date'),
    initialData: [],
    enabled: !!technicianId,
  });

  const serviceLabels = {
    electrician: "Electrician",
    plumber: "Plumber",
    carpenter: "Carpenter",
    ac_repair: "AC Repair",
    painter: "Painter",
    cleaning: "Cleaning",
  };

  if (!technicianId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No technician selected</p>
          <Link to={createPageUrl("BrowseTechnicians")}>
            <Button>Browse Technicians</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading technician profile...</p>
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Technician not found</p>
          <Link to={createPageUrl("BrowseTechnicians")}>
            <Button>Browse Technicians</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBookNow = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) {
      toast.error("Please login to book an appointment");
      base44.auth.redirectToLogin(createPageUrl("BookAppointment") + `?id=${technicianId}`);
      return;
    }
    navigate(createPageUrl("BookAppointment") + `?id=${technicianId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link to={createPageUrl("BrowseTechnicians")}>
          <Button variant="ghost" className="mb-6 hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-5xl font-bold shadow-2xl">
                {technician.full_name?.charAt(0) || "T"}
              </div>
              
              <div className="text-center md:text-left text-white flex-1">
                <h1 className="text-4xl font-bold mb-2">{technician.full_name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-xl font-semibold">
                    {serviceLabels[technician.service_type]}
                  </span>
                  {technician.experience_years && (
                    <span className="text-blue-100">• {technician.experience_years} years experience</span>
                  )}
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-bold">
                    {technician.rating > 0 ? technician.rating.toFixed(1) : "New"}
                  </span>
                  {technician.total_reviews > 0 && (
                    <span className="text-blue-100 ml-2">
                      ({technician.total_reviews} reviews)
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
                  <MapPin className="w-5 h-5" />
                  <span>{technician.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-8 py-8">
            {/* About */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {technician.description || "Experienced professional ready to help with your home service needs."}
              </p>
            </div>

            {/* Areas Served */}
            {technician.areas_served && technician.areas_served.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Areas Served</h2>
                <div className="flex flex-wrap gap-2">
                  {technician.areas_served.map((area, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{technician.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{technician.user_email}</span>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <div className="text-center">
              <Button 
                size="lg"
                onClick={handleBookNow}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-6 transition-transform hover:scale-105 shadow-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment Now
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.customer_name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-3">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
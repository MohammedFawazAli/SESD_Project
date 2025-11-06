import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Briefcase } from "lucide-react";

export default function TechnicianCard({ technician }) {
  const serviceLabels = {
    electrician: "Electrician",
    plumber: "Plumber",
    carpenter: "Carpenter",
    ac_repair: "AC Repair",
    painter: "Painter",
    cleaning: "Cleaning",
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-out p-6 transform hover:scale-[1.02] border border-transparent hover:border-blue-200">
      <div className="flex items-start gap-4">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {technician.full_name?.charAt(0) || "T"}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {technician.full_name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium text-blue-600">
              {serviceLabels[technician.service_type]}
            </span>
            {technician.experience_years && (
              <span className="text-gray-400">• {technician.experience_years} years exp</span>
            )}
          </div>

          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-900">
              {technician.rating > 0 ? technician.rating.toFixed(1) : "New"}
            </span>
            {technician.total_reviews > 0 && (
              <span className="text-sm text-gray-500">
                ({technician.total_reviews} reviews)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{technician.location}</span>
          </div>

          <Link to={createPageUrl("TechnicianProfile") + `?id=${technician.id}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105">
              View Profile & Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { TechnicianService } from "@/services/technicianService";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Loader2 } from "lucide-react";
import TechnicianCard from "../components/TechnicianCard";

export default function BrowseTechnicians() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceFromUrl = urlParams.get('service') || 'all';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState(serviceFromUrl);
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time subscription to approved technicians
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = TechnicianService.subscribeToApprovedTechnicians((updatedTechnicians) => {
      setTechnicians(updatedTechnicians);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = searchQuery === "" || 
      tech.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = serviceFilter === 'all' || tech.service_type === serviceFilter;
    
    return matchesSearch && matchesService;
  });

  const serviceOptions = [
    { value: "all", label: "All Services" },
    { value: "electrician", label: "Electrician" },
    { value: "plumber", label: "Plumber" },
    { value: "carpenter", label: "Carpenter" },
    { value: "ac_repair", label: "AC Repair" },
    { value: "painter", label: "Painter" },
    { value: "cleaning", label: "Cleaning" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Technician
          </h1>
          <p className="text-lg text-gray-600">
            Browse through our verified professionals and book instantly
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Service Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="pl-10 h-12 border-gray-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Technicians Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading technicians...</p>
          </div>
        ) : filteredTechnicians.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No technicians found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicians.map((technician) => (
              <TechnicianCard key={technician.id} technician={technician} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
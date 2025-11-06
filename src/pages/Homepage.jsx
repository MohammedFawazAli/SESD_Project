import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Clock, ShieldCheck, Star } from "lucide-react";
import ServiceCategoryCard from "../components/ServiceCategoryCard";

export default function Homepage() {
  const services = [
    { key: "electrician", label: "Electrician" },
    { key: "plumber", label: "Plumber" },
    { key: "carpenter", label: "Carpenter" },
    { key: "ac_repair", label: "AC Repair" },
    { key: "painter", label: "Painter" },
    { key: "cleaning", label: "Cleaning" },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Select Service",
      description: "Choose from electrician, plumber, carpenter and more",
      icon: Users,
    },
    {
      step: "2",
      title: "Choose Date & Time",
      description: "Pick a convenient time slot from available options",
      icon: Clock,
    },
    {
      step: "3",
      title: "Technician Confirms",
      description: "Get confirmation and the technician visits your home",
      icon: CheckCircle,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      comment: "Found an excellent electrician in minutes! Very professional service.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Property Manager",
      comment: "HomeEase has been a game-changer for managing multiple properties.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Customer",
      comment: "Quick, reliable, and affordable. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-amber-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fadeIn">
              <div className="inline-block">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Trusted by 10,000+ Customers
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Find Trusted Home Service
                <span className="block text-transparent bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text">
                  Professionals
                </span>
                Near You
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Electricians, plumbers, carpenters & more. Book hassle-free appointments in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl("BrowseTechnicians")}>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 transition-transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Book a Service
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Register")}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-amber-400 text-amber-600 hover:bg-amber-50 transition-transform hover:scale-105"
                  >
                    Become a Technician
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-gray-600">4.9 Average Rating</span>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop" 
                  alt="Home services"
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <div className="absolute top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50 -z-10" />
              <div className="absolute bottom-10 -right-10 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-50 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our wide range of home services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service) => (
              <ServiceCategoryCard 
                key={service.key}
                service={service.key}
                label={service.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Book your service in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div 
                key={index}
                className="relative bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>

                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from real people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust HomeEase for their home service needs
          </p>
          
          <Link to={createPageUrl("BrowseTechnicians")}>
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 transition-transform hover:scale-105 shadow-xl"
            >
              Find a Technician Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Clock, ShieldCheck, Star, Sparkles } from "lucide-react";
import ServiceCategoryCard from "../components/ServiceCategoryCard";

export default function Homepage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeInLeft { animation: fadeInLeft 0.8s ease-out forwards; }
        .animate-fadeInRight { animation: fadeInRight 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="animate-fadeInUp">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Trusted by 10,000+ Customers
                </span>
              </div>
              
              <h1 className="animate-fadeInUp delay-100 text-5xl md:text-7xl font-extrabold text-white leading-tight">
                Find Trusted Home Service
                <span className="block text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text animate-gradient">
                  Professionals
                </span>
                Near You
              </h1>
              
              <p className="animate-fadeInUp delay-200 text-xl text-gray-300 leading-relaxed">
                Electricians, plumbers, carpenters & more. Book hassle-free appointments in minutes.
              </p>
              
              <div className="animate-fadeInUp delay-300 flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("BrowseTechnicians")}>
                <Button 
                  size="lg"
                  className="group flex items-center justify-center gap-2 w-full sm:w-auto 
                            bg-gradient-to-r from-blue-600 to-purple-600 
                            hover:from-blue-700 hover:to-purple-700 
                            text-white text-lg px-10 py-7 rounded-2xl 
                            transition-all duration-300 hover:scale-105 
                            hover:shadow-2xl shadow-xl border-0"
                >
                  <span>Book a Service</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

                
                <Link to={createPageUrl("Register")}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/50"
                  >
                    Become a Technician
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="animate-fadeInUp delay-400 flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-200">Verified Professionals</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-gray-200">4.9 Average Rating</span>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="animate-fadeInRight delay-200 relative">
              <div className="relative z-10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-2 border border-white/20 transform hover:scale-105 transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop" 
                    alt="Home services"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our wide range of home services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service, index) => (
              <div 
                key={service.key}
                className={`animate-fadeInUp delay-${index * 100}`}
              >
                <ServiceCategoryCard 
                  service={service.key}
                  label={service.label}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Book your service in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 text-center transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl transform group-hover:rotate-12 transition-transform duration-300">
                      {item.step}
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-blue-400 animate-pulse-slow" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from real people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`group relative transform transition-all duration-500 hover:scale-105 ${
                  activeTestimonial === index ? 'scale-105' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-200">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 transform group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 overflow-hidden flex items-center justify-center gap-2">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-2">
          <div className="inline-block mb-8 animate-pulse-slow">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust HomeEase for their home service needs
          </p>
          
          <Link to={createPageUrl("BrowseTechnicians")}>
            <Button 
              size="lg"
              className="group flex items-center justify-center gap-3 
                        w-full sm:w-auto 
                        bg-gradient-to-r from-blue-600 to-purple-600 
                        hover:from-blue-700 hover:to-purple-700 
                        text-white text-lg px-10 py-7 rounded-2xl 
                        transition-all duration-300 hover:scale-105 
                        hover:shadow-2xl shadow-xl border-0"
            >
              <span>Find a Technician Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
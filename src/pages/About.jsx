import React from "react";
import { Shield, Users, Award, Heart } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "All technicians are verified and background-checked for your peace of mind.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "We prioritize your satisfaction with 24/7 support and quality guarantees.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Only the best professionals join our platform, ensuring top-quality service.",
    },
    {
      icon: Heart,
      title: "Community",
      description: "Supporting local technicians and building stronger communities together.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About HomeEase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make finding trusted home service professionals as easy as a few clicks. 
            Connect with verified technicians in your area and get your home projects done right.
          </p>
        </div>

        {/* Image Section */}
        <div className="mb-20">
          <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop"
            alt="Team collaboration"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>

        {/* Our Story */}
        <div className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              HomeEase was born from a simple frustration: finding reliable home service professionals 
              shouldn't be so difficult. We've all been there – scrambling to find a plumber for a 
              leaking pipe or an electrician for a faulty outlet, unsure who to trust.
            </p>
            <p>
              Founded in 2024, we set out to create a platform that brings transparency, trust, and 
              convenience to the home services industry. Today, we've connected thousands of homeowners 
              with skilled professionals, making home maintenance stress-free.
            </p>
            <p>
              Our platform carefully vets every technician, ensuring they meet our high standards for 
              skill, professionalism, and reliability. We're building a community where great service 
              meets fair pricing, and where both customers and technicians can thrive.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100 text-lg">Happy Customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100 text-lg">Verified Technicians</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100 text-lg">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
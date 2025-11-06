import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Wrench, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("customer");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    // Technician specific
    service_type: "",
    experience_years: "",
    description: "",
    location: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      // Register user with role
      const userData = {
        ...formData,
        role: userType
      };
      
      const user = await base44.auth.register(userData);
      
      toast.success("Registration successful!");
      
      // Route based on user type
      setTimeout(() => {
        if (userType === 'technician') {
          navigate('/technician-dashboard');
        } else {
          navigate('/customer-dashboard');
        }
      }, 1000);
    } catch (error) {
      toast.error('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link to={createPageUrl("Homepage")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join HomeEase and get started</p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setUserType("customer")}
              className={`p-6 border-2 rounded-xl transition-all ${
                userType === "customer"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Customer</h3>
                <p className="text-sm text-gray-600 mt-1">Book services</p>
              </div>
            </button>

            <button
              onClick={() => setUserType("technician")}
              className={`p-6 border-2 rounded-xl transition-all ${
                userType === "technician"
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Technician</h3>
                <p className="text-sm text-gray-600 mt-1">Offer services</p>
              </div>
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Common Fields */}
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="John Doe"
                required
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                required
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 123-4567"
                required
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                required
                className="mt-2 h-12"
              />
            </div>

            {/* Technician Specific Fields */}
            {userType === "technician" && (
              <>
                <div>
                  <Label htmlFor="service_type">Service Type</Label>
                  <Select
                    value={formData.service_type}
                    onValueChange={(value) => setFormData({...formData, service_type: value})}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select your service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electrician">Electrician</SelectItem>
                      <SelectItem value="plumber">Plumber</SelectItem>
                      <SelectItem value="carpenter">Carpenter</SelectItem>
                      <SelectItem value="ac_repair">AC Repair</SelectItem>
                      <SelectItem value="painter">Painter</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                    placeholder="5"
                    required
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location/City</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="San Francisco, CA"
                    required
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="description">About You</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell customers about your expertise..."
                    className="mt-2 h-24 resize-none"
                  />
                </div>
              </>
            )}

            <Button 
              type="submit"
              className={`w-full h-12 text-lg transition-transform hover:scale-105 ${
                userType === "customer" 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to={createPageUrl("Login")} 
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
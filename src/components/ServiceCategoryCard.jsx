import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Zap, Droplet, Hammer, Wind, Paintbrush, Sparkles 
} from "lucide-react";

const serviceIcons = {
  electrician: Zap,
  plumber: Droplet,
  carpenter: Hammer,
  ac_repair: Wind,
  painter: Paintbrush,
  cleaning: Sparkles,
};

const serviceColors = {
  electrician: "from-yellow-400 to-orange-500",
  plumber: "from-blue-400 to-cyan-500",
  carpenter: "from-amber-600 to-orange-700",
  ac_repair: "from-sky-400 to-blue-500",
  painter: "from-purple-400 to-pink-500",
  cleaning: "from-green-400 to-emerald-500",
};

export default function ServiceCategoryCard({ service, label }) {
  const Icon = serviceIcons[service] || Wrench;
  const colorGradient = serviceColors[service] || "from-gray-400 to-gray-600";

  return (
    <Link 
      to={`${createPageUrl("BrowseTechnicians")}?service=${service}`}
      className="group"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-out p-6 text-center cursor-pointer transform hover:scale-105 hover:-translate-y-1">
        <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${colorGradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {label}
        </h3>
        <p className="text-sm text-gray-500 mt-1">Book Now</p>
      </div>
    </Link>
  );
}
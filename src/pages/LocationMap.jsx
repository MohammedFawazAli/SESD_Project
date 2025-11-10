import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Custom icon (so the marker looks right)
const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function LocationMap() {
  // Example coordinates (you can use your own)
  const position = [12.9716, 77.5946]; // Bangalore

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-64 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            📍 HomeEase HQ <br /> Bangalore, India
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

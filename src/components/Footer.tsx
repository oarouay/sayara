// app/components/Footer.tsx

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  // iTeam University location coordinates
  const mainStoreLocation = {
    lat: 36.8178547692,
    lng: 10.1796510816,
    name: "Sayara Main Store - iTeam University",
    address: "85-87 Rue de La Palestine, Tunis 1002"
  };

  // Handle getting directions to main store
  const handleGetDirections = () => {
    // Create Google Maps URL with proper coordinates
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mainStoreLocation.lat},${mainStoreLocation.lng}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-14 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">Sayara</h2>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Sayara provides fast, secure, and affordable car rentals worldwide.
            Trusted by thousands of customers every day.
          </p>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-white font-semibold text-lg">Customer Support</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Manage Booking</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold text-lg">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Guides / Blog */}
        <div>
          <h3 className="text-white font-semibold text-lg">Car Rental Guides</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">How to Rent a Car</a></li>
            <li><a href="#" className="hover:text-white">Insurance Explained</a></li>
            <li><a href="#" className="hover:text-white">Best Cars for Road Trips</a></li>
          </ul>
        </div>

        {/* Location & Contact */}
        <div>
          <h3 className="text-white font-semibold text-lg">Visit Us</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Main Store</p>
                <p className="text-gray-400">85-87 Rue de La Palestine</p>
                <p className="text-gray-400">Tunis 1002, Tunisia</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-green-500 flex-shrink-0" />
              <a href="tel:+21698765432" className="hover:text-white">+216 98 765 432</a>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-green-500 flex-shrink-0" />
              <a href="mailto:info@sayara.tn" className="hover:text-white">info@sayara.tn</a>
            </div>
            <button 
              onClick={handleGetDirections}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Get Directions
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Sayara Rentals. All rights reserved.
          </p>

          {/* Social Icons with Location */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex space-x-5 text-lg">
              <a href="#" className="hover:text-white transition-colors"><FaFacebookF /></a>
              <a href="#" className="hover:text-white transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-white transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-white transition-colors"><FaYoutube /></a>
            </div>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleGetDirections();
              }}
              className="flex items-center space-x-2 text-sm text-green-500 hover:text-green-400 transition-colors"
            >
              <FaMapMarkerAlt />
              <span>Directions</span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
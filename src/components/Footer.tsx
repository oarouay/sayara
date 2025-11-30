// app/components/Footer.tsx

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-14 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
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
            <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
          </ul>
        </div>

        {/* Guides / Blog */}
        <div>
          <h3 className="text-white font-semibold text-lg">Car Rental Guides</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">How to Rent a Car</a></li>
            <li><a href="#" className="hover:text-white">Insurance Explained</a></li>
            <li><a href="#" className="hover:text-white">Best Cars for Road Trips</a></li>
            <li><a href="#" className="hover:text-white">Travel Tips & Blog</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Sayara Rentals. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-5 text-lg">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaYoutube /></a>
          </div>

        </div>
      </div>
    </footer>
  );
}

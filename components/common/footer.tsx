"use client";

import { VenetianMask } from "lucide-react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      // In a real implementation, you would send this to your API
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className=" pt-24 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <VenetianMask className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl text-gray-900">SAFE</span>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Protect your business with AI-powered fraud detection, sentiment
              analysis, and financial monitoring solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base"
                >
                  Watch Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600 flex-shrink-0" />
                <a
                  href="mailto:info@safeprotect.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base"
                >
                  info@safeprotect.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="text-blue-600 flex-shrink-0 mt-1"
                />
                <address className="text-gray-600 not-italic text-sm md:text-base">
                  123 Financial District
                  <br />
                  New York, NY 10004
                  <br />
                  United States
                </address>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Stay Updated</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Subscribe to our newsletter for the latest updates on fraud
              detection and financial security.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col space-y-2"
            >
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                Subscribe <ArrowRight size={16} className="ml-2" />
              </Button>
              {subscribed && (
                <p className="text-green-600 text-sm animate-fade-in-down">
                  Thank you for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Middle section - Legal, Support, Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-b border-blue-200">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-support"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/fraud-detection"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Fraud Detection
                </Link>
              </li>
              <li>
                <Link
                  href="/sentiment-analysis"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Sentiment Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/enterprise-solutions"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section - Copyright and back to top */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {currentYear} SAFE Financial Protection. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="text-sm font-medium">Back to top</span>
            <ChevronUp size={16} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
      `}</style>
    </footer>
  );
}

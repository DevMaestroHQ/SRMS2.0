import { 
  MapPin, Phone, Mail, Globe, 
  BookOpen, Clock, Shield 
} from "lucide-react";
import universityLogo from "@/assets/university-logo.png";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg flex items-center justify-center">
                <img 
                  src={universityLogo} 
                  alt="Tribhuvan University Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Tribhuvan University
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Result Management System
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Nepal's premier educational institution, committed to excellence in education, 
              research, and public service since 1959.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Contact Information
            </h4>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Kirtipur, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>+977-1-4330433</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>info@tu.edu.np</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>www.tu.edu.np</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Quick Links
            </h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                <BookOpen className="h-3 w-3" />
                <span>Academic Calendar</span>
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Student Portal</span>
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                <Globe className="h-3 w-3" />
                <span>University Website</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200/50 dark:border-slate-700/50 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 Tribhuvan University. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure Platform</span>
              </span>
              <span className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>24/7 Access</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
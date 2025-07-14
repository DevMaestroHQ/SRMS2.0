import { 
  MapPin, Phone, Mail, Globe, ExternalLink, FileText, 
  Users, BookOpen, Award, HelpCircle, Shield, Clock 
} from "lucide-react";
import universityLogo from "@/assets/university-logo.png";

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-university-blue shadow-md flex items-center justify-center">
                <img 
                  src={universityLogo} 
                  alt="Tribhuvan University Logo" 
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Tribhuvan University</h3>
                <p className="text-sm text-university-gray dark:text-slate-400">Nepal's Premier Educational Institution</p>
              </div>
            </div>
            <p className="text-sm text-university-gray dark:text-slate-400 leading-relaxed">
              Established in 1959, Tribhuvan University is the oldest and largest university in Nepal, 
              committed to excellence in education, research, and public service.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contact Information</h4>
            <div className="space-y-3 text-sm text-university-gray dark:text-slate-400">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-university-blue" />
                <span>Kirtipur, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-university-blue" />
                <span>+977-1-4330433</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-university-blue" />
                <span>info@tribhuvan-university.edu.np</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-university-blue" />
                <span>www.tribhuvan-university.edu.np</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="#" className="text-university-gray dark:text-slate-400 hover:text-university-blue dark:hover:text-university-blue transition-colors duration-200 flex items-center space-x-2">
                <ExternalLink className="h-3 w-3" />
                <span>University Website</span>
              </a>
              <a href="#" className="text-university-gray dark:text-slate-400 hover:text-university-blue dark:hover:text-university-blue transition-colors duration-200 flex items-center space-x-2">
                <FileText className="h-3 w-3" />
                <span>Academic Calendar</span>
              </a>
              <a href="#" className="text-university-gray dark:text-slate-400 hover:text-university-blue dark:hover:text-university-blue transition-colors duration-200 flex items-center space-x-2">
                <Users className="h-3 w-3" />
                <span>Student Portal</span>
              </a>
              <a href="#" className="text-university-gray dark:text-slate-400 hover:text-university-blue dark:hover:text-university-blue transition-colors duration-200 flex items-center space-x-2">
                <BookOpen className="h-3 w-3" />
                <span>Examination Board</span>
              </a>
              <a href="#" className="text-university-gray dark:text-slate-400 hover:text-university-blue dark:hover:text-university-blue transition-colors duration-200 flex items-center space-x-2">
                <Award className="h-3 w-3" />
                <span>Results Archive</span>
              </a>
              <a href="#" className="text-university-gray dark:text-slate-400 hover:text-university-blue dark:hover:text-university-blue transition-colors duration-200 flex items-center space-x-2">
                <HelpCircle className="h-3 w-3" />
                <span>Help & Support</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-university-gray dark:text-slate-400">
              © 2025 Tribhuvan University. All rights reserved. | Established 1959
            </div>
            <div className="flex items-center space-x-4 text-sm text-university-gray dark:text-slate-400">
              <span className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-academic-green" />
                <span>Secure Platform</span>
              </span>
              <span className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-university-blue" />
                <span>24/7 Access</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
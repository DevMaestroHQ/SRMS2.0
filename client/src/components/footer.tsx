import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Code, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import universityLogo from "@/assets/university-logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto bg-gradient-to-r from-primary/5 via-educational-purple/5 to-educational-green/5 border-t border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-material-1">
                <img 
                  src={universityLogo} 
                  alt="Tribhuvan University Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Tribhuvan University</h3>
                <p className="text-sm text-muted-foreground">Est. 1959</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nepal's first and largest university, committed to providing quality education 
              and fostering academic excellence since 1959.
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Shield className="h-3 w-3 mr-1" />
                Official Portal
              </Badge>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  Student Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  Admin Dashboard
                </a>
              </li>
              <li>
                <a href="https://tribhuvan-university.edu.np" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  Official Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  Result Guidelines
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Information</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Kirtipur, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+977-1-4331444</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@tribhuvan-university.edu.np</span>
              </li>
            </ul>
          </div>
          
          {/* System Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">System Information</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                <strong>Version:</strong> 2.0.0
              </li>
              <li className="text-sm text-muted-foreground">
                <strong>Last Updated:</strong> January 2025
              </li>
              <li className="text-sm text-muted-foreground">
                <strong>Technology:</strong> React + Express
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Code className="h-4 w-4 text-primary" />
                <span>Built with modern web technologies</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} Tribhuvan University. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Help & Support
              </a>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for academic excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
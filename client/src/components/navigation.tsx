import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, LogOut, Shield, User, BookOpen, Menu, X } from "lucide-react";
import { authManager } from "@/lib/auth";
import { useState, useEffect } from "react";
import universityLogo from "@/assets/university-logo.png";

interface NavigationProps {
  currentView: "student" | "admin";
  onViewChange: (view: "student" | "admin") => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [authState, setAuthState] = useState(authManager.getAuthState());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    authManager.verifyToken().then(() => {
      setAuthState(authManager.getAuthState());
    });
  }, []);

  const handleLogout = () => {
    authManager.logout();
    setAuthState(authManager.getAuthState());
    onViewChange("student");
    setIsMobileMenuOpen(false);
  };

  const handleViewChange = (view: "student" | "admin") => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-university-blue shadow-md flex items-center justify-center">
                <img 
                  src={universityLogo} 
                  alt="Tribhuvan University Logo" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Tribhuvan University
                </h1>
                <p className="text-xs text-university-gray dark:text-slate-400 -mt-1">
                  <BookOpen className="inline h-3 w-3 mr-1" />
                  Result Management System
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  T.U. Results
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => handleViewChange("student")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentView === "student"
                    ? "bg-university-blue text-white shadow-md"
                    : "text-university-gray dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Student Portal</span>
              </button>
              <button
                onClick={() => handleViewChange("admin")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentView === "admin"
                    ? "bg-university-navy text-white shadow-md"
                    : "text-university-gray dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </button>
            </div>
            
            {authState.isAuthenticated && (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <Badge className="bg-academic-green/10 text-academic-green border-academic-green/20">
                  <Shield className="h-3 w-3 mr-1" />
                  {authState.admin?.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-academic-red hover:text-academic-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 bg-white/95 dark:bg-slate-900/95">
            <div className="space-y-3">
              <button
                onClick={() => handleViewChange("student")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === "student"
                    ? "bg-university-blue text-white"
                    : "text-university-gray dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Student Portal</span>
              </button>
              <button
                onClick={() => handleViewChange("admin")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === "admin"
                    ? "bg-university-navy text-white"
                    : "text-university-gray dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </button>
              
              {authState.isAuthenticated && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between px-4">
                    <Badge className="bg-academic-green/10 text-academic-green border-academic-green/20">
                      <Shield className="h-3 w-3 mr-1" />
                      {authState.admin?.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-academic-red hover:text-academic-red hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
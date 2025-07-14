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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg flex items-center justify-center">
                <img 
                  src={universityLogo} 
                  alt="Tribhuvan University Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Tribhuvan University
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 -mt-1 flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
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
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-1 bg-slate-100/70 dark:bg-slate-800/70 rounded-full p-1">
              <button
                onClick={() => handleViewChange("student")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  currentView === "student"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-700/80"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Student Portal</span>
              </button>
              <button
                onClick={() => handleViewChange("admin")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  currentView === "admin"
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-700/80"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </button>
            </div>
            
            {authState.isAuthenticated && (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200/50 dark:border-slate-700/50">
                <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  {authState.admin?.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
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
          <div className="md:hidden border-t border-slate-200/50 dark:border-slate-700/50 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <div className="space-y-2">
              <button
                onClick={() => handleViewChange("student")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === "student"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Student Portal</span>
              </button>
              <button
                onClick={() => handleViewChange("admin")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === "admin"
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </button>
              
              {authState.isAuthenticated && (
                <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-3 mt-3">
                  <div className="flex items-center justify-between px-4">
                    <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      {authState.admin?.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
      
      {/* Logo at bottom of navbar */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 py-2 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm flex items-center justify-center">
              <img 
                src={universityLogo} 
                alt="Tribhuvan University Logo" 
                className="h-4 w-4 object-contain"
              />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Tribhuvan University • Est. 1959
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
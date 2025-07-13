import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, LogOut, Shield, User, BookOpen, Menu, X } from "lucide-react";
import { authManager } from "@/lib/auth";
import { useState, useEffect } from "react";

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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-material-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="relative">
              <div className="gradient-primary p-3 rounded-2xl shadow-material-2 animate-bounce-in">
                <GraduationCap className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="responsive-text-xl font-bold bg-gradient-to-r from-primary via-educational-purple to-educational-green bg-clip-text text-transparent">
                EduResults Portal
              </h1>
              <p className="text-xs text-muted-foreground flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                Tribhuvan University System
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-educational-purple bg-clip-text text-transparent">
                EduResults
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-muted/50 rounded-xl p-1">
              <Button
                variant={currentView === "student" ? "default" : "ghost"}
                onClick={() => handleViewChange("student")}
                size="sm"
                className={`relative transition-all duration-300 ${
                  currentView === "student" 
                    ? "shadow-educational" 
                    : "hover:bg-primary/10"
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Student Portal
                {currentView === "student" && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-primary rounded-full" />
                )}
              </Button>
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                onClick={() => handleViewChange("admin")}
                size="sm"
                className={`relative transition-all duration-300 ${
                  currentView === "admin" 
                    ? "shadow-educational" 
                    : "hover:bg-primary/10"
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
                {currentView === "admin" && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-primary rounded-full" />
                )}
              </Button>
            </div>
            
            {authState.isAuthenticated && (
              <div className="flex items-center space-x-3 pl-4 border-l border-border/50">
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <Shield className="h-3 w-3 mr-1" />
                  {authState.admin?.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </nav>

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
          <div className="md:hidden border-t border-border/50 py-4 animate-slide-up">
            <div className="space-y-3">
              <Button
                variant={currentView === "student" ? "default" : "ghost"}
                onClick={() => handleViewChange("student")}
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Student Portal
              </Button>
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                onClick={() => handleViewChange("admin")}
                className="w-full justify-start"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
              
              {authState.isAuthenticated && (
                <div className="pt-3 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      <Shield className="h-3 w-3 mr-1" />
                      {authState.admin?.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
    </header>
  );
}

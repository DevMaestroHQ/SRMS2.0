import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, LogOut, Shield, User } from "lucide-react";
import { authManager } from "@/lib/auth";
import { useState, useEffect } from "react";

interface NavigationProps {
  currentView: "student" | "admin";
  onViewChange: (view: "student" | "admin") => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [authState, setAuthState] = useState(authManager.getAuthState());

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
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-material-1">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-xl mr-3">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Result Portal
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Tribhuvan University</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant={currentView === "student" ? "default" : "ghost"}
                onClick={() => onViewChange("student")}
                size="sm"
                className="relative"
              >
                <User className="h-4 w-4 mr-2" />
                Student
                {currentView === "student" && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                onClick={() => onViewChange("admin")}
                size="sm"
                className="relative"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
                {currentView === "admin" && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            </div>
            
            {authState.isAuthenticated && (
              <div className="flex items-center space-x-3 pl-4 border-l">
                <Badge variant="secondary" className="hidden sm:flex">
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
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

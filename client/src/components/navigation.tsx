import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut } from "lucide-react";
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
    <header className="bg-white shadow-material-1 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="text-primary text-2xl" />
              <h1 className="text-xl font-semibold text-gray-900">Result Management System</h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Button
              variant={currentView === "student" ? "default" : "ghost"}
              onClick={() => onViewChange("student")}
              className={currentView === "student" ? "border-b-2 border-primary rounded-none" : ""}
            >
              Student Portal
            </Button>
            <Button
              variant={currentView === "admin" ? "default" : "ghost"}
              onClick={() => onViewChange("admin")}
              className={currentView === "admin" ? "border-b-2 border-primary rounded-none" : ""}
            >
              Admin Panel
            </Button>
            
            {authState.isAuthenticated && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {authState.admin?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

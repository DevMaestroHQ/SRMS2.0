import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import StudentSearch from "@/components/student-search";
import StudentResults from "@/components/student-results";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import { authManager } from "@/lib/auth";
import NotFound from "@/pages/not-found";

function Router() {
  const [currentView, setCurrentView] = useState<"student" | "admin">("student");
  const [searchResult, setSearchResult] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    authManager.verifyToken().then((isValid) => {
      setIsAdminAuthenticated(isValid);
    });
  }, []);

  const handleResultFound = (result: any) => {
    setSearchResult(result);
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleViewChange = (view: "student" | "admin") => {
    setCurrentView(view);
    if (view === "student") {
      setSearchResult(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "student" ? (
          <div className="space-y-8">
            <StudentSearch onResultFound={handleResultFound} />
            {searchResult && <StudentResults result={searchResult} />}
          </div>
        ) : (
          <div className="space-y-8">
            {isAdminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 University Result Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

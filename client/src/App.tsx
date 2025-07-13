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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-secondary/20 educational-pattern">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {currentView === "student" ? (
          <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live Result Portal
              </div>
              <h1 className="responsive-text-4xl font-bold text-foreground leading-tight">
                Access Your Academic
                <span className="block mt-2 bg-gradient-to-r from-primary via-educational-purple to-educational-green bg-clip-text text-transparent">
                  Results Instantly
                </span>
              </h1>
              <p className="responsive-text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Secure, fast, and reliable access to your university examination results. 
                Built with modern technology for the digital age of education.
              </p>
            </div>

            {/* Search Section */}
            <div className="animate-slide-up">
              <StudentSearch onResultFound={handleResultFound} />
            </div>
            
            {/* Results Section */}
            {searchResult && (
              <div className="animate-scale-in">
                <StudentResults result={searchResult} />
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {isAdminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-card/50 backdrop-blur-sm border-t border-border/50 mt-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-educational-purple/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TU</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Tribhuvan University</p>
                <p className="text-xs text-muted-foreground">Digital Education Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground responsive-text-sm">
              © 2025 Academic Result Management System. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                Secure Access
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                Real-time Results
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-educational-purple rounded-full mr-2 animate-pulse" />
                24/7 Available
              </span>
            </div>
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

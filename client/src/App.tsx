import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-indigo-900/10">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="flex-1 w-full">
        {currentView === "student" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* Hero Section */}
            <div className="text-center space-y-8 mb-16">
              <div className="inline-flex items-center bg-university-blue/10 text-university-blue px-6 py-3 rounded-full text-sm font-medium border border-university-blue/20">
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-university-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-university-blue"></span>
                </span>
                Official Academic Portal
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  <span className="block text-university-blue">Tribhuvan University</span>
                  <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-university-gray dark:text-slate-300 mt-2">
                    Student Result Management System
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-university-gray dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Access your official academic results with our secure, modern platform. 
                  Trusted by thousands of students across Nepal for reliable result verification.
                </p>
              </div>

              {/* University Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-university-blue">1959</div>
                  <div className="text-sm text-university-gray dark:text-slate-400">Established</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-academic-green">500K+</div>
                  <div className="text-sm text-university-gray dark:text-slate-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-academic-gold">65+</div>
                  <div className="text-sm text-university-gray dark:text-slate-400">Years Legacy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-university-navy">24/7</div>
                  <div className="text-sm text-university-gray dark:text-slate-400">Available</div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Search Section */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 md:p-12 shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    Search Your Results
                  </h2>
                  <p className="text-university-gray dark:text-slate-400 text-lg">
                    Enter your details to access your academic records
                  </p>
                </div>
                <StudentSearch onResultFound={handleResultFound} />
              </div>
              
              {/* Results Section */}
              {searchResult && (
                <div className="animate-slide-up">
                  <StudentResults result={searchResult} />
                </div>
              )}

              {/* Information Cards */}
              {!searchResult && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 text-center">
                    <div className="w-12 h-12 bg-university-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Quick Search</h3>
                    <p className="text-sm text-university-gray dark:text-slate-400">
                      Instantly find your results using name and registration number
                    </p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 text-center">
                    <div className="w-12 h-12 bg-academic-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📄</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Official Documents</h3>
                    <p className="text-sm text-university-gray dark:text-slate-400">
                      Download verified PDF copies of your academic records
                    </p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 text-center">
                    <div className="w-12 h-12 bg-academic-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Secure Platform</h3>
                    <p className="text-sm text-university-gray dark:text-slate-400">
                      Protected with enterprise-grade security and encryption
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {isAdminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
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

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { useState, useEffect } from "react";
import { Search, FileText, Shield } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import StudentSearch from "@/components/student-search";
import StudentResults from "@/components/student-results";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import { authManager } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import universityLogo from "@/assets/university-logo.svg";

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
          <div className="container mx-auto px-4 py-12">
            {/* Header with Logo */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl flex items-center justify-center mb-4">
                  <img 
                    src={universityLogo} 
                    alt="Tribhuvan University Logo" 
                    className="h-16 w-16 md:h-20 md:w-20 object-contain"
                  />
                </div>
              </div>
              <h1 className="md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-[40px]">
                Tribhuvan University
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                Student Result Management System
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Access your academic results securely
              </p>
            </div>

            {/* Search Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-8 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Search Your Results
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Enter your details below to find your academic records
                </p>
              </div>
              <StudentSearch onResultFound={handleResultFound} />
            </div>
            
            {/* Results Section */}
            {searchResult && (
              <StudentResults result={searchResult} />
            )}

            {/* Information Section */}
            {!searchResult && (
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Quick Search</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Find your results using name and registration number
                  </p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Official Documents</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Download verified PDF copies of your records
                  </p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Secure Platform</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Protected with enterprise-grade security
                  </p>
                </div>
              </div>
            )}
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

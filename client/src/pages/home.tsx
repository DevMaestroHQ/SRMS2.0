import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, User, Lock, Search, FileText, Shield, Users } from "lucide-react";
import StudentSearch from "@/components/student-search";
import StudentResults from "@/components/student-results";
import Navigation from "@/components/navigation";
import universityLogo from "@/assets/university-logo.png";

export default function Home() {
  const [currentView, setCurrentView] = useState<"student" | "admin">("student");
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleResultFound = (result: any) => {
    setSearchResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/20">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === "student" && (
        <>
          {/* Hero Section */}
          <section className="relative py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
            <div className="container mx-auto px-4 relative">
              <div className="text-center max-w-3xl mx-auto animate-fade-in">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="p-4 rounded-3xl shadow-educational bg-white/90 dark:bg-card/90 backdrop-blur-sm animate-bounce-in">
                      <img 
                        src={universityLogo} 
                        alt="Tribhuvan University Logo" 
                        className="h-16 w-16 md:h-20 md:w-20 object-contain"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  <span className="bg-gradient-to-r from-primary via-educational-purple to-educational-green bg-clip-text text-transparent">
                    Tribhuvan University
                  </span>
                  <span className="block text-3xl md:text-4xl mt-2">
                    Result Management System
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Secure, fast, and reliable access to your university examination results and academic records with official T.U. authentication.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Badge variant="outline" className="px-4 py-2 bg-background/50">
                    <Search className="h-4 w-4 mr-2" />
                    Instant Search
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-background/50">
                    <FileText className="h-4 w-4 mr-2" />
                    PDF Download
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-background/50">
                    <Users className="h-4 w-4 mr-2" />
                    Real OCR Processing
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <main className="container mx-auto px-4 pb-16">
            <div className="max-w-4xl mx-auto">
              {/* Student Search Section */}
              <Card className="shadow-material-3 border-0 bg-white/70 backdrop-blur-sm animate-slide-up card-hover">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                      <div className="bg-gradient-to-br from-primary to-purple-600 p-4 rounded-2xl shadow-material-2">
                        <User className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-3">Student Portal</h3>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      Enter your name and T.U. registration number to search for your academic results
                    </p>
                  </div>
                  
                  <StudentSearch onResultFound={handleResultFound} />
                </CardContent>
              </Card>

              {/* Display Results */}
              {searchResult && (
                <div className="animate-slide-up">
                  <StudentResults result={searchResult} />
                </div>
              )}

              {/* Info Cards */}
              {!searchResult && (
                <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in">
                  <Card className="text-center p-6 card-hover bg-white/50 backdrop-blur-sm border-0 shadow-material-2">
                    <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl w-fit mx-auto mb-4">
                      <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Quick Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Find results instantly using your name and registration number
                    </p>
                  </Card>
                  
                  <Card className="text-center p-6 card-hover bg-white/50 backdrop-blur-sm border-0 shadow-material-2">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-xl w-fit mx-auto mb-4">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold mb-2">PDF Download</h4>
                    <p className="text-sm text-muted-foreground">
                      Download official PDF copies of your marksheets securely
                    </p>
                  </Card>
                  
                  <Card className="text-center p-6 card-hover bg-white/50 backdrop-blur-sm border-0 shadow-material-2">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl w-fit mx-auto mb-4">
                      <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Secure Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected with enterprise-grade security
                    </p>
                  </Card>
                </div>
              )}

              {/* Admin Login Hint */}
              <div className="text-center mt-16">
                <Card className="inline-block bg-muted/30 border-dashed border-2 border-muted-foreground/20 p-6">
                  <div className="flex items-center text-muted-foreground">
                    <Lock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Administrator? Access the{" "}
                      <button 
                        onClick={() => setCurrentView("admin")} 
                        className="font-medium text-primary cursor-pointer hover:underline"
                      >
                        admin panel
                      </button>{" "}
                      to manage student records
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-muted/30 border-t py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground text-sm">
                © 2025 Tribhuvan University. Academic Result Management System.
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Secure • Reliable • Instant Access
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
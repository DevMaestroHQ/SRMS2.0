import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, Lock, Search, FileText, Shield, Users, Award, BookOpen, Globe, Clock, Star, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import StudentSearch from "@/components/student-search";
import StudentResults from "@/components/student-results";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
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
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>
            <div className="container mx-auto px-4 relative">
              <div className="text-center max-w-4xl mx-auto animate-fade-in">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="p-6 rounded-3xl shadow-educational bg-white/90 dark:bg-card/90 backdrop-blur-sm animate-bounce-in">
                      <img 
                        src={universityLogo} 
                        alt="Tribhuvan University Logo" 
                        className="h-20 w-20 md:h-24 md:w-24 object-contain"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <Badge variant="outline" className="px-4 py-2 bg-primary/10 text-primary border-primary/20 mb-4">
                    <Star className="h-4 w-4 mr-2" />
                    Official University Portal
                  </Badge>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-primary via-educational-purple to-educational-green bg-clip-text text-transparent">
                    Tribhuvan University
                  </span>
                  <span className="block text-3xl md:text-4xl lg:text-5xl mt-3 text-foreground/90">
                    Result Management System
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
                  Nepal's premier educational institution presents a secure, modern platform for accessing 
                  your academic achievements with advanced OCR technology and instant verification.
                </p>
                
                {/* CTA Button */}
                <div className="mb-12">
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                    onClick={() => document.getElementById('student-search')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Access Your Results
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                
                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">1959</div>
                    <div className="text-sm text-muted-foreground">Established</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-educational-purple mb-2">500K+</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-educational-green mb-2">60+</div>
                    <div className="text-sm text-muted-foreground">Years Legacy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Availability</div>
                  </div>
                </div>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="outline" className="px-4 py-2 bg-background/80 backdrop-blur-sm">
                    <Search className="h-4 w-4 mr-2" />
                    Instant Search
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-background/80 backdrop-blur-sm">
                    <FileText className="h-4 w-4 mr-2" />
                    PDF Download
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-background/80 backdrop-blur-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure Access
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-background/80 backdrop-blur-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Real-time Processing
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-gradient-to-r from-muted/20 to-background/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why Choose Our Platform?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Built with cutting-edge technology to provide the best experience for students and administrators
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-0 shadow-material-2 card-hover">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Academic Excellence</h3>
                  <p className="text-muted-foreground">
                    Access your complete academic records with detailed marksheets and performance analytics
                  </p>
                </Card>
                
                <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-0 shadow-material-2 card-hover">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Global Recognition</h3>
                  <p className="text-muted-foreground">
                    Tribhuvan University credentials recognized worldwide for higher education and career opportunities
                  </p>
                </Card>
                
                <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-0 shadow-material-2 card-hover">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
                  <p className="text-muted-foreground">
                    Modern OCR technology and digital transformation leading educational advancement in Nepal
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-16" id="student-search">
            <div className="max-w-4xl mx-auto">
              {/* Student Search Section */}
              <Card className="shadow-material-3 border-0 bg-white/80 backdrop-blur-sm animate-slide-up card-hover">
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
                  <Card className="text-center p-6 card-hover bg-white/60 backdrop-blur-sm border-0 shadow-material-2">
                    <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl w-fit mx-auto mb-4">
                      <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Quick Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Find results instantly using your name and registration number
                    </p>
                  </Card>
                  
                  <Card className="text-center p-6 card-hover bg-white/60 backdrop-blur-sm border-0 shadow-material-2">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-xl w-fit mx-auto mb-4">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold mb-2">PDF Download</h4>
                    <p className="text-sm text-muted-foreground">
                      Download official PDF copies of your marksheets securely
                    </p>
                  </Card>
                  
                  <Card className="text-center p-6 card-hover bg-white/60 backdrop-blur-sm border-0 shadow-material-2">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl w-fit mx-auto mb-4">
                      <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Secure Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected with enterprise-grade security
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
        </>
      )}
    </div>
  );
}
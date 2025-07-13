import { Download, Eye, CheckCircle, Calendar, User, Hash, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface StudentResultsProps {
  result: {
    id: number;
    name: string;
    tuRegd: string;
    marks: string;
    uploadedAt: string;
  };
}

export default function StudentResults({ result }: StudentResultsProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/download/${result.id}`);
      if (!response.ok) {
        throw new Error("Download failed");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.name}_${result.tuRegd}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started", 
        description: "Your marksheet PDF is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the marksheet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    window.open(`/api/preview/${result.id}`, "_blank");
  };

  return (
    <div className="mt-12 animate-scale-in">
      <div className="modern-card hover-lift overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20"></div>
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-radial from-green-500/10 to-transparent rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-8 md:p-10 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center floating-animation">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="responsive-text-2xl font-bold mb-2">Result Found Successfully</h3>
                <p className="text-white/90 responsive-text-lg">Academic record retrieved and verified</p>
              </div>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span className="font-bold text-lg">Verified</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 md:p-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Student Info */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h4 className="responsive-text-2xl font-bold text-foreground">Student Information</h4>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl border-2 border-purple-200 dark:border-purple-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-muted-foreground font-bold text-lg">Name:</span>
                    </div>
                    <span className="font-bold text-foreground text-xl">{result.name}</span>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl border-2 border-blue-200 dark:border-blue-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                        <Hash className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-muted-foreground font-bold text-lg">T.U. Regd. No:</span>
                    </div>
                    <span className="font-bold text-foreground font-mono text-xl">{result.tuRegd}</span>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl border-2 border-green-200 dark:border-green-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-muted-foreground font-bold text-lg">Marks:</span>
                    </div>
                    <span className="font-bold text-green-600 text-2xl">{result.marks}</span>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl border-2 border-orange-200 dark:border-orange-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-muted-foreground font-bold text-lg">Upload Date:</span>
                    </div>
                    <span className="font-bold text-foreground text-xl">
                      {new Date(result.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 space-y-4">
                <Button
                  onClick={handleDownload}
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 hover:from-purple-700 hover:via-blue-700 hover:to-green-700 text-white rounded-2xl shadow-vibrant hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download Official PDF
                </Button>
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full h-16 text-lg font-bold border-3 border-purple-200 dark:border-purple-500/20 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-2xl transition-all duration-300"
                >
                  <Eye className="h-6 w-6 mr-3" />
                  View Full Size Image
                </Button>
              </div>
            </div>
            
            {/* Image Preview */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h4 className="responsive-text-2xl font-bold text-foreground">Marksheet Preview</h4>
              </div>
              
              <div className="border-3 border-blue-200 dark:border-blue-500/20 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50 shadow-vibrant">
                <div className="h-96 lg:h-[600px] relative">
                  <img 
                    src={`/api/preview/${result.id}`} 
                    alt="Marksheet preview"
                    className="w-full h-full object-contain p-6"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = target.nextElementSibling as HTMLElement;
                      if (errorDiv) errorDiv.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-full w-full flex items-center justify-center text-center text-muted-foreground">
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                        <Eye className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-xl">Preview not available</p>
                        <p className="text-lg">Use download to view the document</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

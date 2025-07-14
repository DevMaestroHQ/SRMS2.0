import { Download, Eye, CheckCircle, User, Hash, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface StudentResultsProps {
  result: {
    id: number;
    name: string;
    tuRegd: string;
    result: string; // "Passed" or "Failed"
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
    <div className="mt-8">
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-university-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Result Found Successfully</h3>
                <p className="text-white/90 text-sm">Academic record retrieved and verified</p>
              </div>
            </div>
            <Badge className="bg-academic-green text-white border-0 px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Verified
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Student Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-university-blue rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Student Information</h4>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-university-blue rounded-md flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-university-gray dark:text-slate-300 font-medium">Full Name:</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{result.name}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-university-navy rounded-md flex items-center justify-center">
                        <Hash className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-university-gray dark:text-slate-300 font-medium">T.U. Registration:</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{result.tuRegd}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-academic-green rounded-md flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-university-gray dark:text-slate-300 font-medium">Result Status:</span>
                    </div>
                    <Badge className={`px-4 py-2 text-sm font-semibold ${
                      result.result === "Passed" 
                        ? "bg-academic-green text-white" 
                        : "bg-academic-red text-white"
                    }`}>
                      {result.result}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 space-y-3">
                <Button
                  onClick={handleDownload}
                  className="w-full h-12 text-base font-semibold bg-university-blue hover:bg-university-navy text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  <Download className="h-5 w-5 mr-3" />
                  Download Official PDF
                </Button>
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold border-2 border-university-blue text-university-blue hover:bg-university-blue hover:text-white rounded-lg transition-all duration-200"
                >
                  <Eye className="h-5 w-5 mr-3" />
                  View Full Marksheet
                </Button>
              </div>
            </div>
            
            {/* Marksheet Preview */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-university-navy rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Marksheet Preview</h4>
              </div>
              
              <div className="border-2 border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-md">
                <div className="h-80 lg:h-96 relative">
                  <img 
                    src={`/api/preview/${result.id}`} 
                    alt="Marksheet preview"
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = target.nextElementSibling as HTMLElement;
                      if (errorDiv) errorDiv.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-full w-full flex items-center justify-center text-center text-university-gray dark:text-slate-400">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-university-blue rounded-xl flex items-center justify-center mx-auto">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Preview not available</p>
                        <p className="text-sm">Use download to view the document</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
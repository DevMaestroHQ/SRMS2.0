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
        const errorText = await response.text();
        throw new Error(errorText || "Download failed");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.name.replace(/\s+/g, '_')}_${result.tuRegd}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started", 
        description: "Your marksheet PDF is being downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download the marksheet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    try {
      const previewWindow = window.open(`/api/preview/${result.id}`, "_blank");
      if (!previewWindow) {
        toast({
          title: "Preview Blocked",
          description: "Please allow popups for this site to view the preview.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Preview error:", error);
      toast({
        title: "Preview Failed",
        description: "Failed to open preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Result Found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Record verified successfully</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Student Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Student Information</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Name:</span>
                <span className="font-medium text-slate-900 dark:text-white">{result.name}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Registration:</span>
                <span className="font-medium text-slate-900 dark:text-white font-mono">{result.tuRegd}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Result:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.result === "Passed" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {result.result}
                </span>
              </div>
            </div>
            
            <div className="pt-4 space-y-3">
              <Button
                onClick={handleDownload}
                className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handlePreview}
                variant="outline"
                className="w-full h-11 text-base border-slate-300 dark:border-slate-600 rounded-md"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Preview
              </Button>
            </div>
          </div>
          
          {/* Preview */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-900 dark:text-white">Document Preview</h4>
            
            <div className="border border-slate-200 dark:border-slate-600 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-700/50">
              <div className="h-80 relative">
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
                <div className="hidden h-full w-full flex items-center justify-center text-center">
                  <div className="space-y-3">
                    <Eye className="h-12 w-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="font-medium text-slate-600 dark:text-slate-400">Preview unavailable</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">Download to view document</p>
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
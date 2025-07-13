import { Download, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        description: "Your marksheet is being downloaded.",
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
    window.open(`/api/download/${result.id}`, "_blank");
  };

  return (
    <div className="mt-8">
      <Card className="shadow-material-2 overflow-hidden">
        <CardHeader className="bg-[hsl(var(--success))] text-white">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Result Found</h3>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{result.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">T.U. Regd. No:</span>
                  <span className="font-medium">{result.tuRegd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marks:</span>
                  <span className="font-medium text-[hsl(var(--success))]">{result.marks}</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleDownload}
                  className="w-full bg-primary hover:bg-primary/90 py-3"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Marksheet
                </Button>
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full py-3"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Preview Marksheet
                </Button>
              </div>
            </div>
            
            {/* PDF Preview */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Marksheet Preview</h4>
              <div className="border border-gray-300 rounded-lg overflow-hidden pdf-viewer h-96 flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-2" />
                  <p>PDF Preview will load here</p>
                  <p className="text-sm">Click "Preview Marksheet" to view</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

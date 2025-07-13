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
    <div className="mt-8 animate-scale-in">
      <Card className="shadow-educational border-0 overflow-hidden bg-white/90 dark:bg-card/90 backdrop-blur-sm">
        <CardHeader className="gradient-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-success/20 via-transparent to-educational-green/20" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <CheckCircle className="h-7 w-7" />
              </div>
              <div>
                <h3 className="responsive-text-xl font-bold">Result Found Successfully</h3>
                <p className="text-white/90 responsive-text-sm">Academic record retrieved and verified</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Award className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Student Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="gradient-primary p-2 rounded-xl">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h4 className="responsive-text-lg font-semibold text-foreground">Student Information</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground font-medium">Name:</span>
                  </div>
                  <span className="font-semibold text-foreground">{result.name}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Hash className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground font-medium">T.U. Regd. No:</span>
                  </div>
                  <span className="font-semibold text-foreground font-mono">{result.tuRegd}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground font-medium">Marks:</span>
                  </div>
                  <span className="font-semibold text-success text-lg">{result.marks}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground font-medium">Upload Date:</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {new Date(result.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="pt-6 space-y-3">
                <Button
                  onClick={handleDownload}
                  className="w-full py-4 text-base font-semibold gradient-primary hover:opacity-90 rounded-xl shadow-material-2 hover:shadow-educational transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Official PDF
                </Button>
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full py-4 text-base font-semibold border-2 border-primary/20 hover:bg-primary/10 rounded-xl transition-all duration-300"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Full Size Image
                </Button>
              </div>
            </div>
            
            {/* Image Preview */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="gradient-accent p-2 rounded-xl">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <h4 className="responsive-text-lg font-semibold text-foreground">Marksheet Preview</h4>
              </div>
              
              <div className="border-2 border-border/50 rounded-2xl overflow-hidden bg-muted/30 backdrop-blur-sm">
                <div className="h-96 lg:h-[500px] relative">
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
                  <div className="hidden h-full w-full flex items-center justify-center text-center text-muted-foreground">
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-2xl">
                        <Eye className="h-12 w-12 mx-auto mb-2" />
                      </div>
                      <div>
                        <p className="font-semibold">Preview not available</p>
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

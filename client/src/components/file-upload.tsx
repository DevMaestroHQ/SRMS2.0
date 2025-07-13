import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, FileText, X, Upload, Trash2, CheckCircle, Image, AlertCircle, Camera, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";

interface ProcessingResult {
  filename: string;
  success: boolean;
  extracted?: {
    name: string;
    tuRegd: string;
    marks: string;
  };
  recordId?: number;
  error?: string;
}

export default function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("studentImages", file);
      });

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: authManager.getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setProcessingResults(data.results);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast({
        title: "Processing Complete",
        description: `${data.results.filter((r: ProcessingResult) => r.success).length} files processed successfully.`,
      });

      // Invalidate and refetch records
      queryClient.invalidateQueries({ queryKey: ["/api/admin/records"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload and process files.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;
    
    const jpgFiles = Array.from(files).filter(file => 
      file.type === "image/jpeg" || file.type === "image/jpg"
    );
    setSelectedFiles(jpgFiles);
    
    if (jpgFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Only JPG/JPEG files are allowed. Non-JPG files were ignored.",
        variant: "destructive",
      });
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelection(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select JPG files to upload.",
        variant: "destructive",
      });
      return;
    }
    
    uploadMutation.mutate(selectedFiles);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-educational border-0 bg-white/90 dark:bg-card/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-educational-purple/10 to-educational-green/10 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="gradient-primary p-2 rounded-xl">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="responsive-text-xl text-foreground">
                Upload Student Images
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Process marksheet images with OCR technology
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 lg:p-8 space-y-6">
          {/* Drop Zone */}
          <div
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer bg-gradient-to-br from-primary/5 via-transparent to-educational-green/5"
          >
            <div className="space-y-6">
              <div className="relative mx-auto w-20 h-20">
                <div className="gradient-primary rounded-2xl p-4 shadow-material-2 animate-bounce-in">
                  <CloudUpload className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <Image className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="responsive-text-lg font-semibold text-foreground">
                  Drop Student Marksheet Images Here
                </p>
                <p className="text-muted-foreground">
                  or click to browse and select files
                </p>
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Image className="h-3 w-3 mr-1" />
                    JPG/JPEG
                  </Badge>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <Files className="h-3 w-3 mr-1" />
                    Multiple Files
                  </Badge>
                  <Badge variant="outline" className="bg-educational-purple/10 text-educational-purple border-educational-purple/20">
                    <Camera className="h-3 w-3 mr-1" />
                    OCR Ready
                  </Badge>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelection(e.target.files)}
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="gradient-secondary p-2 rounded-xl">
                    <Files className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="responsive-text-lg font-semibold text-foreground">
                    Selected Files ({selectedFiles.length})
                  </h4>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="gradient-accent p-2 rounded-lg">
                        <Image className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB • Image File
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="gradient-primary hover:opacity-90 rounded-xl shadow-material-2 hover:shadow-educational transition-all duration-300 transform hover:scale-[1.02] flex-1 lg:flex-none"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 mr-2 border-b-2 border-white"></div>
                      Processing Images...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Process with OCR
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFiles}
                  disabled={uploadMutation.isPending}
                  className="border-2 border-destructive/20 hover:bg-destructive/10 text-destructive rounded-xl"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Status */}
      {processingResults.length > 0 && (
        <Card className="shadow-educational border-0 bg-white/90 dark:bg-card/90 backdrop-blur-sm animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-success/10 via-educational-green/10 to-primary/10 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="gradient-secondary p-2 rounded-xl">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="responsive-text-xl text-foreground">
                  Processing Results
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  OCR extraction and validation status
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 lg:p-8">
            <div className="space-y-4">
              {processingResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-gradient-to-r from-background/50 to-muted/30 hover:shadow-material-1 transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${result.success ? 'bg-success/20' : 'bg-destructive/20'}`}>
                      {result.success ? (
                        <CheckCircle className="text-success h-5 w-5" />
                      ) : (
                        <AlertCircle className="text-destructive h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{result.filename}</p>
                      {result.success && result.extracted && (
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            <strong>Name:</strong> {result.extracted.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            <strong>Reg:</strong> {result.extracted.tuRegd}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            <strong>Marks:</strong> {result.extracted.marks}
                          </span>
                        </div>
                      )}
                      {!result.success && result.error && (
                        <p className="text-sm text-destructive mt-1">{result.error}</p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={result.success ? "default" : "destructive"}
                    className={result.success ? "bg-success/20 text-success border-success/20" : ""}
                  >
                    {result.success ? 'Processed' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

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
    <div className="space-y-12">
      <div className="modern-card hover-lift p-8 md:p-10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20"></div>
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-radial from-purple-500/10 to-transparent rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="responsive-text-3xl font-bold text-foreground mb-4">
            Upload Student Images
          </h2>
          <p className="text-muted-foreground responsive-text-lg leading-relaxed">
            Process marksheet images with advanced OCR technology
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          {/* Drop Zone */}
          <div
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-3 border-dashed border-purple-300 dark:border-purple-500/30 rounded-3xl p-12 text-center hover:border-purple-400 dark:hover:border-purple-400/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10"
          >
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-vibrant floating-animation">
                    <CloudUpload className="h-14 w-14 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center pulse-animation">
                    <Image className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="responsive-text-2xl font-bold text-foreground">
                  Drop Student Marksheet Images Here
                </p>
                <p className="text-muted-foreground responsive-text-lg">
                  or click to browse and select files
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center space-x-2 shadow-lg">
                    <Image className="h-4 w-4" />
                    <span className="font-semibold">JPG/JPEG</span>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full flex items-center space-x-2 shadow-lg">
                    <Files className="h-4 w-4" />
                    <span className="font-semibold">Multiple Files</span>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-purple-500 text-white rounded-full flex items-center space-x-2 shadow-lg">
                    <Camera className="h-4 w-4" />
                    <span className="font-semibold">OCR Ready</span>
                  </div>
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
        </div>
      </div>

      {/* Processing Status */}
      {processingResults.length > 0 && (
        <div className="modern-card hover-lift p-8 md:p-10 relative overflow-hidden animate-scale-in">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20"></div>
          </div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="responsive-text-2xl font-bold text-foreground mb-2">
                Processing Results
              </h3>
              <p className="text-muted-foreground text-lg">
                OCR extraction and validation status
              </p>
            </div>
            <div className="space-y-6">
              {processingResults.map((result, index) => (
                <div key={index} className="p-6 border-2 border-border/50 rounded-2xl bg-gradient-to-r from-white to-gray-50 dark:from-card dark:to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.success ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}>
                        {result.success ? (
                          <CheckCircle className="text-white h-6 w-6" />
                        ) : (
                          <AlertCircle className="text-white h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg">{result.filename}</p>
                        {result.success && result.extracted && (
                          <div className="flex flex-wrap gap-4 mt-2">
                            <span className="text-muted-foreground">
                              <strong>Name:</strong> {result.extracted.name}
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Reg:</strong> {result.extracted.tuRegd}
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Marks:</strong> {result.extracted.marks}
                            </span>
                          </div>
                        )}
                        {!result.success && result.error && (
                          <p className="text-red-600 mt-2 font-medium">{result.error}</p>
                        )}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold text-white ${result.success ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}>
                      {result.success ? 'Processed' : 'Failed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

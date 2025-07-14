import { useState, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Upload, FileImage, X, CheckCircle, AlertCircle, Loader2, Calendar, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import type { Semester } from "@shared/schema";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  // Fetch available semesters
  const { data: semesters = [], isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["/api/admin/semesters"],
    queryFn: async () => {
      const response = await fetch("/api/admin/semesters", {
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch semesters");
      return response.json() as Promise<Semester[]>;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("studentImages", file);
      });
      
      // Add semester selection if specified
      if (selectedSemester) {
        formData.append("semesterId", selectedSemester);
      }

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
      const successCount = data.results.filter((r: ProcessingResult) => r.success).length;
      const failCount = data.results.filter((r: ProcessingResult) => !r.success).length;
      
      toast({
        title: "Upload Complete",
        description: `${successCount} files processed successfully${failCount > 0 ? `, ${failCount} failed` : ''}.`,
        variant: failCount > 0 ? "destructive" : "default",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/records"] });
      setSelectedFiles([]);
      setProcessingProgress(0);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process files.",
        variant: "destructive",
      });
      setProcessingProgress(0);
    },
  });

  const handleFileSelect = useCallback((files: FileList) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    
    const newFiles = Array.from(files).filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not supported. Only JPG, PNG, and PDF files are allowed.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > maxFileSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 50MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    // Check total files limit
    if (selectedFiles.length + newFiles.length > 50) {
      toast({
        title: "Too Many Files",
        description: "Maximum 50 files can be uploaded at once.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, [toast, selectedFiles.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
    
    setProcessingProgress(0);
    uploadMutation.mutate(selectedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
          <Upload className="h-6 w-6 mr-3 text-blue-600" />
          Upload Student Result Images
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upload JPG images of student result marksheets for OCR processing
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Enhanced Capacity Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Enhanced File Processing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Up to 50 files, 50MB each - JPG, PNG, PDF supported</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Enhanced Capacity
            </Badge>
          </div>
        </div>

        {/* Semester Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Semester (Optional)
            </label>
          </div>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Use active semester or select specific semester" />
            </SelectTrigger>
            <SelectContent>
              {!isLoadingSemesters && semesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span>{semester.name}</span>
                    {semester.isActive && (
                      <Badge variant="default" className="ml-2 text-xs">Active</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                Drop files here or click to browse
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Supports JPG, PNG, PDF files up to 50MB each (Max 50 files)
              </p>
            </div>
            
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
              Selected Files ({selectedFiles.length})
            </h4>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileImage className="h-5 w-5 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploadMutation.isPending && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">Processing files...</span>
              <span className="text-slate-500 dark:text-slate-400">{processingProgress}%</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploadMutation.isPending}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg transition-all duration-200"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload & Process ({selectedFiles.length} files)
              </>
            )}
          </Button>
        </div>

        {/* Processing Results */}
        {uploadMutation.isSuccess && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Upload Complete!</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Files have been processed and records have been updated.
            </p>
          </div>
        )}

        {uploadMutation.isError && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Upload Failed</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              There was an error processing your files. Please try again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
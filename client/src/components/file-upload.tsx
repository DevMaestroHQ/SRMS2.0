import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, FileText, X, Upload, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="shadow-material-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Upload Student Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drop Zone */}
          <div
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CloudUpload className="text-primary text-2xl" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Drop JPG files here</p>
                <p className="text-gray-600">or click to browse and select files</p>
                <p className="text-sm text-gray-500 mt-2">Supports multiple JPG/JPEG files</p>
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
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Selected Files</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-red-600 h-5 w-5" />
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {uploadMutation.isPending ? "Processing..." : "Process Images"}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFiles}
                  disabled={uploadMutation.isPending}
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
        <Card className="shadow-material-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processingResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {result.success ? (
                      <CheckCircle className="text-green-600 h-5 w-5" />
                    ) : (
                      <X className="text-red-600 h-5 w-5" />
                    )}
                    <div>
                      <p className="font-medium">{result.filename}</p>
                      {result.success && result.extracted && (
                        <p className="text-sm text-gray-600">
                          {result.extracted.name} - {result.extracted.tuRegd}
                        </p>
                      )}
                      {!result.success && result.error && (
                        <p className="text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Processed' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

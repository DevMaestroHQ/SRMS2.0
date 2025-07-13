import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2, Users, BarChart3, Shield, Calendar, Award, Hash, User, Database, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import FileUpload from "@/components/file-upload";
import { type StudentRecord } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["/api/admin/records"],
    queryFn: async () => {
      const response = await fetch("/api/admin/records", {
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch records");
      return response.json() as Promise<StudentRecord[]>;
    },
  });

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: number) => {
      const response = await fetch(`/api/admin/records/${recordId}`, {
        method: "DELETE",
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete record");
    },
    onSuccess: () => {
      toast({
        title: "Record Deleted",
        description: "Student record has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/records"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete the record.",
        variant: "destructive",
      });
    },
  });

  const deleteAllRecordsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/records", {
        method: "DELETE",
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete all records");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "All Records Deleted",
        description: `Successfully deleted ${data.deletedCount} student records.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/records"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete All Failed",
        description: error.message || "Failed to delete all records.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteRecord = (recordId: number) => {
    if (confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      deleteRecordMutation.mutate(recordId);
    }
  };

  const handleDeleteAllRecords = () => {
    if (records.length === 0) {
      toast({
        title: "No Records",
        description: "There are no student records to delete.",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Are you sure you want to delete ALL ${records.length} student records? This action cannot be undone and will permanently remove all uploaded files.`)) {
      deleteAllRecordsMutation.mutate();
    }
  };

  const handleViewRecord = (recordId: number) => {
    window.open(`/api/download/${recordId}`, "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="responsive-text-3xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground responsive-text-base mt-2">
            Manage student records and process academic results
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <Shield className="h-3 w-3 mr-1" />
            Authenticated
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Database className="h-3 w-3 mr-1" />
            {records.length} Records
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-0 shadow-material-2 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Records</p>
                <p className="text-2xl font-bold text-foreground">{records.length}</p>
              </div>
              <div className="gradient-primary p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-0 shadow-material-2 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-foreground">
                  {records.filter(r => new Date(r.uploadedAt).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <div className="gradient-secondary p-3 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-0 shadow-material-2 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Processing</p>
                <p className="text-2xl font-bold text-success">Active</p>
              </div>
              <div className="gradient-accent p-3 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Upload Section */}
      <div className="animate-slide-up">
        <FileUpload />
      </div>

      {/* Records Table */}
      <Card className="shadow-educational border-0 overflow-hidden bg-white/90 dark:bg-card/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-educational-purple/10 to-educational-green/10 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="gradient-primary p-2 rounded-xl">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="responsive-text-xl text-foreground">Student Records</CardTitle>
                <p className="text-muted-foreground text-sm">All processed images and extracted data</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-background/50">
                {records.length} Total
              </Badge>
              {records.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAllRecords}
                  disabled={deleteAllRecordsMutation.isPending}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {deleteAllRecordsMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Delete All
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="bg-muted/50 p-6 rounded-2xl w-fit mx-auto">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              </div>
              <div>
                <p className="text-foreground font-semibold">No student records found</p>
                <p className="text-muted-foreground text-sm">Upload some student images to get started</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Student Name</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4" />
                        <span>T.U. Regd. No.</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>Marks</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Upload Date</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 dark:bg-card/50 divide-y divide-border/50">
                  {records.map((record, index) => (
                    <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="gradient-primary p-2 rounded-lg">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">{record.name}</div>
                            <div className="text-xs text-muted-foreground">Record #{record.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
                          {record.tuRegd}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {record.marks}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(record.uploadedAt.toString())}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewRecord(record.id)}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            disabled={deleteRecordMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

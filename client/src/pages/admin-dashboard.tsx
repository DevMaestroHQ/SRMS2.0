import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Eye, 
  Trash2, 
  Users, 
  BarChart3, 
  Shield, 
  Calendar, 
  Award, 
  Hash, 
  User, 
  Database, 
  AlertTriangle,
  Settings,
  FileText,
  Upload,
  GraduationCap,
  Building2,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import FileUpload from "@/components/file-upload";
import AdminManagement from "@/components/admin-management";
import ActivityTracker from "@/components/activity-tracker";
import SemesterManagement from "@/components/semester-management";
import EnhancedSemesterManagement from "@/components/enhanced-semester-management";
import EnhancedAdminDashboard from "@/components/enhanced-admin-dashboard";
import { type StudentRecord } from "@shared/schema";
import universityLogo from "@/assets/university-logo.png";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

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

  const handleLogout = () => {
    authManager.logout();
    window.location.href = "/";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const authState = authManager.getAuthState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-indigo-900/10">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg flex items-center justify-center">
                <img 
                  src={universityLogo} 
                  alt="University Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tribhuvan University Result Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                <Shield className="h-3 w-3 mr-1" />
                {authState.admin?.name || "Administrator"}
              </Badge>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-white/80 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-900/20 border-slate-200 dark:border-slate-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Upload Results</span>
              <span className="sm:hidden">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="semesters" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Semesters</span>
              <span className="sm:hidden">Sem</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Student Records</span>
              <span className="sm:hidden">Records</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Activity</span>
              <span className="sm:hidden">Log</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Admin Management</span>
              <span className="sm:hidden">Admin</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EnhancedAdminDashboard />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <FileUpload />
          </TabsContent>

          <TabsContent value="semesters" className="space-y-6">
            <EnhancedSemesterManagement />
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Student Records</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage all student academic records</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleDeleteAllRecords}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={deleteAllRecordsMutation.isPending}
                >
                  {deleteAllRecordsMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete All Records
                </Button>
              </div>
            </div>

            <Card className="professional-card">
              <CardContent className="professional-card-content">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No records found</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Upload some student results to get started</p>
                    <Button onClick={() => setActiveTab("upload")} className="btn-professional btn-primary">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Results
                    </Button>
                  </div>
                ) : (
                  <div className="table-professional">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">Student Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">T.U. Registration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">Result</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">Upload Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-medium">{record.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                              <span className="font-mono text-sm">{record.tuRegd}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                              <Badge className={`badge-professional ${
                                record.result === "Passed" ? "badge-success" : "badge-danger"
                              }`}>
                                {record.result}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                              <span className="text-sm">{formatDate(record.uploadedAt)}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewRecord(record.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="text-red-600 hover:text-red-700"
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
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityTracker />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <AdminManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
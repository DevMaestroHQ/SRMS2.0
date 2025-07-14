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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleLogout = () => {
    authManager.logout();
    window.location.reload();
  };

  const currentAdmin = authManager.getAuthState().admin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <img 
                    src={universityLogo} 
                    alt="Tribhuvan University" 
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Tribhuvan University
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Administration Portal</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{currentAdmin?.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{currentAdmin?.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
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
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Upload Results</span>
              <span className="sm:hidden">Upload</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Students</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{records.length}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Academic records</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">This Month</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {records.filter(r => new Date(r.uploadedAt).getMonth() === new Date().getMonth()).length}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">New uploads</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Passed</p>
                      <p className="text-3xl font-bold text-green-600">
                        {records.filter(r => r.result === "Passed").length}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Students</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System</p>
                      <p className="text-3xl font-bold text-indigo-600">Active</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">OCR Processing</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>System Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {records.slice(0, 5).map((record) => (
                        <div key={record.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{record.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{record.tuRegd}</p>
                            </div>
                          </div>
                          <Badge className={`${record.result === "Passed" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"}`}>
                            {record.result}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Quick Actions</h4>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setActiveTab("upload")} 
                        className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Upload className="h-4 w-4 mr-3" />
                        Upload New Results
                      </Button>
                      <Button 
                        onClick={() => setActiveTab("records")} 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <FileText className="h-4 w-4 mr-3" />
                        View All Records
                      </Button>
                      <Button 
                        onClick={() => setActiveTab("admin")} 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Admin Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <FileUpload />
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <AdminManagement />
          </TabsContent>

          <TabsContent value="records" className="space-y-6">

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Student Records</CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Processed academic results</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400">
                      {records.length} Total
                    </Badge>
                    {records.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteAllRecords}
                        disabled={deleteAllRecordsMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white"
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading records...</p>
                  </div>
                ) : records.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-slate-100 font-semibold">No student records found</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Upload some student images to get started</p>
                    </div>
                    <Button onClick={() => setActiveTab("upload")} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Results
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>Student</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center space-x-2">
                              <Hash className="h-4 w-4" />
                              <span>Registration</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4" />
                              <span>Result</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Date</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900/50 divide-y divide-slate-200 dark:divide-slate-700">
                        {records.map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{record.name}</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">ID: {record.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-mono text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                {record.tuRegd}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={record.result === "Passed" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
                              }>
                                {record.result}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                {formatDate(record.uploadedAt.toString())}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewRecord(record.id)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
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

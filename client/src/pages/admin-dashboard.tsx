import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleDeleteRecord = (recordId: number) => {
    if (confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      deleteRecordMutation.mutate(recordId);
    }
  };

  const handleViewRecord = (recordId: number) => {
    window.open(`/api/download/${recordId}`, "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage student marksheets and results</p>
        </div>
      </div>

      <FileUpload />

      <Card className="shadow-material-2 overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900">Student Records</CardTitle>
          <p className="text-gray-600 mt-1">All processed marksheets and extracted data</p>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No student records found. Upload some marksheets to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      T.U. Regd. No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.tuRegd}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.marks}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(record.uploadedAt.toString())}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRecord(record.id)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={deleteRecordMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

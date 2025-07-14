import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  BookOpen, 
  Users, 
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { type Semester, type SemesterData } from "@shared/schema";

const semesterSchema = z.object({
  name: z.string().min(1, "Semester name is required"),
  year: z.number().int().min(2000).max(2100),
  season: z.enum(["Spring", "Summer", "Fall"]),
  isActive: z.boolean().default(false),
});

type SemesterFormData = z.infer<typeof semesterSchema>;

export default function SemesterManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [expandedSemester, setExpandedSemester] = useState<number | null>(null);

  const form = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: "",
      year: new Date().getFullYear(),
      season: "Spring",
      isActive: false,
    },
  });

  const { data: semesters = [], isLoading } = useQuery({
    queryKey: ["/api/admin/semesters"],
    queryFn: async () => {
      const response = await fetch("/api/admin/semesters", {
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch semesters");
      return response.json() as Promise<Semester[]>;
    },
  });

  const { data: semesterStats = {}, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/admin/semester-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/semester-stats", {
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch semester stats");
      return response.json() as Promise<Record<number, { studentCount: number; passCount: number; failCount: number }>>;
    },
  });

  const createSemesterMutation = useMutation({
    mutationFn: (data: SemesterFormData) => 
      apiRequest("/api/admin/semesters", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 
          "Content-Type": "application/json",
          ...authManager.getAuthHeaders(),
        },
      }),
    onSuccess: () => {
      toast({
        title: "Semester Created",
        description: "New semester has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/semesters"] });
      setShowCreateForm(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create semester.",
        variant: "destructive",
      });
    },
  });

  const updateSemesterMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SemesterFormData> }) => 
      apiRequest(`/api/admin/semesters/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { 
          "Content-Type": "application/json",
          ...authManager.getAuthHeaders(),
        },
      }),
    onSuccess: () => {
      toast({
        title: "Semester Updated",
        description: "Semester has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/semesters"] });
      setEditingSemester(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update semester.",
        variant: "destructive",
      });
    },
  });

  const deleteSemesterMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/admin/semesters/${id}`, {
        method: "DELETE",
        headers: authManager.getAuthHeaders(),
      }),
    onSuccess: () => {
      toast({
        title: "Semester Deleted",
        description: "Semester has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/semesters"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete semester.",
        variant: "destructive",
      });
    },
  });

  const setActiveSemesterMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/admin/semesters/${id}/activate`, {
        method: "POST",
        headers: authManager.getAuthHeaders(),
      }),
    onSuccess: () => {
      toast({
        title: "Active Semester Updated",
        description: "Active semester has been changed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/semesters"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update active semester.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SemesterFormData) => {
    // Auto-generate name if not provided
    if (!data.name.trim()) {
      data.name = `${data.season} ${data.year}`;
    }

    if (editingSemester) {
      updateSemesterMutation.mutate({ id: editingSemester.id, data });
    } else {
      createSemesterMutation.mutate(data);
    }
  };

  const handleEdit = (semester: Semester) => {
    setEditingSemester(semester);
    setShowCreateForm(true);
    form.reset({
      name: semester.name,
      year: semester.year,
      season: semester.season as "Spring" | "Summer" | "Fall",
      isActive: semester.isActive,
    });
  };

  const handleDelete = (semester: Semester) => {
    if (semester.isActive) {
      toast({
        title: "Cannot Delete Active Semester",
        description: "Please set another semester as active before deleting this one.",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Are you sure you want to delete "${semester.name}"? This action cannot be undone.`)) {
      deleteSemesterMutation.mutate(semester.id);
    }
  };

  const handleSetActive = (semester: Semester) => {
    if (semester.isActive) return;
    
    if (confirm(`Set "${semester.name}" as the active semester? This will deactivate all other semesters.`)) {
      setActiveSemesterMutation.mutate(semester.id);
    }
  };

  const toggleExpanded = (semesterId: number) => {
    setExpandedSemester(expandedSemester === semesterId ? null : semesterId);
  };

  const activeSemester = semesters.find(s => s.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Semester Management
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage academic semesters and organize student results
          </p>
        </div>
        <Button
          onClick={() => {
            setShowCreateForm(true);
            setEditingSemester(null);
            form.reset();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Semester
        </Button>
      </div>

      {/* Active Semester Card */}
      {activeSemester && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Active Semester
                  </h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {activeSemester.name}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Current
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{editingSemester ? "Edit Semester" : "Create New Semester"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Spring">Spring</SelectItem>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Fall">Fall</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            min="2000"
                            max="2100"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="Leave empty to auto-generate (e.g., Spring 2025)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Set as Active</FormLabel>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Make this the current active semester
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingSemester(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createSemesterMutation.isPending || updateSemesterMutation.isPending}
                  >
                    {createSemesterMutation.isPending || updateSemesterMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        {editingSemester ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {editingSemester ? "Update Semester" : "Create Semester"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Semester List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
                <span className="ml-2 text-slate-600 dark:text-slate-400">Loading semesters...</span>
              </div>
            </CardContent>
          </Card>
        ) : semesters.length === 0 ? (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No Semesters Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get started by creating your first semester
              </p>
            </CardContent>
          </Card>
        ) : (
          semesters.map((semester) => {
            const stats = semesterStats[semester.id] || { studentCount: 0, passCount: 0, failCount: 0 };
            const isExpanded = expandedSemester === semester.id;
            
            return (
              <Card key={semester.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        semester.isActive ? 'bg-green-600' : 'bg-slate-400'
                      }`}>
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {semester.name}
                          </h3>
                          {semester.isActive && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {semester.season} {semester.year}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(semester.id)}
                        className="p-2"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      
                      {!semester.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetActive(semester)}
                          disabled={setActiveSemesterMutation.isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          Set Active
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(semester)}
                        className="p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(semester)}
                        disabled={semester.isActive || deleteSemesterMutation.isPending}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400">Total Students</p>
                              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {stats.studentCount}
                              </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 dark:text-green-400">Passed</p>
                              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                {stats.passCount}
                              </p>
                            </div>
                            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
                              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                {stats.failCount}
                              </p>
                            </div>
                            <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
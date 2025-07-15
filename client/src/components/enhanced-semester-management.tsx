import { useState, useMemo } from "react";
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
  ChevronUp,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Eye,
  Archive,
  FileText,
  PieChart,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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

interface SemesterStats {
  studentCount: number;
  passCount: number;
  failCount: number;
  passRate: number;
  avgGrade?: string;
  totalFiles?: number;
}

export default function EnhancedSemesterManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [expandedSemester, setExpandedSemester] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSeason, setSelectedSeason] = useState<string>("all");

  const form = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: "",
      year: new Date().getFullYear(),
      season: "Spring",
      isActive: false,
    },
  });

  // Fetch semesters with enhanced data
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

  // Fetch semester statistics
  const { data: semesterStats = {}, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/admin/semester-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/semester-stats", {
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch semester stats");
      const stats = await response.json() as Record<number, { studentCount: number; passCount: number; failCount: number }>;
      
      // Calculate pass rates
      const enhancedStats: Record<number, SemesterStats> = {};
      Object.entries(stats).forEach(([id, stat]) => {
        const passRate = stat.studentCount > 0 ? (stat.passCount / stat.studentCount) * 100 : 0;
        enhancedStats[parseInt(id)] = {
          ...stat,
          passRate: Math.round(passRate * 100) / 100,
        };
      });
      
      return enhancedStats;
    },
  });

  // Filter semesters based on search and filters
  const filteredSemesters = useMemo(() => {
    return semesters.filter(semester => {
      const matchesSearch = semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           semester.year.toString().includes(searchTerm);
      const matchesYear = selectedYear === "all" || semester.year.toString() === selectedYear;
      const matchesSeason = selectedSeason === "all" || semester.season === selectedSeason;
      
      return matchesSearch && matchesYear && matchesSeason;
    });
  }, [semesters, searchTerm, selectedYear, selectedSeason]);

  // Get unique years for filter
  const availableYears = useMemo(() => {
    const years = [...new Set(semesters.map(s => s.year))].sort((a, b) => b - a);
    return years.map(year => ({ value: year.toString(), label: year.toString() }));
  }, [semesters]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const total = Object.values(semesterStats).reduce((acc, stat) => ({
      students: acc.students + stat.studentCount,
      passed: acc.passed + stat.passCount,
      failed: acc.failed + stat.failCount,
    }), { students: 0, passed: 0, failed: 0 });

    return {
      ...total,
      passRate: total.students > 0 ? (total.passed / total.students) * 100 : 0,
    };
  }, [semesterStats]);

  // Mutations
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/semester-stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/semester-stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/semester-stats"] });
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
    if (editingSemester) {
      updateSemesterMutation.mutate({ id: editingSemester.id, data });
    } else {
      createSemesterMutation.mutate(data);
    }
  };

  const handleEdit = (semester: Semester) => {
    setEditingSemester(semester);
    setShowCreateForm(true);
    form.setValue("name", semester.name);
    form.setValue("year", semester.year);
    form.setValue("season", semester.season);
    form.setValue("isActive", semester.isActive);
  };

  const handleDelete = (semester: Semester) => {
    if (window.confirm(`Are you sure you want to delete ${semester.name}?`)) {
      deleteSemesterMutation.mutate(semester.id);
    }
  };

  const handleSetActive = (semester: Semester) => {
    if (window.confirm(`Set ${semester.name} as the active semester?`)) {
      setActiveSemesterMutation.mutate(semester.id);
    }
  };

  const getStatusBadge = (semester: Semester) => {
    if (semester.isActive) {
      return <Badge className="badge-success">Active</Badge>;
    }
    return <Badge variant="outline">Inactive</Badge>;
  };

  const getPassRateColor = (passRate: number) => {
    if (passRate >= 80) return "text-green-600 dark:text-green-400";
    if (passRate >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getPassRateIcon = (passRate: number) => {
    if (passRate >= 80) return <TrendingUp className="h-4 w-4" />;
    if (passRate >= 60) return <BarChart3 className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="professional-card">
        <div className="professional-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Semester Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-body">
                  Comprehensive semester and academic period management system
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="btn-professional btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Semester
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="professional-card">
          <CardContent className="professional-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Semesters
                </p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  {semesters.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="professional-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Students
                </p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  {overallStats.students.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="professional-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Overall Pass Rate
                </p>
                <p className={`text-2xl font-display font-bold ${getPassRateColor(overallStats.passRate)}`}>
                  {overallStats.passRate.toFixed(1)}%
                </p>
              </div>
              <div className={`p-2 rounded-lg ${
                overallStats.passRate >= 80 ? 'bg-green-100 dark:bg-green-900/20' :
                overallStats.passRate >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                'bg-red-100 dark:bg-red-900/20'
              }`}>
                {getPassRateIcon(overallStats.passRate)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="professional-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Semester
                </p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  {semesters.find(s => s.isActive)?.name || "None"}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="professional-card">
        <CardContent className="professional-card-content">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search semesters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-professional"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="professional-card">
          <CardHeader className="professional-card-header">
            <CardTitle className="text-lg font-semibold">
              {editingSemester ? "Edit Semester" : "Create New Semester"}
            </CardTitle>
          </CardHeader>
          <CardContent className="professional-card-content">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Spring 2024" className="input-professional" />
                        </FormControl>
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
                            {...field}
                            type="number"
                            min="2000"
                            max="2100"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="input-professional"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Semester</FormLabel>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Set as current active semester
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
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingSemester(null);
                      form.reset();
                    }}
                    className="btn-professional btn-secondary"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createSemesterMutation.isPending || updateSemesterMutation.isPending}
                    className="btn-professional btn-primary"
                  >
                    {createSemesterMutation.isPending || updateSemesterMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {editingSemester ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Semesters List */}
      <Card className="professional-card">
        <CardHeader className="professional-card-header">
          <CardTitle className="text-lg font-semibold">Semesters</CardTitle>
        </CardHeader>
        <CardContent className="professional-card-content">
          <div className="space-y-4">
            {filteredSemesters.map((semester) => {
              const stats = semesterStats[semester.id] || { studentCount: 0, passCount: 0, failCount: 0, passRate: 0 };
              const isExpanded = expandedSemester === semester.id;
              
              return (
                <div
                  key={semester.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(semester)}
                        <div>
                          <h3 className="font-display font-semibold text-slate-900 dark:text-white">
                            {semester.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {semester.season} {semester.year}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Students</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {stats.studentCount}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Pass Rate</p>
                          <p className={`font-semibold ${getPassRateColor(stats.passRate)}`}>
                            {stats.passRate.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Passed</p>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {stats.passCount}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Failed</p>
                          <p className="font-semibold text-red-600 dark:text-red-400">
                            {stats.failCount}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedSemester(isExpanded ? null : semester.id)}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      {!semester.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetActive(semester)}
                          className="text-green-600 hover:text-green-700 dark:text-green-400"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(semester)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(semester)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              Performance Overview
                            </span>
                            <PieChart className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Pass Rate</span>
                              <span className={`text-sm font-semibold ${getPassRateColor(stats.passRate)}`}>
                                {stats.passRate.toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={stats.passRate} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              Student Distribution
                            </span>
                            <Users className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Total</span>
                              <span className="text-sm font-semibold">{stats.studentCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-green-600 dark:text-green-400">Passed</span>
                              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                {stats.passCount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-red-600 dark:text-red-400">Failed</span>
                              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                {stats.failCount}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              Quick Actions
                            </span>
                            <Settings className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="space-y-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs"
                            >
                              <Eye className="h-3 w-3 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs"
                            >
                              <Download className="h-3 w-3 mr-2" />
                              Export Data
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs"
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              Generate Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
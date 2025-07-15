import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Upload, 
  BarChart3, 
  Settings, 
  FileText, 
  Search,
  Download,
  Activity,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  Shield,
  Database,
  Server,
  Cpu,
  HardDrive,
  Eye,
  Filter,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authManager } from "@/lib/auth";
import { type Semester, type Admin } from "@shared/schema";
import RealTimeActivityTracker from "@/components/real-time-activity-tracker";

interface DashboardStats {
  totalSemesters: number;
  totalStudents: number;
  totalFiles: number;
  activeUploads: number;
  passRate: number;
  recentActivity: ActivityItem[];
  systemHealth: {
    status: "healthy" | "warning" | "error";
    uptime: string;
    memoryUsage: number;
    diskUsage: number;
  };
}

interface ActivityItem {
  id: string;
  type: "upload" | "search" | "login" | "admin_action" | "system";
  description: string;
  timestamp: Date;
  user?: string;
  status: "success" | "warning" | "error";
}

export default function EnhancedAdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [activityFilter, setActivityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const currentAdmin = authManager.getAuthState().admin;

  // Fetch dashboard statistics
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["/api/admin/dashboard-stats", selectedTimeRange],
    queryFn: async () => {
      const response = await fetch(`/api/admin/dashboard-stats?timeRange=${selectedTimeRange}`, {
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return response.json() as Promise<DashboardStats>;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch system health
  const { data: systemHealth } = useQuery({
    queryKey: ["/api/health"],
    queryFn: async () => {
      const response = await fetch("/api/health");
      if (!response.ok) throw new Error("Failed to fetch system health");
      return response.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Mock data for demonstration (replace with actual API calls)
  const mockStats: DashboardStats = {
    totalSemesters: 12,
    totalStudents: 2847,
    totalFiles: 15234,
    activeUploads: 3,
    passRate: 78.5,
    recentActivity: [
      {
        id: "1",
        type: "upload",
        description: "Batch upload of 45 student results completed",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: "admin@university.edu",
        status: "success"
      },
      {
        id: "2",
        type: "search",
        description: "Student result search for 'John Smith' - T.U. Reg: 2023-1234",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: "success"
      },
      {
        id: "3",
        type: "admin_action",
        description: "New semester 'Fall 2024' created",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        user: "admin@university.edu",
        status: "success"
      },
      {
        id: "4",
        type: "system",
        description: "Database backup completed successfully",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: "success"
      },
      {
        id: "5",
        type: "upload",
        description: "OCR processing failed for 3 files - corrupted images",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        user: "admin@university.edu",
        status: "error"
      }
    ],
    systemHealth: {
      status: "healthy",
      uptime: "15d 7h 32m",
      memoryUsage: 65,
      diskUsage: 42
    }
  };

  const stats = dashboardStats || mockStats;

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4" />;
      case "search":
        return <Search className="h-4 w-4" />;
      case "login":
        return <User className="h-4 w-4" />;
      case "admin_action":
        return <Settings className="h-4 w-4" />;
      case "system":
        return <Server className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: ActivityItem['status']) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-yellow-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-slate-300";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const filteredActivity = stats.recentActivity.filter(item => {
    const matchesFilter = activityFilter === "all" || item.type === activityFilter;
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.user && item.user.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="professional-card">
        <div className="professional-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-body">
                  Welcome back, {currentAdmin?.name || "Administrator"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="professional-card">
          <CardContent className="professional-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Students
                </p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  {stats.totalStudents.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="professional-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Semesters
                </p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  {stats.totalSemesters}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  1 currently active
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="professional-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Files Processed
                </p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  {stats.totalFiles.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {stats.activeUploads} currently processing
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="professional-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Pass Rate
                </p>
                <p className="text-2xl font-display font-bold text-green-600 dark:text-green-400">
                  {stats.passRate}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3% from last semester
                </p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="professional-card">
        <CardHeader className="professional-card-header">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Server className="h-5 w-5 mr-2" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="professional-card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                stats.systemHealth.status === "healthy" ? "bg-green-100 dark:bg-green-900/20" :
                stats.systemHealth.status === "warning" ? "bg-yellow-100 dark:bg-yellow-900/20" :
                "bg-red-100 dark:bg-red-900/20"
              }`}>
                <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</p>
                <p className="font-semibold text-green-600 dark:text-green-400 capitalize">
                  {stats.systemHealth.status}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {stats.systemHealth.uptime}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Memory
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {stats.systemHealth.memoryUsage}%
                </span>
              </div>
              <Progress value={stats.systemHealth.memoryUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Storage
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {stats.systemHealth.diskUsage}%
                </span>
              </div>
              <Progress value={stats.systemHealth.diskUsage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity Tracker */}
      <div className="col-span-full">
        <RealTimeActivityTracker />
      </div>
    </div>
  );
}
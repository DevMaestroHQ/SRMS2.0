import { useQuery } from "@tanstack/react-query";
import { Activity, LogIn, Upload, Search, Download, Settings, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ActivityItem {
  id: number;
  type: "login" | "upload" | "search" | "download" | "admin_action";
  description: string;
  timestamp: Date;
  user?: string;
}

export default function ActivityTracker() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["/api/admin/activity"],
    queryFn: () => {
      // Mock data for demonstration
      const mockActivities: ActivityItem[] = [
        {
          id: 1,
          type: "login",
          description: "Admin logged in",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          user: "admin@university.edu"
        },
        {
          id: 2,
          type: "upload",
          description: "Uploaded 5 student result images",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          user: "admin@university.edu"
        },
        {
          id: 3,
          type: "search",
          description: "Student searched for result: Anish Banjade",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
        },
        {
          id: 4,
          type: "download",
          description: "Result PDF downloaded",
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
        },
        {
          id: 5,
          type: "admin_action",
          description: "Admin profile updated",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          user: "admin@university.edu"
        },
        {
          id: 6,
          type: "login",
          description: "Admin logged in",
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          user: "admin@university.edu"
        },
      ];
      return mockActivities;
    },
  });

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'login': return <LogIn className="h-4 w-4" />;
      case 'upload': return <Upload className="h-4 w-4" />;
      case 'search': return <Search className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      case 'admin_action': return <Settings className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'login': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upload': return 'bg-green-100 text-green-700 border-green-200';
      case 'search': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'download': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'admin_action': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getBadgeVariant = (type: ActivityItem['type']) => {
    switch (type) {
      case 'login': return 'default';
      case 'upload': return 'secondary';
      case 'search': return 'outline';
      case 'download': return 'destructive';
      case 'admin_action': return 'default';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <Activity className="h-6 w-6 mr-3 text-green-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
          <Activity className="h-6 w-6 mr-3 text-green-600" />
          Recent Activity
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Live system activity and user interactions
        </p>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No recent activity</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {activity.description}
                        </p>
                        <Badge variant={getBadgeVariant(activity.type)} className="ml-2 text-xs">
                          {activity.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTime(activity.timestamp)}</span>
                        {activity.user && (
                          <>
                            <Separator orientation="vertical" className="h-3 mx-2" />
                            <User className="h-3 w-3 mr-1" />
                            <span className="truncate">{activity.user}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < activities.length - 1 && (
                    <Separator className="my-2 ml-11" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { Clock, User, Upload, Search, FileText, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItem {
  id: number;
  type: "login" | "upload" | "search" | "download" | "admin_action";
  description: string;
  timestamp: Date;
  user?: string;
}

export default function ActivityTracker() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Initialize with sample activity data
    const sampleActivities: ActivityItem[] = [
      {
        id: 1,
        type: "login",
        description: "Admin logged in",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: "admin@university.edu.np"
      },
      {
        id: 2,
        type: "upload",
        description: "3 student records uploaded",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: "admin@university.edu.np"
      },
      {
        id: 3,
        type: "search",
        description: "Student result searched: John Doe",
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 4,
        type: "download",
        description: "PDF downloaded for student ID: 12345",
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 5,
        type: "admin_action",
        description: "New admin user created",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        user: "admin@university.edu.np"
      }
    ];
    
    setActivities(sampleActivities);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <User className="h-4 w-4 text-blue-600" />;
      case "upload":
        return <Upload className="h-4 w-4 text-green-600" />;
      case "search":
        return <Search className="h-4 w-4 text-purple-600" />;
      case "download":
        return <FileText className="h-4 w-4 text-orange-600" />;
      case "admin_action":
        return <Activity className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 10).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {activity.description}
                  </p>
                  {activity.user && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      by {activity.user}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activities.length > 10 && (
          <div className="text-center pt-3">
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View all activity
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
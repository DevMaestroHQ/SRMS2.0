import { WebSocket } from 'ws';

export interface ActivityEvent {
  id: string;
  type: 'login' | 'upload' | 'search' | 'download' | 'admin_action' | 'system' | 'error';
  description: string;
  timestamp: Date;
  user?: string;
  status: 'success' | 'warning' | 'error';
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  lastUpdate: Date;
}

class ActivityTracker {
  private activities: ActivityEvent[] = [];
  private wsClients: Set<WebSocket> = new Set();
  private startTime: Date = new Date();
  private maxActivities = 1000; // Keep last 1000 activities

  constructor() {
    // Start system health monitoring
    setInterval(() => {
      this.broadcastSystemHealth();
    }, 5000); // Update every 5 seconds
  }

  addClient(ws: WebSocket) {
    this.wsClients.add(ws);
    
    // Send current activities to new client
    ws.send(JSON.stringify({
      type: 'activities',
      data: this.getRecentActivities(50)
    }));
    
    // Send current system health
    ws.send(JSON.stringify({
      type: 'health',
      data: this.getSystemHealth()
    }));

    ws.on('close', () => {
      this.wsClients.delete(ws);
    });
  }

  logActivity(activity: Omit<ActivityEvent, 'id' | 'timestamp'>) {
    const event: ActivityEvent = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...activity
    };

    this.activities.unshift(event);
    
    // Keep only recent activities
    if (this.activities.length > this.maxActivities) {
      this.activities = this.activities.slice(0, this.maxActivities);
    }

    // Broadcast to all connected clients
    this.broadcast({
      type: 'activity',
      data: event
    });
  }

  getRecentActivities(limit: number = 50): ActivityEvent[] {
    return this.activities.slice(0, limit);
  }

  getSystemHealth(): SystemHealth {
    const uptime = Date.now() - this.startTime.getTime();
    const memoryUsage = process.memoryUsage();
    
    return {
      status: this.determineSystemStatus(),
      uptime: this.formatUptime(uptime),
      memoryUsage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      diskUsage: Math.round(Math.random() * 30 + 10), // Simulated disk usage
      activeConnections: this.wsClients.size,
      lastUpdate: new Date()
    };
  }

  private determineSystemStatus(): 'healthy' | 'warning' | 'error' {
    const memoryUsage = process.memoryUsage();
    const memoryPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    if (memoryPercent > 90) return 'error';
    if (memoryPercent > 70) return 'warning';
    return 'healthy';
  }

  private formatUptime(uptime: number): string {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  private broadcastSystemHealth() {
    const health = this.getSystemHealth();
    this.broadcast({
      type: 'health',
      data: health
    });
  }

  private broadcast(message: any) {
    const data = JSON.stringify(message);
    this.wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

export const activityTracker = new ActivityTracker();
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  UserMinus,
  Car,
  DollarSign,
  Clock,
  Eye,
  Filter,
  RefreshCw,
  Bell,
  Shield,
  Zap,
  Database,
  Server,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface ActivityItem {
  id: string;
  type: "user" | "pickup" | "payment" | "system" | "security";
  action: string;
  description: string;
  timestamp: Date;
  status: "success" | "warning" | "error" | "info";
  user?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  priority: "low" | "medium" | "high";
}

export const RecentActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "user",
      action: "New User Registration",
      description: "Teacher Sarah Johnson registered successfully",
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      status: "success",
      user: "Sarah Johnson",
      icon: UserPlus,
      priority: "medium",
    },
    {
      id: "2",
      type: "pickup",
      action: "Pickup Completed",
      description: "Student pickup completed for Emma Wilson",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: "success",
      user: "Emma Wilson",
      icon: Car,
      priority: "low",
    },
    {
      id: "3",
      type: "payment",
      action: "Payment Received",
      description: "Monthly subscription payment received from John Smith",
      timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      status: "success",
      user: "John Smith",
      icon: DollarSign,
      priority: "medium",
    },
    {
      id: "4",
      type: "system",
      action: "System Maintenance",
      description: "Scheduled database maintenance completed successfully",
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: "success",
      icon: Database,
      priority: "high",
    },
    {
      id: "5",
      type: "security",
      action: "Security Alert",
      description:
        "Multiple failed login attempts detected from IP 192.168.1.100",
      timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      status: "warning",
      icon: Shield,
      priority: "high",
    },
    {
      id: "6",
      type: "user",
      action: "User Deactivated",
      description: "Inactive user account deactivated after 90 days",
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      status: "info",
      user: "Inactive User",
      icon: UserMinus,
      priority: "low",
    },
    {
      id: "7",
      type: "system",
      action: "Performance Optimization",
      description: "API response time improved by 23% after optimization",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: "success",
      icon: Zap,
      priority: "medium",
    },
    {
      id: "8",
      type: "pickup",
      action: "Pickup Request",
      description: "New pickup request received for Michael Brown",
      timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
      status: "info",
      user: "Michael Brown",
      icon: Car,
      priority: "medium",
    },
  ]);

  const [filter, setFilter] = useState<
    "all" | "user" | "pickup" | "payment" | "system" | "security"
  >("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-amber-600 bg-amber-100 border-amber-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "user":
        return "from-blue-500 to-blue-600";
      case "pickup":
        return "from-green-500 to-green-600";
      case "payment":
        return "from-emerald-500 to-emerald-600";
      case "system":
        return "from-purple-500 to-purple-600";
      case "security":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredActivities = activities.filter(
    (activity) => filter === "all" || activity.type === filter,
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const addNewActivity = () => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: "system",
      action: "System Update",
      description: "New system update deployed successfully",
      timestamp: new Date(),
      status: "success",
      icon: Server,
      priority: "medium",
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 7)]);
  };

  useEffect(() => {
    const interval = setInterval(addNewActivity, 30000); // Add new activity every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card variant="glass" className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-30" />

      <div className="relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">
                  Recent Activity Feed
                </CardTitle>
                <p className="text-gray-600">
                  Live system events and user activities
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(
                      e.target.value as
                        | "all"
                        | "user"
                        | "pickup"
                        | "payment"
                        | "system"
                        | "security",
                    )
                  }
                  className="border-none bg-transparent text-sm focus:ring-0 focus:outline-none"
                >
                  <option value="all">All Activities</option>
                  <option value="user">User Activities</option>
                  <option value="pickup">Pickup Activities</option>
                  <option value="payment">Payment Activities</option>
                  <option value="system">System Activities</option>
                  <option value="security">Security Activities</option>
                </select>
              </div>

              <motion.button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </motion.button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="flex items-start space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(activity.type)} shadow-lg`}
                    >
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {activity.action}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              activity.status === "success"
                                ? "success"
                                : activity.status === "warning"
                                  ? "warning"
                                  : activity.status === "error"
                                    ? "error"
                                    : "info"
                            }
                            size="sm"
                          >
                            {activity.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            size="sm"
                            className={getPriorityColor(activity.priority)}
                          >
                            {activity.priority}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">
                        {activity.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                          {activity.user && (
                            <div className="flex items-center space-x-1">
                              <UserPlus className="w-3 h-3" />
                              <span>{activity.user}</span>
                            </div>
                          )}
                        </div>

                        <motion.button
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline indicator */}
                  {index < filteredActivities.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-gray-200 to-transparent" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredActivities.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="p-4 rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No activities found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or check back later
              </p>
            </motion.div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Database,
  Cpu,
  HardDrive,
  Network,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle,
  Zap,
  TrendingUp,
  TrendingDown,
  Globe,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { CircularProgress } from "../ui/progress";

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  responseTime: number;
  uptime: number;
  lastCheck: Date;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const SystemHealthMonitor: React.FC = () => {
  const [systemMetrics] = useState<SystemMetric[]>([
    {
      name: "CPU Usage",
      value: 65,
      max: 100,
      unit: "%",
      status: "healthy",
      trend: "up",
      icon: Cpu,
    },
    {
      name: "Memory Usage",
      value: 78,
      max: 100,
      unit: "%",
      status: "warning",
      trend: "up",
      icon: Activity,
    },
    {
      name: "Disk Usage",
      value: 45,
      max: 100,
      unit: "%",
      status: "healthy",
      trend: "stable",
      icon: HardDrive,
    },
    {
      name: "Network Load",
      value: 32,
      max: 100,
      unit: "%",
      status: "healthy",
      trend: "down",
      icon: Network,
    },
  ]);

  const [services] = useState<ServiceStatus[]>([
    {
      name: "Web Server",
      status: "operational",
      responseTime: 45,
      uptime: 99.9,
      lastCheck: new Date(),
      icon: Server,
    },
    {
      name: "Database",
      status: "operational",
      responseTime: 12,
      uptime: 99.8,
      lastCheck: new Date(),
      icon: Database,
    },
    {
      name: "API Gateway",
      status: "operational",
      responseTime: 28,
      uptime: 99.7,
      lastCheck: new Date(),
      icon: Globe,
    },
    {
      name: "Authentication",
      status: "operational",
      responseTime: 15,
      uptime: 99.9,
      lastCheck: new Date(),
      icon: Lock,
    },
  ]);

  const [overallHealth] = useState(95);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "down":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              System Health Monitor
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time system performance and service monitoring
            </p>
          </div>
        </div>
      </motion.div>

      {/* Overall Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <Card variant="glass" className="max-w-md">
          <CardContent className="text-center p-8">
            <div className="mb-6">
              <CircularProgress
                value={overallHealth}
                size={120}
                variant="success"
                showLabel
                className="mx-auto"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Overall System Health
            </h3>
            <p className="text-gray-600">
              Excellent performance across all systems
            </p>
            <div className="mt-4">
              <Badge variant="success" size="lg" animated>
                All Systems Operational
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="gradient">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">
                  System Metrics
                </CardTitle>
                <p className="text-gray-600">
                  Real-time performance indicators
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <metric.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {metric.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm text-gray-500">
                            {metric.value}
                            {metric.unit} / {metric.max}
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        metric.status === "healthy"
                          ? "success"
                          : metric.status === "warning"
                            ? "warning"
                            : "error"
                      }
                      size="sm"
                    >
                      {metric.status}
                    </Badge>
                  </div>

                  <Progress
                    value={(metric.value / metric.max) * 100}
                    variant={
                      metric.status === "healthy"
                        ? "success"
                        : metric.status === "warning"
                          ? "warning"
                          : "error"
                    }
                    size="lg"
                    showLabel={false}
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">
                  Service Status
                </CardTitle>
                <p className="text-gray-600">
                  Live service monitoring and uptime tracking
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white">
                        <service.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {service.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Last checked: {service.lastCheck.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <Badge
                        variant={
                          service.status === "operational"
                            ? "success"
                            : service.status === "degraded"
                              ? "warning"
                              : "error"
                        }
                        size="sm"
                      >
                        {service.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {service.responseTime}ms
                      </div>
                      <div className="text-sm text-gray-600">Response Time</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {service.uptime}%
                      </div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    Performance Trends
                  </CardTitle>
                  <p className="text-gray-600">
                    24-hour performance monitoring
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success" size="sm">
                  +12%
                </Badge>
                <span className="text-sm text-gray-600">vs yesterday</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  99.9%
                </div>
                <div className="text-sm text-gray-600 mb-3">System Uptime</div>
                <Progress value={99.9} variant="success" size="sm" />
              </div>

              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  45ms
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Avg Response Time
                </div>
                <Progress value={85} variant="info" size="sm" />
              </div>

              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  1.2M
                </div>
                <div className="text-sm text-gray-600 mb-3">Requests Today</div>
                <Progress value={78} variant="warning" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card
          variant="glass"
          className="hover:shadow-xl transition-shadow cursor-pointer"
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance Optimization
                </h3>
                <p className="text-gray-600">
                  Optimize system performance and resource usage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          variant="glass"
          className="hover:shadow-xl transition-shadow cursor-pointer"
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Security Scan
                </h3>
                <p className="text-gray-600">
                  Run comprehensive security audit and vulnerability scan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

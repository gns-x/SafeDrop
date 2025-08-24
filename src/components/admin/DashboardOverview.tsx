import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Car,
  DollarSign,
  Database,
  Activity,
  Cpu,
  HardDrive,
  Shield,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { DashboardStats } from '../../services/admin.service';
import { StatCard } from '../ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CircularProgress } from '../ui/progress';

interface DashboardOverviewProps {
  stats: DashboardStats;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatMemory = (mb: number) => {
    if (mb > 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.overview.totalUsers,
      icon: Users,
      variant: 'info' as const,
      trend: {
        value: `+${stats.overview.userGrowth}%`,
        isPositive: stats.overview.userGrowth >= 0
      },
      description: 'from last month'
    },
    {
      title: 'Students',
      value: stats.overview.totalStudents,
      icon: GraduationCap,
      variant: 'success' as const,
      trend: {
        value: `+${stats.overview.studentGrowth}%`,
        isPositive: stats.overview.studentGrowth >= 0
      },
      description: 'from last month'
    },
    {
      title: 'Active Pickups',
      value: stats.overview.activePickups,
      icon: Car,
      variant: 'warning' as const,
      trend: {
        value: 'Live',
        isPositive: true
      },
      description: 'real-time'
    },
    {
      title: 'Total Revenue',
      value: stats.overview.totalRevenue,
      icon: DollarSign,
      variant: 'success' as const,
      trend: {
        value: `+${stats.overview.revenueGrowth}%`,
        isPositive: stats.overview.revenueGrowth >= 0
      },
      description: 'from last month'
    }
  ];

  const systemMetrics = [
    {
      name: 'Database',
      icon: Database,
      status: 'Connected',
      statusColor: 'success' as const,
      metrics: [
        { label: 'Connections', value: `${stats.systemHealth.database.connections.active}/${stats.systemHealth.database.connections.total}` },
        { label: 'Response Time', value: '< 50ms' }
      ]
    },
    {
      name: 'Server',
      icon: Activity,
      status: 'Operational',
      statusColor: 'success' as const,
      metrics: [
        { label: 'Uptime', value: formatUptime(stats.systemHealth.uptime) },
        { label: 'Version', value: stats.systemHealth.version }
      ]
    },
    {
      name: 'Memory',
      icon: Cpu,
      status: 'Optimal',
      statusColor: 'success' as const,
      metrics: [
        { label: 'Used', value: formatMemory(stats.systemHealth.memory.heapUsed) },
        { label: 'Total', value: formatMemory(stats.systemHealth.memory.heapTotal) }
      ]
    },
    {
      name: 'Storage',
      icon: HardDrive,
      status: 'Healthy',
      statusColor: 'success' as const,
      metrics: [
        { label: 'RSS', value: formatMemory(stats.systemHealth.memory.rss) },
        { label: 'External', value: formatMemory(stats.systemHealth.memory.external) }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions across the system',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      stats: [
        { label: 'Teachers', value: stats.overview.totalTeachers },
        { label: 'Parents', value: stats.overview.totalParents }
      ],
      action: 'Manage Users',
      actionColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Pickup Operations',
      description: 'Monitor and manage all pickup activities in real-time',
      icon: Car,
      color: 'from-green-500 to-green-600',
      stats: [
        { label: 'Active', value: stats.overview.activePickups, color: 'text-yellow-600' },
        { label: 'Completed', value: stats.overview.completedPickups, color: 'text-green-600' }
      ],
      action: 'View Pickups',
      actionColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Financial Overview',
      description: 'Track revenue, payments, and financial analytics',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      stats: [
        { label: 'Total Revenue', value: `$${stats.overview.totalRevenue.toLocaleString()}`, color: 'text-green-600' },
        { label: 'Growth', value: '+23%', color: 'text-green-600' }
      ],
      action: 'View Financials',
      actionColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 p-8"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                System Overview
              </h1>
              <p className="text-gray-600">Real-time monitoring and analytics dashboard</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-green-100">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <p className="font-semibold text-green-600">All Systems Operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-100">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Performance</p>
                <p className="font-semibold text-blue-600">Excellent</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-100">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="font-semibold text-purple-600">{formatUptime(stats.systemHealth.uptime)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
              variant={card.variant}
              trend={card.trend}
            />
          </motion.div>
        ))}
      </div>

      {/* System Health Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="gradient" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
          <div className="relative z-10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">System Health Overview</CardTitle>
                    <p className="text-gray-600">Real-time system performance metrics</p>
                  </div>
                </div>
                <Badge variant="success" size="lg" animated>
                  All Systems Operational
                </Badge>
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
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <metric.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                        <Badge variant={metric.statusColor} size="sm">
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {metric.metrics.map((m, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{m.label}</span>
                          <span className="font-medium text-gray-900">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card variant="glass" className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  {action.stats.map((stat, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{stat.label}</span>
                      <span className={`font-semibold ${stat.color || 'text-gray-900'}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
                
                <button className={`w-full px-4 py-3 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${action.actionColor}`}>
                  {action.action}
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-xl">Performance Metrics</CardTitle>
            <p className="text-gray-600">System performance indicators and trends</p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <CircularProgress
                  value={85}
                  size={80}
                  variant="success"
                  showLabel
                  className="mx-auto mb-3"
                />
                <p className="text-sm font-medium text-gray-700">CPU Usage</p>
              </div>
              
              <div className="text-center">
                <CircularProgress
                  value={72}
                  size={80}
                  variant="info"
                  showLabel
                  className="mx-auto mb-3"
                />
                <p className="text-sm font-medium text-gray-700">Memory Usage</p>
              </div>
              
              <div className="text-center">
                <CircularProgress
                  value={95}
                  size={80}
                  variant="success"
                  showLabel
                  className="mx-auto mb-3"
                />
                <p className="text-sm font-medium text-gray-700">Uptime</p>
              </div>
              
              <div className="text-center">
                <CircularProgress
                  value={88}
                  size={80}
                  variant="warning"
                  showLabel
                  className="mx-auto mb-3"
                />
                <p className="text-sm font-medium text-gray-700">Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

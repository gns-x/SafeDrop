import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import {
  Car,
  Clock,
  CheckCircle,
  TrendingUp,
  MapPin,
  Eye,
  Download,
  Activity,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { ChartContainer } from '../ui/chart-container';
import { StatCard } from '../ui/stat-card';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface PickupMetrics {
  totalPickups: number;
  activePickups: number;
  completedPickups: number;
  cancelledPickups: number;
  avgPickupTime: number;
  pickupGrowth: number;
  topLocations: Array<{ location: string; count: number; percentage: number }>;
  pickupTrends: Array<{ date: string; total: number; completed: number; cancelled: number }>;
  pickupStatus: Array<{ status: string; count: number; percentage: number; color: string }>;
  performanceMetrics: Array<{ metric: string; value: number; target: number; status: 'excellent' | 'good' | 'warning' | 'poor' }>;
}

export const PickupAnalyticsChart: React.FC = () => {
  const [metrics, setMetrics] = useState<PickupMetrics>({
    totalPickups: 1247,
    activePickups: 89,
    completedPickups: 1123,
    cancelledPickups: 35,
    avgPickupTime: 12.5,
    pickupGrowth: 18.7,
    topLocations: [
      { location: 'Main Campus', count: 456, percentage: 37 },
      { location: 'North Building', count: 289, percentage: 23 },
      { location: 'East Wing', count: 234, percentage: 19 },
      { location: 'South Gate', count: 156, percentage: 13 },
      { location: 'West Entrance', count: 112, percentage: 8 }
    ],
    pickupTrends: [
      { date: '2024-01-01', total: 45, completed: 42, cancelled: 3 },
      { date: '2024-01-02', total: 52, completed: 48, cancelled: 4 },
      { date: '2024-01-03', total: 48, completed: 45, cancelled: 3 },
      { date: '2024-01-04', total: 61, completed: 58, cancelled: 3 },
      { date: '2024-01-05', total: 55, completed: 52, cancelled: 3 },
      { date: '2024-01-06', total: 67, completed: 64, cancelled: 3 },
      { date: '2024-01-07', total: 89, completed: 85, cancelled: 4 }
    ],
    pickupStatus: [
      { status: 'Completed', count: 1123, percentage: 90, color: '#10B981' },
      { status: 'Active', count: 89, percentage: 7, color: '#F59E0B' },
      { status: 'Cancelled', count: 35, percentage: 3, color: '#EF4444' }
    ],
    performanceMetrics: [
      { metric: 'Completion Rate', value: 90, target: 85, status: 'excellent' },
      { metric: 'Avg Pickup Time', value: 12.5, target: 15, status: 'excellent' },
      { metric: 'Customer Satisfaction', value: 4.6, target: 4.5, status: 'good' },
      { metric: 'On-time Performance', value: 94.2, target: 95, status: 'warning' }
    ]
  });

  const [period, setPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const periodOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'good':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'warning':
        return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'poor':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const summaryCards = [
    {
      title: 'Total Pickups',
      value: metrics.totalPickups,
      icon: Car,
      variant: 'info' as const,
      trend: {
        value: `+${metrics.pickupGrowth}%`,
        isPositive: metrics.pickupGrowth >= 0
      },
      description: 'from last period'
    },
    {
      title: 'Active Pickups',
      value: metrics.activePickups,
      icon: Activity,
      variant: 'warning' as const,
      trend: {
        value: 'Live',
        isPositive: true
      },
      description: 'real-time'
    },
    {
      title: 'Completed',
      value: metrics.completedPickups,
      icon: CheckCircle,
      variant: 'success' as const,
      trend: {
        value: '+15.3%',
        isPositive: true
      },
      description: 'from last period'
    },
    {
      title: 'Avg Time',
      value: `${metrics.avgPickupTime} min`,
      icon: Clock,
      variant: 'info' as const,
      trend: {
        value: '-8.2%',
        isPositive: true
      },
      description: 'faster than target'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600">
            <Car className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Pickup Analytics
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive pickup operations and performance insights</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pickup Trends Chart */}
        <ChartContainer
          title="Pickup Trends"
          subtitle="Daily pickup volume and completion rates"
          icon={TrendingUp}
          actions={
            <div className="flex items-center space-x-2">
              <Badge variant="success" size="sm">+18.7%</Badge>
              <span className="text-sm text-gray-600">vs last period</span>
            </div>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.pickupTrends}>
                <defs>
                  <linearGradient id="totalPickupsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="completedPickupsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="cancelledPickupsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value, name) => [
                    value, 
                    name === 'total' ? 'Total Pickups' : 
                    name === 'completed' ? 'Completed' : 'Cancelled'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3B82F6"
                  fill="url(#totalPickupsGradient)"
                  strokeWidth={3}
                  name="Total Pickups"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  fill="url(#completedPickupsGradient)"
                  strokeWidth={3}
                  name="Completed"
                />
                <Area
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#EF4444"
                  fill="url(#cancelledPickupsGradient)"
                  strokeWidth={3}
                  name="Cancelled"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Pickup Status Distribution */}
        <ChartContainer
          title="Pickup Status Distribution"
          subtitle="Current status breakdown"
          icon={Target}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.pickupStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {metrics.pickupStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, `${name} Pickups`]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center flex-wrap gap-4 mt-6">
            {metrics.pickupStatus.map((entry, index) => (
              <motion.div
                key={entry.status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.status}</span>
                <span className="text-sm font-medium text-gray-900">
                  ({entry.percentage}%)
                </span>
              </motion.div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Top Locations and Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pickup Locations */}
        <ChartContainer
          title="Top Pickup Locations"
          subtitle="Most popular pickup points"
          icon={MapPin}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.topLocations} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="location" type="category" stroke="#6b7280" fontSize={12} />
                <Tooltip
                  formatter={(value, name) => [value, 'Pickups']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Performance Metrics */}
        <ChartContainer
          title="Performance Metrics"
          subtitle="Key performance indicators"
          icon={Zap}
        >
          <div className="space-y-6">
            {metrics.performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      {typeof metric.value === 'number' && metric.metric.includes('Rate') 
                        ? `${metric.value}%` 
                        : metric.metric.includes('Satisfaction') 
                          ? metric.value.toFixed(1)
                          : metric.value.toFixed(1)}
                    </span>
                    <Badge 
                      variant={metric.status === 'excellent' ? 'success' : 
                             metric.status === 'good' ? 'info' : 
                             metric.status === 'warning' ? 'warning' : 'error'} 
                      size="sm"
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={(metric.value / metric.target) * 100}
                  variant={metric.status === 'excellent' ? 'success' : 
                          metric.status === 'good' ? 'info' : 
                          metric.status === 'warning' ? 'warning' : 'error'}
                  size="md"
                  showLabel={false}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {typeof metric.target === 'number' && metric.metric.includes('Rate') 
                    ? `${metric.target}%` 
                    : metric.metric.includes('Satisfaction') 
                      ? metric.target.toFixed(1)
                      : metric.target.toFixed(1)}</span>
                  <span>{((metric.value / metric.target) * 100).toFixed(1)}% of target</span>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Real-time Monitoring */}
      <ChartContainer
        title="Real-time Pickup Monitoring"
        subtitle="Live pickup operations dashboard"
        icon={Activity}
        actions={
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.activePickups}</div>
            <div className="text-sm text-blue-700 mb-3">Active Pickups</div>
            <Progress value={75} variant="info" size="sm" />
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">{metrics.avgPickupTime}</div>
            <div className="text-sm text-green-700 mb-3">Avg Time (min)</div>
            <Progress value={83} variant="success" size="sm" />
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">94.2%</div>
            <div className="text-sm text-purple-700 mb-3">On-time Rate</div>
            <Progress value={94.2} variant="warning" size="sm" />
          </div>
        </div>
      </ChartContainer>

      {/* Quick Actions and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Live Monitoring</h3>
                <p className="text-gray-600">Real-time pickup operations dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Safety Analytics</h3>
                <p className="text-gray-600">Monitor safety metrics and incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
                <p className="text-gray-600">Generate pickup operations report</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

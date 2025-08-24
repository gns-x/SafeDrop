import React, { useState } from "react";
import { motion } from "framer-motion";
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
  Bar,
} from "recharts";
import {
  Users,
  GraduationCap,
  UserPlus,
  TrendingUp,
  Eye,
  Download,
  Activity,
  Shield,
  Zap,
} from "lucide-react";
import { ChartContainer } from "../ui/chart-container";
import { StatCard } from "../ui/stat-card";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
  userRetention: number;
  topUserTypes: Array<{ type: string; count: number; percentage: number }>;
  userActivity: Array<{ date: string; active: number; new: number }>;
  userDistribution: Array<{ age: string; count: number; percentage: number }>;
  userEngagement: Array<{
    metric: string;
    value: number;
    target: number;
    status: "excellent" | "good" | "warning" | "poor";
  }>;
}

export const UserAnalyticsChart: React.FC = () => {
  const [metrics] = useState<UserMetrics>({
    totalUsers: 2847,
    activeUsers: 2156,
    newUsers: 89,
    userGrowth: 23.4,
    userRetention: 87.2,
    topUserTypes: [
      { type: "Students", count: 1847, percentage: 65 },
      { type: "Parents", count: 847, percentage: 30 },
      { type: "Teachers", count: 153, percentage: 5 },
    ],
    userActivity: [
      { date: "2024-01-01", active: 1850, new: 45 },
      { date: "2024-01-02", active: 1920, new: 52 },
      { date: "2024-01-03", active: 1980, new: 48 },
      { date: "2024-01-04", active: 2050, new: 61 },
      { date: "2024-01-05", active: 2120, new: 55 },
      { date: "2024-01-06", active: 2180, new: 67 },
      { date: "2024-01-07", active: 2156, new: 89 },
    ],
    userDistribution: [
      { age: "18-25", count: 456, percentage: 16 },
      { age: "26-35", count: 789, percentage: 28 },
      { age: "36-45", count: 1023, percentage: 36 },
      { age: "46-55", count: 423, percentage: 15 },
      { age: "55+", count: 156, percentage: 5 },
    ],
    userEngagement: [
      {
        metric: "Daily Active Users",
        value: 2156,
        target: 2000,
        status: "excellent",
      },
      {
        metric: "Weekly Active Users",
        value: 2456,
        target: 2500,
        status: "good",
      },
      {
        metric: "Monthly Active Users",
        value: 2847,
        target: 3000,
        status: "warning",
      },
      {
        metric: "User Retention Rate",
        value: 87.2,
        target: 85,
        status: "excellent",
      },
    ],
  });

  const summaryCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      icon: Users,
      variant: "info" as const,
      trend: {
        value: `+${metrics.userGrowth}%`,
        isPositive: metrics.userGrowth >= 0,
      },
      description: "from last period",
    },
    {
      title: "Active Users",
      value: metrics.activeUsers,
      icon: Activity,
      variant: "success" as const,
      trend: {
        value: "+15.2%",
        isPositive: true,
      },
      description: "from last period",
    },
    {
      title: "New Users",
      value: metrics.newUsers,
      icon: UserPlus,
      variant: "warning" as const,
      trend: {
        value: "+8.7%",
        isPositive: true,
      },
      description: "this week",
    },
    {
      title: "Retention Rate",
      value: `${metrics.userRetention}%`,
      icon: TrendingUp,
      variant: "success" as const,
      trend: {
        value: "+2.1%",
        isPositive: true,
      },
      description: "from last month",
    },
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
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              User Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive user behavior and growth insights
            </p>
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
        {/* User Activity Chart */}
        <ChartContainer
          title="User Activity Trends"
          subtitle="Daily active and new user counts"
          icon={TrendingUp}
          actions={
            <div className="flex items-center space-x-2">
              <Badge variant="success" size="sm">
                +15.2%
              </Badge>
              <span className="text-sm text-gray-600">vs last period</span>
            </div>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.userActivity}>
                <defs>
                  <linearGradient
                    id="activeUsersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="newUsersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value, name) => [
                    value,
                    name === "active" ? "Active Users" : "New Users",
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#3B82F6"
                  fill="url(#activeUsersGradient)"
                  strokeWidth={3}
                  name="Active Users"
                />
                <Area
                  type="monotone"
                  dataKey="new"
                  stroke="#10B981"
                  fill="url(#newUsersGradient)"
                  strokeWidth={3}
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* User Distribution Chart */}
        <ChartContainer
          title="User Age Distribution"
          subtitle="Demographic breakdown by age groups"
          icon={Users}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="age"
                >
                  {metrics.userDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#3B82F6",
                          "#10B981",
                          "#F59E0B",
                          "#EF4444",
                          "#8B5CF6",
                          "#06B6D4",
                        ][index % 6]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, `${name} years`]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center flex-wrap gap-4 mt-6">
            {metrics.userDistribution.map((entry, index) => (
              <motion.div
                key={entry.age}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: [
                      "#3B82F6",
                      "#10B981",
                      "#F59E0B",
                      "#EF4444",
                      "#8B5CF6",
                      "#06B6D4",
                    ][index % 6],
                  }}
                ></div>
                <span className="text-sm text-gray-600">{entry.age}</span>
                <span className="text-sm font-medium text-gray-900">
                  ({entry.percentage}%)
                </span>
              </motion.div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* User Types and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Types */}
        <ChartContainer
          title="User Type Distribution"
          subtitle="Breakdown by user categories"
          icon={GraduationCap}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.topUserTypes} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis
                  dataKey="type"
                  type="category"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value, name) => [value, "Users"]} // eslint-disable-line @typescript-eslint/no-unused-vars
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* User Engagement Metrics */}
        <ChartContainer
          title="User Engagement Metrics"
          subtitle="Performance against targets"
          icon={Zap}
        >
          <div className="space-y-6">
            {metrics.userEngagement.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {metric.metric}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      {typeof metric.value === "number" &&
                      metric.metric.includes("Rate")
                        ? `${metric.value}%`
                        : metric.value.toLocaleString()}
                    </span>
                    <Badge
                      variant={
                        metric.status === "excellent"
                          ? "success"
                          : metric.status === "good"
                            ? "info"
                            : metric.status === "warning"
                              ? "warning"
                              : "error"
                      }
                      size="sm"
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={(metric.value / metric.target) * 100}
                  variant={
                    metric.status === "excellent"
                      ? "success"
                      : metric.status === "good"
                        ? "info"
                        : metric.status === "warning"
                          ? "warning"
                          : "error"
                  }
                  size="md"
                  showLabel={false}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Target:{" "}
                    {typeof metric.target === "number" &&
                    metric.metric.includes("Rate")
                      ? `${metric.target}%`
                      : metric.target.toLocaleString()}
                  </span>
                  <span>
                    {((metric.value / metric.target) * 100).toFixed(1)}% of
                    target
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Quick Actions and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          variant="glass"
          className="hover:shadow-xl transition-shadow cursor-pointer"
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  User Insights
                </h3>
                <p className="text-gray-600">
                  Deep dive into user behavior patterns
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
                  Security Analytics
                </h3>
                <p className="text-gray-600">
                  Monitor user security and access patterns
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Export Report
                </h3>
                <p className="text-gray-600">
                  Generate comprehensive user analytics report
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

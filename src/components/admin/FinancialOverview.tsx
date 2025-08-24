import React, { useState, useEffect } from 'react';
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
  Cell
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Calendar,
  Eye,
  Download
} from 'lucide-react';
import { adminService, FinancialOverview as FinancialOverviewType } from '../../services/admin.service';
import { ChartContainer } from '../ui/chart-container';
import { StatCard } from '../ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import toast from 'react-hot-toast';

export const FinancialOverview: React.FC = () => {
  const [financial, setFinancial] = useState<FinancialOverviewType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  const fetchFinancialOverview = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getFinancialOverview(period);
      setFinancial(data);
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      toast.error('Failed to load financial overview');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialOverview();
  }, [period]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const periodOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  if (isLoading || !financial) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Financial Overview
            </h2>
            <p className="text-gray-600 mt-2">Revenue tracking and payment analytics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const avgTransactionValue = financial.totalTransactions > 0 
    ? financial.totalRevenue / financial.totalTransactions 
    : 0;

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: financial.totalRevenue,
      icon: DollarSign,
      variant: 'success' as const,
      trend: {
        value: `+${financial.growthRate}%`,
        isPositive: financial.growthRate >= 0
      },
      description: 'from last period'
    },
    {
      title: 'Total Transactions',
      value: financial.totalTransactions,
      icon: Receipt,
      variant: 'info' as const,
      trend: {
        value: '+12%',
        isPositive: true
      },
      description: 'from last period'
    },
    {
      title: 'Avg Transaction',
      value: avgTransactionValue,
      icon: TrendingUp,
      variant: 'warning' as const,
      trend: {
        value: '+8%',
        isPositive: true
      },
      description: 'from last period'
    },
    {
      title: 'Growth Rate',
      value: `${financial.growthRate}%`,
      icon: CreditCard,
      variant: financial.growthRate >= 0 ? 'success' : 'error' as const,
      trend: {
        value: financial.growthRate >= 0 ? '↗' : '↘',
        isPositive: financial.growthRate >= 0
      },
      description: 'month over month'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Financial Overview
          </h2>
          <p className="text-gray-600 mt-2">Revenue tracking and payment analytics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 px-4 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border-none bg-transparent text-sm focus:ring-0 focus:outline-none"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">View Details</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

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
        {/* Daily Revenue Chart */}
        <ChartContainer
          title="Daily Revenue"
          subtitle="Revenue trends over time"
          icon={TrendingUp}
          actions={
            <div className="flex items-center space-x-2">
              <Badge variant="success" size="sm">+23%</Badge>
              <span className="text-sm text-gray-600">vs last period</span>
            </div>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financial.dailyRevenue}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
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
                  formatter={(value) => [`$${value}`, 'Revenue']}
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
                  dataKey="count"
                  stroke="#10B981"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Payment Methods Chart */}
        <ChartContainer
          title="Payment Methods"
          subtitle="Distribution by payment type"
          icon={CreditCard}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financial.paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="_count"
                  nameKey="method"
                >
                  {financial.paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, `${name} payments`]}
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
            {financial.paymentMethods.map((entry, index) => (
              <motion.div
                key={entry.method}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-600 capitalize">{entry.method}</span>
                <span className="text-sm font-medium text-gray-900">
                  (${entry._sum.amount.toLocaleString()})
                </span>
              </motion.div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Top Students Table */}
      <ChartContainer
        title="Top Paying Students"
        subtitle="Highest revenue contributors"
        icon={TrendingUp}
        actions={
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            View All
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Student Name</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Total Paid</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Transactions</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Avg per Transaction</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {financial.topStudents.slice(0, 10).map((student, index) => (
                <motion.tr
                  key={student.studentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{student.studentName}</td>
                  <td className="py-4 px-4 text-green-600 font-bold">
                    ${student._sum.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{student._count}</td>
                  <td className="py-4 px-4 text-gray-600">
                    ${(student._sum.amount / student._count).toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="success" size="sm">Active</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>

      {/* Revenue Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium text-green-600">+23%</span>
                </div>
                <Progress value={75} variant="success" size="lg" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Last Month</span>
                  <span className="text-sm font-medium text-blue-600">+18%</span>
                </div>
                <Progress value={60} variant="info" size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {financial.totalTransactions.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total transactions</p>
              <div className="mt-4">
                <Badge variant="success" size="lg" animated>
                  +12% from last period
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${avgTransactionValue.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Per transaction</p>
              <div className="mt-4">
                <Badge variant="warning" size="lg" animated>
                  +8% from last period
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

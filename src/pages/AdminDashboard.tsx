import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  Car, 
  DollarSign,
  Activity,
  Database,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw,
  Bell,
  Settings,
  Shield,
  Zap,
  Target,
  Crown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { adminService, DashboardStats } from '../services/admin.service';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { UserAnalyticsChart } from '../components/admin/UserAnalyticsChart';
import { PickupAnalyticsChart } from '../components/admin/PickupAnalyticsChart';
import { SystemHealthMonitor } from '../components/admin/SystemHealthMonitor';
import { RecentActivityFeed } from '../components/admin/RecentActivityFeed';
import { FinancialOverview } from '../components/admin/FinancialOverview';
import { Badge } from '../components/ui/badge';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userId, userName, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'pickups' | 'financial' | 'system'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'healthy':
        return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-200' };
      case 'warning':
        return { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' };
      case 'critical':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' };
      default:
        return { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200' };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { id: 'users', label: 'User Analytics', icon: Users, color: 'from-green-500 to-green-600' },
    { id: 'pickups', label: 'Pickup Analytics', icon: Car, color: 'from-yellow-500 to-yellow-600' },
    { id: 'financial', label: 'Financial', icon: DollarSign, color: 'from-purple-500 to-purple-600' },
    { id: 'system', label: 'System Health', icon: Activity, color: 'from-red-500 to-red-600' },
  ];

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-2 border-purple-200 animate-pulse"></div>
          </div>
          <p className="mt-8 text-gray-600 text-lg font-medium">Loading admin dashboard...</p>
          <p className="mt-2 text-gray-500 text-sm">Preparing your premium experience</p>
        </motion.div>
      </div>
    );
  }

  const healthStatus = getHealthStatus(stats.systemHealth.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <motion.div 
        className="relative overflow-hidden bg-white shadow-lg border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-purple-50 opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 -translate-y-48 translate-x-48" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1">Comprehensive system overview and analytics</p>
                </div>
              </div>
              
              <motion.div 
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${healthStatus.border} ${healthStatus.bg} backdrop-blur-sm`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <healthStatus.icon className={`w-5 h-5 ${healthStatus.color}`} />
                <span className={`text-sm font-semibold ${healthStatus.color}`}>
                  System {stats.systemHealth.status}
                </span>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
              <motion.button 
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
              
              <motion.button 
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              
              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{userName || 'Administrator'}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Crown className="w-3 h-3 mr-1 text-yellow-500" />
                    System Administrator
                  </p>
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`p-2 rounded-lg ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-br from-purple-100 to-purple-200' 
                      : 'bg-gray-100'
                  }`}>
                    <tab.icon className={`w-5 h-5 ${
                      activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      className="w-2 h-2 bg-purple-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <DashboardOverview stats={stats} />}
          {activeTab === 'users' && <UserAnalyticsChart />}
          {activeTab === 'pickups' && <PickupAnalyticsChart />}
          {activeTab === 'financial' && <FinancialOverview />}
          {activeTab === 'system' && <SystemHealthMonitor />}
        </motion.div>

        {/* Recent Activity - Always visible at bottom */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-gray-600">Live system events and updates</p>
            </div>
          </div>
          <RecentActivityFeed />
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Zap className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  );
}
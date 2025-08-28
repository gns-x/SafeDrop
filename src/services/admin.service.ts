import { apiService } from "./api.service";

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    activePickups: number;
    completedPickups: number;
    totalRevenue: number;
    userGrowth: number;
    studentGrowth: number;
    revenueGrowth: number;
  };
  systemHealth: {
    status: string;
    uptime: number;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    database: {
      connections: {
        active: number;
        idle: number;
        total: number;
      };
      status: string;
    };
    version: string;
  };
  lastUpdated: string;
}



export interface FinancialOverview {
  totalRevenue: number;
  totalTransactions: number;
  dailyRevenue: Array<{
    date: string;
    count: number;
  }>;
  paymentMethods: Array<{
    method: string;
    _count: number;
    _sum: { amount: number };
  }>;
  topStudents: Array<{
    studentId: string;
    studentName: string;
    _sum: { amount: number };
    _count: number;
  }>;
  growthRate: number;
  period: string;
}

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    return apiService.get<DashboardStats>("/admin/dashboard-stats");
  }

  async getUserAnalytics(period: string = "7d"): Promise<UserAnalytics> {
    return apiService.get<UserAnalytics>(
      `/admin/user-analytics?period=${period}`,
    );
  }

  async getPickupAnalytics(period: string = "7d"): Promise<PickupAnalytics> {
    return apiService.get<PickupAnalytics>(
      `/admin/pickup-analytics?period=${period}`,
    );
  }

  async getSystemHealth(): Promise<SystemHealth> {
    return apiService.get<SystemHealth>("/admin/system-health");
  }

  async getRecentActivities(limit: number = 20): Promise<RecentActivity[]> {
    return apiService.get<RecentActivity[]>(
      `/admin/recent-activities?limit=${limit}`,
    );
  }

  async getAllUsers(
    role?: string,
    page: number = 1,
  ): Promise<{
    users: User[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    params.append("page", page.toString());

    return apiService.get(`/admin/users?${params.toString()}`);
  }

  async getAllStudents(page: number = 1): Promise<{
    students: Student[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    return apiService.get(`/admin/students?page=${page}`);
  }

  async getFinancialOverview(
    period: string = "30d",
  ): Promise<FinancialOverview> {
    return apiService.get<FinancialOverview>(
      `/admin/financial-overview?period=${period}`,
    );
  }
}

export const adminService = new AdminService();
export default adminService;

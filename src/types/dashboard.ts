export interface Student {
    id: string;
    name: string;
    cardId: string;
    grade: string;
    balance: number;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
  }

  export interface PickupRecord {
    id: string;
    studentName: string;
    parentName: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    timestamp: string;
    location: string;
  }

  export interface Analytics {
    totalStudents: number;
    todayPickups: number;
    pendingPickups: number;
    completedPickups: number;
    pickupTrends: Array<{
      date: string;
      count: number;
    }>;
    gradeDistribution: Array<{
      grade: string;
      count: number;
    }>;
    dailyActivity: Array<{
      hour: string;
      pickups: number;
    }>;
  }

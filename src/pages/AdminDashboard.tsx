import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Sidebar from '../components/layout/sidebar';
import TopNav from '../components/layout/TopNav';
import AnalyticsCards from '../components/dashboard/AnalyticsCards';
import StudentsTable from '../components/dashboard/StudentsTable';
import PickupsTable from '../components/dashboard/PickupsTable';
import { Clock, TrendingUp, Users } from 'lucide-react';

// Mock data - replace with actual API calls
const mockAnalytics = {
  totalStudents: 256,
  todayPickups: 45,
  pendingPickups: 12,
  completedPickups: 33
};

const mockStudents = Array.from({ length: 10 }, (_, i) => ({
  id: `STU${i + 1}`,
  name: `Student ${i + 1}`,
  cardId: `CARD${1000 + i}`,
  grade: `Grade ${Math.floor(Math.random() * 12) + 1}`,
  balance: Math.floor(Math.random() * 1000),
  parentName: `Parent ${i + 1}`,
  parentEmail: `parent${i + 1}@example.com`,
  parentPhone: `(555) 000-${1000 + i}`,
}));

const mockPickups = Array.from({ length: 10 }, (_, i) => ({
  id: `PIC${i + 1}`,
  studentName: `Student ${i + 1}`,
  parentName: `Parent ${i + 1}`,
  status: ['pending', 'in-progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as any,
  timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  location: ['Main Gate', 'Side Entrance', 'Parking Lot'][Math.floor(Math.random() * 3)],
}));

// Grade distribution data
const gradeDistribution = [
  { grade: 'Grade 1', students: 28 },
  { grade: 'Grade 2', students: 32 },
  { grade: 'Grade 3', students: 45 },
  { grade: 'Grade 4', students: 38 },
  { grade: 'Grade 5', students: 41 },
  { grade: 'Grade 6', students: 35 }
];

// Pickup locations data
const pickupLocations = [
  { name: 'Main Gate', value: 45 },
  { name: 'Side Entrance', value: 30 },
  { name: 'Parking Lot', value: 25 }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <TopNav />

      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <AnalyticsCards analytics={mockAnalytics} />

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Average Daily Pickups</p>
                  <h3 className="text-3xl font-bold mt-2">42.5</h3>
                </div>
                <TrendingUp className="h-12 w-12 opacity-50" />
              </div>
              <div className="mt-4 text-blue-100">
                <span className="text-white font-medium">↑ 12%</span> vs last week
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Peak Hours</p>
                  <h3 className="text-3xl font-bold mt-2">2:30 PM</h3>
                </div>
                <Clock className="h-12 w-12 opacity-50" />
              </div>
              <div className="mt-4 text-purple-100">
                Highest activity window
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Parent Satisfaction</p>
                  <h3 className="text-3xl font-bold mt-2">98%</h3>
                </div>
                <Users className="h-12 w-12 opacity-50" />
              </div>
              <div className="mt-4 text-emerald-100">
                <span className="text-white font-medium">↑ 3%</span> this month
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Grade Distribution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Student Distribution by Grade</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pickup Locations Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Pickup Locations Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pickupLocations}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pickupLocations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StudentsTable students={mockStudents} />
            <PickupsTable pickups={mockPickups} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

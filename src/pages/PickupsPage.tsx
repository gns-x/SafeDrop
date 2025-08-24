import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  MapPin,
  RefreshCcw,
  Search,
  User
} from 'lucide-react';
import Sidebar from '../components/layout/sidebar';
import TopNav from '../components/layout/TopNav';

// Mock data
const mockPickups = Array.from({ length: 20 }, (_, i) => ({
  id: `PIC${i + 1}`,
  studentName: `Student ${i + 1}`,
  studentGrade: `Grade ${Math.floor(Math.random() * 12) + 1}`,
  parentName: `Parent ${i + 1}`,
  status: ['pending', 'in-progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as Status,
  timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  scheduledTime: new Date(Date.now() + Math.random() * 86400000).toISOString(),
  location: ['Main Gate', 'Side Entrance', 'Parking Lot'][Math.floor(Math.random() * 3)],
  notes: Math.random() > 0.5 ? 'Early pickup requested' : '',
}));

type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';

const PickupsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPickups = mockPickups.filter(pickup => {
    const matchesSearch = pickup.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pickup.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pickup.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || pickup.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <TopNav />

      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Pickup Management</h1>
            <p className="mt-2 text-gray-600">Monitor and manage student pickup requests</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Pickups', value: mockPickups.length, color: 'blue' },
              { label: 'Pending', value: mockPickups.filter(p => p.status === 'pending').length, color: 'yellow' },
              { label: 'In Progress', value: mockPickups.filter(p => p.status === 'in-progress').length, color: 'blue' },
              { label: 'Completed', value: mockPickups.filter(p => p.status === 'completed').length, color: 'green' }
            ].map((stat) => (
              <div key={stat.label} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-xl p-6`}>
                <p className={`text-${stat.color}-600 text-sm font-medium`}>{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by student or parent..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  <option value="Main Gate">Main Gate</option>
                  <option value="Side Entrance">Side Entrance</option>
                  <option value="Parking Lot">Parking Lot</option>
                </select>
              </div>

              <button className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100">
                <RefreshCcw size={20} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Pickups Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPickups.map((pickup) => (
                    <tr key={pickup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{pickup.studentName}</div>
                            <div className="text-sm text-gray-500">{pickup.studentGrade}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pickup.parentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pickup.status)}`}>
                          {pickup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar size={16} />
                          <span>{new Date(pickup.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <Clock size={16} />
                          <span>{new Date(pickup.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin size={16} />
                          <span>{pickup.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select
                          className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={pickup.status}
                          onChange={() => {}}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PickupsPage;

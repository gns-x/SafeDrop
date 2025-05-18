import React from 'react';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AnalyticsCardsProps {
  analytics: {
    totalStudents: number;
    todayPickups: number;
    pendingPickups: number;
    completedPickups: number;
  };
}

const AnalyticsCards = ({ analytics }: AnalyticsCardsProps) => {
  const cards = [
    {
      title: 'Total Students',
      value: analytics.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: "Today's Pickups",
      value: analytics.todayPickups,
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Pickups',
      value: analytics.pendingPickups,
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Completed Pickups',
      value: analytics.completedPickups,
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
              <card.icon
                className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`}
              />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;

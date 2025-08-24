import { Bell } from 'lucide-react';
import { StudentStatus } from '../types/student';

interface StatusChangeNotificationProps {
  studentName: string;
  newStatus: StudentStatus;
  onClose: () => void;
}

export function StatusChangeNotification({ studentName, newStatus, onClose }: StatusChangeNotificationProps) {
  const getStatusConfig = () => {
    switch (newStatus) {
      case 'PENDING_PICKUP':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: 'text-amber-600',
          message: 'is waiting for pickup'
        };
      case 'WITH_PARENT':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          message: 'has been picked up'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          message: 'status has changed'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-in">
      <div className={`max-w-sm w-full ${config.bg} ${config.border} border p-4 rounded-xl shadow-lg`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${config.icon}`}>
            <Bell className="h-6 w-6" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`font-medium ${config.text}`}>Status Update</p>
            <p className={`mt-1 text-sm ${config.text}`}>
              {studentName} {config.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className={`inline-flex ${config.text} hover:${config.bg} rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

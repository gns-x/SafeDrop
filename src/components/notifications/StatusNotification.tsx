import { Bell, Check, Clock } from 'lucide-react';
import { StudentStatus } from '../../types/student';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusNotificationProps {
  studentName: string;
  newStatus: StudentStatus;
  onClose: () => void;
}

export function StatusNotification({ studentName, newStatus, onClose }: StatusNotificationProps) {
  const getStatusConfig = () => {
    switch (newStatus) {
      case 'PENDING_PICKUP':
        return {
          icon: <Clock className="h-5 w-5" />,
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          iconColor: 'text-amber-600',
          message: 'is waiting for pickup',
          action: 'Pickup Requested'
        };
      case 'WITH_PARENT':
        return {
          icon: <Check className="h-5 w-5" />,
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          iconColor: 'text-green-600',
          message: 'has been picked up',
          action: 'Pickup Confirmed'
        };
      default:
        return {
          icon: <Bell className="h-5 w-5" />,
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          iconColor: 'text-blue-600',
          message: 'status has changed',
          action: 'Status Update'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        className="fixed top-24 right-4 z-50"
      >
        <div className={`${config.bg} ${config.border} border shadow-lg rounded-lg max-w-md`}>
          <div className="p-4">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                {config.icon}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${config.text}`}>
                  {config.action}
                </p>
                <p className={`mt-1 text-sm ${config.text}`}>
                  {studentName} {config.message}
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={onClose}
                  className={`inline-flex rounded-md p-1.5 ${config.text} hover:${config.bg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

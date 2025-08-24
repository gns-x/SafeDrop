import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParentNotificationProps {
  studentName: string;
  onClose: () => void;
}

export function ParentNotification({ studentName, onClose }: ParentNotificationProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        className="fixed top-24 right-4 z-50"
      >
        <div className="bg-green-50 border border-green-200 shadow-lg rounded-lg max-w-md">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-green-600">
                <Check className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-green-800">
                  Pickup Confirmed
                </p>
                <p className="mt-1 text-sm text-green-700">
                  Teacher has confirmed {studentName}'s pickup request.
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={onClose}
                  className="inline-flex rounded-md p-1.5 text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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

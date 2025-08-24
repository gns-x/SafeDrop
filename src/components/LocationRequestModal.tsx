import { MapPin } from 'lucide-react';

interface LocationRequestModalProps {
  onRequestLocation: () => void;
  onClose: () => void;
}

export function LocationRequestModal({ onRequestLocation, onClose }: LocationRequestModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 animate-slide-up">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enable Location Access
          </h3>
          <p className="text-gray-600 mb-6">
            We need your location to verify when you're at school for student pickup. This helps us ensure student safety.
          </p>
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onRequestLocation}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              Allow Location Access
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Student } from '../../types/auth';
import { ArrowLeft, Clock, GraduationCap, MapPin, Shield, User } from 'lucide-react';

interface DetailedStatusViewProps {
  student: Student;
  status: any;
  onBack: () => void;
}

export function DetailedStatusView({ student, status, onBack }: DetailedStatusViewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Students
      </button>

      <div className="flex items-start space-x-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-gray-500 flex items-center mt-1">
                <GraduationCap className="w-5 h-5 mr-2" />
                Grade {student.grade}
              </p>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-full">
              <span className="text-green-700 font-medium">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>
              </div>
              <p className="text-gray-700">{status?.status || 'Loading...'}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Last Updated</h3>
              </div>
              <p className="text-gray-700">{new Date().toLocaleTimeString()}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              </div>
              <p className="text-gray-700">{status?.location || 'School Premises'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

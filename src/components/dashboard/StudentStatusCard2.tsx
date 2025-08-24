import React from "react";
import { Student } from "../../types/auth";
import { Clock, GraduationCap, MapPin } from "lucide-react";

interface StudentStatusCardProps {
  student: Student;
  onSelect: (student: Student) => void;
}

export function StudentStatusCard2({
  student,
  onSelect,
}: StudentStatusCardProps) {
  return (
    <div
      onClick={() => onSelect(student)}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100"
    >
      <div className="relative p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-50 transform rotate-12 transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50 to-transparent rounded-tr-full opacity-50 transform -rotate-12 transition-transform duration-500 group-hover:scale-110" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-6">
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {student.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-xl p-2 shadow-lg border border-indigo-50">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {student.name}
                </h3>
                <p className="text-gray-500 flex items-center mt-1">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  Grade {student.grade}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Last Updated
              </span>
              <span className="text-xs text-gray-400">Just now</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                Current Location
              </span>
              <button
                className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-xl font-medium
                          transition-all duration-300 group-hover:shadow-md group-hover:from-indigo-100 group-hover:to-purple-100"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

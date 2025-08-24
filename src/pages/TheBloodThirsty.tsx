import React, { useEffect, useState } from "react";
import { Student } from "../types/auth";
import { Location } from "../types/location";
import {
  getStudentsByUser,
  getStudentDetails,
} from "../services/student.service";
import { Search } from "lucide-react";
import { StudentCard } from "../components/dashboard/StudentCard";
import toast from "react-hot-toast";

export default function TheBloodThirsty() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentLocation] = useState<Location | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudentsByUser(userId, "PARENT");
        setAllStudents(data);
      } catch {
        toast.error("Failed to load students");
      }
    };

    loadStudents();
  }, [userId]);

  const filteredStudents = allStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleStudentSelect = async (student: Student) => {
    setIsLoadingDetails(true);
    try {
      const detailedStudent = await getStudentDetails(student.id);
      setSelectedStudent(detailedStudent);
      setSearchQuery("");
    } catch {
      toast.error("Failed to load student details");
      setSelectedStudent(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleRequestPickup = () => {
    // Implement pickup request logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {!selectedStudent ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl
                         text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2
                         focus:ring-indigo-500 focus:border-transparent shadow-sm"
                placeholder="Search for a student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchQuery && (
              <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    className="w-full px-4 py-3 flex items-center space-x-4 hover:bg-gray-50
                             transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-semibold text-indigo-600">
                          {student.name[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-medium text-gray-900">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Grade {student.grade}
                      </p>
                    </div>
                  </button>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No students found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-2"
            >
              <span>← Back to search</span>
            </button>
            {isLoadingDetails ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading student details...</p>
              </div>
            ) : (
              selectedStudent && (
                <StudentCard
                  student={selectedStudent}
                  currentLocation={currentLocation}
                  onRequestPickup={handleRequestPickup}
                  isWithinRange={false}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

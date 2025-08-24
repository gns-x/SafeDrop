import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../types/auth";
import { getStudentsList } from "../services/student.service";
import { Header } from "../components/dashboard/Header";
import { StudentStatusCard2 } from "../components/dashboard/StudentStatusCard2";
import { StudentCard2 } from "../components/dashboard/StudentCard2";
import toast from "react-hot-toast";
import { Users, ArrowLeft, Search, X } from "lucide-react";

export default function StudentStatusDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = localStorage.getItem("userId") || "";
  const userName = localStorage.getItem("userName") || "";

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudentsList(userId, "PARENT");
        setStudents(data);
      } catch {
        toast.error("Failed to load students");
      }
    };

    loadStudents();
  }, [userId]);

  const handleStudentSelect = async (student: Student) => {
    setSelectedStudent(student);
    try {
      // const status = await getStudentStatus(student.id);
      // setStudentStatus(status); // This line is removed
    } catch {
      toast.error("Failed to load student status");
    }
  };

  const handleBack = () => {
    setSelectedStudent(null);
    // setStudentStatus(null); // This line is removed
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleRequestPickup = () => {
    toast.success("Pickup request handled");
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header
        userName={userName}
        onLogout={handleLogout}
        isLoadingLocation={false}
        isWithinRange={() => false}
        currentLocation={null}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedStudent ? (
          <>
            <div className="relative mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    Student Status Dashboard
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">
                    Monitor and manage your students' status in real-time
                  </p>
                </div>

                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search students..."
                      className="w-full md:w-80 pl-12 pr-10 py-3 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 shadow-sm transition-all duration-300"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-2xl shadow-lg border border-gray-100 animate-fadeIn">
                  <p className="text-sm text-gray-600 mb-2">
                    {filteredStudents.length === 0 ? "No students found" : ""}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <StudentStatusCard2
                    student={student}
                    onSelect={handleStudentSelect}
                  />
                </div>
              ))}
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                <div className="max-w-sm mx-auto">
                  <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Students Found
                  </h3>
                  <p className="text-gray-600">
                    There are currently no students associated with your
                    account.
                  </p>
                </div>
              </div>
            ) : (
              filteredStudents.length === 0 &&
              searchQuery && (
                <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                  <div className="max-w-sm mx-auto">
                    <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Results Found
                    </h3>
                    <p className="text-gray-600">
                      No students found matching "{searchQuery}". Try a
                      different search term.
                    </p>
                  </div>
                </div>
              )
            )}
          </>
        ) : (
          <div className="animate-fadeIn">
            <button
              onClick={handleBack}
              className="group flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-lg">Back to Students</span>
            </button>
            <StudentCard2
              student={selectedStudent}
              currentLocation={null}
              onRequestPickup={handleRequestPickup}
              isWithinRange={false}
            />
          </div>
        )}
      </main>
    </div>
  );
}

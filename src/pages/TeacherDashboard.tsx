import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { StudentWithStatus, StudentStatus } from "../types/student";
import { getStudentsByUser } from "../services/teacher.service";
import { useAuth } from "../hooks/useAuth";
import { useWebSocket } from "../hooks/useWebSocket";
import { websocketService } from "../services/websocket.service";
import { StatusNotification } from "../components/notifications/StatusNotification";
import { TeacherHeader } from "../components/dashboard/TeacherHeader";
import { TeacherStats } from "../components/dashboard/TeacherStats";
import { StudentStatusCard } from "../components/dashboard/StudentStatusCard";
import useSound from "use-sound";
import toast from "react-hot-toast";

const notificationSound = "/notification.mp3";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { userId, userName, userGrade, logout, isAuthenticated } = useAuth();
  // Ensure WebSocket connection for realtime updates
  useWebSocket();
  const [students, setStudents] = useState<StudentWithStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    studentName: string;
    status: StudentStatus;
  } | null>(null);
  const [playSound] = useSound(notificationSound);
  const [activeTab, setActiveTab] = useState<"all" | "active">("all");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!userId) {
        console.log("No userId available, skipping student load");
        return;
      }

      try {
        const data = await getStudentsByUser(userId, "TEACHER");
        setStudents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading students:", error);
        toast.error("Failed to load students");
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = websocketService.onStatusUpdate((data) => {
      console.log("Received Data in Teachers Dashboard : ", data);
      if (!data || !data.studentId) {
        console.warn("Invalid status update data received");
        return;
      }

      setStudents((prevStudents) => {
        if (!prevStudents || !Array.isArray(prevStudents)) {
          console.warn("Previous students state is invalid");
          return [];
        }

        const student = prevStudents.find((s) => s.id === data.studentId);

        if (
          student &&
          (data.grade === userGrade || student.grade === userGrade)
        ) {
          setNotification({ studentName: student.name, status: data.status });
          playSound();

          return prevStudents.map((s) =>
            s.id === data.studentId ? { ...s, status: data.status } : s,
          );
        }

        return prevStudents;
      });
    });

    loadStudents();
    return () => unsubscribe();
  }, [userGrade, playSound, userId]);

  // Listen to pickup requests broadcasted to teachers
  useEffect(() => {
    const handleTeacherBroadcast = (broadcast: any) => {
      if (!broadcast || broadcast.type !== "PICKUP_REQUEST") return;
      const studentName = broadcast?.data?.studentName as string | undefined;
      if (!studentName) return;

      setStudents((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const target = list.find((s) => s.name === studentName);
        if (!target) return list;
        // Mark as pending pickup for visibility
        const updated = list.map((s) =>
          s.id === target.id ? { ...s, status: "PENDING_PICKUP" } : s,
        );
        setNotification({ studentName: target.name, status: "PENDING_PICKUP" as any });
        playSound();
        return updated;
      });
    };

    websocketService.on("teacher_broadcast", handleTeacherBroadcast);
    return () => {
      websocketService.off("teacher_broadcast", handleTeacherBroadcast);
    };
  }, [playSound]);

  const handleStatusUpdate = async (
    studentId: string,
    newStatus: StudentStatus,
  ) => {
    setStudents((prevStudents) => {
      if (!Array.isArray(prevStudents)) return [];
      return prevStudents.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student,
      );
    });

    // Show local notification for confirmation/cancel
    const picked = students.find((s) => s.id === studentId);
    if (picked) {
      setNotification({ studentName: picked.name, status: newStatus });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredStudents =
    students && Array.isArray(students)
      ? students.filter((student) => {
          const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.cardId.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesTab =
            activeTab === "all" ||
            (activeTab === "active" && student.status === "PENDING_PICKUP");
          return matchesSearch && matchesTab;
        })
      : [];

  const activeStudentsCount = Array.isArray(students)
    ? students.filter((s) => s.status !== "IN_CLASS").length
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <StatusNotification
          studentName={notification.studentName}
          newStatus={notification.status}
          onClose={() => setNotification(null)}
        />
      )}

      <TeacherHeader
        userName={userName}
        activeStudentsCount={activeStudentsCount}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TeacherStats students={students} userGrade={userGrade || ""} />

        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Students
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === "active"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Active Pickups
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentStatusCard
              key={student.id}
              student={student}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="mt-8 text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No students found
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {isLoading
                  ? "Loading students..."
                  : "Try adjusting your search criteria or switching tabs"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

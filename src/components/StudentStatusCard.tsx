import { User, Check, Clock, Users } from "lucide-react";
import { StudentWithStatus, StudentStatus } from "../types/student";
import { updateStudentStatus } from "../services/student.service";
import toast from "react-hot-toast";

interface StudentStatusCardProps {
  student: StudentWithStatus;
  onStatusUpdate: (studentId: string, newStatus: StudentStatus) => void;
}

export default function StudentStatusCard({
  student,
  onStatusUpdate,
}: StudentStatusCardProps) {
  const handleStatusChange = async (newStatus: StudentStatus) => {
    try {
      await updateStudentStatus({
        studentId: student.id,
        status: newStatus,
      });
      onStatusUpdate(student.id, newStatus);
      toast.success(`Student status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update student status");
    }
  };

  const getStatusDisplay = () => {
    switch (student.status) {
      case "IN_CLASS":
        return {
          icon: <User className="w-5 h-5" />,
          text: "In Class",
          color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
          badge: "bg-emerald-400/10",
        };
      case "PENDING_PICKUP":
        return {
          icon: <Clock className="w-5 h-5" />,
          text: "Pending Pickup",
          color: "bg-amber-50 text-amber-700 ring-amber-600/20",
          badge: "bg-amber-400/10",
        };
      case "WITH_PARENT":
        return {
          icon: <Users className="w-5 h-5" />,
          text: "With Parent",
          color: "bg-blue-50 text-blue-700 ring-blue-600/20",
          badge: "bg-blue-400/10",
        };
      default:
        return {
          icon: <User className="w-5 h-5" />,
          text: "Unknown",
          color: "bg-gray-50 text-gray-700 ring-gray-600/20",
          badge: "bg-gray-400/10",
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {student.photo ? (
              <img
                src={student.photo}
                alt={student.name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-offset-2 ring-blue-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ring-2 ring-offset-2 ring-blue-500">
                <span className="text-2xl font-bold text-blue-600">
                  {student.name.charAt(0)}
                </span>
              </div>
            )}
            <div
              className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${statusInfo.badge} ring-2 ring-white flex items-center justify-center`}
            >
              {statusInfo.icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500">ID: {student.cardId}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${statusInfo.color}`}
            >
              {statusInfo.icon}
              <span>{statusInfo.text}</span>
            </span>

            {student.status === "PENDING_PICKUP" && (
              <button
                onClick={() => handleStatusChange("WITH_PARENT")}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Confirm Pickup</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

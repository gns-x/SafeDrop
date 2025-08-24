import { useState } from "react";
import { Clock, MapPin, UserCheck, AlertCircle } from "lucide-react";
import { StudentWithStatus, StudentStatus } from "../../types/student";
import { updateStudentStatus } from "../../services/student.service";
import toast from "react-hot-toast";

interface StudentStatusCardProps {
  student: StudentWithStatus;
  onStatusUpdate: (studentId: string, status: StudentStatus) => void;
}

export function StudentStatusCard({
  student,
  onStatusUpdate,
}: StudentStatusCardProps) {
  const [, setIsHovered] = useState(false);

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

  const statusConfig = {
    IN_CLASS: { color: "green", label: "In Class", icon: UserCheck },
    PENDING_PICKUP: { color: "amber", label: "Pending Pickup", icon: Clock },
    WITH_PARENT: { color: "blue", label: "With Parent", icon: UserCheck },
    ABSENT: { color: "red", label: "Absent", icon: AlertCircle },
  };

  const currentStatus = statusConfig[student.status];

  return (
    <div
      className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300" />

      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Student Photo */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 p-0.5">
              <div className="w-full h-full rounded-xl overflow-hidden">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600">
                    <span className="text-xl font-bold text-white">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg shadow-lg flex items-center justify-center bg-${currentStatus.color}-50 border-2 border-white`}
            >
              <currentStatus.icon
                className={`w-3 h-3 text-${currentStatus.color}-600`}
              />
            </div>
          </div>

          {/* Student Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {student.name}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${currentStatus.color}-50 text-${currentStatus.color}-700`}
              >
                {currentStatus.label}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                <span className="text-sm">{student.externalCode}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                <span className="text-sm">{student.cardId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {student.status === "PENDING_PICKUP" && (
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => handleStatusChange("WITH_PARENT")}
              className="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
              Confirm Pickup
            </button>
            <button
              onClick={() => onStatusUpdate(student.id, "IN_CLASS")}
              className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { Student } from "../types/auth";
import { User } from "lucide-react";

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          {student.photo ? (
            <img
              src={student.photo}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {student.name}
            </h3>
            <p className="text-sm text-gray-600">Grade: {student.grade}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Card ID</p>
              <p className="font-medium">{student.cardId}</p>
            </div>
            {/* <div className="text-right">
              <p className="text-sm text-gray-600">Balance</p>
              <p className="font-medium text-green-600">${student.balance.toFixed(2)}</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

import { School, LogOut, Bell } from "lucide-react";

interface TeacherHeaderProps {
  userName: string | null;
  activeStudentsCount: number;
  onLogout: () => void;
}

export function TeacherHeader({
  userName,
  activeStudentsCount,
  onLogout,
}: TeacherHeaderProps) {
  return (
    <div className="relative bg-white border-b border-gray-100">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-bl-full opacity-30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-tr-full opacity-30" />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-5">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                <School className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Teacher Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back,{" "}
                  <span className="font-medium text-gray-900">{userName}</span>{" "}
                  👋
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {activeStudentsCount > 0 && (
                <div className="flex items-center space-x-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">
                    {activeStudentsCount} active pickups
                  </span>
                </div>
              )}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-5 py-2.5 text-gray-700 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

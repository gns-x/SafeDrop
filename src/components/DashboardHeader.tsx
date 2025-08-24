import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
    userName: string | null;
    userGrade: string | null;
    onLogout: () => void;
    activeStudentsCount: number;
}

export default function DashboardHeader({
    userName = 'Teacher',
    userGrade = 'N/A',
    onLogout,
    activeStudentsCount
}: DashboardHeaderProps) {
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <p className="text-sm text-gray-600">
                                Welcome, {userName || 'Teacher'} {userGrade ? `- Grade ${userGrade}` : ''}
                            </p>
                            {activeStudentsCount > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {activeStudentsCount} active updates
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

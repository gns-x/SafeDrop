import { Users, Clock, GraduationCap, UserCheck } from 'lucide-react';
import { StudentWithStatus } from '../../types/student';

interface TeacherStatsProps {
    students: StudentWithStatus[];
    userGrade: string;
}

export function TeacherStats({ students, userGrade }: TeacherStatsProps) {
    const activeStudents = students.filter(s => s.status !== 'IN_CLASS').length;
    const inClassStudents = students.filter(s => s.status === 'IN_CLASS').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                {
                    label: 'Total Students',
                    value: students.length,
                    icon: Users,
                    color: 'blue'
                },
                {
                    label: 'In Class',
                    value: inClassStudents,
                    icon: GraduationCap,
                    color: 'green'
                },
                {
                    label: 'Active Pickups',
                    value: activeStudents,
                    icon: UserCheck,
                    color: 'amber'
                },
                {
                    label: 'Grade Level',
                    value: userGrade,
                    icon: Clock,
                    color: 'purple'
                }
            ].map((stat, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300" />
                    <div className="p-6">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

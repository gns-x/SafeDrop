import { useState } from 'react';
import { MapPin, Bell, Loader2 } from 'lucide-react';
import { Student } from '../types/auth';
import { Location } from '../types/location';
import { sendPickupRequest } from '../services/location.service';
import toast from 'react-hot-toast';

interface StudentPickupCardProps {
    student: Student;
    currentLocation: Location | null;
    onRequestPickup: () => void;
    isWithinRange: boolean;
}

export default function StudentPickupCard({
    student,
    currentLocation,
    onRequestPickup,
    isWithinRange
}: StudentPickupCardProps) {
    const [isRequesting, setIsRequesting] = useState(false);
    const [hasClicked, setHasClicked] = useState(false); // Track if the button has been clicked

    const handlePickupRequest = async () => {
        if (!currentLocation) {
            toast.error('Location not available');
            return;
        }

        setIsRequesting(true);
        setHasClicked(true); // Disable the button after the first click

        try {
            await sendPickupRequest({
                studentId: student.id,
                parentId: localStorage.getItem('userId') || '',
                location: currentLocation,
                status: 'PENDING_PICKUP'
            });
            toast.success('Pickup request sent successfully');
            onRequestPickup();
        } catch (error) {
            toast.error('Failed to send pickup request');
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                            {student.photo ? (
                                <img
                                    src={student.photo}
                                    alt={student.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-indigo-600">
                                    {student.name.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">Grade: {student.grade}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className={`text-sm ${isWithinRange ? 'text-green-600' : 'text-red-600'}`}>
                                {isWithinRange ? 'Within pickup range' : 'Outside pickup range'}
                            </span>
                        </div>
                        <button
                            onClick={handlePickupRequest}
                            disabled={!isWithinRange || isRequesting || hasClicked} // Disable based on conditions
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isWithinRange && !hasClicked // Enable hover effect and active button only if within range and not clicked
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                } transition-colors duration-200`}
                        >
                            {isRequesting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Bell className="w-5 h-5" />
                            )}
                            <span>Request Pickup</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

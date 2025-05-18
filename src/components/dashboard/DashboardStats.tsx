import { Users2 } from 'lucide-react';
import { Student } from '../../types/auth';
import { Location } from '../../types/location';
import { useState } from 'react';
import { sendPickupRequest, getCurrentLocation } from '../../services/location.service';
import toast from 'react-hot-toast';
import { getDistance } from 'geolib';
import { SCHOOL_LOCATION } from '../../config/constants';

interface DashboardStatsProps {
    students: Student[];
    isWithinRange: boolean;
    currentLocation: Location | null;
    onGetLocation: () => void;
}

export function DashboardStats({ students, isWithinRange, currentLocation }: DashboardStatsProps) {
    const [isRequestingAll, setIsRequestingAll] = useState(false);
    const [isCheckingLocation, setIsCheckingLocation] = useState(false);

    const checkLocationAndRequestPickup = async () => {
        setIsCheckingLocation(true);
        try {
            // First check if geolocation is available
            if (!navigator.geolocation) {
                toast.error('Location services are not supported by your browser');
                return;
            }

            // Request permission explicitly
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            if (permission.state === 'denied') {
                toast.error('Please enable location services in your browser settings to request pickup');
                return;
            }

            const location = await getCurrentLocation();
            const distance = getDistance(
                { latitude: location.latitude, longitude: location.longitude },
                { latitude: SCHOOL_LOCATION.latitude, longitude: SCHOOL_LOCATION.longitude }
            );

            if (distance <= SCHOOL_LOCATION.radius) {
                await handleRequestAllPickups(location);
            } else {
                toast.error('You must be within school range to request pickups');
            }
        } catch (error) {
            toast.error('Please enable location services in your browser settings and try again');
        } finally {
            setIsCheckingLocation(false);
        }
    };

    const handleRequestAllPickups = async (location: Location) => {
        setIsRequestingAll(true);
        try {
            const parentId = localStorage.getItem('userId') || '';
            await Promise.all(
                students.map(student =>
                    sendPickupRequest({
                        studentId: student.id,
                        parentId,
                        location,
                        status: 'PENDING_PICKUP',
                    })
                )
            );
            toast.success('Pickup requests sent for all students');
        } catch (error) {
            toast.error('Failed to send pickup requests');
        } finally {
            setIsRequestingAll(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {students.length > 1 && (
                <div className="bg-white rounded-2xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <button
                        onClick={checkLocationAndRequestPickup}
                        disabled={isRequestingAll || isCheckingLocation}
                        className="w-full h-full flex flex-col items-center justify-center space-y-2 text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <div className="p-3 rounded-xl bg-indigo-100">
                            <Users2 className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium">
                            {isCheckingLocation ? 'Checking Location...' :
                             isRequestingAll ? 'Requesting Pickups...' :
                             'Request All Pickups'}
                        </p>
                    </button>
                </div>
            )}
        </div>
    );
}

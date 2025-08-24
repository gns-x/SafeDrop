import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types/auth';
import { Location } from '../types/location';
import { SCHOOL_LOCATION } from '../config/constants';
import { getStudentsByUser } from '../services/student.service';
import { getCurrentLocation } from '../services/location.service';
import { getDistance } from 'geolib';
import { Header } from '../components/dashboard/Header';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { StudentCard } from '../components/dashboard/StudentCard';
import { ParentNotification } from '../components/notifications/ParentNotification';
import { websocketService } from '../services/websocket.service';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import useSound from 'use-sound';
import { Users } from 'lucide-react';

const notificationSound = '/notification.mp3';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { userId, userName, logout, isAuthenticated } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [playSound] = useSound(notificationSound);
  const [studentsLoaded, setStudentsLoaded] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!userId) {
        console.log('No userId available, skipping student load');
        return;
      }
      
      try {
        const data = await getStudentsByUser(userId, 'PARENT');
        setStudents(data);
        setStudentsLoaded(true);
      } catch (error) {
        toast.error('Failed to load students');
      }
    };

    loadStudents();
  }, [userId]);

  useEffect(() => {
    const unsubscribe = websocketService.onStatusUpdate((data) => {
      console.log("Data in Parent Dashboard : ", data);
              setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s.id === data.studentId
              ? {
                  ...s,
                  status: data.status,
                }
              : s
          )
        );

      const student = students.find((s) => s.id === data.studentId);
      if (student && data.status === 'WITH_PARENT') {
        setNotification(student.name);
        playSound();
      }
    });

    return () => unsubscribe();
  }, [students, playSound]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isWithinRange = (location: Location | null): boolean => {
    if (!location) return false;
    const distance = getDistance(
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: SCHOOL_LOCATION.latitude, longitude: SCHOOL_LOCATION.longitude }
    );
    return distance <= SCHOOL_LOCATION.radius;
  };

  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setLocationDenied(false);
    } catch (error) {
      if (!locationDenied) {
        toast.error('Failed to get location');
        setLocationDenied(true);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleRequestPickup = async (studentId: string) => {
    if (!currentLocation) {
    //   toast.error('Please enable location services to request pickup');
      return ;
    }

    if (!isWithinRange(currentLocation)) {
      toast.error('You must be within school range to request pickup');
      return;
    }

    try {
      // Here you would make an API call to request pickup
      // For example: await requestPickup(studentId, currentLocation);
      toast.success('Pickup request sent successfully');
    } catch (error) {
      toast.error('Failed to send pickup request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header
        userName={userName || 'User'}
        isLoadingLocation={isLoadingLocation}
        isWithinRange={isWithinRange}
        currentLocation={currentLocation}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <ParentNotification
            studentName={notification}
            onClose={() => setNotification(null)}
          />
        )}

        <DashboardStats
          students={students}
          isWithinRange={isWithinRange(currentLocation)}
          currentLocation={currentLocation}
          onGetLocation={handleGetLocation}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              currentLocation={currentLocation}
              onRequestPickup={() => handleRequestPickup(student.id)}
              isWithinRange={isWithinRange(currentLocation)}
            />
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600">There are currently no students associated with your account.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

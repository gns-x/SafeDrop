import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../types/auth";
import { Location, SchoolLocation } from "../types/location";
import { SCHOOL_LOCATION } from "../config/constants";
import { getStudentsByUser } from "../services/student.service";
import { getDistance } from "geolib";
import { Header } from "../components/dashboard/Header";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { StudentCard } from "../components/dashboard/StudentCard";
import { ParentNotification } from "../components/notifications/ParentNotification";
import { SchoolLocationUpdater } from "../components/dashboard/SchoolLocationUpdater";
import { websocketService } from "../services/websocket.service";
import { useAuth } from "../hooks/useAuth";
import { locationManagementService } from "../services/location-management.service";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import useSound from "use-sound";
import { Users, Settings } from "lucide-react";
import { getCurrentLocation } from "../services/location.service";

const notificationSound = "/notification.mp3";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { userId, userName, logout, isAuthenticated } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [playSound] = useSound(notificationSound);
  const [currentSchoolLocation, setCurrentSchoolLocation] =
    useState<SchoolLocation>(SCHOOL_LOCATION);
  const [parentLocation, setParentLocation] = useState<Location | null>(null);
  // Location history removed
  const [showLocationSettings, setShowLocationSettings] = useState(false);

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
        const data = await getStudentsByUser(userId, "PARENT");
        setStudents(data);
      } catch {
        toast.error("Failed to load students");
      }
    };

    loadStudents();
  }, [userId]);

  // Fetch parent's current location once on mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        setParentLocation(loc);
      } catch (e) {
        // ignore; user may deny permissions
        setParentLocation(null);
      }
    };
    fetchLocation();
  }, []);

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
            : s,
        ),
      );

      const student = students.find((s) => s.id === data.studentId);
      if (student && data.status === "WITH_PARENT") {
        setNotification(student.name);
        playSound();
      }
    });

    return () => unsubscribe();
  }, [students, playSound]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isWithinRange = (location: Location | null): boolean => {
    if (!location) return false;
    const distance = getDistance(
      { latitude: location.latitude, longitude: location.longitude },
      {
        latitude: currentSchoolLocation.latitude,
        longitude: currentSchoolLocation.longitude,
      },
    );
    return distance <= currentSchoolLocation.radius;
  };

  const handleRequestPickup = async () => {
    // Location functionality removed - always allow pickup request
    try {
      // Here you would make an API call to request pickup
      toast.success("Pickup request sent successfully");
    } catch {
      toast.error("Failed to send pickup request");
    }
  };

  const handleLocationUpdate = async (newLocation: SchoolLocation) => {
    try {
      // Use mock service for now - replace with real API call when backend is ready
      const response = await locationManagementService.mockUpdateSchoolLocation(
        newLocation,
        userId || "unknown",
      );

      if (response.success) {
        setCurrentSchoolLocation(newLocation);
        toast.success("School location updated successfully! 🎉");
      }
    } catch {
      toast.error("Failed to update school location");
    }
  };

  // Location history removed

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header
        userName={userName || "User"}
        isLoadingLocation={false} // isLoadingLocation is removed
        isWithinRange={isWithinRange}
        currentLocation={parentLocation}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <ParentNotification
            studentName={notification}
            onClose={() => setNotification(null)}
          />
        )}

        <DashboardStats students={students} />

        {/* Location Management Section */}
        <div className="mb-8">
          <div className="flex items-center justify-end mb-4">
            <Button
              onClick={() => setShowLocationSettings(!showLocationSettings)}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2 bg-white text-gray-700"
            >
              <Settings className="w-4 h-4" />
              <span>{showLocationSettings ? "Hide" : "Update Location"}</span>
            </Button>
          </div>

          {showLocationSettings && (
            <div className="space-y-4">
              <SchoolLocationUpdater
                onLocationUpdate={handleLocationUpdate}
                currentLocation={currentSchoolLocation}
              />
              {/* Location history removed */}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              currentLocation={parentLocation}
              onRequestPickup={() => handleRequestPickup()}
              isWithinRange={isWithinRange(parentLocation)}
              schoolLocation={currentSchoolLocation || SCHOOL_LOCATION}
            />
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Students Found
              </h3>
              <p className="text-gray-600">
                There are currently no students associated with your account.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import {
  MapPin,
  Bell,
  Loader2,
  GraduationCap,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
} from "lucide-react";
import { Student } from "../../types/auth";
import { Location } from "../../types/location";
import {
  sendPickupRequest,
  getCurrentLocation,
} from "../../services/location.service";
import toast from "react-hot-toast";
import { getDistance } from "geolib";


interface StudentCardProps {
  student: Student;
  currentLocation: Location | null;
  onRequestPickup: () => void;
  isWithinRange: boolean;
  schoolLocation: SchoolLocation;
}

export function StudentCard({ student, onRequestPickup, schoolLocation }: StudentCardProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [isWithinRange, setIsWithinRange] = useState(false);

  const checkLocationAndRequestPickup = async () => {
    if (hasRequested) return;

    setIsCheckingLocation(true);
    try {
      // First check if geolocation is available
      if (!navigator.geolocation) {
        toast.error("Location services are not supported by your browser");
        return;
      }

      // Request permission explicitly
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      if (permission.state === "denied") {
        toast.error(
          "Please enable location services in your browser settings to request pickup",
        );
        return;
      }

      const location = await getCurrentLocation();
      const distance = getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        {
          latitude: schoolLocation.latitude,
          longitude: schoolLocation.longitude,
        },
      );

      setIsWithinRange(distance <= schoolLocation.radius);

      if (distance <= schoolLocation.radius) {
        await handlePickupRequest(location);
      } else {
        toast.error("You must be within school range to request pickup");
      }
    } catch {
      toast.error(
        "Please enable location services in your browser settings and try again",
      );
    } finally {
      setIsCheckingLocation(false);
    }
  };

  const handlePickupRequest = async (location: Location) => {
    setIsRequesting(true);
    try {
      await sendPickupRequest({
        studentId: student.id,
        parentId: localStorage.getItem("userId") || "",
        location,
        status: "PENDING_PICKUP",
      });
      toast.success("Pickup request sent successfully");
      setHasRequested(true);
      onRequestPickup();
    } catch {
      toast.error("Failed to send pickup request");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      className="relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50 transform rotate-12" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-tr-full opacity-50 transform -rotate-12" />

      <div className="relative p-6">
        <div className="absolute top-4 right-4">
          <div
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isWithinRange
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isWithinRange ? "bg-green-500" : "bg-red-500"
              } animate-pulse`}
            />
            {isWithinRange ? "In Range" : "Out of Range"}
          </div>
        </div>

        <div className="flex items-start space-x-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-50 p-1">
              <div className="w-full h-full rounded-xl overflow-hidden">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
                    <span className="text-3xl font-bold text-white">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-xl p-2 shadow-lg border border-indigo-50">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
          </div>

          <div className="flex-1 pt-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
              {student.name}
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium">
                  Grade {student.grade}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Class A</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium">3:30 PM</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Room 204</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={checkLocationAndRequestPickup}
            disabled={isCheckingLocation || isRequesting || hasRequested}
            className={`
                            w-full flex items-center justify-center space-x-3 px-6 py-3.5 rounded-xl
                            transition-all duration-300 transform
                            ${
                              !hasRequested
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }
                            ${isHovered && !hasRequested ? "scale-[1.02]" : "scale-100"}
                        `}
          >
            {isCheckingLocation ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Checking Location...</span>
              </>
            ) : isRequesting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Processing Request...</span>
              </>
            ) : hasRequested ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Pickup Requested</span>
              </>
            ) : (
              <>
                <Bell className="w-5 h-5" />
                <span className="font-medium">Request Pickup</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

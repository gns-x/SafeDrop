import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { SCHOOL_LOCATION } from "../../config/constants";
import { SchoolLocation } from "../../types/location";
import toast from "react-hot-toast";

interface SchoolLocationUpdaterProps {
  onLocationUpdate: (newLocation: SchoolLocation) => void;
  currentLocation?: SchoolLocation;
}

export function SchoolLocationUpdater({
  onLocationUpdate,
  currentLocation,
}: SchoolLocationUpdaterProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOneTapUpdate = async () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setIsLoading(false);
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "denied") {
        toast.error("Enable location permissions in your browser");
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next: SchoolLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radius: currentLocation?.radius || SCHOOL_LOCATION.radius,
          };
          onLocationUpdate(next);
          toast.success("School location updated");
          setIsLoading(false);
        },
        () => {
          toast.error("Unable to get current position");
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    } catch {
      toast.error("Location permission check failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-4 bg-white/80 backdrop-blur shadow-sm border border-gray-100">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-50/40 via-indigo-50/20 to-purple-50/40" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow text-white">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Update School Location</p>
            <p className="text-xs text-gray-500">One tap using your current position</p>
          </div>
        </div>
        <Button
          onClick={handleOneTapUpdate}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md disabled:opacity-70"
        >
          {isLoading ? "Updating..." : "Use My Location"}
        </Button>
      </div>
    </div>
  );
}

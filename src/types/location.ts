export interface Location {
    latitude: number;
    longitude: number;
  }

  export interface SchoolLocation {
  latitude: number;
  longitude: number;
  radius: number; // in meters
  reason?: string; // optional reason for update
}

  export interface PickupRequest {
    studentId: string;
    parentId: string;
    location: Location;
    status: "PENDING_PICKUP";
  }

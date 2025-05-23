export interface Location {
    latitude: number;
    longitude: number;
  }

  export interface SchoolLocation {
    latitude: number;
    longitude: number;
    radius: number; // in meters
  }

  export interface PickupRequest {
    studentId: string;
    parentId: string;
    location: Location;
    status: "PENDING_PICKUP";
  }

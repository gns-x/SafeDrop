import { SchoolLocation } from "../types/location";
import { API_URL } from "../config/constants";

export interface LocationUpdateResponse {
  success: boolean;
  message: string;
  location: SchoolLocation;
  updatedBy: string;
  updatedAt: string;
}

export interface LocationHistoryEntry {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
  updatedBy: string;
  updatedAt: string;
  reason?: string;
}

class LocationManagementService {
  private baseUrl = `${API_URL}/location`;

  async updateSchoolLocation(
    newLocation: SchoolLocation,
    userId: string,
    reason?: string,
  ): Promise<LocationUpdateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/school`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...newLocation,
          updatedBy: userId,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating school location:", error);
      throw new Error("Failed to update school location");
    }
  }

  async getSchoolLocation(): Promise<SchoolLocation> {
    try {
      const response = await fetch(`${this.baseUrl}/school`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.location;
    } catch (error) {
      console.error("Error fetching school location:", error);
      throw new Error("Failed to fetch school location");
    }
  }

  async getLocationHistory(): Promise<LocationHistoryEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/school/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.history;
    } catch (error) {
      console.error("Error fetching location history:", error);
      throw new Error("Failed to fetch location history");
    }
  }

  async validateLocation(
    location: SchoolLocation,
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (location.latitude < -90 || location.latitude > 90) {
      errors.push("Latitude must be between -90 and 90 degrees");
    }

    if (location.longitude < -180 || location.longitude > 180) {
      errors.push("Longitude must be between -180 and 180 degrees");
    }

    if (location.radius < 100 || location.radius > 5000) {
      errors.push("Radius must be between 100 and 5000 meters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async mockUpdateSchoolLocation(
    newLocation: SchoolLocation,
    userId: string,
  ): Promise<LocationUpdateResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "School location updated successfully",
      location: newLocation,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
    };
  }
}

export const locationManagementService = new LocationManagementService();

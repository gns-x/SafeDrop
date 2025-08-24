import { apiService } from "./api.service";
import { Location, PickupRequest } from "../types/location";

export async function sendPickupRequest(request: PickupRequest): Promise<void> {
  try {
    await apiService.post("/pickup/request", request);
  } catch {
    throw new Error("Failed to send pickup request");
  }
}

export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          reject(new Error("Out Of Range."));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(
                  new Error(
                    "User denied the request for Geolocation. Please enable location permissions in your browser settings and try again.",
                  ),
                );
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error("Location information is unavailable."));
                break;
              case error.TIMEOUT:
                reject(
                  new Error("The request to get user location timed out."),
                );
                break;
              default:
                reject(new Error("An unknown error occurred."));
                break;
            }
          },
          {
            timeout: 60000,
          },
        );
      });
  });
}

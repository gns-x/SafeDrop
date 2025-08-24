import { SchoolLocation } from "../types/location";

export const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error("VITE_API_URL environment variable is not set");
  console.error("Available env vars:", import.meta.env);
  throw new Error("VITE_API_URL environment variable is not set");
}

console.log("API_URL loaded:", API_URL);

export const SCHOOL_LOCATION: SchoolLocation = {
  latitude: 33.50148021702571,
  longitude: -7.6367796029366675,
  radius: 500, // 500 meters radius
};

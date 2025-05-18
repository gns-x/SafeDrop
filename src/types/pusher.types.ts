import type { StatusUpdateMessage } from "./student";

export interface PusherConnectionEvents {
  connected: () => void;
  disconnected: () => void;
  error: (error: Error) => void;
}

export interface PickupRequestData {
  studentId: string;
  parentId: string;
  location: string;
}

export type StatusUpdateCallback = (data: StatusUpdateMessage) => void;

import Pusher from "pusher-js";
import { StatusUpdateMessage } from "../types/student";

class PusherService {
  private pusher: Pusher;
  private channel: any;
  private statusUpdateCallbacks: ((data: StatusUpdateMessage) => void)[] = [];

  constructor() {
    this.pusher = new Pusher(
      import.meta.env.VITE_PUSHER_KEY || "bc0503efea536bb60290",
      {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER || "eu",
        forceTLS: true,
      }
    );

    this.channel = this.pusher.subscribe("student-status");

    this.channel.bind("status-update", (data: StatusUpdateMessage) => {
      // Ensure grade is included in the status update
      if (!data.grade && this.statusUpdateCallbacks.length > 0) {
        console.warn("Grade missing in status update:", data);
      }
      this.statusUpdateCallbacks.forEach((callback) => callback(data));
    });
  }

  onStatusUpdate(callback: (data: StatusUpdateMessage) => void) {
    this.statusUpdateCallbacks.push(callback);
    return () => {
      this.statusUpdateCallbacks = this.statusUpdateCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  disconnect() {
    if (this.channel) {
      this.channel.unbind_all();
      this.pusher.unsubscribe("student-status");
    }
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }
}

export const pusherService = new PusherService();

import { io, Socket } from "socket.io-client";

export interface WebSocketMessage {
  id: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface PickupUpdate {
  pickupId: string;
  status: string;
  studentName: string;
  parentName: string;
  timestamp: string;
}

export interface StudentStatusUpdate {
  studentId: string;
  status: string;
  timestamp: string;
}

export interface TeacherBroadcast {
  type: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface ParentBroadcast {
  type: string;
  message: string;
  data?: Record<string, unknown>;
}

type EventHandler = (...args: unknown[]) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private eventListeners: Map<string, Set<EventHandler>> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Handle connection events
    window.addEventListener("beforeunload", () => {
      this.disconnect();
    });

    window.addEventListener("online", () => {
      this.reconnect();
    });
  }

  connect(userId: string, token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error("Connection already in progress"));
        return;
      }

      this.isConnecting = true;

      try {
        const wsUrl = import.meta.env.VITE_WS_URL;
        if (!wsUrl) {
          throw new Error("VITE_WS_URL environment variable is not set");
        }
        const url = wsUrl
          .replace("ws://", "http://")
          .replace("wss://", "https://");

        this.socket = io(url, {
          auth: {
            token,
          },
          transports: ["websocket", "polling"],
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
        });

        this.socket.on("connect", () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          this.isConnecting = false;

          // Join user room with payload shape expected by server
          this.socket?.emit("join", { userId });

          resolve();
        });

        this.socket.on("disconnect", (reason) => {
          console.log("WebSocket disconnected:", reason);
          this.isConnecting = false;

          if (reason === "io server disconnect") {
            // Server disconnected us, try to reconnect
            this.reconnect();
          }
        });

        this.socket.on("connect_error", (error) => {
          console.error("WebSocket connection error:", error);
          this.isConnecting = false;
          reject(error);
        });

        this.socket.on("reconnect", (attemptNumber) => {
          console.log("WebSocket reconnected after", attemptNumber, "attempts");
          this.reconnectAttempts = 0;

          // Rejoin user room after reconnection
          if (this.socket?.connected) {
            this.socket.emit("join", { userId });
          }
        });

        this.socket.on("reconnect_failed", () => {
          console.error("WebSocket reconnection failed");
          this.isConnecting = false;
          reject(new Error("Reconnection failed"));
        });

        // Set up message handlers
        this.setupMessageHandlers();
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private setupMessageHandlers() {
    if (!this.socket) return;

    // Handle notifications
    this.socket.on("notification", (message: WebSocketMessage) => {
      this.emit("notification", message);
    });

    // Handle pickup updates
    this.socket.on("pickup_update", (update: PickupUpdate) => {
      this.emit("pickup_update", update);
    });

    // Handle student status updates
    this.socket.on("student_status_update", (update: StudentStatusUpdate) => {
      this.emit("student_status_update", update);
    });

    // Handle teacher broadcasts
    this.socket.on("teacher_broadcast", (broadcast: TeacherBroadcast) => {
      this.emit("teacher_broadcast", broadcast);
    });

    // Handle parent broadcasts
    this.socket.on("parent_broadcast", (broadcast: ParentBroadcast) => {
      this.emit("parent_broadcast", broadcast);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.eventListeners.clear();
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    );

    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  // Event listener management
  on(event: string, callback: EventHandler): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
  }

  off(event: string, callback: EventHandler): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in event listener:", error);
        }
      });
    }
  }

  // Send messages to server
  sendPickupRequest(pickupData: PickupUpdate): void {
    if (this.socket?.connected) {
      this.socket.emit("pickup_request", pickupData);
    }
  }

  sendStatusUpdate(statusData: StudentStatusUpdate): void {
    if (this.socket?.connected) {
      this.socket.emit("status_update", statusData);
    }
  }

  joinRoom(room: string): void {
    if (this.socket?.connected) {
      this.socket.emit("join_room", room);
    }
  }

  leaveRoom(room: string): void {
    if (this.socket?.connected) {
      this.socket.emit("leave_room", room);
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionState(): string {
    if (!this.socket) return "disconnected";
    return this.socket.connected ? "connected" : "disconnected";
  }

  // Specific method for status updates to maintain compatibility with existing code
  onStatusUpdate(callback: (data: StudentStatusUpdate) => void): () => void {
    this.on("student_status_update", callback as unknown as EventHandler);

    // Return unsubscribe function
    return () => {
      this.off("student_status_update", callback as unknown as EventHandler);
    };
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
export default websocketService;

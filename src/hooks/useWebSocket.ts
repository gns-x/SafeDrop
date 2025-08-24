import { useEffect, useRef, useCallback, useState } from 'react';
import { websocketService, WebSocketMessage, PickupUpdate, StudentStatusUpdate } from '../services/websocket.service';
import { useAuth } from './useAuth';

export const useWebSocket = () => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(async () => {
    if (!user?.id || !token) return;

    try {
      await websocketService.connect(user.id, token);
      setIsConnected(true);
      setConnectionState('connected');
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setIsConnected(false);
      setConnectionState('error');
      
      // Retry connection after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    }
  }, [user?.id, token]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionState('disconnected');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const sendPickupRequest = useCallback((pickupData: any) => {
    if (isConnected) {
      websocketService.sendPickupRequest(pickupData);
    }
  }, [isConnected]);

  const sendStatusUpdate = useCallback((statusData: any) => {
    if (isConnected) {
      websocketService.sendStatusUpdate(statusData);
    }
  }, [isConnected]);

  const joinRoom = useCallback((room: string) => {
    if (isConnected) {
      websocketService.joinRoom(room);
    }
  }, [isConnected]);

  const leaveRoom = useCallback((room: string) => {
    if (isConnected) {
      websocketService.leaveRoom(room);
    }
  }, [isConnected]);

  // Listen for WebSocket events
  useEffect(() => {
    if (!isConnected) return;

    const handleNotification = (message: WebSocketMessage) => {
      console.log('Received notification:', message);
      // You can dispatch to a notification store or show toast here
    };

    const handlePickupUpdate = (update: PickupUpdate) => {
      console.log('Received pickup update:', update);
      // Handle pickup updates
    };

    const handleStudentStatusUpdate = (update: StudentStatusUpdate) => {
      console.log('Received student status update:', update);
      // Handle student status updates
    };

    const handleTeacherBroadcast = (broadcast: any) => {
      console.log('Received teacher broadcast:', broadcast);
      // Handle teacher broadcasts
    };

    const handleParentBroadcast = (broadcast: any) => {
      console.log('Received parent broadcast:', broadcast);
      // Handle parent broadcasts
    };

    const handleEmergencyBroadcast = (broadcast: any) => {
      console.log('Received emergency broadcast:', broadcast);
      // Handle emergency broadcasts
    };

    const handleConnected = (data: any) => {
      console.log('WebSocket connected:', data);
      setIsConnected(true);
      setConnectionState('connected');
    };

    const handleDisconnected = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setConnectionState('disconnected');
    };

    const handleError = (error: any) => {
      console.error('WebSocket error:', error);
      setConnectionState('error');
    };

    // Subscribe to events
    websocketService.on('notification', handleNotification);
    websocketService.on('pickup_update', handlePickupUpdate);
    websocketService.on('student_status_update', handleStudentStatusUpdate);
    websocketService.on('teacher_broadcast', handleTeacherBroadcast);
    websocketService.on('parent_broadcast', handleParentBroadcast);
    websocketService.on('emergency_broadcast', handleEmergencyBroadcast);
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);

    // Cleanup
    return () => {
      websocketService.off('notification', handleNotification);
      websocketService.off('pickup_update', handlePickupUpdate);
      websocketService.off('student_status_update', handleStudentStatusUpdate);
      websocketService.off('teacher_broadcast', handleTeacherBroadcast);
      websocketService.off('parent_broadcast', handleParentBroadcast);
      websocketService.off('emergency_broadcast', handleEmergencyBroadcast);
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
    };
  }, [isConnected]);

  // Connect when user logs in
  useEffect(() => {
    if (user?.id && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user?.id, token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
    sendPickupRequest,
    sendStatusUpdate,
    joinRoom,
    leaveRoom,
  };
};

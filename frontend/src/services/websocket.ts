import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  type Message,
  type TypingIndicator,
  type PresenceUpdate,
} from "../types";

export type MessageHandler = (message: Message) => void;
export type TypingHandler = (typing: TypingIndicator) => void;
export type PresenceHandler = (presence: PresenceUpdate) => void;
export type ConnectionHandler = (connected: boolean) => void;

class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private currentUserId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event handlers
  private messageHandlers: MessageHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private presenceHandlers: PresenceHandler[] = [];
  private connectionHandlers: ConnectionHandler[] = [];

  constructor() {
    this.setupClient();
  }
  private setupClient() {
    const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("STOMP Debug:", str);
        }
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log("WebSocket connected:", frame);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);
      this.subscribeToChannels();
    };

    this.client.onDisconnect = (frame) => {
      console.log("WebSocket disconnected:", frame);
      this.isConnected = false;
      this.notifyConnectionHandlers(false);
    };

    this.client.onStompError = (frame) => {
      console.error("WebSocket error:", frame);
      this.handleReconnect();
    };

    this.client.onWebSocketError = (error) => {
      console.error("WebSocket connection error:", error);
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
      );

      setTimeout(() => {
        if (!this.isConnected) {
          this.connect(this.currentUserId!);
        }
      }, delay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  private subscribeToChannels() {
    if (!this.client || !this.currentUserId) return;

    // Subscribe to personal message channel
    this.client.subscribe(
      `/topic/messages/${this.currentUserId}`,
      (message: IMessage) => {
        try {
          const messageData: Message = JSON.parse(message.body);
          this.notifyMessageHandlers(messageData);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      }
    ); // Subscribe to presence updates
    this.client.subscribe(
      `/topic/presence/${this.currentUserId}`,
      (message: IMessage) => {
        try {
          const presenceData: PresenceUpdate = JSON.parse(message.body);
          this.notifyPresenceHandlers(presenceData);
        } catch (error) {
          console.error("Error parsing presence update:", error);
        }
      }
    );

    // Subscribe to typing indicators
    this.client.subscribe(
      `/topic/typing/${this.currentUserId}`,
      (message: IMessage) => {
        try {
          const typingData: TypingIndicator = JSON.parse(message.body);
          this.notifyTypingHandlers(typingData);
        } catch (error) {
          console.error("Error parsing typing indicator:", error);
        }
      }
    );

    // Subscribe to notifications
    this.client.subscribe(
      `/topic/notifications/${this.currentUserId}`,
      (message: IMessage) => {
        try {
          const notificationData = JSON.parse(message.body);
          // Handle notifications here if needed
          console.log("Notification received:", notificationData);
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      }
    );

    // Subscribe to errors
    this.client.subscribe(
      `/topic/errors/${this.currentUserId}`,
      (message: IMessage) => {
        try {
          const errorData = JSON.parse(message.body);
          console.error("Server error:", errorData);
        } catch (error) {
          console.error("Error parsing error message:", error);
        }
      }
    );
  }

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      this.currentUserId = userId;

      if (!this.client) {
        this.setupClient();
      }

      // Update auth header with current token
      const token = localStorage.getItem("auth_token");
      if (token) {
        this.client!.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };
      }

      const originalOnConnect = this.client!.onConnect;
      this.client!.onConnect = (frame) => {
        originalOnConnect!(frame);
        resolve();
      };

      const originalOnStompError = this.client!.onStompError;
      this.client!.onStompError = (frame) => {
        originalOnStompError!(frame);
        reject(new Error(`Connection failed: ${frame.body}`));
      };

      this.client!.activate();
    });
  }

  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
      this.currentUserId = null;
      this.notifyConnectionHandlers(false);
    }
  }

  // Send message
  sendMessage(
    recipientId: string,
    content: string,
    contentType: "text" | "image" | "file" = "text"
  ) {
    if (!this.client || !this.isConnected) {
      throw new Error("WebSocket not connected");
    }

    const messageData = {
      recipientId,
      content,
      contentType,
      timestamp: new Date().toISOString(),
    };

    this.client.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(messageData),
    });
  }

  // Send group message
  sendGroupMessage(
    groupId: string,
    content: string,
    contentType: "text" | "image" | "file" = "text"
  ) {
    if (!this.client || !this.isConnected) {
      throw new Error("WebSocket not connected");
    }

    const messageData = {
      groupId,
      content,
      contentType,
      timestamp: new Date().toISOString(),
    };

    this.client.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(messageData),
    });
  }

  // Send typing indicator
  sendTypingIndicator(recipientId: string, isTyping: boolean) {
    if (!this.client || !this.isConnected) return;

    const typingData = {
      recipientId_or_groupId: recipientId,
      isTyping,
    };

    this.client.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify(typingData),
    });
  }

  // Subscribe to group messages
  subscribeToGroup(groupId: string) {
    if (!this.client || !this.isConnected) return;

    this.client.subscribe(
      `/topic/messages/group/${groupId}`,
      (message: IMessage) => {
        try {
          const messageData: Message = JSON.parse(message.body);
          this.notifyMessageHandlers(messageData);
        } catch (error) {
          console.error("Error parsing group message:", error);
        }
      }
    );
  }

  // Event handler management
  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  onTyping(handler: TypingHandler) {
    this.typingHandlers.push(handler);
    return () => {
      const index = this.typingHandlers.indexOf(handler);
      if (index > -1) {
        this.typingHandlers.splice(index, 1);
      }
    };
  }

  onPresence(handler: PresenceHandler) {
    this.presenceHandlers.push(handler);
    return () => {
      const index = this.presenceHandlers.indexOf(handler);
      if (index > -1) {
        this.presenceHandlers.splice(index, 1);
      }
    };
  }

  onConnection(handler: ConnectionHandler) {
    this.connectionHandlers.push(handler);
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) {
        this.connectionHandlers.splice(index, 1);
      }
    };
  }
  // Notification methods
  private notifyMessageHandlers(message: Message) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private notifyTypingHandlers(typing: TypingIndicator) {
    this.typingHandlers.forEach((handler) => handler(typing));
  }

  private notifyPresenceHandlers(presence: PresenceUpdate) {
    this.presenceHandlers.forEach((handler) => handler(presence));
  }

  private notifyConnectionHandlers(connected: boolean) {
    this.connectionHandlers.forEach((handler) => handler(connected));
  }

  // Getters
  get connected() {
    return this.isConnected;
  }

  get userId() {
    return this.currentUserId;
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;

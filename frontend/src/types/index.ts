// User types
export interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  status?: "online" | "offline" | "away";
  isOnline?: boolean;
}

// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  user: User;
}

// Message types
export interface Message {
  messageId: string;
  senderId: string;
  senderUsername?: string;
  recipientId?: string;
  groupId?: string;
  content: string;
  contentType: "text" | "image" | "file";
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read";
}

// Chat types
export type ConversationType = "direct" | "group";

export interface Conversation {
  conversationId: string;
  type: ConversationType;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  name?: string; // For group chats
  avatarUrl?: string;
  isGroupChat?: boolean;
}

export interface ChatRoom {
  roomId: string;
  name: string;
  type: "direct" | "group";
  participants: string[];
  lastActivity: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: "message" | "typing" | "presence" | "notification";
  payload: any;
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}

export interface PresenceUpdate {
  userId: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

// Contact types
export interface Contact {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: "message" | "friend_request" | "system";
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Store types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  contacts: Contact[];
  onlineUsers: Set<string>;
  typingUsers: Record<string, TypingIndicator>;
  isConnected: boolean;
  isLoading: boolean;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message["status"]) => void;
  setTyping: (typing: TypingIndicator) => void;
  setUserOnline: (userId: string, isOnline: boolean) => void;
  loadConversations: () => Promise<void>;
  loadContacts: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  getConversationMessages: (conversationId: string) => Message[];
  markMessagesAsRead: (conversationId: string) => void;
  sendMessage: (content: string, conversationId: string) => Promise<void>;
  addContact: (contact: Contact) => void;
  createConversation: (
    request: CreateConversationRequest
  ) => Promise<Conversation>;
}

export interface CreateConversationRequest {
  participants: string[];
  type: ConversationType;
  name?: string;
}

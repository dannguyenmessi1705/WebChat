// Environment configuration
export const config = {
  // API Configuration
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",

  // WebSocket Configuration
  WEBSOCKET_URL:
    import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:8080/ws",

  // File Upload Configuration
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],

  // Chat Configuration
  MESSAGE_BATCH_SIZE: 50,
  TYPING_INDICATOR_TIMEOUT: 3000, // 3 seconds
  PRESENCE_UPDATE_INTERVAL: 30000, // 30 seconds

  // UI Configuration
  DEFAULT_AVATAR: "/default-avatar.png",
  EMOJI_PICKER_CATEGORIES: [
    "Frequently used",
    "Smileys & Emotion",
    "People & Body",
    "Animals & Nature",
    "Food & Drink",
    "Activities",
    "Travel & Places",
    "Objects",
    "Symbols",
    "Flags",
  ],

  // Notification Configuration
  NOTIFICATION_TIMEOUT: 5000, // 5 seconds
  ENABLE_SOUND_NOTIFICATIONS: true,
  ENABLE_DESKTOP_NOTIFICATIONS: true,

  // Development Configuration
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,

  // Authentication
  TOKEN_STORAGE_KEY: "webchat_token",
  USER_STORAGE_KEY: "webchat_user",
  REMEMBER_ME_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Helper functions
export const getApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};

export const getWebSocketUrl = (): string => {
  return config.WEBSOCKET_URL;
};

export const isFileTypeAllowed = (fileType: string): boolean => {
  return config.ALLOWED_FILE_TYPES.includes(fileType);
};

export const isFileSizeAllowed = (fileSize: number): boolean => {
  return fileSize <= config.MAX_FILE_SIZE;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

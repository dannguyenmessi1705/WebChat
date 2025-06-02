import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  type ChatState,
  type Conversation,
  type Message,
  type Contact,
} from "../types";
import apiService from "../services/api";
import webSocketService from "../services/websocket";
import { v4 as uuidv4 } from "uuid";

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    conversations: [],
    activeConversation: null,
    messages: {},
    contacts: [],
    onlineUsers: new Set(),
    typingUsers: {},
    isConnected: false,
    isLoading: false,

    setActiveConversation: (conversation) => {
      set({ activeConversation: conversation });

      // Load messages for the active conversation if not already loaded
      if (conversation && !get().messages[conversation.conversationId]) {
        get().loadMessages(conversation.conversationId);
      }
    },

    addMessage: (message) => {
      const { messages, conversations } = get();
      const conversationId =
        message.groupId ||
        (message.senderId === get().activeConversation?.conversationId
          ? message.recipientId
          : message.senderId) ||
        message.recipientId ||
        "";

      // Add message to messages
      const conversationMessages = messages[conversationId] || [];
      const updatedMessages = {
        ...messages,
        [conversationId]: [...conversationMessages, message],
      };

      // Update conversation's last message and unread count
      const updatedConversations = conversations.map((conv) => {
        if (conv.conversationId === conversationId) {
          return {
            ...conv,
            lastMessage: message,
            unreadCount:
              conv.conversationId !== get().activeConversation?.conversationId
                ? conv.unreadCount + 1
                : conv.unreadCount,
          };
        }
        return conv;
      });

      set({
        messages: updatedMessages,
        conversations: updatedConversations,
      });
    },

    updateMessageStatus: (messageId, status) => {
      const { messages } = get();
      const updatedMessages = { ...messages };

      Object.keys(updatedMessages).forEach((conversationId) => {
        updatedMessages[conversationId] = updatedMessages[conversationId].map(
          (msg) => (msg.messageId === messageId ? { ...msg, status } : msg)
        );
      });

      set({ messages: updatedMessages });
    },

    setTyping: (typing) => {
      const { typingUsers } = get();
      const key = `${typing.userId}-${typing.conversationId}`;

      if (typing.isTyping) {
        set({
          typingUsers: {
            ...typingUsers,
            [key]: typing,
          },
        });

        // Auto-remove typing indicator after 3 seconds
        setTimeout(() => {
          const currentTypingUsers = get().typingUsers;
          const { [key]: removed, ...rest } = currentTypingUsers;
          set({ typingUsers: rest });
        }, 3000);
      } else {
        const { [key]: removed, ...rest } = typingUsers;
        set({ typingUsers: rest });
      }
    },

    setUserOnline: (userId, isOnline) => {
      const { onlineUsers } = get();
      const newOnlineUsers = new Set(onlineUsers);

      if (isOnline) {
        newOnlineUsers.add(userId);
      } else {
        newOnlineUsers.delete(userId);
      }

      set({ onlineUsers: newOnlineUsers });
    },

    getConversationMessages: (conversationId) => {
      const { messages } = get();
      return messages[conversationId] || [];
    },

    markMessagesAsRead: (conversationId) => {
      const { conversations, messages } = get();

      // Update conversation unread count
      const updatedConversations = conversations.map((conv) =>
        conv.conversationId === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      );

      // Update message statuses to read
      const conversationMessages = messages[conversationId] || [];
      const updatedMessages = {
        ...messages,
        [conversationId]: conversationMessages.map((msg) =>
          msg.status === "delivered" ? { ...msg, status: "read" as const } : msg
        ),
      };

      set({
        conversations: updatedConversations,
        messages: updatedMessages,
      });
    },
    loadConversations: async () => {
      try {
        const users = await apiService.getContacts();

        // Convert Users to Contacts
        const contacts: Contact[] = users.map((user) => ({
          ...user,
          fullName: user.fullName || user.username,
          status: user.status || "offline",
        }));

        // For now, create conversations from contacts
        // In a real app, you'd have a separate conversations endpoint
        const conversations: Conversation[] = contacts.map((contact) => ({
          conversationId: contact.userId,
          type: "direct" as const,
          participants: [contact],
          unreadCount: 0,
          name: contact.username,
          avatarUrl: contact.avatarUrl,
        }));

        set({
          conversations,
          contacts,
        });
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    },

    loadMessages: async (conversationId) => {
      try {
        const response =
          await apiService.getConversationMessages(conversationId);
        const { messages } = get();

        set({
          messages: {
            ...messages,
            [conversationId]: response.data || [],
          },
        });
      } catch (error) {
        console.error("Failed to load messages:", error);
        // If endpoint doesn't exist yet, initialize empty array
        const { messages } = get();
        set({
          messages: {
            ...messages,
            [conversationId]: [],
          },
        });
      }
    },

    sendMessage: async (content, conversationId) => {
      const { activeConversation } = get();
      if (!activeConversation) return;

      // Create optimistic message
      const tempMessage: Message = {
        messageId: uuidv4(),
        senderId: "current-user", // This should be from auth store
        recipientId: conversationId,
        content,
        contentType: "text",
        timestamp: new Date().toISOString(),
        status: "sending",
      };

      // Add optimistic message to store
      get().addMessage(tempMessage);

      try {
        // Send via WebSocket
        if (activeConversation.type === "direct") {
          webSocketService.sendMessage(conversationId, content);
        } else {
          webSocketService.sendGroupMessage(conversationId, content);
        }

        // Update message status to sent
        get().updateMessageStatus(tempMessage.messageId, "sent");
      } catch (error) {
        console.error("Failed to send message:", error); // Could update message status to 'failed' and show retry option
        get().updateMessageStatus(tempMessage.messageId, "sent"); // For now, just mark as sent
      }
    },
    loadContacts: async () => {
      try {
        const users = await apiService.getContacts();
        const contacts: Contact[] = users.map((user) => ({
          ...user,
          fullName: user.fullName || user.username,
          status: user.status || "offline",
        }));
        set({ contacts });
      } catch (error) {
        console.error("Failed to load contacts:", error);
      }
    },

    addContact: (contact) => {
      const { contacts } = get();
      if (!contacts.find((c) => c.userId === contact.userId)) {
        set({ contacts: [...contacts, contact] });
      }
    },

    createConversation: async (request) => {
      try {
        // This would call the API to create a conversation
        // For now, create a local conversation
        const conversation: Conversation = {
          conversationId: uuidv4(),
          type: request.type,
          participants: [], // Would be populated from API
          unreadCount: 0,
          name: request.name,
        };

        const { conversations } = get();
        set({ conversations: [...conversations, conversation] });

        return conversation;
      } catch (error) {
        console.error("Failed to create conversation:", error);
        throw error;
      }
    },
  }))
);

// Subscribe to WebSocket events
webSocketService.onMessage((message) => {
  useChatStore.getState().addMessage(message);
});

webSocketService.onTyping((typing) => {
  useChatStore.getState().setTyping(typing);
});

webSocketService.onPresence((presence) => {
  useChatStore
    .getState()
    .setUserOnline(presence.userId, presence.status === "online");
});

webSocketService.onConnection((connected) => {
  useChatStore.setState({ isConnected: connected });
});

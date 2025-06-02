import React, { useEffect, useState } from "react";
import {
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { webSocketService } from "../../services/websocket";

interface ChatWindowProps {
  conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const { user } = useAuthStore();
  const {
    conversations,
    messages,
    isLoading,
    getConversationMessages,
    sendMessage,
    markMessagesAsRead,
  } = useChatStore();

  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const conversation = conversations.find(
    (c) => c.conversationId === conversationId
  );
  const conversationMessages = messages[conversationId] || [];

  useEffect(() => {
    if (conversationId && user) {
      getConversationMessages(conversationId);
      markMessagesAsRead(conversationId);
    }
  }, [conversationId, user, getConversationMessages, markMessagesAsRead]);
  useEffect(() => {
    if (!conversationId || !user) return;

    // Subscribe to typing indicators
    const unsubscribeTyping = webSocketService.onTyping((typing) => {
      if (
        typing.conversationId === conversationId &&
        typing.userId !== user.userId
      ) {
        if (typing.isTyping) {
          setTypingUsers((prev) => [
            ...prev.filter((u) => u !== typing.userId),
            typing.userId,
          ]);
        } else {
          setTypingUsers((prev) => prev.filter((u) => u !== typing.userId));
        }
      }
    });

    return () => {
      unsubscribeTyping();
    };
  }, [conversationId, user?.userId]);
  const handleSendMessage = async (content: string) => {
    if (!user || !conversationId.trim()) return;

    try {
      await sendMessage(content.trim(), conversationId);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  const handleTypingStart = () => {
    if (!isTyping && user && conversationId) {
      setIsTyping(true);
      webSocketService.sendTypingIndicator(conversationId, true);
    }
  };

  const handleTypingStop = () => {
    if (isTyping && user && conversationId) {
      setIsTyping(false);
      webSocketService.sendTypingIndicator(conversationId, false);
    }
  };

  const getConversationTitle = () => {
    if (!conversation) return "Chọn cuộc trò chuyện";

    if (conversation.isGroupChat) {
      return conversation.name || "Nhóm chat";
    } else {
      // For direct messages, show the other participant's name
      const otherParticipant = conversation.participants?.find(
        (p) => p.userId !== user?.userId
      );
      return otherParticipant?.username || "Cuộc trò chuyện";
    }
  };

  const getConversationSubtitle = () => {
    if (!conversation) return "";

    if (conversation.isGroupChat) {
      return `${conversation.participants?.length || 0} thành viên`;
    } else {
      const otherParticipant = conversation.participants?.find(
        (p) => p.userId !== user?.userId
      );
      return otherParticipant?.isOnline ? "Đang hoạt động" : "Không hoạt động";
    }
  };
  if (!conversationId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 sm:h-20 sm:w-20">
            <span className="text-2xl sm:text-3xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 sm:text-xl">
            Chào mừng đến với WebChat
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu nhắn tin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      {/* Chat Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-3 py-3 shadow-sm sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm">
                {conversation?.isGroupChat
                  ? "👥"
                  : getConversationTitle().charAt(0).toUpperCase()}
              </div>
              {!conversation?.isGroupChat && (
                <div
                  className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white sm:-right-1 sm:-bottom-1 sm:h-3 sm:w-3 ${
                    conversation?.participants?.find(
                      (p) => p.userId !== user?.userId
                    )?.isOnline
                      ? "bg-green-400"
                      : "bg-gray-400"
                  }`}
                />
              )}
            </div>

            {/* Conversation Info */}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {getConversationTitle()}
              </h2>
              <p className="truncate text-xs text-gray-500">
                {typingUsers.length > 0
                  ? `${typingUsers.join(", ")} đang nhập...`
                  : getConversationSubtitle()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-shrink-0 items-center space-x-1 sm:space-x-2">
            <button className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:p-2">
              <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:p-2">
              <VideoCameraIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:p-2">
              <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1">
        <MessageList messages={conversationMessages} isLoading={isLoading} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        disabled={!conversation}
      />
    </div>
  );
};

export default ChatWindow;

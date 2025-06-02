import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { type Conversation } from "../../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import CreateGroupChat from "./CreateGroupChat";

interface ChatSidebarProps {
  onNewChat: () => void;
  onConversationSelect?: () => void;
  isMobile?: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onNewChat,
  onConversationSelect,
  isMobile = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const { user, logout } = useAuthStore();
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    loadConversations,
    onlineUsers,
    isConnected,
  } = useChatStore();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participants.some((p) =>
        p.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );
  const handleConversationClick = (conversation: Conversation) => {
    setActiveConversation(conversation);
    onConversationSelect?.();
  };

  const getLastMessageTime = (conversation: Conversation) => {
    if (!conversation.lastMessage) return "";
    try {
      return formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "";
    }
  };

  const getLastMessageText = (conversation: Conversation) => {
    if (!conversation.lastMessage) return "Chưa có tin nhắn";
    const { content, contentType, senderId } = conversation.lastMessage;

    if (contentType === "image") return "📷 Hình ảnh";
    if (contentType === "file") return "📎 Tệp đính kèm";

    const senderName =
      senderId === user?.userId
        ? "Bạn"
        : conversation.participants.find((p) => p.userId === senderId)
            ?.username || "Ai đó";

    return `${senderName}: ${content}`;
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <div className="relative flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white sm:h-10 sm:w-10 sm:text-base">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div
                className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white sm:-right-1 sm:-bottom-1 sm:h-4 sm:w-4 ${
                  isConnected ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {user?.username}
              </h2>
              <p className="text-xs text-gray-500">
                {isConnected ? "Đang hoạt động" : "Đang kết nối..."}
              </p>
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:p-2"
              aria-label="Tùy chọn"
            >
              <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>{" "}
            {showMenu && (
              <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg sm:w-48">
                <button
                  onClick={() => {
                    setShowCreateGroup(true);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 sm:px-4"
                >
                  <UserGroupIcon className="h-4 w-4" />
                  <span>Tạo nhóm</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 sm:px-4">
                  Cài đặt
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 sm:px-4">
                  Chế độ tối
                </button>
                <hr className="my-1" />
                <button
                  onClick={logout}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 sm:px-4"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
          <input
            type="text"
            placeholder={
              isMobile ? "Tìm kiếm..." : "Tìm kiếm cuộc trò chuyện..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:py-2 sm:pl-10"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="border-b border-gray-200 p-3 sm:p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm text-white transition-colors hover:bg-indigo-700 sm:py-2 sm:text-base"
        >
          <UserPlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>{isMobile ? "Chat mới" : "Cuộc trò chuyện mới"}</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <ChatBubbleLeftRightIcon className="mx-auto mb-2 h-10 w-10 text-gray-300 sm:h-12 sm:w-12" />
            <p className="text-sm sm:text-base">Chưa có cuộc trò chuyện nào</p>{" "}
            <p className="text-sm sm:text-base">Bắt đầu cuộc trò chuyện mới!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.conversationId}
                onClick={() => handleConversationClick(conversation)}
                className={`w-full p-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 sm:p-4 ${
                  activeConversation?.conversationId ===
                  conversation.conversationId
                    ? "border-r-2 border-indigo-600 bg-indigo-50"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    {conversation.type === "group" ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 sm:h-12 sm:w-12">
                        <UserGroupIcon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                      </div>
                    ) : (
                      <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-semibold text-white sm:h-12 sm:w-12 sm:text-base">
                          {conversation.name?.charAt(0).toUpperCase()}
                        </div>
                        {conversation.participants.length > 0 &&
                          isUserOnline(conversation.participants[0].userId) && (
                            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 sm:-right-1 sm:-bottom-1 sm:h-4 sm:w-4" />
                          )}
                      </>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-sm font-medium text-gray-900 sm:text-base">
                        {conversation.name || "Cuộc trò chuyện"}
                      </h3>
                      <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
                        {getLastMessageTime(conversation)}
                      </span>{" "}
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <p className="truncate pr-2 text-xs text-gray-600 sm:text-sm">
                        {getLastMessageText(conversation)}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="min-w-5 flex-shrink-0 rounded-full bg-indigo-600 px-1.5 py-0.5 text-center text-xs text-white sm:min-w-6 sm:px-2 sm:py-1">
                          {conversation.unreadCount > 99
                            ? "99+"
                            : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Chat Modal */}
      <CreateGroupChat
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </div>
  );
};

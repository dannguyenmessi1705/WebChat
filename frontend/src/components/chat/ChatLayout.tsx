import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatSidebar } from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { webSocketService } from "../../services/websocket";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ChatLayout: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuthStore();
  const {
    conversations,
    loadConversations,
    loadContacts,
    setActiveConversation,
    activeConversation,
  } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, always show sidebar
      if (!mobile) {
        setShowSidebar(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Load initial data
        await Promise.all([loadConversations(), loadContacts()]); // Connect to WebSocket
        await webSocketService.connect(user.userId);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setIsLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, [user, loadConversations, loadContacts]);
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(
        (c) => c.conversationId === conversationId
      );
      if (conversation) {
        setActiveConversation(conversation);
        // On mobile, hide sidebar when conversation is selected
        if (isMobile) {
          setShowSidebar(false);
        }
      }
    }
  }, [conversationId, conversations, setActiveConversation, isMobile]);

  const handleBackToSidebar = () => {
    setShowSidebar(true);
    setActiveConversation(null);
  };

  const handleConversationSelect = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-sm text-gray-600 sm:text-base">Đang tải...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 flex bg-white">
      {/* Mobile Sidebar Overlay */}
      {isMobile && showSidebar && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={` ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"} ${isMobile && !showSidebar ? "-translate-x-full" : "translate-x-0"} flex h-full w-full max-w-sm flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out md:w-80 md:max-w-none md:translate-x-0`}
      >
        <ChatSidebar
          onNewChat={() => {}}
          onConversationSelect={handleConversationSelect}
          isMobile={isMobile}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {activeConversation ? (
          <div className="flex h-full flex-col">
            {/* Mobile Header with Back Button */}
            {isMobile && (
              <div className="flex items-center border-b border-gray-200 bg-white p-3 md:hidden">
                <button
                  onClick={handleBackToSidebar}
                  className="mr-3 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Quay lại danh sách chat"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold text-gray-900">
                    {activeConversation.name ||
                      activeConversation.participants
                        .filter((p) => p.userId !== user?.userId)
                        .map((p) => p.username)
                        .join(", ")}
                  </h2>
                </div>
              </div>
            )}

            <div className="min-h-0 flex-1">
              <ChatWindow conversationId={activeConversation.conversationId} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
            <div className="mx-auto max-w-md text-center">
              {/* Mobile: Show button to open sidebar if no conversation */}
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="mb-6 rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700 md:hidden"
                >
                  Mở danh sách chat
                </button>
              )}

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 sm:h-24 sm:w-24">
                <span className="text-2xl sm:text-4xl">💬</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                Chọn một cuộc trò chuyện
              </h3>
              <p className="px-4 text-sm text-gray-500 sm:text-base">
                {isMobile
                  ? "Nhấn vào nút trên để xem danh sách cuộc trò chuyện"
                  : "Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;

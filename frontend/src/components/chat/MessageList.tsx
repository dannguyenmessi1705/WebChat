import React, { useEffect, useRef } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { CheckIcon } from "@heroicons/react/24/outline";
import { type Message } from "../../types";
import { useAuthStore } from "../../store/authStore";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "HH:mm")}`;
    } else {
      return format(date, "MMM d, HH:mm");
    }
  };

  const formatDateDivider = (date: Date) => {
    if (isToday(date)) {
      return "Hôm nay";
    } else if (isYesterday(date)) {
      return "Hôm qua";
    } else {
      return format(date, "dd/MM/yyyy");
    }
  };
  const renderMessageStatus = (message: Message) => {
    if (message.senderId !== user?.userId) return null;

    if (message.status === "delivered") {
      return (
        <div className="flex">
          <CheckIcon className="h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
          <CheckIcon className="-ml-1 h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
        </div>
      );
    } else if (message.status === "sent") {
      return <CheckIcon className="h-3 w-3 text-gray-400 sm:h-4 sm:w-4" />;
    }
    return null;
  };

  const shouldShowDateDivider = (
    currentMessage: Message,
    previousMessage?: Message
  ) => {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.timestamp);
    const previousDate = new Date(previousMessage.timestamp);

    return !isSameDay(currentDate, previousDate);
  };

  const shouldShowAvatar = (currentMessage: Message, nextMessage?: Message) => {
    if (!nextMessage) return true;
    return currentMessage.senderId !== nextMessage.senderId;
  };
  const renderFileMessage = (message: Message) => {
    if (message.contentType === "image") {
      return (
        <div className="relative">
          <img
            src={message.content}
            alt="Image"
            className="max-w-[250px] cursor-pointer rounded-lg transition-opacity hover:opacity-95 sm:max-w-xs"
            onClick={() => window.open(message.content, "_blank")}
          />
        </div>
      );
    } else if (message.contentType === "file") {
      const fileName = message.content.split("/").pop() || "File";
      return (
        <div className="flex max-w-[250px] items-center space-x-2 rounded-lg bg-gray-100 p-2 sm:max-w-xs sm:p-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-300 sm:h-10 sm:w-10">
            <span className="text-xs font-medium text-gray-600">📎</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-gray-900 sm:text-sm">
              {fileName}
            </p>
            <button
              onClick={() => window.open(message.content, "_blank")}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Tải xuống
            </button>
          </div>
        </div>
      );
    }
    return null;
  };
  const renderMessage = (message: Message, index: number) => {
    const isCurrentUser = message.senderId === user?.userId;
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    const nextMessage =
      index < messages.length - 1 ? messages[index + 1] : undefined;
    const showAvatar = shouldShowAvatar(message, nextMessage);
    const showDateDivider = shouldShowDateDivider(message, previousMessage);

    return (
      <div key={message.messageId}>
        {" "}
        {/* Date Divider */}
        {showDateDivider && (
          <div className="my-3 flex items-center justify-center sm:my-4">
            <div className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 sm:px-3">
              {formatDateDivider(new Date(message.timestamp))}
            </div>
          </div>
        )}
        {/* Message */}
        <div
          className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-1 px-2 sm:px-0`}
        >
          <div
            className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} max-w-[280px] items-end space-x-2 sm:max-w-xs lg:max-w-md`}
          >
            {/* Avatar */}
            {!isCurrentUser && (
              <div
                className={`h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8 ${showAvatar ? "visible" : "invisible"}`}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-semibold text-white">
                  {message.senderUsername?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            )}

            {/* Message Content */}
            <div
              className={`group ${isCurrentUser ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"} min-w-0 flex-1`}
            >
              {/* Sender name for group chats */}
              {!isCurrentUser && showAvatar && (
                <p className="mb-1 truncate px-1 text-xs text-gray-500">
                  {message.senderUsername || "Unknown User"}
                </p>
              )}
              <div
                className={`relative rounded-2xl px-3 py-2 sm:px-4 ${
                  isCurrentUser
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900"
                } ${
                  showAvatar
                    ? isCurrentUser
                      ? "rounded-br-md"
                      : "rounded-bl-md"
                    : ""
                }`}
              >
                {/* Message content */}
                {message.contentType === "text" ? (
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                ) : (
                  renderFileMessage(message)
                )}

                {/* Message time and status */}
                <div
                  className={`mt-1 flex items-center justify-end space-x-1 ${
                    isCurrentUser ? "text-indigo-200" : "text-gray-500"
                  }`}
                >
                  <span className="text-xs">
                    {formatMessageTime(new Date(message.timestamp))}
                  </span>
                  {renderMessageStatus(message)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600 sm:h-8 sm:w-8"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-gray-500">
        <div className="text-center">
          <div className="mb-2 text-4xl sm:text-6xl">💬</div>
          <p className="text-sm sm:text-base">Chưa có tin nhắn nào</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-2 py-2 sm:px-4 sm:py-4">
        {" "}
        {messages.map((message, index) => renderMessage(message, index))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

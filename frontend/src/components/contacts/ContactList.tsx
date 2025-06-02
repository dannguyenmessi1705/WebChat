import React, { useState } from "react";
import {
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import type { User } from "../../types";
import { useNavigate } from "react-router-dom";

interface ContactListProps {
  onStartChat?: (contact: User) => void;
}

const ContactList: React.FC<ContactListProps> = ({ onStartChat }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { contacts, onlineUsers, createConversation } = useChatStore();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const handleStartChat = async (contact: User) => {
    try {
      // Create or get existing conversation
      const conversation = await createConversation({
        participants: [user!.userId, contact.userId],
        type: "direct",
        name: contact.fullName,
      });

      // Navigate to the conversation
      navigate(`/chat/${conversation.conversationId}`);

      if (onStartChat) {
        onStartChat(contact);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const handleContactAction = (contactId: string, action: string) => {
    setSelectedContact(null);

    switch (action) {
      case "remove":
        // TODO: Implement remove contact
        console.log("Remove contact:", contactId);
        break;
      case "block":
        // TODO: Implement block contact
        console.log("Block contact:", contactId);
        break;
      default:
        break;
    }
  };
  const isOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          Chưa có liên hệ nào
        </h3>
        <p className="text-sm text-gray-500">
          Thêm bạn bè để bắt đầu trò chuyện
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {contacts.map((contact) => (
        <div
          key={contact.userId}
          className="group relative flex items-center space-x-3 px-4 py-3 hover:bg-gray-50"
        >
          {/* Avatar with online status */}
          <div className="relative flex-shrink-0">
            <img
              src={contact.avatarUrl || "/default-avatar.png"}
              alt={contact.fullName}
              className="h-12 w-12 rounded-full"
            />
            {isOnline(contact.userId) && (
              <div className="absolute -right-0 -bottom-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
            )}
          </div>

          {/* Contact Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="truncate text-sm font-medium text-gray-900">
                {contact.fullName}
              </p>
              <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                {/* Start Chat Button */}
                <button
                  onClick={() => handleStartChat(contact)}
                  className="rounded-full p-1 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
                  title="Bắt đầu trò chuyện"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                </button>

                {/* More Actions */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setSelectedContact(
                        selectedContact === contact.userId
                          ? null
                          : contact.userId
                      )
                    }
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {selectedContact === contact.userId && (
                    <div className="ring-opacity-5 absolute top-8 right-0 z-10 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black">
                      <button
                        onClick={() =>
                          handleContactAction(contact.userId, "remove")
                        }
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Xóa liên hệ
                      </button>
                      <button
                        onClick={() =>
                          handleContactAction(contact.userId, "block")
                        }
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Chặn người dùng
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <p className="truncate text-sm text-gray-500">
                @{contact.username}
              </p>
              {isOnline(contact.userId) && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  Đang hoạt động
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Click outside to close dropdown */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setSelectedContact(null)}
        />
      )}
    </div>
  );
};

export default ContactList;

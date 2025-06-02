import React, { useState } from "react";
import { XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

interface CreateGroupChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupChat: React.FC<CreateGroupChatProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { contacts, createConversation } = useChatStore();
  const [groupName, setGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [isCreating, setIsCreating] = useState(false);

  const handleContactToggle = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedContacts.size < 2) {
      return;
    }

    setIsCreating(true);
    try {
      const participants = [user!.userId, ...Array.from(selectedContacts)];
      const conversation = await createConversation({
        participants,
        type: "group",
        name: groupName.trim(),
      });

      // Navigate to the new group chat
      navigate(`/chat/${conversation.conversationId}`);

      // Reset form and close modal
      setGroupName("");
      setSelectedContacts(new Set());
      onClose();
    } catch (error) {
      console.error("Error creating group chat:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setSelectedContacts(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
          onClick={handleClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Đóng</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <UserPlusIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Tạo nhóm chat
              </h3>
              <div className="mt-4">
                {/* Group Name Input */}
                <div className="mb-4">
                  <label
                    htmlFor="groupName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Tên nhóm
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Nhập tên nhóm..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    maxLength={50}
                  />
                </div>

                {/* Contact Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Chọn thành viên ({selectedContacts.size} đã chọn)
                  </label>
                  <div className="max-h-64 overflow-y-auto rounded-md border border-gray-300">
                    {contacts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Không có liên hệ nào
                      </div>
                    ) : (
                      contacts.map((contact) => (
                        <div
                          key={contact.userId}
                          className="flex cursor-pointer items-center p-3 hover:bg-gray-50"
                          onClick={() => handleContactToggle(contact.userId)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedContacts.has(contact.userId)}
                            onChange={() => handleContactToggle(contact.userId)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="ml-3 flex items-center space-x-3">
                            <img
                              src={contact.avatarUrl || "/default-avatar.png"}
                              alt={contact.fullName}
                              className="h-8 w-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {contact.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                @{contact.username}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Validation Messages */}
                {selectedContacts.size < 2 && (
                  <p className="mt-2 text-sm text-amber-600">
                    Cần chọn ít nhất 2 thành viên để tạo nhóm
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={
                !groupName.trim() || selectedContacts.size < 2 || isCreating
              }
              className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                !groupName.trim() || selectedContacts.size < 2 || isCreating
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              }`}
            >
              {isCreating ? "Đang tạo..." : "Tạo nhóm"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupChat;

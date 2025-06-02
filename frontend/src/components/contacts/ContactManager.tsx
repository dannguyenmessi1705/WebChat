import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useChatStore } from "../../store/chatStore";
import { apiService } from "../../services/api";
import type { User, Contact } from "../../types";

interface ContactManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactManager: React.FC<ContactManagerProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { contacts, addContact } = useChatStore();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await apiService.searchUsers(query);
      // Filter out existing contacts
      const existingContactIds = new Set(contacts.map((c) => c.userId));
      const filteredResults = results.filter(
        (user) => !existingContactIds.has(user.userId)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  const handleAddContact = async (user: User) => {
    try {
      await apiService.addContact(user.userId);
      const contact: Contact = {
        ...user,
        status: user.status || "offline",
      };
      addContact(contact);
      setSelectedUsers((prev) => new Set(prev).add(user.userId));

      // Remove from search results
      setSearchResults((prev) => prev.filter((u) => u.userId !== user.userId));
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleAddMultipleContacts = async () => {
    const userIds = Array.from(selectedUsers);

    try {
      await Promise.all(userIds.map((userId) => apiService.addContact(userId))); // Add to contacts store
      const usersToAdd = searchResults.filter((user) =>
        selectedUsers.has(user.userId)
      );
      usersToAdd.forEach((user) => {
        const contact: Contact = {
          ...user,
          status: user.status || "offline",
        };
        addContact(contact);
      });

      // Clear selections and results
      setSelectedUsers(new Set());
      setSearchResults((prev) =>
        prev.filter((user) => !selectedUsers.has(user.userId))
      );
    } catch (error) {
      console.error("Error adding contacts:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Thêm liên hệ
              </h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Đóng</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pr-3 pl-10 text-sm placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Search Results */}
            <div className="max-h-64 overflow-y-auto">
              {isSearching && (
                <div className="flex items-center justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    Đang tìm kiếm...
                  </span>
                </div>
              )}

              {!isSearching &&
                searchQuery.length >= 2 &&
                searchResults.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </div>
                )}

              {searchResults.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between rounded-md px-2 py-3 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatarUrl || "/default-avatar.png"}
                      alt={user.fullName}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddContact(user)}
                    disabled={selectedUsers.has(user.userId)}
                    className={`flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                      selectedUsers.has(user.userId)
                        ? "cursor-not-allowed bg-green-100 text-green-800"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {selectedUsers.has(user.userId) ? (
                      <>
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Đã thêm
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="mr-1 h-4 w-4" />
                        Thêm
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Multiple Selection Actions */}
            {selectedUsers.size > 1 && (
              <div className="mt-4 rounded-md bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedUsers.size} người dùng
                  </span>
                  <button
                    onClick={handleAddMultipleContacts}
                    className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                  >
                    Thêm tất cả
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactManager;

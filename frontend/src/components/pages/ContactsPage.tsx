import React, { useState } from "react";
import ContactList from "../contacts/ContactList";
import ContactManager from "../contacts/ContactManager";

const ContactsPage: React.FC = () => {
  const [showContactManager, setShowContactManager] = useState(false);

  return (
    <>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="flex w-80 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Liên hệ</h1>
              <button
                onClick={() => setShowContactManager(true)}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm leading-4 font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                Thêm liên hệ
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ContactList />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Quản lý liên hệ
            </h3>
            <p className="text-gray-500">Thêm bạn bè và bắt đầu trò chuyện</p>
          </div>
        </div>
      </div>

      {/* Contact Manager Modal */}
      <ContactManager
        isOpen={showContactManager}
        onClose={() => setShowContactManager(false)}
      />
    </>
  );
};

export default ContactsPage;

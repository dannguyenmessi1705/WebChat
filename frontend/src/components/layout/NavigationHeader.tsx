import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../../store/authStore";

const NavigationHeader: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigationItems = [
    {
      name: "Trò chuyện",
      href: "/chat",
      icon: ChatBubbleLeftRightIcon,
      current: location.pathname.startsWith("/chat"),
    },
    {
      name: "Liên hệ",
      href: "/contacts",
      icon: UserGroupIcon,
      current: location.pathname === "/contacts",
    },
    {
      name: "Hồ sơ",
      href: "/profile",
      icon: UserIcon,
      current: location.pathname === "/profile",
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">WebChat</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  item.current
                    ? "border-b-2 border-indigo-500 text-gray-900"
                    : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700">{user?.username}</span>
            </div>

            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Đăng xuất"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center px-2 py-2 text-xs font-medium transition-colors ${
                item.current
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;

import React from "react";
import { useAuthStore } from "../../store/authStore";

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-full bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg leading-6 font-medium text-gray-900">
              Thông tin cá nhân
            </h3>

            {user && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <img
                    src={user.avatarUrl || "/default-avatar.png"}
                    alt={user.fullName}
                    className="h-24 w-24 rounded-full"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {user.fullName}
                    </h4>
                    <p className="text-gray-600">@{user.username}</p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                    Chỉnh sửa thông tin
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

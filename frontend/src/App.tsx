import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/layout/ProtectedRoute";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import ChatLayout from "./components/chat/ChatLayout.tsx";
import ContactsPage from "./components/pages/ContactsPage";
import ProfilePage from "./components/pages/ProfilePage";
import {
  NotificationSystem,
  useNotifications,
} from "./components/ui/NotificationSystem";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { notifications, removeNotification } = useNotifications();

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                      <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                          Đăng nhập vào tài khoản
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                          Hoặc{" "}
                          <a
                            href="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            tạo tài khoản mới
                          </a>
                        </p>
                      </div>
                      <LoginForm />
                    </div>
                  </div>
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                      <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                          Tạo tài khoản mới
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                          Hoặc{" "}
                          <a
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            đăng nhập vào tài khoản có sẵn
                          </a>
                        </p>
                      </div>
                      <RegisterForm />
                    </div>
                  </div>
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ChatLayout />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/:conversationId"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ChatLayout />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ContactsPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ProfilePage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirects */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/chat" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="flex min-h-screen items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                      404
                    </h1>
                    <p className="mb-4 text-gray-600">Trang không tồn tại</p>
                    <a
                      href={isAuthenticated ? "/chat" : "/login"}
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Quay về trang chủ
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>

          {/* Global Notification System */}
          <NotificationSystem
            notifications={notifications}
            onRemove={removeNotification}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;

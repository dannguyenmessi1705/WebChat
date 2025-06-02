import React from "react";
import NavigationHeader from "./NavigationHeader";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <main className="h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;

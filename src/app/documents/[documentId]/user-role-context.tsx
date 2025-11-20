"use client";

import { createContext, useContext, ReactNode } from "react";

type UserRole = "viewer" | "commenter" | "editor";

interface UserRoleContextType {
  userRole: UserRole;
  canEdit: boolean;
  canComment: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ 
  children, 
  userRole 
}: { 
  children: ReactNode; 
  userRole: UserRole;
}) {
  const canEdit = userRole === "editor";
  const canComment = userRole === "commenter" || userRole === "editor";

  return (
    <UserRoleContext.Provider value={{ userRole, canEdit, canComment }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    // Default to editor if context is not available (for backwards compatibility)
    return { userRole: "editor" as UserRole, canEdit: true, canComment: true };
  }
  return context;
}


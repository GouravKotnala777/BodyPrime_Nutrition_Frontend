import type { ReactNode } from "react";
import Login from "../pages/Login.page";

export interface ProtectedRoutePropType{
  children:ReactNode;
  isUserAuthenticated:boolean;
  isUserAdmin?:boolean;
};

export function ProtectedRoute({children, isUserAuthenticated, isUserAdmin}:ProtectedRoutePropType) {

  if (!isUserAuthenticated) return <Login />
  if (!isUserAdmin) return <h1>Page not found</h1>
  
  return children;
};

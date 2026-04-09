'use client';

import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type UserRole = 'patient' | 'doctor';

export type AppUser = {
  role?: UserRole;
  email?: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  id?: string;
  _id?: string;
  availability?: unknown[]; 
  // Allow extra fields from API without blocking the UI.
  [key: string]: unknown;
} | null;



/** True when `user` has a Mongo-style `_id` (present after successful login). Partial signup state may omit it. */
export function hasAuthenticatedUserId(user: AppUser): boolean {
  if (!user) return false;
  const id = user._id;
  return typeof id === 'string' && id.length > 0;
}

type UserContextType = {
  user: AppUser;
  setUser: (user: AppUser) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { value, setValue, remove } = useLocalStorage<AppUser>('user', null);

  const setUser = (user: AppUser) => setValue(user);
  const logout = () => remove();

  return (
    <UserContext.Provider value={{ user: value, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}


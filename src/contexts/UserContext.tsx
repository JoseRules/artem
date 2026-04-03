'use client';

import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type UserRole = 'patient' | 'doctor';

export type AppUser = {
  role?: UserRole;
  email?: string;
  id?: string;
  // Allow extra fields from API without blocking the UI.
  [key: string]: unknown;
} | null;

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


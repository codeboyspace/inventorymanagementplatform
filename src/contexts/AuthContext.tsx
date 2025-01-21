import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, Store } from '@/types';

interface AuthContextType {
  user: User | null;
  stores: Store[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  toggleStoreStatus: (storeId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS: Record<string, User> = {
  'admin@example.com': {
    id: '1',
    name: 'Administrator',
    role: 'administrator',
    email: 'admin@example.com'
  },
  'storekeeper@example.com': {
    id: '2',
    name: 'Store Keeper',
    role: 'storekeeper',
    email: 'storekeeper@example.com'
  },
  'stockmanagement@example.com': {
    id: '3',
    name: 'Stock Manager',
    role: 'stockmanagement',
    email: 'stockmanagement@example.com'
  },
  'stockdisburser@example.com': {
    id: '4',
    name: 'Stock Disburser',
    role: 'stockdisburser',
    email: 'stockdisburser@example.com'
  },
  'storemanager@example.com': {
    id: '5',
    name: 'Store Manager',
    role: 'storemanager',
    email: 'storemanager@example.com'
  }
};

// Mock stores data
const INITIAL_STORES: Store[] = [
  {
    id: '1',
    name: 'Store A',
    location: 'Main Street',
    description: 'Main warehouse',
    isOpen: true
  },
  {
    id: '2',
    name: 'Store B',
    location: 'Downtown',
    description: 'Downtown branch',
    isOpen: true
  },
  {
    id: '3',
    name: 'Store C',
    location: 'Suburb',
    description: 'Suburban warehouse',
    isOpen: false
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);

  const login = async (email: string, password: string) => {
    const mockUser = MOCK_USERS[email];
    if (mockUser && password === 'password') {
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const toggleStoreStatus = (storeId: string) => {
    if (user?.role !== 'administrator') {
      throw new Error('Unauthorized');
    }
    
    setStores(prevStores =>
      prevStores.map(store =>
        store.id === storeId
          ? { ...store, isOpen: !store.isOpen }
          : store
      )
    );
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    const rolePermissions: Record<UserRole, string[]> = {
      administrator: ['all'],
      storekeeper: ['add_items', 'delete_items'],
      stockmanagement: ['add_items', 'delete_items', 'edit_items'],
      stockdisburser: ['delete_items'],
      storemanager: ['all']
    };

    const userPermissions = rolePermissions[user.role];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      stores, 
      login, 
      logout, 
      hasPermission, 
      toggleStoreStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
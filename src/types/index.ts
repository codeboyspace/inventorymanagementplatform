export type UserRole = 'administrator' | 'storekeeper' | 'stockmanagement' | 'stockdisburser' | 'storemanager';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  description: string;
  rackNumber: string;
  brand: string;
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  description: string;
  isOpen: boolean;
}

export interface PermissionRequest {
  id: string;
  userId: string;
  requestedPermission: string;
  status: 'pending' | 'approved' | 'rejected';
  duration: number; // in days
  createdAt: string;
}
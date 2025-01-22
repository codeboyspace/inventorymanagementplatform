import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryPanel } from '@/components/inventory/InventoryPanel';
import { useToast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const getRoleTitle = (role: string) => {
    const titles = {
      administrator: 'System Administrator',
      storekeeper: 'Store Keeper Panel',
      stockmanagement: 'Stock Management Panel',
      stockdisburser: 'Stock Disbursement Panel',
      storemanager: 'Store Manager Panel'
    };
    return titles[role as keyof typeof titles] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-gray-600">{getRoleTitle(user?.role || '')}</p>
          </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryPanel userRole={user?.role || 'storekeeper'} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
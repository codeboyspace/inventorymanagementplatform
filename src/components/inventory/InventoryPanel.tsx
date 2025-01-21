import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { InventoryItem, UserRole } from '@/types';
import { Plus, Trash, Edit, Save, Minus } from 'lucide-react';

interface InventoryPanelProps {
  userRole: UserRole;
}

export function InventoryPanel({ userRole }: InventoryPanelProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reduceAmount, setReduceAmount] = useState<Record<string, number>>({});

  const canAdd = ['administrator', 'storekeeper', 'stockmanagement', 'storemanager'].includes(userRole);
  const canEdit = ['administrator', 'stockmanagement', 'storemanager'].includes(userRole);
  const canDelete = ['administrator', 'storekeeper', 'stockmanagement', 'stockdisburser', 'storemanager'].includes(userRole);
  const canReduceStock = ['administrator', 'stockdisburser', 'storemanager'].includes(userRole);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.count || !newItem.rackNumber || !newItem.brand) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name || '',
      count: Number(newItem.count) || 0,
      description: newItem.description || '',
      rackNumber: newItem.rackNumber || '',
      brand: newItem.brand || '',
      storeId: '1', // Default store ID
    };

    setItems([...items, item]);
    setNewItem({});
    toast({
      title: "Success",
      description: "Item added successfully",
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Item deleted successfully",
    });
  };

  const handleEditItem = (item: InventoryItem) => {
    if (editingId === item.id) {
      setItems(items.map(i => i.id === item.id ? { ...item } : i));
      setEditingId(null);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } else {
      setEditingId(item.id);
    }
  };

  const handleReduceStock = (itemId: string) => {
    const amount = reduceAmount[itemId] || 0;
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount to reduce",
        variant: "destructive",
      });
      return;
    }

    setItems(items.map(item => {
      if (item.id === itemId) {
        const newCount = item.count - amount;
        if (newCount < 0) {
          toast({
            title: "Error",
            description: "Cannot reduce stock below 0",
            variant: "destructive",
          });
          return item;
        }
        return { ...item, count: newCount };
      }
      return item;
    }));

    setReduceAmount(prev => ({ ...prev, [itemId]: 0 }));
    toast({
      title: "Success",
      description: `Reduced ${amount} items from stock`,
    });
  };

  return (
    <div className="space-y-6">
      {canAdd && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={newItem.name || ''}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="count">Count</Label>
            <Input
              id="count"
              type="number"
              value={newItem.count || ''}
              onChange={e => setNewItem({ ...newItem, count: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={newItem.brand || ''}
              onChange={e => setNewItem({ ...newItem, brand: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="rackNumber">Rack Number</Label>
            <Input
              id="rackNumber"
              value={newItem.rackNumber || ''}
              onChange={e => setNewItem({ ...newItem, rackNumber: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newItem.description || ''}
              onChange={e => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          <div className="col-span-3">
            <Button onClick={handleAddItem} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-4 border rounded-lg flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">
                Brand: {item.brand} | Rack: {item.rackNumber} | Count: {item.count}
              </p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <div className="space-x-2 flex items-center">
              {canReduceStock && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    className="w-20"
                    value={reduceAmount[item.id] || ''}
                    onChange={e => setReduceAmount(prev => ({ 
                      ...prev, 
                      [item.id]: parseInt(e.target.value) || 0 
                    }))}
                    placeholder="Amount"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReduceStock(item.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditItem(item)}
                >
                  {editingId === item.id ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Successfully logged in');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('https://via.placeholder.com/1920x1080')] bg-opacity-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <Card className="w-[400px] z-10 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-mono">
            Inventory Login Panel 🛠️
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrator">Administrator</SelectItem>
                <SelectItem value="storekeeper">Store Keeper</SelectItem>
                <SelectItem value="stockmanagement">Stock Management</SelectItem>
                <SelectItem value="stockdisburser">Stock Disburser</SelectItem>
                <SelectItem value="storemanager">Store Manager</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
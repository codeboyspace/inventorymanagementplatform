import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("email",email)
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });

       if (response.status === 200) {
         const { role } = response.data;
         login(email, role);
         toast.success("Successfully logged in");
         navigate("/dashboard");
       }
       console.log(response); 
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
      console.log(error);
      
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
                type="text"
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
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

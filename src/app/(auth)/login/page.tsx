"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn.email({
        email,
        password,
      });
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
      });
    } catch (error) {
      toast.error("Failed to login with Google");
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@jobspark.ai");
    setPassword("demo1234");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="w-full max-w-md p-8 bg-surface border border-border rounded-2xl shadow-xl">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link href="/" className="font-bold text-inherit flex items-center gap-2 mb-2">
            <span className="text-primary text-3xl">⚡</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted">Log in to your JobSpark account</p>
        </div>
        
        <div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Email</label>
              <input
                required
                className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Password</label>
              <input
                required
                className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Link href="#" className="text-sm text-primary font-medium">
                Forgot password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <button 
            className="w-full mt-2 py-3 rounded-xl font-semibold border border-default-200 hover:bg-default-100 transition-colors"
            onClick={handleDemoLogin}
          >
            Use Demo Account
          </button>

          <button 
            className="w-full flex items-center justify-center gap-2 h-12 border-2 border-default-200 rounded-xl hover:bg-default-100 transition-colors font-medium"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

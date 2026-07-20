"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp.email({
        email,
        password,
        name,
      });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create account.");
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

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="w-full max-w-md p-8 bg-surface border border-border rounded-2xl shadow-xl">
        <div className="flex flex-col items-center gap-2 pb-6">
          <a href="/" className="font-bold text-inherit flex items-center gap-2 mb-2">
            <span className="text-primary text-3xl">⚡</span>
          </a>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted">Join JobSpark to find your dream job</p>
        </div>
        
        <div>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Full Name</label>
              <input
                required
                className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                placeholder="Enter your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
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
                placeholder="Create a password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full mt-4 h-12 bg-primary text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-border" />
            <span className="text-sm text-muted">OR</span>
            <hr className="flex-1 border-border" />
          </div>

          <button 
            className="w-full flex items-center justify-center gap-2 h-12 border-2 border-default-200 rounded-xl hover:bg-default-100 transition-colors font-medium"
            onClick={handleGoogleLogin}
          >
            Sign up with Google
          </button>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

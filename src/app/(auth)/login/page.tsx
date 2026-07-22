"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import { signIn, signUp } from "@/lib/auth-client";
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
        callbackURL: `${window.location.origin}/dashboard`
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
        callbackURL: `${window.location.origin}/dashboard`
      });
    } catch (error) {
      toast.error("Failed to login with Google");
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    const demoEmail = "demo@jobspark.ai";
    const demoPassword = "demo1234";
    
    try {
      // First, try to sign in
      await signIn.email({
        email: demoEmail,
        password: demoPassword,
        callbackURL: `${window.location.origin}/dashboard`
      });
      toast.success("Logged in as Demo User!");
      router.push("/dashboard");
    } catch (error: any) {
      // If sign in fails, the user might not exist yet. Try to register.
      try {
        await signUp.email({
          email: demoEmail,
          password: demoPassword,
          name: "Demo User",
          callbackURL: `${window.location.origin}/dashboard`
        });
        toast.success("Demo account created and logged in!");
        router.push("/dashboard");
      } catch (signUpError: any) {
        toast.error(signUpError?.message || "Failed to log in as Demo User.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="font-bold text-inherit flex items-center gap-2 mb-1">
            <span className="text-primary text-3xl">⚡</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-400">Log in to your JobSpark account</p>
        </div>
        
        <div className="space-y-4">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-300">Email Address</label>
              <input
                required
                suppressHydrationWarning
                className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <input
                required
                className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Link href="#" className="text-sm text-primary font-semibold hover:opacity-80 transition-opacity">
                Forgot password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-12 bg-primary text-white rounded-xl font-bold hover:opacity-90 active:scale-[0.99] transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <button 
            className="w-full h-12 rounded-xl font-bold border border-slate-800 hover:bg-slate-800/50 active:scale-[0.99] transition-all text-slate-200 cursor-pointer"
            onClick={handleDemoLogin}
          >
            Use Demo Account
          </button>

          <div className="flex items-center gap-4 my-4">
            <hr className="flex-1 border-slate-800" />
            <span className="text-xs font-semibold text-slate-500">OR</span>
            <hr className="flex-1 border-slate-800" />
          </div>

          <button 
            className="w-full flex items-center justify-center gap-3 h-12 bg-white text-slate-900 hover:bg-slate-50 active:scale-[0.99] transition-all rounded-xl font-bold shadow-sm cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-400 pt-2">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

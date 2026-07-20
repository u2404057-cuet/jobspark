"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";

export function TopNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const menuItems = session
    ? [
        { label: "Home", href: "/" },
        { label: "Jobs", href: "/jobs" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Post a Job", href: "/jobs/add" },
        { label: "My Jobs", href: "/jobs/manage" },
        { label: "AI Career Coach", href: "/ai-coach" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Jobs", href: "/jobs" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-md">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="sm:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <Link href="/" className="font-bold text-inherit flex items-center gap-2">
            <span className="text-primary text-2xl">⚡</span>
            <p className="font-bold text-xl tracking-tight hidden sm:block">JobSpark <span className="text-primary">AI</span></p>
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : "text-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse border border-slate-700" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30 shadow-inner">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-200 hidden sm:inline-block">
                {session.user.name}
              </span>
              <button 
                onClick={handleSignOut}
                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/30 transition-all">
                Login
              </Link>
              <Link href="/register" className="bg-primary text-white hover:bg-primary/95 px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-primary/10">
                Sign Up
              </Link>
            </>
          )}
        </div>

      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-border bg-background p-4 absolute w-full left-0 top-16 shadow-lg">
          <ul className="flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Link
                  className={`block w-full text-lg ${pathname === item.href ? "text-primary font-semibold" : "text-foreground"}`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
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
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered className="bg-background/70 backdrop-blur-md">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit flex items-center gap-2">
            <span className="text-primary text-2xl">⚡</span>
            <p className="font-bold text-xl tracking-tight">JobSpark <span className="text-primary">AI</span></p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link color={pathname === item.href ? "primary" : "foreground"} href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {isPending ? (
          <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />
        ) : session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={session.user.name}
                size="sm"
                src={session.user.image || undefined}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session.user.email}</p>
              </DropdownItem>
              <DropdownItem key="dashboard" href="/dashboard">
                Dashboard
              </DropdownItem>
              <DropdownItem key="post_job" href="/jobs/add" color="primary">
                Post a Job
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleSignOut}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login" color="foreground">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              color={pathname === item.href ? "primary" : "foreground"}
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

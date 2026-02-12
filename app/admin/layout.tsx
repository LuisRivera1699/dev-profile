"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/experiences", label: "Experiences" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card">
        <div className="flex h-14 items-center gap-4 px-4">
          <Link href="/admin" className="font-medium">
            Admin
          </Link>
          <nav className="flex gap-2">
            {nav.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                View site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeedDataButton } from "@/components/admin/SeedDataButton";

const links = [
  { href: "/admin/experiences", label: "Experiences", desc: "Manage work experience entries" },
  { href: "/admin/projects", label: "Projects", desc: "Manage projects and featured items" },
  { href: "/admin/skills", label: "Skills", desc: "Manage skills by category" },
  { href: "/admin/certifications", label: "Certifications", desc: "Manage certifications" },
  { href: "/admin/messages", label: "Messages", desc: "View contact form submissions" },
  { href: "/admin/settings", label: "Settings", desc: "Edit hero, about, and CV" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your website content. Select a section below.
          </p>
        </div>
        <SeedDataButton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">{item.label}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-sm font-medium text-foreground">
          ~/
        </Link>
        <nav className="flex items-center gap-1">
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#work" className="hover:text-primary transition-colors">
              Experience
            </Link>
            <Link href="#projects" className="hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="#skills" className="hover:text-primary transition-colors">
              Skills
            </Link>
            <Link href="#certifications" className="hover:text-primary transition-colors">
              Certifications
            </Link>
            <Link href="#contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

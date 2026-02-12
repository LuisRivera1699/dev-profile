import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-muted/30 py-8">
      <div className="container mx-auto max-w-5xl px-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Built with Next.js & Firebase ·{" "}
          <Link href="/admin" className="text-primary hover:underline">
            /admin
          </Link>
        </p>
      </div>
    </footer>
  );
}

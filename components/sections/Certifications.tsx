import type { Certification as CertificationType } from "@/types/firestore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CertificationsProps {
  certifications: (CertificationType & { id: string })[];
}

export function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="border-b border-border/80 bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
          {`// certifications`}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <Card key={cert.id} className="border-border/80 bg-card">
              <CardHeader className="pb-2">
                <h3 className="font-mono font-medium text-foreground">{cert.title}</h3>
                <p className="font-mono text-xs text-primary">
                  {cert.issuer} · {cert.date}
                </p>
              </CardHeader>
              {cert.description ? (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

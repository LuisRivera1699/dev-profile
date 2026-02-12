"use client";

import { useState } from "react";
import { createMessage } from "@/services/messageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactProps {
  email?: string;
  linkedin?: string;
  github?: string;
  wallet?: string;
}

export function Contact({
  email: linkEmail = "",
  linkedin: linkLinkedIn = "",
  github: linkGitHub = "",
  wallet: linkWallet = "",
}: ContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await createMessage({ name, email, message });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="border-b border-border/80 bg-background py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
          {`// contact`}
        </h2>
        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <div className="rounded-lg border border-border/80 bg-card/50 p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Get in touch for consulting, collaborations, or technical leadership roles.
            </p>
            <ul className="space-y-2 font-mono text-sm">
              {linkEmail && (
                <li>
                  <a
                    href={`mailto:${linkEmail}`}
                    className="text-primary hover:underline underline-offset-4"
                  >
                    {linkEmail}
                  </a>
                </li>
              )}
              {linkLinkedIn && (
                <li>
                  <a
                    href={linkLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {linkGitHub && (
                <li>
                  <a
                    href={linkGitHub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    GitHub
                  </a>
                </li>
              )}
              {linkWallet && (
                <li className="text-muted-foreground break-all">{linkWallet}</li>
              )}
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="font-mono text-xs">name</Label>
              <Input
                id="contact-name"
                className="font-mono text-sm border-border/80 bg-background"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="your_name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="font-mono text-xs">email</Label>
              <Input
                id="contact-email"
                type="email"
                className="font-mono text-sm border-border/80 bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message" className="font-mono text-xs">message</Label>
              <Textarea
                id="contact-message"
                className="font-mono text-sm border-border/80 bg-background resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Your message..."
                rows={4}
              />
            </div>
            {status === "sent" && (
              <p className="text-sm text-primary font-mono">
                Message sent. I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive font-mono">
                Something went wrong. Try again or email directly.
              </p>
            )}
            <Button type="submit" disabled={status === "sending"} className="font-mono text-sm">
              {status === "sending" ? "Sending…" : "send_message()"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

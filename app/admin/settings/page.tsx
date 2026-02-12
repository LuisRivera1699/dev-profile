"use client";

import { useEffect, useState, useCallback } from "react";
import { getSettings, updateSettings } from "@/services/settingsService";
import { uploadFile, STORAGE_PATHS } from "@/services/storageService";
import type { Settings } from "@/types/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const defaultSettings: Settings = {
  heroTitle: "",
  heroSubtitle: "",
  heroSummary: "",
  aboutText: "",
  cvUrl: "",
  contactEmail: "",
  contactLinkedIn: "",
  contactGitHub: "",
  contactWallet: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      if (data) setSettings({ ...defaultSettings, ...data });
    } catch {
      toast({ title: "Failed to load settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setSaving(true);
    try {
      let cvUrl = settings.cvUrl;
      if (cvFile) {
        cvUrl = await uploadFile(STORAGE_PATHS.cv, cvFile);
      }
      await updateSettings({ ...settings, cvUrl });
      setCvFile(null);
      toast({ title: "Settings saved" });
      load();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save all"}
        </Button>
      </div>
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Hero</h2>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={settings.heroTitle}
              onChange={(e) =>
                setSettings((s) => ({ ...s, heroTitle: e.target.value }))
              }
              placeholder="Senior Web3 Engineer & Technical Lead"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={settings.heroSubtitle}
              onChange={(e) =>
                setSettings((s) => ({ ...s, heroSubtitle: e.target.value }))
              }
              placeholder="DeFi infrastructure · Smart contracts"
            />
          </div>
          <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea
              value={settings.heroSummary}
              onChange={(e) =>
                setSettings((s) => ({ ...s, heroSummary: e.target.value }))
              }
              rows={3}
              placeholder="2-3 sentence executive summary"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-medium">About</h2>
          <div className="space-y-2">
            <Label>About text</Label>
            <Textarea
              value={settings.aboutText}
              onChange={(e) =>
                setSettings((s) => ({ ...s, aboutText: e.target.value }))
              }
              rows={8}
              placeholder="Professional bio"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Contact links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={settings.contactEmail ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, contactEmail: e.target.value }))
                }
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                value={settings.contactLinkedIn ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, contactLinkedIn: e.target.value }))
                }
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input
                value={settings.contactGitHub ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, contactGitHub: e.target.value }))
                }
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Wallet address</Label>
              <Input
                value={settings.contactWallet ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, contactWallet: e.target.value }))
                }
                placeholder="0x..."
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-medium">CV</h2>
          <div className="space-y-2">
            <Label>Upload CV (PDF)</Label>
            <Input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            />
            {settings.cvUrl && (
              <p className="text-sm text-muted-foreground">
                Current CV:{" "}
                <a
                  href={settings.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Download
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "@/services/certificationService";
import type { Certification } from "@/types/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function emptyCert(): Omit<Certification, "createdAt"> {
  return {
    title: "",
    issuer: "",
    date: "",
    description: "",
  };
}

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<(Certification & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<(Certification & { id: string }) | null>(null);
  const [form, setForm] = useState<Omit<Certification, "createdAt">>(emptyCert());
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllCertifications();
      setCerts(data);
    } catch {
      toast({ title: "Failed to load certifications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyCert());
    setOpen(true);
  }

  function openEdit(cert: Certification & { id: string }) {
    setEditing(cert);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      description: cert.description ?? "",
    });
    setOpen(true);
  }

  async function save() {
    try {
      if (editing) {
        await updateCertification(editing.id, form);
        toast({ title: "Certification updated" });
      } else {
        await createCertification(form);
        toast({ title: "Certification created" });
      }
      setOpen(false);
      load();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this certification?")) return;
    try {
      await deleteCertification(id);
      toast({ title: "Certification deleted" });
      load();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Certifications</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Add certification</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit certification" : "New certification"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Certification name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issuer</Label>
                  <Input
                    value={form.issuer}
                    onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
                    placeholder="Issuing organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    placeholder="2024"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Brief description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certs.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">{cert.title}</TableCell>
                <TableCell>{cert.issuer}</TableCell>
                <TableCell>{cert.date}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cert)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(cert.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {certs.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No certifications yet. Add one above.</p>
      )}
    </div>
  );
}

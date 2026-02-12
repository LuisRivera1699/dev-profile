"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/services/experienceService";
import type { Experience } from "@/types/firestore";
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

function emptyExperience(): Omit<Experience, "createdAt"> {
  return {
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    techStack: [],
  };
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<(Experience & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<(Experience & { id: string }) | null>(null);
  const [form, setForm] = useState<Omit<Experience, "createdAt">>(emptyExperience());
  const [techInput, setTechInput] = useState("");
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllExperiences();
      setExperiences(data);
    } catch {
      toast({ title: "Failed to load experiences", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyExperience());
    setTechInput("");
    setOpen(true);
  }

  function openEdit(exp: Experience & { id: string }) {
    setEditing(exp);
    setForm({
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      techStack: exp.techStack ?? [],
    });
    setTechInput("");
    setOpen(true);
  }

  function addTech() {
    const t = techInput.trim();
    if (t && !form.techStack.includes(t)) {
      setForm((f) => ({ ...f, techStack: [...f.techStack, t] }));
      setTechInput("");
    }
  }

  function removeTech(t: string) {
    setForm((f) => ({ ...f, techStack: f.techStack.filter((x) => x !== t) }));
  }

  async function save() {
    try {
      if (editing) {
        await updateExperience(editing.id, form);
        toast({ title: "Experience updated" });
      } else {
        await createExperience(form);
        toast({ title: "Experience created" });
      }
      setOpen(false);
      load();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      toast({ title: "Experience deleted" });
      load();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Experiences</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Add experience</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit experience" : "New experience"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="Senior Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="Company name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start date</Label>
                  <Input
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    placeholder="2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End date</Label>
                  <Input
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    placeholder="Present"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Impact and responsibilities"
                />
              </div>
              <div className="space-y-2">
                <Label>Tech stack</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="Add a technology"
                  />
                  <Button type="button" variant="outline" onClick={addTech}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-muted px-2 py-1 text-sm flex items-center gap-1"
                    >
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="text-muted-foreground hover:text-foreground">×</button>
                    </span>
                  ))}
                </div>
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
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell className="font-medium">{exp.role}</TableCell>
                <TableCell>{exp.company}</TableCell>
                <TableCell>{exp.startDate} — {exp.endDate}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(exp)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(exp.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {experiences.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No experiences yet. Add one above.</p>
      )}
    </div>
  );
}

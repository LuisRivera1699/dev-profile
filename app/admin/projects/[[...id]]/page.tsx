"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/services/projectService";
import { uploadFile, STORAGE_PATHS } from "@/services/storageService";
import type { Project } from "@/types/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

function emptyProject(): Omit<Project, "createdAt"> {
  return {
    title: "",
    description: "",
    impact: "",
    techStack: [],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<(Project & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<(Project & { id: string }) | null>(null);
  const [form, setForm] = useState<Omit<Project, "createdAt">>(emptyProject());
  const [techInput, setTechInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch {
      toast({ title: "Failed to load projects", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyProject());
    setTechInput("");
    setImageFile(null);
    setOpen(true);
  }

  function openEdit(proj: Project & { id: string }) {
    setEditing(proj);
    setForm({
      title: proj.title,
      description: proj.description,
      impact: proj.impact,
      techStack: proj.techStack ?? [],
      githubUrl: proj.githubUrl ?? "",
      liveUrl: proj.liveUrl ?? "",
      imageUrl: proj.imageUrl ?? "",
      featured: proj.featured ?? false,
    });
    setTechInput("");
    setImageFile(null);
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
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile && editing) {
        const path = STORAGE_PATHS.projectImage(editing.id, imageFile.name);
        imageUrl = await uploadFile(path, imageFile);
      } else if (imageFile && !editing) {
        const tempId = "temp-" + Date.now();
        const path = STORAGE_PATHS.projectImage(tempId, imageFile.name);
        imageUrl = await uploadFile(path, imageFile);
      }
      const payload = { ...form, imageUrl };
      if (editing) {
        await updateProject(editing.id, payload);
        toast({ title: "Project updated" });
      } else {
        await createProject(payload);
        toast({ title: "Project created" });
      }
      setOpen(false);
      load();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function toggleFeatured(proj: Project & { id: string }) {
    try {
      await updateProject(proj.id, { featured: !proj.featured });
      toast({ title: proj.featured ? "Unfeatured" : "Featured" });
      load();
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      toast({ title: "Project deleted" });
      load();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Add project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Project name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Short description"
                />
              </div>
              <div className="space-y-2">
                <Label>Impact</Label>
                <Input
                  value={form.impact}
                  onChange={(e) => setForm((f) => ({ ...f, impact: e.target.value }))}
                  placeholder="Key impact statement"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={form.githubUrl}
                    onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Live URL</Label>
                  <Input
                    value={form.liveUrl}
                    onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                {form.imageUrl && !imageFile && (
                  <p className="text-xs text-muted-foreground">Current image URL in use. Upload a new file to replace.</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
                <Label>Featured</Label>
              </div>
              <div className="space-y-2">
                <Label>Tech stack</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="Add technology"
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
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((proj) => (
              <TableRow key={proj.id}>
                <TableCell className="font-medium">{proj.title}</TableCell>
                <TableCell>
                  <Switch
                    checked={proj.featured}
                    onCheckedChange={() => toggleFeatured(proj)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(proj)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(proj.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {projects.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No projects yet. Add one above.</p>
      )}
    </div>
  );
}

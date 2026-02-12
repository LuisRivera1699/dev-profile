"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/services/skillService";
import type { Skill } from "@/types/firestore";
import { SKILL_CATEGORIES } from "@/types/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<(Skill & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<(Skill & { id: string }) | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(SKILL_CATEGORIES[0]);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllSkills();
      setSkills(data);
    } catch {
      toast({ title: "Failed to load skills", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setName("");
    setCategory(SKILL_CATEGORIES[0]);
    setOpen(true);
  }

  function openEdit(skill: Skill & { id: string }) {
    setEditing(skill);
    setName(skill.name);
    setCategory(skill.category);
    setOpen(true);
  }

  async function save() {
    if (!name.trim()) return;
    try {
      if (editing) {
        await updateSkill(editing.id, { name: name.trim(), category });
        toast({ title: "Skill updated" });
      } else {
        await createSkill({ name: name.trim(), category });
        toast({ title: "Skill created" });
      }
      setOpen(false);
      load();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      toast({ title: "Skill deleted" });
      load();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Add skill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit skill" : "New skill"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Solidity"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!name.trim()}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>{skill.category}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(skill)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(skill.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {skills.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No skills yet. Add one above.</p>
      )}
    </div>
  );
}

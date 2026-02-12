"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllMessages, deleteMessage } from "@/services/messageService";
import type { Message } from "@/types/firestore";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<(Message & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<(Message & { id: string }) | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllMessages();
      setMessages(data);
    } catch {
      toast({ title: "Failed to load messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      toast({ title: "Message deleted" });
      setSelected(null);
      load();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }

  function formatDate(ts: Message["createdAt"]) {
    if (!ts) return "—";
    const d =
      typeof (ts as { toDate?: () => Date }).toDate === "function"
        ? (ts as { toDate: () => Date }).toDate()
        : new Date();
    return d.toLocaleString();
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Messages</h1>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell className="font-medium">{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(msg.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(msg)}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(msg.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {messages.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No messages yet.</p>
      )}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Date:</strong> {formatDate(selected.createdAt)}</p>
              <div className="rounded border bg-muted/50 p-3 text-sm">
                {selected.message}
              </div>
              <Button variant="destructive" size="sm" onClick={() => selected && remove(selected.id)}>
                Delete
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

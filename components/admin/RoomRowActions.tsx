"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import type { Room } from "@/types";

export function RoomRowActions({ room }: { room: Room }) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, { method: "DELETE" });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not delete the room.");
      toast("Room deleted.", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete the room.", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Link
        href={`/admin/rooms/${room.id}/edit`}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3.5 text-sm font-medium text-stone-700 transition-colors hover:border-ocean-400 hover:text-ocean-700"
      >
        <Pencil className="size-3.5" aria-hidden />
        Edit
      </Link>
      <Button size="sm" variant="ghost" onClick={() => setConfirmOpen(true)}>
        <Trash2 className="size-3.5 text-red-500" aria-hidden />
        Delete
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={remove}
        loading={deleting}
        title={`Delete "${room.name}"?`}
        description="This permanently removes the room and its photos from the site. Rooms with bookings on record can't be deleted — set them inactive instead."
        confirmLabel="Delete room"
      />
    </div>
  );
}

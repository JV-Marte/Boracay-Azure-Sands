"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, InputField, SelectField, TextareaField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { AMENITIES } from "@/lib/data/amenities";
import type { Room } from "@/types";

interface RoomFormProps {
  room?: Room;
}

export function RoomForm({ room }: RoomFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<string[]>(room?.amenities ?? ["wifi", "aircon"]);

  const toggleAmenity = (key: string) =>
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      description: form.get("description"),
      room_type: form.get("room_type"),
      price_per_night: Number(form.get("price_per_night")),
      max_guests: Number(form.get("max_guests")),
      bed_type: form.get("bed_type"),
      bed_summary: form.get("bed_summary"),
      room_size: Number(form.get("room_size")),
      status: form.get("status"),
      amenities,
      images: String(form.get("images") ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        room ? `/api/admin/rooms/${room.id}` : "/api/admin/rooms",
        {
          method: room ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not save the room.");
      toast(room ? "Room updated." : "Room created.", "success");
      router.push("/admin/rooms");
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not save the room.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      {errorMsg && (
        <p role="alert" className="rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700">
          {errorMsg}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="Room name"
          name="name"
          required
          minLength={3}
          defaultValue={room?.name}
          wrapperClassName="sm:col-span-2"
        />
        <TextareaField
          label="Description"
          name="description"
          required
          minLength={20}
          rows={5}
          defaultValue={room?.description}
          wrapperClassName="sm:col-span-2"
          hint="Shown on the room page. 2–4 sentences works best."
        />
        <SelectField label="Room type" name="room_type" defaultValue={room?.room_type ?? "studio"}>
          <option value="studio">Studio</option>
          <option value="suite">Suite</option>
          <option value="loft">Loft</option>
        </SelectField>
        <SelectField label="Status" name="status" defaultValue={room?.status ?? "active"}>
          <option value="active">Active (bookable)</option>
          <option value="inactive">Inactive (hidden)</option>
        </SelectField>
        <InputField
          label="Price per night (PHP)"
          name="price_per_night"
          type="number"
          min={500}
          step={50}
          required
          defaultValue={room?.price_per_night}
        />
        <InputField
          label="Max guests"
          name="max_guests"
          type="number"
          min={1}
          max={10}
          required
          defaultValue={room?.max_guests}
        />
        <SelectField label="Bed type" name="bed_type" defaultValue={room?.bed_type ?? "queen"}>
          <option value="queen">Queen</option>
          <option value="king">King</option>
          <option value="two_queens">Two queens</option>
          <option value="king_and_queen">King + queen</option>
        </SelectField>
        <InputField
          label="Bed summary"
          name="bed_summary"
          required
          placeholder="e.g. 1 king, 1 queen + sofa bed"
          defaultValue={room?.bed_summary}
        />
        <InputField
          label="Room size (m²)"
          name="room_size"
          type="number"
          min={10}
          max={500}
          required
          defaultValue={room?.room_size}
        />
      </div>

      <FieldWrapper label="Amenities" htmlFor="amenity-grid">
        <div id="amenity-grid" className="grid gap-2 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((a) => (
            <label key={a.key} className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={amenities.includes(a.key)}
                onChange={() => toggleAmenity(a.key)}
                className="size-4 rounded border-stone-300 accent-ocean-600"
              />
              {a.label}
            </label>
          ))}
        </div>
      </FieldWrapper>

      <TextareaField
        label="Image paths (one per line)"
        name="images"
        required
        rows={3}
        defaultValue={room?.images.join("\n") ?? "/images/rooms/deluxe-studio/interior.jpg"}
        hint="Paths under /public, e.g. /images/rooms/deluxe-studio/interior.jpg. List the homepage cover image first."
      />

      <div className="flex gap-3">
        <Button type="submit" loading={saving} size="lg">
          {room ? "Save changes" : "Create room"}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => router.push("/admin/rooms")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

import { RoomForm } from "@/components/admin/RoomForm";

export default function NewRoomPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold text-stone-900">Add room</h1>
      <p className="mt-1 text-sm text-stone-500">
        New rooms appear on the site immediately when set to active.
      </p>
      <div className="mt-8">
        <RoomForm />
      </div>
    </div>
  );
}

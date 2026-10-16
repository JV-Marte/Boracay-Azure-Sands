import { notFound } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";
import { getRoomById } from "@/services/rooms";

export const dynamic = "force-dynamic";

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-medium text-ink-900">
        Edit · {room.name}
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Changes go live immediately. Existing bookings keep their original price.
      </p>
      <div className="mt-8">
        <RoomForm room={room} />
      </div>
    </div>
  );
}

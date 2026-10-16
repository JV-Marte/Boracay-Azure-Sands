import { BedDouble, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";
import { RoomRowActions } from "@/components/admin/RoomRowActions";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPHP } from "@/lib/utils";
import { listRooms } from "@/services/rooms";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const rooms = await listRooms({ includeInactive: true });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-900">Rooms</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage inventory, pricing, photos, and availability status.
          </p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ocean-600 px-5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-ocean-700"
        >
          <Plus className="size-4" aria-hidden />
          Add room
        </Link>
      </div>

      <div className="mt-8">
        {rooms.length === 0 ? (
          <EmptyState
            icon={BedDouble}
            title="No rooms yet"
            description="Add your first room to start taking bookings."
          />
        ) : (
          <AdminTable
            caption="All rooms"
            headers={["Room", "Type", "Price / night", "Capacity", "Size", "Status", "Actions"]}
          >
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-sand-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={room.images[0] ?? "/images/property-exterior.jpg"}
                      alt=""
                      width={64}
                      height={48}
                      className="aspect-[4/3] w-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-stone-900">{room.name}</p>
                      <p className="text-xs text-stone-400">/rooms/{room.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-stone-600">{room.room_type}</td>
                <td className="px-4 py-3 font-medium text-stone-900">
                  {formatPHP(room.price_per_night)}
                </td>
                <td className="px-4 py-3 text-stone-600">{room.max_guests} guests</td>
                <td className="px-4 py-3 text-stone-600">{room.room_size} m²</td>
                <td className="px-4 py-3">
                  <Badge tone={room.status === "active" ? "green" : "neutral"}>
                    {room.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <RoomRowActions room={room} />
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </div>
    </div>
  );
}

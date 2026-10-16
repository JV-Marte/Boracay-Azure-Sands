import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { listRooms } from "@/services/rooms";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await listRooms();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/rooms`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const roomPages: MetadataRoute.Sitemap = rooms.map((room) => ({
    url: `${SITE.url}/rooms/${room.slug}`,
    lastModified: new Date(room.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...roomPages];
}

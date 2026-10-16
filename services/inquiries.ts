import { randomUUID } from "crypto";
import { getMemoryStore } from "@/lib/data/memory-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { ServiceError } from "@/services/errors";
import type { Inquiry, InquiryStatus } from "@/types";

export async function createInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<Inquiry> {
  const inquiry: Inquiry = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    message: input.message,
    status: "new",
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("inquiries")
      .insert(inquiry)
      .select()
      .single();
    if (error) throw new ServiceError("Could not send your message. Please try again.", 500);
    return data as Inquiry;
  }
  getMemoryStore().inquiries.push(inquiry);
  return inquiry;
}

export async function listInquiries(): Promise<Inquiry[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new ServiceError("Could not load inquiries.", 500);
    return data as Inquiry[];
  }
  return [...getMemoryStore().inquiries].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from("inquiries").update({ status }).eq("id", id);
    if (error) throw new ServiceError("Could not update the inquiry.", 500);
    return;
  }
  const inquiry = getMemoryStore().inquiries.find((i) => i.id === id);
  if (!inquiry) throw new ServiceError("Inquiry not found.", 404);
  inquiry.status = status;
}

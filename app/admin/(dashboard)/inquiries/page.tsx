import { InquiryManager } from "@/components/admin/InquiryManager";
import { listInquiries } from "@/services/inquiries";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await listInquiries();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold text-stone-900">Inquiries</h1>
      <p className="mt-1 text-sm text-stone-500">
        Messages from the contact form. Reply by email, then mark them resolved.
      </p>
      <div className="mt-8">
        <InquiryManager inquiries={inquiries} />
      </div>
    </div>
  );
}

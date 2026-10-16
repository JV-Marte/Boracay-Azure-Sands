import { SITE } from "@/lib/constants";
import { formatDateLong, formatPHP } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/lib/payments";
import type { Booking, Room } from "@/types";

/** Plain-HTML confirmation email that renders well in every client. */
export function buildBookingConfirmationHtml(booking: Booking, room: Room | null): string {
  const rows: Array<[string, string]> = [
    ["Booking reference", booking.booking_reference],
    ["Room", room?.name ?? "Suite"],
    ["Check-in", `${formatDateLong(booking.check_in)} · from ${SITE.checkInTime}`],
    ["Check-out", `${formatDateLong(booking.check_out)} · by ${SITE.checkOutTime}`],
    ["Guests", String(booking.guest_count)],
    ["Payment method", PAYMENT_METHOD_LABELS[booking.payment_method]],
    ["Payment status", booking.payment_status],
  ];

  const money: Array<[string, string]> = [
    ["Room subtotal", formatPHP(booking.subtotal)],
    ...(booking.discount > 0
      ? ([["Discount", `−${formatPHP(booking.discount)}`]] as Array<[string, string]>)
      : []),
    ["Fees (cleaning + service)", formatPHP(booking.fees)],
    ["Taxes (12% VAT)", formatPHP(booking.taxes)],
    ["Total", formatPHP(booking.total)],
  ];

  const rowHtml = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:8px 0;color:#57534e;font-size:14px;">${label}</td>
      <td style="padding:8px 0;color:${strong ? "#1c3e4e" : "#292524"};font-size:14px;font-weight:${strong ? "700" : "500"};text-align:right;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#faf8f4;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background:#1c3e4e;border-radius:16px 16px 0 0;padding:28px 32px;">
        <p style="margin:0;color:#b3dbe6;font-size:12px;letter-spacing:2px;text-transform:uppercase;">${SITE.name}</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;">Your island stay is booked 🌴</h1>
      </div>
      <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:28px 32px;border:1px solid #e7e5e4;border-top:0;">
        <p style="color:#292524;font-size:15px;line-height:1.6;">
          Hi ${booking.guest_name},<br/>
          Salamat! Your booking is <strong>received and pending confirmation</strong>.
          We'll confirm it shortly — keep your reference handy.
        </p>
        <div style="background:#eef7f9;border-radius:12px;padding:14px 18px;margin:20px 0;text-align:center;">
          <span style="font-size:13px;color:#1d5970;">Booking reference</span><br/>
          <span style="font-size:22px;font-weight:700;letter-spacing:2px;color:#1c3e4e;">${booking.booking_reference}</span>
        </div>
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          ${rows.map(([l, v]) => rowHtml(l, v)).join("")}
        </table>
        <hr style="border:none;border-top:1px solid #e7e5e4;margin:16px 0;"/>
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          ${money.map(([l, v], i) => rowHtml(l, v, i === money.length - 1)).join("")}
        </table>
        ${
          booking.special_requests
            ? `<p style="color:#57534e;font-size:13px;margin-top:16px;"><strong>Special requests:</strong> ${booking.special_requests}</p>`
            : ""
        }
        <p style="color:#57534e;font-size:13px;line-height:1.6;margin-top:20px;">
          Manage or cancel this booking any time at
          <a href="${SITE.url}/manage-booking" style="color:#1f6d88;">${SITE.url.replace(/^https?:\/\//, "")}/manage-booking</a>
          using your reference and email.
        </p>
        <p style="color:#a8a29e;font-size:12px;line-height:1.6;margin-top:24px;">
          ${SITE.address}<br/>${SITE.phone} · ${SITE.email}
        </p>
      </div>
    </div>
  </body>
</html>`;
}

/**
 * Send the confirmation email via Resend when RESEND_API_KEY is set;
 * otherwise log to the server console (demo mode). Never throws — a failed
 * email must not fail the booking.
 */
export async function sendBookingConfirmation(
  booking: Booking,
  room: Room | null,
): Promise<{ sent: boolean }> {
  const subject = `Booking ${booking.booking_reference} — ${SITE.shortName}, Boracay`;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(
      `[email:demo] Would send "${subject}" to ${booking.guest_email}. Set RESEND_API_KEY to send real emails.`,
    );
    return { sent: false };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Azure Sands <onboarding@resend.dev>",
      to: booking.guest_email,
      subject,
      html: buildBookingConfirmationHtml(booking, room),
    });
    if (error) {
      console.error("Resend error:", error);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
    return { sent: false };
  }
}

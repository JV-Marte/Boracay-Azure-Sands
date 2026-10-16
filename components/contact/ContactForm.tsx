"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { InputField, TextareaField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { contactSchema } from "@/lib/validation/schemas";

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Could not send your message.");
      }
      setSent(true);
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : "Network error — please check your connection and try again.",
        "error",
      );
    }
  });

  if (sent) {
    return (
      <div
        className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center"
        role="status"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100">
          <MailCheck className="size-6 text-emerald-700" aria-hidden />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-emerald-900">
          Message sent — salamat!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-emerald-800">
          We usually reply within a few hours during front desk time (7 AM –
          10 PM GMT+8). For anything urgent, call or WhatsApp us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="Your name"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <InputField
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <InputField
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        hint="Include your country code for WhatsApp/Viber callbacks."
        error={errors.phone?.message}
        {...register("phone")}
      />
      <TextareaField
        label="How can we help?"
        required
        rows={5}
        placeholder="Dates, room questions, transfers, special occasions…"
        error={errors.message?.message}
        {...register("message")}
      />
      <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
        <Send className="size-4" aria-hidden />
        Send message
      </Button>
    </form>
  );
}

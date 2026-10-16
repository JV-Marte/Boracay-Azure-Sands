"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/Field";

export function TrackOrderForm() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/cafe/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not find that order.");
      router.push(`/cafe/orders/${body.reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <InputField
        label="Order reference"
        placeholder="ASC-7KQ2MX9C"
        required
        value={reference}
        onChange={(e) => setReference(e.target.value.toUpperCase())}
      />
      <InputField
        label="Mobile number on the order"
        type="tel"
        placeholder="+63 9XX XXX XXXX"
        hint="For room-charge orders, use the phone number on your booking."
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        loading={loading}
        className="w-full bg-sunset-500 hover:bg-sunset-600 active:bg-sunset-700 sm:w-auto"
      >
        <Search className="size-4" aria-hidden />
        Find my order
      </Button>
    </form>
  );
}

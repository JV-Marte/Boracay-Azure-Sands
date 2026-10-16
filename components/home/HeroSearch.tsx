"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { InputField, SelectField } from "@/components/ui/Field";
import { searchSchema } from "@/lib/validation/schemas";

type SearchForm = z.infer<typeof searchSchema>;

export function HeroSearch() {
  const router = useRouter();
  const today = format(new Date(), "yyyy-MM-dd");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>({
    // Cast needed because z.coerce makes the schema's input type `unknown`
    resolver: zodResolver(searchSchema) as Resolver<SearchForm>,
    defaultValues: {
      checkIn: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      checkOut: format(addDays(new Date(), 10), "yyyy-MM-dd"),
      guests: 2,
    },
  });

  const checkIn = watch("checkIn");

  const onSubmit = handleSubmit((data) => {
    const params = new URLSearchParams({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: String(data.guests),
    });
    router.push(`/rooms?${params.toString()}`);
  });

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Check availability"
      className="grid gap-3 rounded-2xl bg-white/95 p-4 shadow-lift backdrop-blur-sm sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end"
    >
      <InputField
        label="Check-in"
        type="date"
        min={today}
        error={errors.checkIn?.message}
        {...register("checkIn")}
      />
      <InputField
        label="Check-out"
        type="date"
        min={checkIn || today}
        error={errors.checkOut?.message}
        {...register("checkOut")}
      />
      <SelectField
        label="Guests"
        error={errors.guests?.message}
        wrapperClassName="lg:w-36"
        {...register("guests")}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} {n === 1 ? "guest" : "guests"}
          </option>
        ))}
      </SelectField>
      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        className="w-full self-end lg:w-auto"
      >
        <Search className="size-4" aria-hidden />
        Search availability
      </Button>
    </form>
  );
}

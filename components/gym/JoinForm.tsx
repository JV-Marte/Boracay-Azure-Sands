"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { InputField, SelectField, TextareaField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { GYM_PLANS } from "@/lib/data/gym";
import { formatPHP, todayISO } from "@/lib/utils";
import { gymSignupSchema, type GymSignupRequest } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

const PERIOD_LABEL: Record<string, string> = {
  visit: "per visit",
  day: "per day",
  month: "per month",
  quarter: "per quarter",
  year: "per year",
};

export function JoinForm({ defaultPlanId }: { defaultPlanId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GymSignupRequest>({
    resolver: zodResolver(gymSignupSchema) as Resolver<GymSignupRequest>,
    defaultValues: {
      planId: defaultPlanId,
      preferredStart: todayISO(),
      isHotelGuest: false,
      goal: "",
    },
  });

  const selectedPlanId = watch("planId");
  const selectedPlan = GYM_PLANS.find((p) => p.id === selectedPlanId);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/gym/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not save your sign-up.");
      router.push(`/gym/join/confirmation/${body.reference}`);
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : "Network error — please check your connection and try again.",
        "error",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <fieldset>
        <legend className="text-sm font-medium text-stone-800">Choose your membership</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {GYM_PLANS.map((plan) => {
            const active = plan.id === selectedPlanId;
            return (
              <label
                key={plan.id}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-xl border p-4 transition-colors",
                  active
                    ? "border-ember-500 bg-ember-50 ring-1 ring-ember-500"
                    : "border-stone-300 bg-white hover:border-stone-400",
                )}
              >
                <input
                  type="radio"
                  value={plan.id}
                  checked={active}
                  onChange={() => setValue("planId", plan.id, { shouldValidate: true })}
                  className="sr-only"
                  name="planId"
                />
                <span className="flex items-start justify-between gap-2">
                  <span className="font-medium text-stone-900">{plan.name}</span>
                  {active && <Check className="size-4 shrink-0 text-ember-600" aria-hidden />}
                </span>
                <span className="mt-1 text-sm text-stone-500">
                  {formatPHP(plan.price)}{" "}
                  <span className="text-stone-400">
                    {PERIOD_LABEL[plan.billing_period] ?? plan.billing_period}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {errors.planId && (
          <p className="mt-2 text-xs font-medium text-red-600" role="alert">
            {errors.planId.message}
          </p>
        )}
      </fieldset>

      {selectedPlan && (
        <div className="rounded-xl bg-stone-50 p-4">
          <p className="text-sm font-medium text-stone-900">
            {selectedPlan.name} — {formatPHP(selectedPlan.price)}{" "}
            {PERIOD_LABEL[selectedPlan.billing_period] ?? selectedPlan.billing_period}
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {selectedPlan.perks.map((perk) => (
              <li key={perk} className="flex gap-2 text-sm text-stone-600">
                <Check className="mt-0.5 size-3.5 shrink-0 text-ember-600" aria-hidden />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="Full name"
          autoComplete="name"
          required
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <InputField
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <InputField
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          placeholder="+63 9XX XXX XXXX"
          required
          error={errors.phone?.message}
          {...register("phone")}
        />
        <InputField
          label="Preferred start date"
          type="date"
          min={todayISO()}
          required
          error={errors.preferredStart?.message}
          {...register("preferredStart")}
        />
      </div>

      <SelectField
        label="Are you staying at Azure Sands Boracay?"
        hint="Hotel guests get the resident rate and can charge the gym to their room."
        {...register("isHotelGuest", { setValueAs: (v) => v === "true" })}
      >
        <option value="false">No — I live or work on the island</option>
        <option value="true">Yes — I&apos;m an Azure Sands guest</option>
      </SelectField>

      <TextareaField
        label="What are you training for? (optional)"
        rows={4}
        placeholder="Getting back into lifting, prepping for a race, Zumba twice a week…"
        error={errors.goal?.message}
        {...register("goal")}
      />

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        className="w-full bg-ember-500 hover:bg-ember-600 active:bg-ember-700 sm:w-auto"
      >
        Submit sign-up
        <ArrowRight className="size-4" aria-hidden />
      </Button>
      <p className="text-xs leading-relaxed text-stone-500">
        Submitting this form reserves your rate — nothing is charged online. A coach calls you
        within one business day to confirm your start date and take payment at the desk.
      </p>
    </form>
  );
}

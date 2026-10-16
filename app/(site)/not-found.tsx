import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <div className="flex size-14 items-center justify-center rounded-full bg-ocean-50">
        <Compass className="size-7 text-ocean-600" aria-hidden />
      </div>
      <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink-900 text-balance">
        Looks like you drifted off course
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-500">
        The page you’re looking for doesn’t exist — but the beach is always
        where you left it.
      </p>
      <div className="mt-10 flex gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/rooms" variant="outline">
          Browse rooms
        </ButtonLink>
      </div>
    </div>
  );
}

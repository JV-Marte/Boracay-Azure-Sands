import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <div className="flex size-14 items-center justify-center rounded-full bg-ocean-50">
        <Compass className="size-7 text-ocean-600" aria-hidden />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-stone-900">
        Looks like you drifted off course
      </h1>
      <p className="mt-3 max-w-md text-lg text-stone-500">
        The page you’re looking for doesn’t exist â but the beach is always
        where you left it.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/rooms" variant="outline">
          Browse rooms
        </ButtonLink>
      </div>
    </div>
  );
}

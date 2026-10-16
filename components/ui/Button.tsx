import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "sunset"
  | "light"
  | "glass";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-ink-900 text-sand-50 hover:bg-ocean-800 active:bg-ocean-900",
  secondary: "bg-ocean-50 text-ocean-800 hover:bg-ocean-100 active:bg-ocean-200",
  outline:
    "border border-ink-900/15 bg-transparent text-ink-900 hover:border-ink-900 active:bg-sand-100",
  ghost: "text-stone-700 hover:bg-sand-100 active:bg-sand-200",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  // Lagoon accent: dark text on a light teal — the hero/CTA action on dark grounds
  sunset: "bg-ocean-300 text-ink-950 hover:bg-ocean-200 active:bg-ocean-400",
  light: "bg-sand-50 text-ink-950 hover:bg-white active:bg-sand-100",
  glass:
    "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-14 px-8 text-base gap-2.5",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-medium tracking-[-0.005em] transition-[color,background-color,border-color,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  prefetch?: boolean;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  prefetch,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Link>
  );
}

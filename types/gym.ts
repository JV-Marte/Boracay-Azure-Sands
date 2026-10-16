/** Azure Sands Fitness domain types. */

export type GymBillingPeriod = "visit" | "day" | "month" | "quarter" | "year";

export interface GymPlan {
  id: string;
  name: string;
  slug: string;
  price: number; // whole PHP
  billing_period: GymBillingPeriod;
  description: string;
  perks: string[];
  /** Highlighted in the pricing grid. */
  featured?: boolean;
  badge?: string;
}

export type ClassIntensity = "low" | "moderate" | "high";

export interface GymClass {
  id: string;
  name: string;
  /** 0 = Sunday … 6 = Saturday, matching Date#getDay(). */
  day: number;
  start_time: string; // "HH:mm", 24-hour
  duration_min: number;
  trainer_id: string;
  intensity: ClassIntensity;
  capacity: number;
  description: string;
}

export interface GymTrainer {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  certification: string;
  image: string;
}

export type GymSignupStatus = "new" | "contacted" | "enrolled" | "declined";

export interface GymSignup {
  id: string;
  reference: string;
  plan_id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_start: string; // yyyy-MM-dd
  goal: string | null;
  is_hotel_guest: boolean;
  status: GymSignupStatus;
  created_at: string;
  updated_at: string;
}

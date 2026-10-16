import {
  Bike,
  Clock,
  Dumbbell,
  Droplets,
  Footprints,
  HeartPulse,
  Lock,
  Music,
  ShieldCheck,
  ShowerHead,
  Snowflake,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { GYM } from "@/lib/constants";
import type { Faq, GymClass, GymPlan, GymTrainer } from "@/types";

/** Facility registry — same key/label/icon shape as lib/data/amenities.ts. */
export interface FacilityDef {
  key: string;
  label: string;
  icon: LucideIcon;
  featured?: boolean;
  description?: string;
}

export const GYM_FACILITIES: FacilityDef[] = [
  {
    key: "free_weights",
    label: "Free weights",
    icon: Dumbbell,
    featured: true,
    description:
      "Dumbbells from 2 kg to 50 kg, two squat racks, an olympic bench, and a full set of bumper plates.",
  },
  {
    key: "cardio_deck",
    label: "Cardio deck",
    icon: HeartPulse,
    featured: true,
    description:
      "Treadmills, upright and recumbent bikes, and two rowers facing the windows over the garden.",
  },
  {
    key: "functional_turf",
    label: "Functional turf zone",
    icon: Footprints,
    featured: true,
    description:
      "Sled track, kettlebells, battle ropes, plyo boxes, and a rig for TRX and pull-up work.",
  },
  {
    key: "group_studio",
    label: "Group class studio",
    icon: Music,
    featured: true,
    description:
      "Mirrored studio with a sound system — HIIT, yoga, Zumba, and Muay Thai conditioning six days a week.",
  },
  {
    key: "coaching",
    label: "Certified coaches",
    icon: Users,
    featured: true,
    description:
      "Three resident coaches on the floor. Your first form check and programme walkthrough are free.",
  },
  {
    key: "aircon",
    label: "Fully air-conditioned",
    icon: Snowflake,
    featured: true,
    description: "The whole floor is cooled — a real consideration on Boracay at 2 PM.",
  },
  {
    key: "showers",
    label: "Showers & lockers",
    icon: ShowerHead,
    featured: true,
    description: "Hot showers, day lockers, and fresh towels included with every visit.",
  },
  {
    key: "hours",
    label: "5 AM – 11 PM daily",
    icon: Clock,
    featured: true,
    description: "Open before the sunrise run along White Beach and long after the sunset sail comes in.",
  },
  { key: "towel_service", label: "Towel service", icon: Droplets },
  { key: "day_lockers", label: "Day lockers", icon: Lock },
  { key: "wifi", label: "Free Wi-Fi", icon: Wifi },
  { key: "spin", label: "Spin bikes", icon: Bike },
  { key: "security", label: "Keycard access & CCTV", icon: ShieldCheck },
];

const facilitiesByKey = new Map(GYM_FACILITIES.map((f) => [f.key, f]));

export function getFacility(key: string): FacilityDef {
  return (
    facilitiesByKey.get(key) ?? { key, label: key.replace(/_/g, " "), icon: Dumbbell }
  );
}

export const GYM_PLANS: GymPlan[] = [
  {
    id: "plan-day-pass",
    name: "Day Pass",
    slug: "day-pass",
    price: 250,
    billing_period: "visit",
    description: "Walk in, train, shower, go. No commitment, no sign-up fee.",
    perks: [
      "Full access to every zone",
      "Towel and day locker included",
      "Join any group class running that day",
    ],
  },
  {
    id: "plan-hotel-guest",
    name: "Hotel Guest Rate",
    slug: "hotel-guest",
    price: 150,
    billing_period: "day",
    description:
      "Staying upstairs? Show your room key at reception for the guest rate.",
    perks: [
      "Discounted daily access for Azure Sands guests",
      "Charge it to your room instead of paying at the desk",
      "Towel, locker, and drinking water included",
    ],
    badge: "For hotel guests",
  },
  {
    id: "plan-monthly",
    name: "Monthly",
    slug: "monthly",
    price: 1500,
    billing_period: "month",
    description: "The everyday membership. Unlimited access, all classes included.",
    perks: [
      "Unlimited access, 5 AM to 11 PM",
      "All group classes included",
      "Free onboarding session with a coach",
      "Bring a guest once a month",
    ],
    featured: true,
    badge: "Most popular",
  },
  {
    id: "plan-quarterly",
    name: "Quarterly",
    slug: "quarterly",
    price: 4000,
    billing_period: "quarter",
    description: "Three months up front — about ₱1,333 a month.",
    perks: [
      "Everything in Monthly",
      "One free body-composition check per quarter",
      "Membership freeze for up to 2 weeks",
    ],
  },
  {
    id: "plan-annual",
    name: "Annual",
    slug: "annual",
    price: 13500,
    billing_period: "year",
    description: "The best rate we offer — works out to ₱1,125 a month.",
    perks: [
      "Everything in Quarterly",
      "Two free personal-training sessions",
      "Azure Sands Fitness shirt and shaker",
      "Locked-in rate on renewal",
    ],
    badge: "Best value",
  },
  {
    id: "plan-student",
    name: "Student Monthly",
    slug: "student-monthly",
    price: 1100,
    billing_period: "month",
    description: "For students with a valid school ID from any Aklan or Malay campus.",
    perks: [
      "Unlimited access, 5 AM to 11 PM",
      "All group classes included",
      "Valid school ID required at sign-up",
    ],
  },
];

const plansById = new Map(GYM_PLANS.map((p) => [p.id, p]));

export function getGymPlan(id: string): GymPlan | undefined {
  return plansById.get(id);
}

export const GYM_TRAINERS: GymTrainer[] = [
  {
    id: "coach-marlon",
    name: "Marlon Sarmiento",
    specialty: "Strength & powerlifting",
    bio: "Fifteen years under the bar and eight coaching on the island. Marlon rebuilds messy deadlifts and gets nervous beginners comfortable in the free-weight area — usually within a week.",
    certification: "NASM-CPT · Philippine Weightlifting Association Level 2",
    image: "/images/gym/trainers/marlon.jpg",
  },
  {
    id: "coach-jhona",
    name: "Jhona Ricafort",
    specialty: "HIIT, Zumba & group fitness",
    bio: "Jhona runs the loudest, most-attended hour in the building. She started teaching Zumba on the beachfront in 2018 and has never taught a quiet class since.",
    certification: "Zumba Basic 1 & 2 · ACE Group Fitness Instructor",
    image: "/images/gym/trainers/jhona.jpg",
  },
  {
    id: "coach-dexter",
    name: "Dexter Villanueva",
    specialty: "Conditioning & Muay Thai",
    bio: "Former amateur fighter out of Iloilo. Dexter's conditioning block is the reason half the members can suddenly run the length of White Beach without stopping.",
    certification: "IFBB Fitness Coach · First Aid & CPR certified",
    image: "/images/gym/trainers/dexter.jpg",
  },
];

const trainersById = new Map(GYM_TRAINERS.map((t) => [t.id, t]));

export function getTrainer(id: string): GymTrainer | undefined {
  return trainersById.get(id);
}

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Weekly timetable. day: 0 = Sunday … 6 = Saturday (matches Date#getDay()). */
export const GYM_CLASSES: GymClass[] = [
  {
    id: "cls-mon-hiit",
    name: "Sunrise HIIT",
    day: 1,
    start_time: "06:00",
    duration_min: 45,
    trainer_id: "coach-jhona",
    intensity: "high",
    capacity: 18,
    description: "Twenty minutes of intervals bookended by a real warm-up and a real cool-down.",
  },
  {
    id: "cls-mon-strength",
    name: "Strength Basics",
    day: 1,
    start_time: "18:00",
    duration_min: 60,
    trainer_id: "coach-marlon",
    intensity: "moderate",
    capacity: 12,
    description: "Squat, hinge, press, pull. Technique first, load second. Beginners welcome.",
  },
  {
    id: "cls-tue-zumba",
    name: "Zumba",
    day: 2,
    start_time: "18:30",
    duration_min: 60,
    trainer_id: "coach-jhona",
    intensity: "moderate",
    capacity: 25,
    description: "An hour of dance cardio. No coordination required, only enthusiasm.",
  },
  {
    id: "cls-tue-muaythai",
    name: "Muay Thai Conditioning",
    day: 2,
    start_time: "06:30",
    duration_min: 60,
    trainer_id: "coach-dexter",
    intensity: "high",
    capacity: 14,
    description: "Pads, bags, and footwork. Fight conditioning without the sparring.",
  },
  {
    id: "cls-wed-spin",
    name: "Spin Express",
    day: 3,
    start_time: "06:00",
    duration_min: 40,
    trainer_id: "coach-jhona",
    intensity: "high",
    capacity: 12,
    description: "Forty minutes on the bike with hill climbs and sprints. In and out before work.",
  },
  {
    id: "cls-wed-yoga",
    name: "Evening Yoga Flow",
    day: 3,
    start_time: "19:00",
    duration_min: 60,
    trainer_id: "coach-jhona",
    intensity: "low",
    capacity: 20,
    description: "Vinyasa-style flow to unwind. Mats provided.",
  },
  {
    id: "cls-thu-strength",
    name: "Strength Basics",
    day: 4,
    start_time: "18:00",
    duration_min: 60,
    trainer_id: "coach-marlon",
    intensity: "moderate",
    capacity: 12,
    description: "The Monday session repeated for people whose Mondays never cooperate.",
  },
  {
    id: "cls-thu-core",
    name: "Core & Mobility",
    day: 4,
    start_time: "06:30",
    duration_min: 45,
    trainer_id: "coach-dexter",
    intensity: "low",
    capacity: 18,
    description: "Anti-rotation work, hip mobility, and the shoulder drills desk workers need.",
  },
  {
    id: "cls-fri-hiit",
    name: "Sunrise HIIT",
    day: 5,
    start_time: "06:00",
    duration_min: 45,
    trainer_id: "coach-jhona",
    intensity: "high",
    capacity: 18,
    description: "Same format as Monday, different circuit. Bring a towel.",
  },
  {
    id: "cls-fri-boxing",
    name: "Boxing Bootcamp",
    day: 5,
    start_time: "18:30",
    duration_min: 60,
    trainer_id: "coach-dexter",
    intensity: "high",
    capacity: 14,
    description: "Rounds on the bag mixed with bodyweight conditioning. Wraps available at the desk.",
  },
  {
    id: "cls-sat-openbox",
    name: "Saturday Open Gym Clinic",
    day: 6,
    start_time: "08:00",
    duration_min: 120,
    trainer_id: "coach-marlon",
    intensity: "moderate",
    capacity: 20,
    description: "A coach on the floor for two hours. Ask anything, get your lifts filmed and fixed.",
  },
  {
    id: "cls-sat-zumba",
    name: "Zumba",
    day: 6,
    start_time: "16:00",
    duration_min: 60,
    trainer_id: "coach-jhona",
    intensity: "moderate",
    capacity: 25,
    description: "The weekend session. Reliably the fullest class of the week.",
  },
  {
    id: "cls-sat-mobility",
    name: "Recovery & Stretch",
    day: 6,
    start_time: "17:30",
    duration_min: 45,
    trainer_id: "coach-dexter",
    intensity: "low",
    capacity: 20,
    description: "Foam rolling, guided stretching, and breathing work to close out the week.",
  },
];

export const GYM_FAQS: Faq[] = [
  {
    question: "Do I need to be a hotel guest to use the gym?",
    answer: `No. ${GYM.name} is open to island residents and day visitors too. Walk-ins pay a ₱250 day pass; Azure Sands guests get the ₱150 rate on presentation of a room key.`,
    category: "Access",
  },
  {
    question: "What are your opening hours?",
    answer: `${GYM.hoursLabel}. Keycard access means the floor stays open even when the front desk is quiet, and there is always staff in the building.`,
    category: "Access",
  },
  {
    question: "Are group classes included in a membership?",
    answer:
      "Yes — every class on the weekly timetable is included in Monthly, Quarterly, Annual, and Student memberships. Day-pass holders can join any class running during their visit at no extra cost.",
    category: "Classes",
  },
  {
    question: "I have never trained before. Where do I start?",
    answer:
      "Book a Monthly membership and claim your free onboarding session — a coach walks you through every machine, sets your starting loads, and writes you a first four-week programme. Strength Basics on Monday and Thursday evenings is the other good entry point.",
    category: "Classes",
  },
  {
    question: "Can I freeze my membership?",
    answer:
      "Quarterly and Annual members can freeze for up to two weeks per term — useful if you are travelling or recovering from an injury. Just tell the front desk before you go.",
    category: "Membership",
  },
  {
    question: "Is there parking?",
    answer:
      "Yes, free parking is available in the Azure Sands lot off White Beach Path for the duration of your session.",
    category: "Access",
  },
  {
    question: "Do you have showers and lockers?",
    answer:
      "Hot showers, day lockers, and a fresh towel come with every visit, membership or day pass. Bring your own padlock or borrow one at the desk.",
    category: "Facilities",
  },
];

export const GYM_TESTIMONIALS = [
  {
    name: "Rico Delgado",
    detail: "Member since 2024",
    quote:
      "I joined for the aircon, honestly. Stayed because Coach Marlon fixed a deadlift I'd been doing wrong for four years.",
  },
  {
    name: "Aileen Bautista",
    detail: "Zumba regular, Balabag",
    quote:
      "Jhona's Saturday class is the highlight of my week. My sister visits from Iloilo and asks to come with me.",
  },
  {
    name: "Tom Reyner",
    detail: "Hotel guest, Australia",
    quote:
      "Off the boat, checked in, and on a treadmill twenty minutes later for ₱150. Better setup than the gym I pay a monthly fee for at home.",
  },
];

export type FamilyMember = "david" | "katie" | "alex" | "sebastian" | "evangeline";

export const FAMILY_COLORS: Record<FamilyMember, string> = {
  david: "#d4af37",
  katie: "#2d7d46",
  alex: "#e67e22",
  sebastian: "#c1292e",
  evangeline: "#7b2d8f",
};

export const FAMILY_INITIALS: Record<FamilyMember, string> = {
  david: "D",
  katie: "M", // "M" for Mom in bedtime chips
  alex: "A",
  sebastian: "S",
  evangeline: "E",
};

export interface BedtimePair {
  child: Exclude<FamilyMember, "david" | "katie">;
  parent: "david" | "katie";
}

export interface DayBanner {
  text: string;
  familyMember: FamilyMember;
}

export interface DaySection {
  title: string;
  content: string; // line breaks via \n
}

export interface DayPlan {
  dayName: string;
  date: string;
  banner?: DayBanner;
  sections: DaySection[];
  bedtime?: BedtimePair[];
}

export interface WeeklyPlanData {
  weekDates: string;
  weekdays: DayPlan[]; // Mon–Fri (5 items)
  weekendBanner?: DayBanner;
  saturday: DayPlan;
  sunday: DayPlan;
  lunchSnacks: string;
  lookAhead: string;
}

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

export type Parent = "david" | "katie";
export type Child = Exclude<FamilyMember, Parent>;

export interface BedtimePair {
  child: Child;
  parent: Parent;
}

export const BANNER_COLORS: Record<string, string> = {
  ...FAMILY_COLORS,
  school: "#337ab7",
};

export type BannerColorKey = FamilyMember | "school";

export interface DayBanner {
  text: string;
  familyMember: BannerColorKey;
}

export interface DaySection {
  title: string;
  content: string[];
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
  weekdays: [DayPlan, DayPlan, DayPlan, DayPlan, DayPlan];
  weekendBanner?: DayBanner;
  saturday: DayPlan;
  sunday: DayPlan;
  lunchSnacks: string[];
  lookAhead: string[];
}

import Head from "next/head";
import React, { useMemo, useState } from "react";
import BottomSection from "../../components/weekly-plan/BottomSection";
import FamilyLegend from "../../components/weekly-plan/FamilyLegend";
import WeekGrid from "../../components/weekly-plan/WeekGrid";
import {
  Child,
  FAMILY_COLORS,
  Parent,
  WeeklyPlanData,
} from "../../lib/weekly-plan-types";

// ---------------------------------------------------------------------------
// Error Boundary — wraps only the rendered plan output
// ---------------------------------------------------------------------------

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class PlanErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, unknown>>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<Record<string, unknown>>) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("PlanErrorBoundary caught:", error, info.componentStack);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 text-sm text-center py-8">
          <p>Something went wrong rendering the plan. Please check your JSON and try again.</p>
          {this.state.errorMessage && (
            <p className="mt-2 font-mono text-xs">{this.state.errorMessage}</p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const VALID_PARENTS = new Set<string>(["david", "katie"] satisfies Parent[]);
const VALID_CHILDREN = new Set<string>(
  ["alex", "sebastian", "evangeline"] satisfies Child[]
);

function validateDayPlan(day: unknown, label: string): string | null {
  if (typeof day !== "object" || day === null) {
    return `${label} must be an object.`;
  }

  const d = day as Record<string, unknown>;

  if (typeof d.dayName !== "string") {
    return `${label}.dayName must be a string.`;
  }
  if (typeof d.date !== "string") {
    return `${label}.date must be a string.`;
  }
  if (!Array.isArray(d.sections)) {
    return `${label}.sections must be an array.`;
  }

  for (let i = 0; i < (d.sections as unknown[]).length; i++) {
    const section = (d.sections as unknown[])[i];
    if (typeof section !== "object" || section === null) {
      return `${label}.sections[${i}] must be an object.`;
    }
    const s = section as Record<string, unknown>;
    if (typeof s.title !== "string") {
      return `${label}.sections[${i}].title must be a string.`;
    }
    if (typeof s.content !== "string") {
      return `${label}.sections[${i}].content must be a string.`;
    }
  }

  if (d.banner !== undefined) {
    if (typeof d.banner !== "object" || d.banner === null) {
      return `${label}.banner must be an object.`;
    }
    const b = d.banner as Record<string, unknown>;
    if (typeof b.text !== "string") {
      return `${label}.banner.text must be a string.`;
    }
    if (typeof b.familyMember !== "string" || !Object.hasOwn(FAMILY_COLORS, b.familyMember)) {
      return `${label}.banner.familyMember must be a valid family member (${Object.keys(FAMILY_COLORS).join(", ")}).`;
    }
  }

  if (d.bedtime !== undefined) {
    if (!Array.isArray(d.bedtime)) {
      return `${label}.bedtime must be an array.`;
    }
    for (let i = 0; i < (d.bedtime as unknown[]).length; i++) {
      const pair = (d.bedtime as unknown[])[i];
      if (typeof pair !== "object" || pair === null) {
        return `${label}.bedtime[${i}] must be an object.`;
      }
      const p = pair as Record<string, unknown>;
      if (typeof p.child !== "string" || !VALID_CHILDREN.has(p.child)) {
        return `${label}.bedtime[${i}].child must be one of: ${[...VALID_CHILDREN].join(", ")}.`;
      }
      if (typeof p.parent !== "string" || !VALID_PARENTS.has(p.parent)) {
        return `${label}.bedtime[${i}].parent must be one of: ${[...VALID_PARENTS].join(", ")}.`;
      }
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const WeeklyPlanPage = (): React.ReactElement => {
  const [jsonInput, setJsonInput] = useState<string>("");

  const { planData, parseError } = useMemo<{
    planData: WeeklyPlanData | null;
    parseError: string | null;
  }>(() => {
    if (!jsonInput.trim()) {
      return { planData: null, parseError: null };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (err) {
      return {
        planData: null,
        parseError: `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`,
      };
    }

    if (typeof parsed !== "object" || parsed === null) {
      return { planData: null, parseError: "JSON must be an object." };
    }

    const data = parsed as Record<string, unknown>;

    if (!Array.isArray(data.weekdays) || data.weekdays.length !== 5) {
      return {
        planData: null,
        parseError: "weekdays must be an array of exactly 5 items (Mon–Fri).",
      };
    }

    if (typeof data.weekDates !== "string") {
      return { planData: null, parseError: "weekDates must be a string." };
    }

    if (typeof data.lunchSnacks !== "string") {
      return { planData: null, parseError: "lunchSnacks must be a string." };
    }

    if (typeof data.lookAhead !== "string") {
      return { planData: null, parseError: "lookAhead must be a string." };
    }

    // Validate each weekday
    for (let i = 0; i < data.weekdays.length; i++) {
      const err = validateDayPlan(data.weekdays[i], `weekdays[${i}]`);
      if (err !== null) {
        return { planData: null, parseError: err };
      }
    }

    // Validate saturday and sunday
    const satErr = validateDayPlan(data.saturday, "saturday");
    if (satErr !== null) {
      return { planData: null, parseError: satErr };
    }

    const sunErr = validateDayPlan(data.sunday, "sunday");
    if (sunErr !== null) {
      return { planData: null, parseError: sunErr };
    }

    // Validate optional weekendBanner
    if (data.weekendBanner !== undefined) {
      if (typeof data.weekendBanner !== "object" || data.weekendBanner === null) {
        return { planData: null, parseError: "weekendBanner must be an object." };
      }
      const wb = data.weekendBanner as Record<string, unknown>;
      if (typeof wb.text !== "string") {
        return { planData: null, parseError: "weekendBanner.text must be a string." };
      }
      if (typeof wb.familyMember !== "string" || !Object.hasOwn(FAMILY_COLORS, wb.familyMember)) {
        return {
          planData: null,
          parseError: `weekendBanner.familyMember must be a valid family member (${Object.keys(FAMILY_COLORS).join(", ")}).`,
        };
      }
    }

    return { planData: parsed as WeeklyPlanData, parseError: null };
  }, [jsonInput]);

  return (
    <>
      <Head>
        <title>Rovani Family Week Planner</title>
      </Head>

      {/* Print page size */}
      <style jsx global>{`
        @page {
          size: letter landscape;
          margin: 0.4in;
        }
      `}</style>

      {/* Input panel — hidden when printing */}
      <div className="weekly-plan-no-print p-4 bg-gray-50 border-b border-gray-200">
        <h1 className="text-lg font-bold mb-2">Rovani Family Week Planner</h1>
        <p className="text-sm text-gray-600 mb-2">
          Paste the weekly plan JSON below, then click Print.
        </p>
        <textarea
          className="w-full h-48 font-mono text-xs border border-gray-300 rounded p-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder='{ "weekDates": "...", "weekdays": [...], ... }'
          value={jsonInput}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setJsonInput(e.target.value)
          }
          spellCheck={false}
        />
        {parseError && (
          <p className="text-red-600 text-xs mt-1">{parseError}</p>
        )}
        <div className="flex gap-2 mt-2">
          <button
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => window.print()}
            disabled={planData === null}
          >
            Print
          </button>
          {jsonInput && (
            <button
              className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              onClick={() => setJsonInput("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Printable area — wrapped in error boundary */}
      <PlanErrorBoundary key={jsonInput}>
        <div className="weekly-plan-print p-4">
          {planData ? (
            <>
              {/* Page header */}
              <div className="flex justify-between items-center mb-1">
                <h1 className="text-sm font-bold">Rovani Family Week</h1>
                <span className="text-sm font-semibold text-gray-600">
                  {planData.weekDates}
                </span>
              </div>

              <FamilyLegend />

              <div className="mt-2">
                <WeekGrid
                  weekdays={planData.weekdays}
                  weekendBanner={planData.weekendBanner}
                  saturday={planData.saturday}
                  sunday={planData.sunday}
                />
              </div>

              <BottomSection
                lunchSnacks={planData.lunchSnacks}
                lookAhead={planData.lookAhead}
              />
            </>
          ) : (
            <div className="weekly-plan-no-print text-gray-400 text-sm text-center py-8">
              Paste valid JSON above to preview the plan.
            </div>
          )}
        </div>
      </PlanErrorBoundary>
    </>
  );
};

export default WeeklyPlanPage;

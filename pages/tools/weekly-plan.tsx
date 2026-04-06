import Head from "next/head";
import React, { useMemo, useState } from "react";
import BottomSection from "../../components/weekly-plan/BottomSection";
import FamilyLegend from "../../components/weekly-plan/FamilyLegend";
import WeekGrid from "../../components/weekly-plan/WeekGrid";
import { WeeklyPlanData } from "../../lib/weekly-plan-types";

const WeeklyPlanPage = (): React.ReactElement => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);

  const planData = useMemo<WeeklyPlanData | null>(() => {
    if (!jsonInput.trim()) {
      setParseError(null);
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (err) {
      setParseError(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }

    if (typeof parsed !== "object" || parsed === null) {
      setParseError("JSON must be an object.");
      return null;
    }

    const data = parsed as Record<string, unknown>;

    if (!Array.isArray(data.weekdays) || data.weekdays.length !== 5) {
      setParseError("weekdays must be an array of exactly 5 items (Mon–Fri).");
      return null;
    }

    if (typeof data.weekDates !== "string") {
      setParseError("weekDates must be a string.");
      return null;
    }

    if (typeof data.saturday !== "object" || data.saturday === null) {
      setParseError("saturday must be an object.");
      return null;
    }

    if (typeof data.sunday !== "object" || data.sunday === null) {
      setParseError("sunday must be an object.");
      return null;
    }

    if (typeof data.lunchSnacks !== "string") {
      setParseError("lunchSnacks must be a string.");
      return null;
    }

    if (typeof data.lookAhead !== "string") {
      setParseError("lookAhead must be a string.");
      return null;
    }

    setParseError(null);
    return parsed as WeeklyPlanData;
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
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
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

      {/* Printable area */}
      <div className="weekly-plan-print p-4">
        {planData ? (
          <>
            {/* Page header */}
            <div className="flex justify-between items-center mb-1">
              <h1 className="text-sm font-bold">Rovani Family Week</h1>
              <span className="text-sm font-semibold text-gray-600">{planData.weekDates}</span>
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
    </>
  );
};

export default WeeklyPlanPage;

import React from "react";
import { DayPlan, FAMILY_COLORS } from "../../lib/weekly-plan-types";
import BedtimeChips from "./BedtimeChips";

interface DayCardProps {
  day: DayPlan;
}

function DayCard({ day }: DayCardProps): React.ReactElement {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 flex flex-col gap-1 h-full">
      {/* Header */}
      <div className="border-b border-gray-300 pb-1 mb-1">
        <span className="text-xs font-bold">{day.dayName}</span>
        <span className="text-xs text-gray-500 ml-1">{day.date}</span>
      </div>

      {/* Banner */}
      {day.banner && (
        <div
          className="text-white text-xs font-semibold px-2 py-0.5 rounded"
          style={{ backgroundColor: FAMILY_COLORS[day.banner.familyMember] }}
        >
          {day.banner.text}
        </div>
      )}

      {/* Sections */}
      <div className="flex flex-col gap-1 flex-1">
        {day.sections.map((section, index) => (
          <div key={index}>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {section.title}
            </div>
            <div className="text-xs">
              {section.content.map((line, lineIndex, arr) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bedtime */}
      {day.bedtime && day.bedtime.length > 0 && (
        <div className="mt-auto pt-1 border-t border-gray-100">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
            Bedtime
          </div>
          <BedtimeChips pairs={day.bedtime} />
        </div>
      )}
    </div>
  );
}

export default DayCard;

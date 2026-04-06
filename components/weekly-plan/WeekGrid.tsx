import React from "react";
import { DayBanner, DayPlan, FAMILY_COLORS } from "../../lib/weekly-plan-types";
import DayCard from "./DayCard";

interface WeekGridProps {
  weekdays: DayPlan[];
  weekendBanner?: DayBanner;
  saturday: DayPlan;
  sunday: DayPlan;
}

const WeekGrid = ({ weekdays, weekendBanner, saturday, sunday }: WeekGridProps): React.ReactElement => {
  return (
    <div
      className="gap-2"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr) 2fr",
      }}
    >
      {/* Weekday columns */}
      {weekdays.map((day, index) => (
        <DayCard key={index} day={day} />
      ))}

      {/* Weekend column */}
      <div className="flex flex-col gap-2">
        {/* Optional weekend spanning banner */}
        {weekendBanner && (
          <div
            className="text-white text-xs font-semibold px-2 py-1 rounded text-center"
            style={{ backgroundColor: FAMILY_COLORS[weekendBanner.familyMember] }}
          >
            {weekendBanner.text}
          </div>
        )}

        {/* Saturday + Sunday two-column grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          <DayCard day={saturday} />
          <DayCard day={sunday} />
        </div>
      </div>
    </div>
  );
};

export default WeekGrid;

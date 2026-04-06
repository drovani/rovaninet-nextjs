import React from "react";
import { FAMILY_COLORS, FamilyMember } from "../../lib/weekly-plan-types";

const FamilyLegend = (): React.ReactElement => {
  const entries = Object.entries(FAMILY_COLORS) as [FamilyMember, string][];

  return (
    <div className="flex flex-row gap-4 justify-center items-center py-1">
      {entries.map(([member, color]) => (
        <div key={member} className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs capitalize font-medium">{member}</span>
        </div>
      ))}
    </div>
  );
};

export default FamilyLegend;

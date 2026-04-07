import React from "react";
import { BedtimePair, FAMILY_COLORS, FAMILY_INITIALS } from "../../lib/weekly-plan-types";

interface BedtimeChipsProps {
  pairs: BedtimePair[];
}

function BedtimeChips({ pairs }: BedtimeChipsProps): React.ReactElement | null {
  if (pairs.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap gap-1 mt-1">
      {pairs.map((pair, index) => (
        <div key={index} className="flex items-center text-white text-xs font-bold">
          <span
            className="px-1.5 py-0.5 rounded-l-full"
            style={{ backgroundColor: FAMILY_COLORS[pair.child] }}
          >
            {FAMILY_INITIALS[pair.child]}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-r-full"
            style={{ backgroundColor: FAMILY_COLORS[pair.parent] }}
          >
            {FAMILY_INITIALS[pair.parent]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default BedtimeChips;

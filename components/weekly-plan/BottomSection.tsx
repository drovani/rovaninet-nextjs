import React from "react";

interface BottomSectionProps {
  lunchSnacks: string;
  lookAhead: string;
}

const BottomSection = ({ lunchSnacks, lookAhead }: BottomSectionProps): React.ReactElement => {
  const renderContent = (content: string): React.ReactElement => (
    <div className="text-xs">
      {content.split("\n").map((line, index, arr) => (
        <React.Fragment key={index}>
          {line}
          {index < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="border border-gray-200 rounded-lg p-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 border-b border-gray-200 pb-1">
          Lunch &amp; Snack Options
        </div>
        {renderContent(lunchSnacks)}
      </div>
      <div className="border border-gray-200 rounded-lg p-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 border-b border-gray-200 pb-1">
          Look Ahead
        </div>
        {renderContent(lookAhead)}
      </div>
    </div>
  );
};

export default BottomSection;

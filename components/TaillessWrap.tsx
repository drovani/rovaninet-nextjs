import React from "react";

const TaillessWrap = ({ text }) => {
  const everythingElse =
    text.lastIndexOf(" ", text.lastIndexOf(" ") - 1) === -1
      ? null
      : text.slice(0, text.lastIndexOf(" ", text.lastIndexOf(" ") - 1) + 1);
  const keepTogether =
    text.lastIndexOf(" ", text.lastIndexOf(" ") - 1) === -1
      ? text
      : text.slice(text.lastIndexOf(" ", text.lastIndexOf(" ") - 1) + 1);
  return (
    <React.Fragment>
      <span>{everythingElse}</span>
      <span className="whitespace-nowrap">{keepTogether}</span>
    </React.Fragment>
  );
};
export default TaillessWrap;

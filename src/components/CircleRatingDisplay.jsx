import React from "react";

const CircleRatingDisplay = ({ value = 0 }) => {
  const outerSize = 40;
  const baseSize = 8;
  const ringGap = 3;
  const ringCount = value + 1;

  return (
    <div
      style={{
        position: "relative",
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "2px",
      }}
    >
      {[...Array(ringCount)].map((_, i) => {
        const size = baseSize + ringGap * 2 * i;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              border: `1.5px solid #333`,
              borderRadius: "50%",
              backgroundColor: i === 0 ? "#333" : "transparent",
              boxSizing: "border-box",
            }}
          />
        );
      })}
    </div>
  );
};

export default CircleRatingDisplay;

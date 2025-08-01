import React from "react";

const CircleRatingRowDisplay = ({ value = 0 }) => {
  const baseSize = 6;
  const ringGap = 2;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const rings = i + 1;
        const ringCount = rings + 1;
        const isActive = rings <= value;

        return (
          <div
            key={i}
            style={{
              position: "relative",
              width: baseSize + ringGap * 2 * rings,
              height: baseSize + ringGap * 2 * rings,
              marginRight: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Array.from({ length: ringCount }).map((_, j) => {
              const size = baseSize + ringGap * 2 * j;
              return (
                <div
                  key={j}
                  style={{
                    position: "absolute",
                    width: `${size}px`,
                    height: `${size}px`,
                    border: `1.2px solid ${isActive ? "#333" : "#ccc"}`,
                    borderRadius: "50%",
                    backgroundColor: j === 0 ? (isActive ? "#333" : "#ccc") : "transparent",
                    boxSizing: "border-box",
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CircleRatingRowDisplay;

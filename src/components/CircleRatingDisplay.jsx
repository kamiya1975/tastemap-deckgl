// ✅ 表示専用の評価リング（クリック不可）
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
        margin: "2px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
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
              border: `1.5px solid #999`,
              borderRadius: "50%",
              backgroundColor: i === 0 ? "#999" : "transparent",
              boxSizing: "border-box",
            }}
          />
        );
      })}
    </div>
  );
};

export default CircleRatingDisplay;

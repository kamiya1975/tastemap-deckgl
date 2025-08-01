import React from "react";

// 1個ずつのサークル表示（中心黒＋外n重）
const CircleRatingIcon = ({ value }) => {
  const baseSize = 8;
  const ringGap = 3;
  const ringCount = value + 1; // 中心黒を含めて合計何重か

  return (
    <div
      style={{
        position: "relative",
        width: `${baseSize + ringGap * 2 * (ringCount - 1)}px`,
        height: `${baseSize + ringGap * 2 * (ringCount - 1)}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "6px",
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

// 横並びに6段階の表示
const CircleRatingRowDisplay = ({ currentRating }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {[0, 1, 2, 3, 4, 5].map((val) => (
        <CircleRatingIcon key={val} value={val} />
      ))}
    </div>
  );
};

export default CircleRatingRowDisplay;


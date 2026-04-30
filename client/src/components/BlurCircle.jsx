import React from "react";

const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
}) => {
  return (
    <div
      className="absolute -z-50 h-72 w-72 rounded-full 
      bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-400/30 
      blur-3xl opacity-70 animate-pulse"
      style={{ top, left, right, bottom }}
    />
  );
};

export default BlurCircle;
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
      bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 
      blur-[120px] opacity-60 
      animate-[float_10s_ease-in-out_infinite]"
      style={{ top, left, right, bottom }}
    />
  );
};

export default BlurCircle;
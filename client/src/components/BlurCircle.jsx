import React from "react";

const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
  delay = "0s",
}) => {
  return (
    <div
      className="absolute -z-10 h-96 w-96 rounded-full 
      bg-gradient-to-r from-red-500/50 via-rose-500/40 to-pink-500/50 
      opacity-90 animate-spark-red mix-blend-screen"
      style={{
        top,
        left,
        right,
        bottom,
        animationDelay: delay,
      }}
    />
  );
};

export default BlurCircle;
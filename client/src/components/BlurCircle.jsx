import React from 'react'

const BlurCircle = ({ top = "auto", left = "auto", right = "auto", bottom = "auto" }) => {
  return (
    <div
      className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl"
      style={{ top, left, right, bottom }}
    />
  );
};

export default BlurCircle

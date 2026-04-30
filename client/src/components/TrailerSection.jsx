import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import { PlaySquareIcon } from "lucide-react";
import BlurCircle from "./BlurCircle";
import ReactPlayer from "react-player";

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      
      <BlurCircle top="-120px" right="-120px" delay="1s" />

      {/* Heading */}
      <div className="max-w-[960px] mx-auto">
        <p className="text-primary text-sm font-medium tracking-wide">
          WATCH
        </p>
        <h2 className="text-2xl font-semibold text-white mt-1">
          Latest Trailers
        </h2>
      </div>

      {/* Main Player */}
      <div className="relative mt-6 max-w-[960px] mx-auto">
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-primary/10">
          <ReactPlayer
            src={currentTrailer.videoUrl}
            controls
            width="100%"
            height="540px"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            onClick={() => setCurrentTrailer(trailer)}
            className={`group relative cursor-pointer rounded-xl overflow-hidden transition duration-300
            ${
              currentTrailer.image === trailer.image
                ? "ring-2 ring-primary scale-105"
                : "hover:-translate-y-1"
            }`}
          >
            <img
              loading="lazy"
              src={trailer.image}
              alt="trailer"
              className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition"
            />

            {/* Play Icon */}
            <PlaySquareIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-8 h-8 text-white 
              transform -translate-x-1/2 -translate-y-1/2 opacity-80 group-hover:scale-110 transition"
            />

            {/* Glow on hover */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
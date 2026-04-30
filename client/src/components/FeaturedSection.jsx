import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { useAppContext } from "../context/AppContext";

const FeaturedSection = () => {
  const { shows } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <BlurCircle top="40px" left="-120px"/>

      <div className="relative z-10 flex items-center justify-between pt-20 pb-10">
        <div>
          <p className="text-primary text-sm font-medium tracking-wide">
            FEATURED MOVIES
          </p>
          <h2 className="text-2xl font-semibold text-white mt-1">
            Now Showing
          </h2>
        </div>

        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo(0, 0);
          }}
          className="group flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition cursor-pointer"
        >
          View All
          <ArrowRight className="group-hover:translate-x-1 transition w-4.5 h-4.5" />
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-2">
        {shows.slice(0, 4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>

      <div className="relative z-10 flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo(0, 0);
          }}
          className="px-10 py-3 mb-5 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer shadow-md shadow-primary/30 hover:shadow-primary/60 active:scale-95"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
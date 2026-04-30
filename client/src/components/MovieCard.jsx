import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import TimeFormat from "../lib/TimeFormat";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ movie }) => {
  const { image_base_url } = useAppContext();
  const navigate = useNavigate();

  const movieId = movie._id || movie.id;

  const handleNavigate = () => {
    navigate(`/movies/${movieId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative flex flex-col justify-between p-4 bg-gray-900/80 backdrop-blur rounded-2xl
      border border-white/10 hover:border-primary/40
      hover:-translate-y-2 transition-all duration-300 w-full cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition duration-300 blur-2xl"></div>

      <img
        loading="lazy"
        src={
          movie.backdrop_path
            ? image_base_url + movie.backdrop_path
            : movie.poster_path
            ? image_base_url + movie.poster_path
            : "https://placehold.co/500x300?text=No+Image"
        }
        alt={movie.title || "Movie"}
        className="relative z-10 rounded-lg h-52 w-full object-cover object-right-bottom
        group-hover:scale-105 transition duration-300"
      />

      <div className="relative z-10">
        <p className="font-semibold mt-3 truncate text-white">
          {movie.title}
        </p>

        <p className="text-sm text-gray-400 mt-2">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}{" "}
          • {movie.genres?.slice(0, 2).map((g) => g.name).join(" | ") || "Movie"}{" "}
          • {movie.runtime ? TimeFormat(movie.runtime) : "N/A"}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="px-4 py-2 text-xs rounded-full font-medium
          bg-primary hover:bg-primary-dull
          transition duration-300 shadow-md shadow-primary/30
          hover:shadow-primary/60 active:scale-95 cursor-pointer"
        >
          View Details
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-300">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average?.toFixed(1) || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
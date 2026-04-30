import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon, X } from "lucide-react";
import TimeFormat from "../lib/TimeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MovieDeatils = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  const {
    shows,
    axios,
    getToken,
    user,
    favorites,
    fetchFavoriteMovie,
    image_base_url,
  } = useAppContext();

  const hasShows = show?.dateTime && Object.keys(show.dateTime).length > 0;

  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerKey(null);
  };

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);

      if (data.success) {
        setShow(data);
      } else {
        const tmdbRes = await axios.get(`/api/show/tmdb/${id}`);

        if (tmdbRes.data.success) {
          setShow({
            movie: tmdbRes.data.movie,
            dateTime: {},
          });
        }
      }
    } catch (error) {
      try {
        const tmdbRes = await axios.get(`/api/show/tmdb/${id}`);

        if (tmdbRes.data.success) {
          setShow({
            movie: tmdbRes.data.movie,
            dateTime: {},
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTrailer = async () => {
    try {
      setLoadingTrailer(true);

      const { data } = await axios.get(`/api/show/trailer/${id}`);

      if (data.success && data.trailerKey) {
        setTrailerKey(data.trailerKey);
        setShowTrailer(true);
      } else {
        toast.error("Trailer not available");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load trailer");
    } finally {
      setLoadingTrailer(false);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed.");

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        await fetchFavoriteMovie();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeTrailer();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return show ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-50 min-h-screen overflow-hidden">
      <BlurCircle top="80px" left="-120px" />
      <BlurCircle bottom="120px" right="-120px" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          loading="lazy"
          src={image_base_url + show.movie.poster_path}
          alt={show.movie.title}
          className="max-md:mx-auto rounded-2xl h-104 max-w-70 object-cover border border-white/10 shadow-xl shadow-primary/20"
        />

        <div className="relative flex flex-col gap-3">
          <p className="text-primary font-medium tracking-wide">
            {show.movie.original_language?.toUpperCase() || "MOVIE"}
          </p>

          <h1 className="text-4xl font-semibold max-w-96 text-balance text-white">
            {show.movie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie.vote_average?.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-xl">
            {show.movie.overview}
          </p>

          <p className="text-gray-300">
            {TimeFormat(show.movie.runtime)} .{" "}
            {show.movie.genres?.map((genre) => genre.name).join(", ")} .{" "}
            {show.movie.release_date?.split("-")[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button
              onClick={handleTrailer}
              disabled={loadingTrailer}
              className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-900/80 hover:bg-gray-800 border border-white/10 hover:border-primary/40 transition rounded-full font-medium cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-primary/30"
            >
              <PlayCircleIcon className="w-5 h-5 text-primary" />
              {loadingTrailer ? "Loading..." : "Watch Trailer"}
            </button>

            {hasShows ? (
              <a
                className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 shadow-md shadow-primary/30 hover:shadow-primary/60"
                href="#dateSelect"
              >
                Buy Tickets
              </a>
            ) : (
              <button
                disabled
                className="px-10 py-3 text-sm bg-gray-700 text-gray-400 rounded-full font-medium cursor-not-allowed"
              >
                Not Available
              </button>
            )}

            <button
              onClick={handleFavorite}
              className="bg-gray-900/80 border border-white/10 hover:border-primary/40 p-3 rounded-full transition cursor-pointer active:scale-95 hover:shadow-md hover:shadow-primary/30"
            >
              <Heart
                className={`w-5 h-5 ${
                  favorites?.find((movie) => String(movie._id) === String(id))
                    ? "fill-primary text-primary"
                    : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-lg font-medium mt-20">
        Your Favorite Cast
      </p>

      <div className="relative z-10 overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-5 w-max px-4">
          {show.movie.casts?.slice(0, 12).map((cast, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center"
            >
              <img
                loading="lazy"
                src={
                  cast.profile_path
                    ? image_base_url + cast.profile_path
                    : "https://placehold.co/100x100?text=No+Image"
                }
                alt={cast.name}
                className="rounded-full h-20 md:h-20 aspect-square object-cover bg-gray-800 border border-white/10 group-hover:border-primary/50 transition"
              />
              <p className="text-sm mt-2 text-gray-300 max-w-24 truncate">
                {cast.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {hasShows && (
        <div className="relative z-10">
          <DateSelect dateTime={show.dateTime} id={id} />
        </div>
      )}

      <p className="relative z-10 text-lg font-medium mt-20 mb-8">
        You may Also Like
      </p>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mt-4">
        {shows
          .filter((movie) => String(movie._id) !== String(id))
          .slice(0, 4)
          .map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
      </div>

      <div className="relative z-10 flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer shadow-md shadow-primary/30 hover:shadow-primary/60 active:scale-95"
        >
          Show More
        </button>
      </div>

      {showTrailer && trailerKey && (
        <div
          onClick={closeTrailer}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl"
          >
            <button
              onClick={closeTrailer}
              className="absolute -top-12 right-0 text-white bg-gray-900 hover:bg-gray-800 border border-white/10 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <iframe
              className="w-full aspect-video rounded-2xl border border-white/10 shadow-2xl shadow-primary/20"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&vq=hd1080`}
              title="Movie Trailer"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDeatils;
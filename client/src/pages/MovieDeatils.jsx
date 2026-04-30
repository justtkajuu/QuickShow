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
          src={
            show.movie?.poster_path
              ? image_base_url + show.movie.poster_path
              : "https://placehold.co/300x450?text=No+Image"
          }
          alt={show.movie?.title || "Movie"}
          className="max-md:mx-auto rounded-2xl h-104 max-w-70 object-cover border border-white/10 shadow-xl shadow-primary/20"
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold text-white">
            {show.movie?.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie?.vote_average?.toFixed(1) || "N/A"}
          </div>

          <p className="text-gray-400 text-sm">
            {show.movie?.overview}
          </p>

          <p className="text-gray-300 text-sm">
            {show.movie?.runtime ? TimeFormat(show.movie.runtime) : "N/A"} •{" "}
            {show.movie?.genres?.map((g) => g.name).join(", ") || "N/A"} •{" "}
            {show.movie?.release_date?.split("-")[0] || "N/A"}
          </p>

          <div className="flex gap-4 mt-4 flex-wrap">
            <button
              onClick={handleTrailer}
              className="px-6 py-2 bg-gray-800 rounded-full text-sm flex items-center gap-2"
            >
              <PlayCircleIcon className="w-4 h-4" />
              Trailer
            </button>

            {hasShows ? (
              <a
                href="#dateSelect"
                className="px-6 py-2 bg-primary rounded-full text-sm"
              >
                Buy Tickets
              </a>
            ) : (
              <button
                disabled
                className="px-6 py-2 bg-gray-600 text-gray-300 rounded-full text-sm"
              >
                Not Available
              </button>
            )}

            <button onClick={handleFavorite}>
              <Heart
                className={`w-5 h-5 ${
                  favorites?.find((m) => String(m._id) === String(id))
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {hasShows && (
        <div id="dateSelect" className="mt-10">
          <DateSelect dateTime={show.dateTime} id={id} />
        </div>
      )}

      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        {shows.slice(0, 4).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="relative w-full max-w-3xl">
            <button onClick={closeTrailer} className="absolute -top-10 right-0">
              <X />
            </button>

            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&vq=hd1080`}
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
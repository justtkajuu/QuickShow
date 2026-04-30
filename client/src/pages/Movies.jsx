import React, { useEffect, useState } from "react";
import { Bell, CalendarDays, Check } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const Releases = () => {
  const { axios, image_base_url } = useAppContext();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifiedMovies, setNotifiedMovies] = useState([]);

  const fetchUpcomingMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/upcoming");
      console.log("Upcoming API response:", data);

      if (data.success && Array.isArray(data.movies)) {
        setMovies(data.movies);
      } else {
        setMovies([]);
        toast.error(data.message || "No upcoming movies found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load upcoming movies");
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = (movieId, title) => {
    if (notifiedMovies.includes(movieId)) {
      toast("Already added to notify list");
      return;
    }

    setNotifiedMovies((prev) => [...prev, movieId]);
    toast.success(`You will be notified for ${title}`);
  };

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  if (loading) return <Loading />;

  return movies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium my-4">Upcoming Releases</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-6">
        {movies.map((movie) => {
          const isNotified = notifiedMovies.includes(movie.id);

          return (
            <div
              key={movie.id}
              className="flex flex-col justify-between p-4 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full"
            >
              <img
                src={
                  movie.poster_path
                    ? image_base_url + movie.poster_path
                    : "https://placehold.co/300x450?text=No+Image"
                }
                alt={movie.title}
                className="rounded-lg h-52 w-full object-cover object-center"
              />

              <p className="font-semibold mt-3 truncate">{movie.title}</p>

              <p className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                {movie.release_date || "Coming Soon"}
              </p>

              <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                {movie.overview || "No description available."}
              </p>

              <button
                onClick={() => handleNotify(movie.id, movie.title)}
                className={`flex items-center justify-center gap-2 mt-4 px-4 py-2 text-xs rounded-full transition font-medium cursor-pointer active:scale-95 ${
                  isNotified
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-primary hover:bg-primary-dull"
                }`}
              >
                {isNotified ? (
                  <>
                    <Check className="w-4 h-4" />
                    Notified
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Notify Me
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">
        No upcoming movies available
      </h1>
    </div>
  );
};

export default Releases;
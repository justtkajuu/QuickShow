import React, { useEffect, useState } from "react";
import { CalendarDays, Bell } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const Releases = () => {
  const { axios, image_base_url } = useAppContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="px-6 md:px-16 lg:px-40 xl:px-44 pt-30 min-h-screen">
      <h1 className="text-2xl font-semibold">Upcoming Releases</h1>
      <p className="text-gray-400 mt-2 mb-10">
        Explore movies coming soon to theatres.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-2xl p-4 hover:-translate-y-1 transition duration-300"
            >
              <img
                src={
                  movie.poster_path
                    ? image_base_url + movie.poster_path
                    : "https://placehold.co/300x450?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-80 object-cover rounded-xl"
              />

              <h2 className="font-semibold mt-4 truncate">{movie.title}</h2>

              <p className="text-sm text-gray-400 mt-2">
                {movie.release_date || "Coming Soon"}
              </p>

              <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                {movie.overview || "No description available."}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No upcoming movies available.</p>
        )}
      </div>
    </div>
  );
};

export default Releases;

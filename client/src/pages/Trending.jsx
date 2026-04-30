import React, { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Trending = () => {
  const { axios } = useAppContext();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrendingMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/trending");

      if (data.success && Array.isArray(data.movies)) {
        const formattedMovies = data.movies.map((movie) => ({
          ...movie,
          _id: movie.id,
        }));

        setMovies(formattedMovies);
      } else {
        setMovies([]);
        toast.error(data.message || "No trending movies found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load trending movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  if (loading) return <Loading />;

  return movies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 min-h-[80vh] overflow-hidden">
      <BlurCircle top="120px" left="-80px" />
      <BlurCircle bottom="100px" right="-80px" delay="1.5s" />

      <div className="flex items-center gap-2 my-4">
        <Flame className="w-5 h-5 text-primary fill-primary" />
        <h1 className="text-lg font-medium">Trending Movies</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-6">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">
        No trending movies available
      </h1>
    </div>
  );
};

export default Trending;
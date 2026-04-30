import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "./../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [allMovies, setAllMovies] = useState([]);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const { favorites, shows, image_base_url, axios } = useAppContext();

  const fetchSearchMovies = async () => {
    try {
      const [trendingRes, upcomingRes] = await Promise.all([
        axios.get("/api/show/trending"),
        axios.get("/api/show/upcoming"),
      ]);

      const trendingMovies = trendingRes.data.success
        ? trendingRes.data.movies
        : [];

      const upcomingMovies = upcomingRes.data.success
        ? upcomingRes.data.movies
        : [];

      const mergedMovies = [...shows, ...trendingMovies, ...upcomingMovies];

      const uniqueMovies = mergedMovies.filter(
        (movie, index, self) =>
          index ===
          self.findIndex(
            (m) => String(m._id || m.id) === String(movie._id || movie.id)
          )
      );

      setAllMovies(uniqueMovies);
    } catch (error) {
      console.error(error);
      setAllMovies(shows);
    }
  };

  useEffect(() => {
    fetchSearchMovies();
  }, [shows]);

  const filteredMovies =
    search.trim().length > 0
      ? allMovies.filter((movie) =>
          movie.title?.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const handleMovieClick = (movieId) => {
    setSearch("");
    setShowSearch(false);
    setIsOpen(false);
    navigate(`/movies/${movieId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full px-6 md:px-16 lg:px-36 py-5">
      <div className="flex items-center justify-between">
        <Link to="/" className="max-md:flex-1">
          <img src={assets.logo} alt="QuickShow" className="w-36 h-auto" />
        </Link>

        <div
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/80 md:bg-white/10 md:border border-white/10 overflow-hidden transition-[width] duration-300 ${
            isOpen ? "max-md:w-full" : "max-md:w-0"
          }`}
        >
          <XIcon
            className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          <Link
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/"
          >
            Home
          </Link>

          <Link
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/movies"
          >
            Movies
          </Link>

          <Link
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/trending"
          >
            Trending
          </Link>

          <Link
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/releases"
          >
            Releases
          </Link>

          {favorites?.length > 0 && (
            <Link
              onClick={() => {
                window.scrollTo(0, 0);
                setIsOpen(false);
              }}
              to="/favorite"
            >
              Favorites
            </Link>
          )}
        </div>

        <div className="flex items-center gap-6">
          <SearchIcon
            onClick={() => setShowSearch(true)}
            className="max-md:hidden w-6 h-6 cursor-pointer hover:text-primary transition"
          />

          {!user ? (
            <button
              onClick={openSignIn}
              className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer shadow-md shadow-primary/30"
            >
              Login
            </button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<TicketPlus width={15} />}
                  onClick={() => navigate("/my-bookings")}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
        </div>

        <MenuIcon
          className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>

      {showSearch && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center px-4 pt-28">
          <div className="w-full max-w-xl bg-gray-900/95 border border-white/10 rounded-3xl p-4 shadow-2xl shadow-primary/20">
            <div className="flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-primary" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                autoFocus
                className="flex-1 bg-transparent text-white outline-none"
              />

              <XIcon
                onClick={() => {
                  setShowSearch(false);
                  setSearch("");
                }}
                className="w-5 h-5 cursor-pointer hover:text-primary transition"
              />
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
              {filteredMovies.slice(0, 8).map((movie) => (
                <div
                  key={movie._id || movie.id}
                  onClick={() => handleMovieClick(movie._id || movie.id)}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-primary/20 cursor-pointer transition"
                >
                  <img
                    src={
                      movie.poster_path
                        ? image_base_url + movie.poster_path
                        : "https://placehold.co/100x140?text=No+Image"
                    }
                    alt={movie.title || "Movie"}
                    className="w-12 h-16 object-cover rounded-lg"
                  />

                  <div>
                    <p className="text-sm font-medium text-white">
                      {movie.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {movie.release_date?.split("-")[0] || "N/A"}
                    </p>
                  </div>
                </div>
              ))}

              {search && filteredMovies.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No movie found
                </p>
              )}

              {!search && (
                <p className="text-sm text-gray-500 text-center py-6">
                  Search from Now Showing, Trending and Upcoming movies
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
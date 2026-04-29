import axios from "axios";
import Movie from "./../models/Movie.js";
import Show from "./../models/Show.js";
import { inngest } from "../inngest/index.js";

// Api to get now playing movies from TMDB API

export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
      },
    );

    const movies = data.results;
    res.json({ success: true, movies: movies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to add a new show to the database

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      // fetch movie details and credits from tmdb API

      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
        }),

        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      // Add movie to databse

      movie = await Movie.create(movieDetails);
    }

    const showToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showToCreate.length > 0) {
      await Show.insertMany(showToCreate);
    }

    // Trigger Inngest event
    await inngest.send({
      name:'app/show.added',
      data: {
        movieTitle: movie.title
      }
    })

    res.json({
      success: true,
      message: "Show Added succesfully.",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get all shows from the databse

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({}).populate("movie");

    const uniqueMap = new Map();

    shows.forEach((show) => {
      if (show.movie) {
        const id = show.movie._id.toString();

        if (!uniqueMap.has(id)) {
          uniqueMap.set(id, show.movie);
        }
      }
    });

    res.json({
      success: true,
      shows: Array.from(uniqueMap.values()),
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Api to get single shows from database

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      // showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    res.json({
      success: true,
      movie,
      dateTime,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// api to get the movie trailer from database

export const getMovieTrailer = async (req, res) => {
  try {
    const { movieId } = req.params;

    console.log("Trailer movieId:", movieId);
    console.log("TMDB token exists:", !!process.env.TMDB_ACCESS_TOKEN);

    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
        timeout: 15000,
      }
    );

    const trailer = data.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );

    res.json({
      success: true,
      trailerKey: trailer?.key || null,
    });
  } catch (error) {
    console.log("---- TRAILER ERROR ----");
    console.log("Code:", error.code);
    console.log("Message:", error.message);
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.status_message ||
        error.message ||
        error.code ||
        "Failed to fetch trailer",
    });
  }
};
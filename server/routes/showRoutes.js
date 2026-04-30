import express from "express";

import { addShow, getMovieDetailsFromTMDB, getMovieTrailer, getNowPlayingMovies, getShow, getShows, getTrendingMovies, getUpcomingMovies } from './../controllers/showController.js';
import { protectAdmin } from "../middlware/auth.js";

const showRouter = express.Router()

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.post('/add', protectAdmin, addShow)
showRouter.get('/all', getShows)

showRouter.get("/upcoming", getUpcomingMovies)
showRouter.get("/trending", getTrendingMovies)

// 🔥 ye upar hona chahiye
showRouter.get("/trailer/:movieId", getMovieTrailer)
showRouter.get("/tmdb/:movieId", getMovieDetailsFromTMDB)

// ❗ ye hamesha last me
showRouter.get("/:movieId", getShow)

export default showRouter
import express from "express";

import { addShow, getMovieDetailsFromTMDB, getMovieTrailer, getNowPlayingMovies, getShow, getShows, getTrendingMovies, getUpcomingMovies } from './../controllers/showController.js';
import { protectAdmin } from "../middlware/auth.js";

const showRouter = express.Router()

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.post('/add', protectAdmin, addShow)
showRouter.get('/all', getShows)
showRouter.get("/upcoming", getUpcomingMovies);
showRouter.get("/trending", getTrendingMovies);
showRouter.get("/:movieId", getShow)
showRouter.get("/trailer/:movieId", getMovieTrailer);
showRouter.get("/tmdb/:movieId", getMovieDetailsFromTMDB);

export default showRouter
import express from "express";

import { addShow, getMovieTrailer, getNowPlayingMovies, getShow, getShows, getUpcomingMovies } from './../controllers/showController.js';
import { protectAdmin } from "../middlware/auth.js";

const showRouter = express.Router()

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.post('/add', protectAdmin, addShow)
showRouter.get('/all', getShows)
showRouter.get("/upcoming", getUpcomingMovies);
showRouter.get("/:movieId", getShow)
showRouter.get("/trailer/:movieId", getMovieTrailer);

export default showRouter
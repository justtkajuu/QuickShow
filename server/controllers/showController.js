import axios from "axios";

export const getNowPlayingMovies = async (req, res) => {
  try {
    console.log("Token exists:", !!process.env.TMDB_ACCESS_TOKEN);

    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
        params: {
          language: "en-US",
          page: 1,
        },
        timeout: 30000,
      }
    );

    const movies = data.results;

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.log("TMDB ERROR CODE:", error.code);
    console.log("TMDB ERROR MESSAGE:", error.message);
    console.log("TMDB RESPONSE:", error.response?.data);

    res.json({
      success: false,
      message: error.message,
      code: error.code,
      tmdbError: error.response?.data,
    });
  }
};

export default getNowPlayingMovies;
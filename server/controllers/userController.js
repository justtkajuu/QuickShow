
import Booking from './../models/Booking.js';
import { clerkClient } from '@clerk/express';
import Movie from './../models/Movie.js';

// api controller function to et user bookings

export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId

        const bookings = await Booking.find({user}).populate({
            path: "show",
            populate: {path : "movie"}
        }).sort({createdAt: -1})

        res.json({
            success: true,
            bookings
        })

    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Api controller function to update favorite movie in clerk user metadata

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    let favorites = user.privateMetadata.favorites || [];

    let message = "";

    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
      message = "Added to favorites ❤️";
    } else {
      favorites = favorites.filter((item) => item !== movieId);
      message = "Removed from favorites ❌";
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        favorites,
      },
    });

    res.json({
      success: true,
      message,
      favorites,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// 

export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);

    const favorites = user.privateMetadata.favorites || [];

    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({
      success: true,
      movies,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import TimeFormat from "./../lib/TimeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { axios, getToken, user, image_base_url } = useAppContext();

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] overflow-hidden">
      <BlurCircle top="120px" left="-80px" />
      <BlurCircle bottom="100px" right="-80px"/>

      <h1 className="text-xl font-semibold mb-6 text-white">🎟 My Bookings</h1>

      {bookings.length > 0 ? (
        bookings.map((item, index) => (
          <div
            key={index}
            className="group relative flex flex-col md:flex-row justify-between 
            bg-gray-900/70 backdrop-blur rounded-2xl 
            border border-white/10 hover:border-primary/40 
            mt-6 p-3 md:p-4 max-w-3xl 
            transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-primary/10 blur-2xl rounded-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-4">
              <img
                loading="lazy"
                src={image_base_url + item.show.movie.poster_path}
                alt={item.show.movie.title}
                className="md:w-44 w-full h-28 object-cover object-bottom rounded-lg"
              />

              <div className="flex flex-col">
                <p className="text-lg font-semibold text-white">
                  {item.show.movie.title}
                </p>

                <p className="text-gray-400 text-sm mt-1">
                  {TimeFormat(item.show.movie.runtime)}
                </p>

                <p className="text-gray-400 text-sm mt-2">
                  {dateFormat(item.show.showDateTime)}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:items-end justify-between mt-4 md:mt-0">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold text-white">
                  {currency}
                  {item.amount}
                </p>

                {!item.isPaid && (
                  <Link
                    to={item.paymentLink}
                    className="px-4 py-1.5 text-sm rounded-full 
                    bg-primary hover:bg-primary-dull 
                    transition shadow-md shadow-primary/30 
                    hover:shadow-primary/60 active:scale-95"
                  >
                    Pay Now
                  </Link>
                )}
              </div>

              <div className="text-sm text-gray-300 mt-2">
                <p>
                  <span className="text-gray-400">Tickets: </span>
                  {item.bookedSeats.length}
                </p>

                <p className="truncate max-w-[220px] md:max-w-none">
                  <span className="text-gray-400">Seats: </span>
                  {item.bookedSeats.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <h2 className="text-3xl font-bold text-white">No bookings yet</h2>
          <p className="text-gray-400 mt-2">
            Book a movie ticket and it will appear here.
          </p>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
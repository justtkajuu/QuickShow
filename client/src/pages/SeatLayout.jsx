import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { axios, getToken, user } = useAppContext();
  const { id, date } = useParams();

  const [selectseats, setSelectSeats] = useState([]);
  const [selectTime, setSelectTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedseats, setoccupiedSeats] = useState([]);

  const navigate = useNavigate();

  const getshow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) setShow(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectTime) return toast("Please select a time first");

    if (!selectseats.includes(seatId) && selectseats.length >= 5) {
      return toast("You can only select 5 seats");
    }

    if (occupiedseats?.includes(seatId)) {
      return toast("This seat is already booked");
    }

    setSelectSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectseats.includes(seatId);
          const isOccupied = occupiedseats?.includes(seatId);

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isOccupied}
              className={`w-8 h-8 rounded-md text-xs border transition-all duration-200
              ${
                isOccupied
                  ? "bg-gray-700/70 border-gray-600 text-gray-500 cursor-not-allowed opacity-60"
                  : isSelected
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/50 scale-105"
                  : "bg-gray-900/80 border-primary/40 text-gray-300 hover:bg-primary/20 hover:border-primary hover:text-white cursor-pointer"
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${selectTime.showId}`);

      if (data.success) {
        setoccupiedSeats(data.occupiedSeats || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const bookTickets = async () => {
    try {
      if (!user) return toast.error("Please login to proceed.");

      if (!selectTime || selectseats.length === 0) {
        return toast.error("Please select a time and seats");
      }

      const { data } = await axios.post(
        "/api/booking/create",
        { showId: selectTime.showId, selectedSeats: selectseats },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getshow();
  }, []);

  useEffect(() => {
    if (selectTime) getOccupiedSeats();
  }, [selectTime]);

  return show ? (
    <div className="relative flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-40 py-30 md:pt-50 min-h-screen overflow-hidden">
      <BlurCircle top="120px" left="-100px" />
      <BlurCircle bottom="100px" right="-120px" />

      {/* Available Timings */}
      <div className="relative z-10 w-full md:w-64 bg-gray-900/70 backdrop-blur border border-white/10 hover:border-primary/30 rounded-2xl p-5 h-max md:sticky md:top-30 shadow-xl shadow-black/20">
        <p className="text-lg font-semibold text-white">Available Timings</p>

        <div className="mt-5 space-y-2">
          {show.dateTime[date].map((item) => (
            <div
              key={item.time}
              onClick={() => {
                setSelectTime(item);
                setSelectSeats([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                selectTime?.time === item.time
                  ? "bg-primary text-white shadow-md shadow-primary/40"
                  : "bg-white/5 hover:bg-primary/20 text-gray-300 hover:text-white"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="relative z-10 flex-1 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4 text-white">
          Select your seat
        </h1>

        <div className="w-full max-w-2xl flex flex-col items-center bg-gray-900/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur">
          <img src={assets.screenImage} alt="screen" className="max-w-full" />
          <p className="text-gray-400 text-sm mb-6 tracking-[0.3em]">
            SCREEN SIDE
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-900 border border-primary/40"></span>
              Available
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-primary shadow shadow-primary/40"></span>
              Selected
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-700 opacity-60"></span>
              Booked
            </div>
          </div>

          <div className="flex flex-col items-center text-xs text-gray-300">
            <div className="grid grid-cols-2 gap-6 md:gap-10 mb-6">
              {groupRows[0].map((row) => renderSeats(row))}
            </div>

            <div className="grid grid-cols-2 gap-8 md:gap-14">
              {groupRows.slice(1).map((group, idx) => (
                <div key={idx}>{group.map((row) => renderSeats(row))}</div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={bookTickets}
          className="flex items-center gap-2 mt-10 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 shadow-md shadow-primary/30 hover:shadow-primary/60"
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
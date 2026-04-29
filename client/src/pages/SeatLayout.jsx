import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
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

  const {axios, getToken, user} = useAppContext()
  const { id, date } = useParams();
  const [selectseats, setSelectSeats] = useState([]);
  const [selectTime, setSelectTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedseats, setoccupiedSeats] = useState([])
  const navigate = useNavigate();

  const getshow = async () => {
    try {
      const {data} = await axios.get(`/api/show/${id}`)
      if(data.success){
        setShow(data)
      }
    } catch (error) {
      console.error(error);   
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectTime) {
      return toast("Please select a time first");
    }
    if (!selectseats.includes(seatId) && selectseats.length > 4) {
      return toast("You can only select 5 seats");
    }
    if(occupiedseats?.includes(seatId)){
      return toast('This seat is already booked')
    }
    setSelectSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId],
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`w-8 h-8 rounded border border-primary/60  cursor-pointer ${selectseats.includes(seatId) && "bg-primary text-white"}
              ${occupiedseats?.includes(seatId) && 'opacity-50'}`}
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
      const {data} = await axios.get(`/api/booking/seats/${selectTime.showId}`)

      if(data.success){
        setoccupiedSeats(data.occupiedSeats || [])
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error); 
    }
  }

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
  },[]);

  useEffect(()=> {
    if(selectTime){
      getOccupiedSeats()
    }
  },[selectTime])

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* {Avilable Timings} */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date].map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"} `}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* {Seat Layout} */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid gird-cols-2 md:grid-cols1 gap-6 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        <button onClick={bookTickets} className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95">Prcoeed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4"/>
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;

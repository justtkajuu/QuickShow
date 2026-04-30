import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, Calendar, ClockIcon, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen overflow-hidden'>
      

      <div className="relative z-10">
        <img
          src={assets.marvelLogo}
          alt="Marvel"
          className="max-h-11 lg:h-11 mt-20"
        />

        <h1 className="mt-4 text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110 text-white">
          Guardians <br /> of the Galaxy
        </h1>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-300">
          <span>Action | Adventure | Sci-Fi</span>

          <div className="flex items-center gap-1">
            <Calendar className="w-4.5 h-4.5 text-primary" /> 2018
          </div>

          <div className="flex items-center gap-1">
            <ClockIcon className="w-4.5 h-4.5 text-primary" /> 2h 8m
          </div>
        </div>

        <p className="max-w-md text-gray-300 mt-3 leading-relaxed">
          In a post-apocalyptic world where cities ride on wheels and consume
          each other to survive, two people meet in London and try to stop a
          conspiracy.
        </p>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => navigate("/movies")}
            className="flex items-center gap-2 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer shadow-md shadow-primary/30 hover:shadow-primary/60 active:scale-95"
          >
            Explore Movies
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
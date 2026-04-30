import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full mt-40 text-gray-300 bg-gray-950 border-t border-white/10 overflow-hidden">

      {/* 🔥 Blur Glow */}
      <div className="absolute left-10 bottom-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl -z-10"></div>
      <div className="absolute right-10 top-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl -z-10"></div>

      {/* Content */}
      <div className="px-6 md:px-16 lg:px-36 py-10">

        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-white/10 pb-10">
          
          {/* Left */}
          <div className="md:max-w-96">
            <img alt="QuickShow" className="h-11" src={assets.logo} />

            <p className="mt-6 text-sm leading-relaxed text-gray-400">
              QuickShow is your smart movie booking platform where you can explore latest shows,
              watch trailers, select seats and book tickets easily with a smooth experience.
            </p>

            <div className="flex items-center gap-3 mt-5">
              <img
                src={assets.googlePlay}
                alt="Google Play"
                className="h-9 w-auto hover:scale-105 transition cursor-pointer"
              />
              <img
                src={assets.appStore}
                alt="App Store"
                className="h-9 w-auto hover:scale-105 transition cursor-pointer"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-10 md:gap-24">

            {/* Links */}
            <div>
              <h2 className="font-semibold mb-5 text-white">Company</h2>

              <ul className="text-sm space-y-3 text-gray-400">
                <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
                <li><Link to="/movies" className="hover:text-primary transition">Movies</Link></li>
                <li><Link to="/releases" className="hover:text-primary transition">Releases</Link></li>
                <li><Link to="/favorite" className="hover:text-primary transition">Favorites</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-semibold mb-5 text-white">Get in touch</h2>

              <div className="text-sm space-y-3 text-gray-400">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  +91 98765 43210
                </p>

                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  support@quickshow.com
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <p className="pt-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-primary font-medium">QuickShow</span>. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
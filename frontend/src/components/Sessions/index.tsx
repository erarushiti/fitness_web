"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

interface Session {
  id: string;
  name: string;
  description: string;
  weekDays: string[];
  time: string;
  price: number;
  createdAt?: string;
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get("https://fitness-web-api-g1zu.onrender.com/api/session");
      setSessions(response.data);
      console.log(loading);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleRegister = (sessionId: string) => {
    window.open(`/SessionRegistration/${sessionId}/register`, "_blank");
  };

  console.log("sessions", sessions);

 return (
    <div className="mt-8 sm:mt-10 bg-black px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-10 md:py-12 rounded-2xl sm:rounded-3xl md:rounded-4xl">
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center mb-6 sm:mb-8 md:mb-10 font-bold text-white">
        BEST WORKOUT{" "}
        <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#EE7838]">
          PROGRAM
        </span>
        <br />
        MADE FOR YOU!
      </h2>

      {/* Session Cards */}
      {sessions.map((session, index) => (
        <div
          key={session.id}
          className="bg-[#111] rounded-2xl sm:rounded-3xl flex flex-col md:flex-row items-start md:items-center mb-4 sm:mb-6"
        >
          {/* Number Label */}
          <div className="bg-[#FF9B17] text-white text-lg sm:text-xl md:text-2xl font-bold rounded-l-2xl sm:rounded-l-3xl h-16 sm:h-20 md:h-[91.99px] w-16 sm:w-20 md:w-[85px] flex items-center justify-center shrink-0">
            {String(index + 1).padStart(2, "0")}.
          </div>

          {/* Session Details */}
          <div className="flex flex-col sm:flex-row w-full justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-0">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase">
                {session.name}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-2 max-w-md">
                {session.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-6 md:space-x-8 text-gray-300 text-sm sm:text-base font-extrabold">
              <div className="flex items-center mb-2 sm:mb-0">
                <FaCalendarAlt className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                <span>{session.weekDays.join(" - ")}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                <span>{session.time}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-300 text-sm sm:text-base font-extrabold mt-2 sm:mt-0">
              <span>{session.price}€</span>
            </div>
          </div>

          {/* Join Now Button */}
          <button
            onClick={() => handleRegister(session.id)}
            className="mt-4 md:mt-0 bg-yellow-400 text-black font-semibold py-2 px-4 sm:px-6 w-full sm:w-auto sm:min-w-[160px] md:min-w-[190px] mr-0 md:mr-4 rounded-2xl sm:rounded-3xl flex items-center justify-center hover:bg-yellow-500 transition-colors"
            aria-label={`Join ${session.name} workout program`}
          >
            Join Now
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

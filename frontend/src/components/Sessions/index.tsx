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
      const response = await axios.get("http://localhost:8080/api/sessions");
      setSessions(response.data);
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
    <div className="mt-[50px] bg-black px-[100px] py-[50px]  rounded-[30px] md:rounded-[60px]">
      <h2 className="text-3xl md:text-5xl text-center mb-[40px] font-bold text-white">
        BEST WORKOUT{" "}
        <span className="text-3xl md:text-5xl font-bold text-[#EE7838]">
          PROGRAM
        </span>
        <br />
        MADE FOR YOU!
      </h2>
      {sessions.map((session, index) => (
        <div
          key={session.id}
          className="bg-[#111]  rounded-3xl flex flex-col md:flex-row items-start md:items-center mb-4 justify-between  "
        >
          {/* Number Label */}
          <div className="bg-[#FF9B17] text-white text-xl md:text-2xl font-bold rounded-l-3xl h-[91.99px] w-[85px] flex items-center justify-center ">
            {String(index + 1).padStart(2, "0")}.
          </div>
          {/* Session Details */}
          <div className="flex w-full justify-between px-[100px]">
            <div>
              <h3 className=" text-3xl font-bold text-white uppercase">
                {session.name}
              </h3>
              <p className="text-gray-400 text-[17px] mt-2">
                {session.description}
              </p>
            </div>

            <div className="flex flex-col  mt-2 text-gray-300 text-base justify-between font-extrabold">
              <div className="flex items-center mr-4">
                <FaCalendarAlt className="mr-2" />
                {/* Example days, adjust based on your data */}
                <span>{session.weekDays.join(" - ")}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>{session.time}</span>
              </div>
            </div>
          </div>
          {/* Join Now Button */}
          <button
            onClick={() => handleRegister(session.id)}
            className="mt-4 md:mt-0 bg-yellow-400 text-black font-semibold py-2 px-[30px] w-[190px] mr-[15px] rounded-3xl flex items-center hover:bg-yellow-500 transition"
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

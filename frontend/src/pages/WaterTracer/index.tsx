"use client";

import { useEffect, useState } from "react";
import "../../app/globals.css"
interface WaterLogEntry {
  id: string;
  amount: number;
  timestamp: string;
}

const GOAL = 2000;

export default function WaterTracker() {
  const [intake, setIntake] = useState<number>(0);
  const [log, setLog] = useState<WaterLogEntry[]>([]);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    console.log("Stored Token:", storedToken);  // Log token
    if (storedToken) setToken(storedToken);
  }, []);

 useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const clientData = localStorage.getItem("user"); // Or get this from auth/user context
    console.log("clientdata", clientData);

    if (!storedToken || !clientData) {
      console.warn("Missing token or clientId");
      return;
    }

    const clientId = JSON.parse(clientData).id;

    // Get current date at midnight (12:00 AM)
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Set to midnight

    // Get end date (24 hours later)
    const endDate = new Date(startDate);
    endDate.setHours(24, 0, 0, 0); // Midnight of the next day

    // Convert to ISO strings for API
    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();

    fetch(`http://localhost:8080/api/waterlog/${clientId}?startDate=${startDateISO}&endDate=${endDateISO}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch logs");
        return res.json();
      })
      .then((data) => {
        console.log("Water logs:", data);
        setLog(data);
      })
      .catch((err) => console.error("Error fetching water logs:", err));
  }, []);
  
  
  
  
  const addWater = async (amount: number) => {
    if (!amount || isNaN(amount)) return;
  
    const clientData = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
  
    if (!clientData || !token) {
      console.error("Missing client data or token");
      return;
    }
  
    const clientId = JSON.parse(clientData).id;
  
    try {
      const res = await fetch("http://localhost:8080/api/waterlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, clientId }),
      });
  
      console.log("Response status:", res.status);
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to log water");
      }
  
      const logEntry = await res.json();
  
      setIntake((prev) => prev + amount);
  
      setLog((prev) =>
        [logEntry, ...prev].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
    } catch (err) {
      console.error("Error adding water:", err);
    }
  };
  
  
  

  const resetDay = () => {
    setIntake(0);
    setLog([]);
  };

  const percentage = Math.min((intake / GOAL) * 100, 100);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-48 border-4 border-blue-300 rounded-md overflow-hidden bg-blue-100">
            <div
              className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500"
              style={{ height: `${percentage}%` }}
            />
          </div>

          <div className="my-4">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="none"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={(1 - percentage / 100) * 2 * Math.PI * 45}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-lg fill-blue-600 font-semibold">
                {intake}ml
              </text>
            </svg>
          </div>

          <p className="text-gray-700">Goal: {GOAL}ml</p>

          <div className="flex gap-2 mt-4">
            {[250, 500, 750].map((amt) => (
              <button
                key={amt}
                onClick={() => addWater(amt)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                {amt}ml
              </button>
            ))}
          </div>

          <div className="flex mt-4 gap-2">
            <input
              type="number"
              placeholder="Custom amount (ml)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="border rounded-md px-2 py-1 w-36 text-black"
            />
            <button
              onClick={() => {
                const amt = Number(customAmount);
                if (!isNaN(amt)) {
                  addWater(amt);
                  setCustomAmount("");
                }
              }}
              className="bg-green-500 text-white px-4 py-1 rounded-md"
            >
              Add
            </button>
          </div>
        </div>

        {/* Right Side: Log */}
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Today's Log</h2>
            <div className="h-64 overflow-y-auto border rounded-md  bg-white p-[15px]">
              {log.length === 0 ? (
                <p className="text-black text-sm text-center mt-10">No water logged yet.</p>
              ) : (
                log.map((entry) => (
                  <div key={entry.id} className="text-sm text-black py-2">
                    {entry.amount}ml at {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* <button onClick={resetDay} className="mt-4 bg-red-500 text-white w-full py-2 rounded-md">
            Reset Day
          </button> */}
        </div>
      </div>
    </div>
  );
}

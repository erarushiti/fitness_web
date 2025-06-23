"use client";

import { useEffect, useState } from "react";
import "../../app/globals.css";
import DashboardLayout from "@/components/DashboardLayout";

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

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const clientData = localStorage.getItem("user");

    if (!storedToken || !clientData) return;

    const clientId = JSON.parse(clientData).id;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(24, 0, 0, 0);

    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();

    fetch(`http://localhost:8080/api/waterlog/${clientId}?startDate=${startDateISO}&endDate=${endDateISO}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch logs");
        return res.json();
      })
      .then((data) => setLog(data))
      .catch((err) => console.error("Error fetching water logs:", err));
  }, []);

  const addWater = async (amount: number) => {
    if (!amount || isNaN(amount)) return;

    const clientData = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!clientData || !token) return;

    const clientId = JSON.parse(clientData).id;

    try {
      const res = await fetch("http://localhost:8080/api/waterlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, clientId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error:", errorText);
        throw new Error("Failed to log water");
      }

      const logEntry = await res.json();
      setIntake((prev) => prev + amount);
      setLog((prev) => [logEntry, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) {
      console.error("Error adding water:", err);
    }
  };

  const percentage = Math.min((intake / GOAL) * 100, 100);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-blue-50 p-4 sm:p-6 overflow-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Panel */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-48 border-4 border-blue-300 rounded-md  bg-blue-100">
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

            <div className="flex flex-wrap justify-center gap-2 mt-4">
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

            <div className="flex mt-4 gap-2 flex-wrap justify-center">
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

          {/* Right Panel */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Today's Log</h2>
              <div className="h-64 overflow-y-auto border rounded-md bg-white p-3">
                {log.length === 0 ? (
                  <p className="text-black text-sm text-center mt-10">No water logged yet.</p>
                ) : (
                  log.map((entry) => (
                    <div key={entry.id} className="text-sm text-black py-1">
                      {entry.amount}ml at {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

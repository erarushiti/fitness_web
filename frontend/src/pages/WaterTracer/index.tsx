import { useState, useEffect } from "react";
import "../../app/globals.css";

export default function Home() {
  const GOAL = 2000;
  const [intake, setIntake] = useState(0);
  const [log, setLog] = useState<{ amount: number; time: string }[]>([]);
  const [customAmount, setCustomAmount] = useState("");
  const [reminder, setReminder] = useState(false);
  const [intervalTime, setIntervalTime] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (reminder) {
      timer = setInterval(() => {
        alert("Time to drink water! 💧");
      }, intervalTime * 60 * 1000);
    }
    return () => clearInterval(timer);
  }, [reminder, intervalTime]);

  const addWater = (amount: number) => {
    if (!amount || isNaN(amount)) return;
    const now = new Date().toLocaleTimeString();
    setIntake((prev) => prev + amount);
    setLog((prev) => [{ amount, time: now }, ...prev]);
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
          {/* Water Level */}
          <div className="relative w-24 h-48 border-4 border-blue-300 rounded-md overflow-hidden bg-blue-100">
            <div
              className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500"
              style={{ height: `${percentage}%` }}
            />
          </div>

          {/* Circular Progress */}
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
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                className="text-lg fill-blue-600 font-semibold"
              >
                {intake}ml
              </text>
            </svg>
          </div>

          <p className="text-gray-700">Goal: {GOAL}ml</p>

          {/* Add Buttons */}
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

          {/* Custom Input */}
          <div className="flex mt-4 gap-2">
            <input
              type="number"
              placeholder="Custom amount (ml)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="border rounded-md px-2 py-1 w-36"
            />
            <button
              onClick={() => {
                addWater(Number(customAmount));
                setCustomAmount("");
              }}
              className="bg-green-500 text-white px-4 py-1 rounded-md"
            >
              Add
            </button>
          </div>

          {/* Reminders */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={reminder}
              onChange={() => setReminder((r) => !r)}
            />
            <label className="text-gray-700">Reminders</label>
            <select
              value={intervalTime}
              onChange={(e) => setIntervalTime(Number(e.target.value))}
              className="border px-2 py-1 rounded-md"
            >
              {[15, 30, 45, 60].map((min) => (
                <option key={min} value={min}>
                  Every {min} mins
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Log */}
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Today's Log</h2>
            <div className="h-64 overflow-y-auto border rounded-md p-2 bg-white">
              {log.length === 0 && (
                <p className="text-gray-500 text-sm text-center mt-10">No water logged yet.</p>
              )}
              {log.map((entry, index) => (
                <div key={index} className="text-sm border-b py-1">
                  {entry.amount}ml at {entry.time}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={resetDay}
            className="mt-4 bg-red-500 text-white w-full py-2 rounded-md"
          >
            Reset Day
          </button>
        </div>
      </div>
    </div>
  );
}

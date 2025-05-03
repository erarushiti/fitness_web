import React, { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface FormData {
  name: string;
  description: string;
  weekDays: string[]; // updated
  time: string;
  price: string;
}

export default function CreateSession() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    weekDays: [], // updated
    time: "",
    price: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeekDayToggle = (day: string) => {
    setFormData((prev) => {
      const exists = prev.weekDays.includes(day);
      const weekDays = exists
        ? prev.weekDays.filter((d) => d !== day)
        : [...prev.weekDays, day];
      return { ...prev, weekDays };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { name, description, weekDays, time, price } = formData;
    // if (!name || !description || weekDays.length === 0 || !time || !price) {
    //   setError("All fields are required, including at least one weekday.");
    //   return;
    // }

    try {
      const response = await fetch("http://localhost:8080/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create session");
      }

      setSuccess("Session created successfully!");
      setFormData({
        name: "",
        description: "",
        weekDays: [],
        time: "",
        price: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Session Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Week Days
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WEEKDAYS.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.weekDays.includes(day)}
                    onChange={() => handleWeekDayToggle(day)}
                    className="accent-blue-600"
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-black">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-black">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#111] text-white p-2 rounded-lg"
          >
            Create Session
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

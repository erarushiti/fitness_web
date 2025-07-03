"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

import DashboardLayout from "../../../components/DashboardLayout";
import { fetchWithAuth } from "@/utils/api";
import useAdminRedirect from "../../../../hooks/useAdminRedirect";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface FormData {
  name: string;
  description: string;
  weekDays: string[];
  time: string;
  price: string;
}

export default function CreateSession() {
  useAdminRedirect();

  const [token, setToken] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    weekDays: [],
    time: "",
    price: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Simple validation function
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Session name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.weekDays.length === 0) newErrors.weekDays = "Select at least one weekday";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(Number(formData.price)) || Number(formData.price) < 0)
      newErrors.price = "Price must be a number 0 or more";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleWeekDay = (day: string) => {
    setFormData((prev) => {
      if (prev.weekDays.includes(day)) {
        return { ...prev, weekDays: prev.weekDays.filter((d) => d !== day) };
      } else {
        return { ...prev, weekDays: [...prev.weekDays, day] };
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) {
      return;
    }

    try {
      const response = await fetchWithAuth("http://localhost:8080/api/session", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
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
      setErrors({});
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
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black"
            >
              Session Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              value={formData.name}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {errors.name && (
              <div className="text-red-600 text-sm">{errors.name}</div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-black"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              onChange={handleChange}
              value={formData.description}
              rows={4}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {errors.description && (
              <div className="text-red-600 text-sm">{errors.description}</div>
            )}
          </div>

          {/* Weekdays */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Week Days
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WEEKDAYS.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="weekDays"
                    value={day}
                    checked={formData.weekDays.includes(day)}
                    onChange={() => toggleWeekDay(day)}
                    className="accent-blue-600"
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
            {errors.weekDays && (
              <div className="text-red-600 text-sm">{errors.weekDays}</div>
            )}
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-black"
            >
              Time
            </label>
            <input
              id="time"
              name="time"
              type="time"
              onChange={handleChange}
              value={formData.time}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {errors.time && (
              <div className="text-red-600 text-sm">{errors.time}</div>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-black"
            >
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              onChange={handleChange}
              value={formData.price}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {errors.price && (
              <div className="text-red-600 text-sm">{errors.price}</div>
            )}
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

"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DashboardLayout from "../../../components/DashboardLayout";
import { fetchWithAuth } from "utils/api";
import useAdminRedirect from "../../../../hooks/useAdminRedirect";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface FormData {
  name: string;
  description: string;
  weekDays: string[];
  time: string;
  price: string;
}

export default function CreateSession() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useAdminRedirect();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      weekDays: [],
      time: "",
      price: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetchWithAuth("http://localhost:8080/api/session", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to create session");
      }

      setSuccess("Session created successfully!");
      reset(); // Reset form after successful submission
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Session Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Session name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black">
              Description
            </label>
            <textarea
              id="description"
              {...register("description", { required: "Description is required", minLength: { value: 10, message: "Description must be at least 10 characters" } })}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
              rows={4}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Week Days</label>
            <Controller
              name="weekDays"
              control={control}
              rules={{ validate: (value) => value.length > 0 || "Select at least one weekday" }}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {WEEKDAYS.map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={day}
                        checked={field.value.includes(day)}
                        onChange={(e) => {
                          const updatedDays = e.target.checked
                            ? [...field.value, day]
                            : field.value.filter((d: string) => d !== day);
                          field.onChange(updatedDays);
                        }}
                        className="accent-blue-600"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.weekDays && (
              <p className="mt-1 text-sm text-red-600">{errors.weekDays.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-black">
              Time
            </label>
            <input
              type="time"
              id="time"
              {...register("time", { required: "Time is required" })}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-black">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
              step="0.01"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <button type="submit" className="w-full bg-[#111] text-white p-2 rounded-lg">
            Create Session
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
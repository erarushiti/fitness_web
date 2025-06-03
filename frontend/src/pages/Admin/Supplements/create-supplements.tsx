"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DashboardLayout from "../../../components/DashboardLayout";
import { fetchWithAuth } from "utils/api";
import useAdminRedirect from "../../../../hooks/useAdminRedirect";

interface FormData {
  name: string;
  description: string;
  goal: string;
  activity: string;
  gender: string;
  age: string;
  price: string;
  image: File | null;
}

export default function CreateSupplement() {
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
      goal: "",
      activity: "",
      gender: "",
      age: "",
      price: "",
      image: null,
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSuccess(null);

    // Create FormData for API request
    const payload = new FormData();
    payload.append("name", data.name);
    payload.append("description", data.description);
    payload.append("goal", data.goal);
    payload.append("activity", data.activity);
    payload.append("gender", data.gender);
    payload.append("age", data.age);
    payload.append("price", data.price);
    if (data.image) {
      payload.append("image", data.image);
    }

    try {
      const response = await fetchWithAuth("http://localhost:8080/api/supplement", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to create supplement");
      }

      setSuccess("Supplement created successfully!");
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
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
              })}
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Description must be at least 10 characters" },
              })}
              className="mt-1 block w-full p-2 border rounded-lg text-black"
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Goal</label>
            <select
              {...register("goal", { required: "Goal is required" })}
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            >
              <option value="">Select</option>
              <option value="lose weight">Lose Weight</option>
              <option value="gain weight">Gain Weight</option>
            </select>
            {errors.goal && (
              <p className="mt-1 text-sm text-red-600">{errors.goal.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Activity Level</label>
            <select
              {...register("activity", { required: "Activity level is required" })}
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            >
              <option value="">Select</option>
              <option value="high">High</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
            </select>
            {errors.activity && (
              <p className="mt-1 text-sm text-red-600">{errors.activity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Gender</label>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Age Range</label>
            <select
              {...register("age", { required: "Age range is required" })}
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            >
              <option value="">Select</option>
              <option value="18-29">18-29</option>
              <option value="30-39">30-39</option>
              <option value="40-54">40-54</option>
              <option value="55+">55+</option>
            </select>
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Price (€)</label>
            <input
              type="number"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className="mt-1 block w-full p-2 border rounded-lg text-black"
              step="0.01"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Image</label>
            <Controller
              name="image"
              control={control}
              rules={{
                required: "Image is required",
                validate: (value) =>
                  !value ||
                  (value.size <= 5 * 1024 * 1024 && /^image\/(jpeg|png|gif|webp)$/.test(value.type)) ||
                  "Image must be JPEG, PNG, GIF, or WebP and less than 5MB",
              }}
              render={({ field }) => (
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      field.onChange(e.target.files[0]);
                    } else {
                      field.onChange(null);
                    }
                  }}
                  accept="image/*"
                  className="mt-1 block w-full p-2 border rounded-lg text-black"
                />
              )}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg"
          >
            Create Supplement
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
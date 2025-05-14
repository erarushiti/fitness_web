import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

interface TrainerFormData {
  specialization: string;
  experienceYears: string;
  bio: string;
}

export default function CreateTrainer() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<TrainerFormData>({
    specialization: "",
    experienceYears: "",
    bio: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:8080/api/trainer", {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create trainer");
      }

      setSuccess("Trainer created successfully!");
      setFormData({
        specialization: "",
        experienceYears: "",
        bio: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Experience Years</label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              min="0"
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg"
          >
            Create Trainer
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

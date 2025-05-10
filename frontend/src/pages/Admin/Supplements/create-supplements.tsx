import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

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

  
    useEffect(() => {
      // Retrieve token from localStorage when component mounts
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setToken(storedToken);
      }
    }, []);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    goal: "",
    activity: "",
    gender: "",
    age: "",
    price: "",
    image: null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("goal", formData.goal);
    payload.append("activity", formData.activity);
    payload.append("gender", formData.gender);
    payload.append("age", formData.age);
    payload.append("price", formData.price);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:8080/api/supplement", {
        method: "POST",
       headers: {
            // "Content-Type": "application/json",  kur ki image ose files qikjo ta prish error 500
            Authorization: `Bearer ${token}`,
          },
        body: payload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create supplement");
      }

      setSuccess("Supplement created successfully!");
      setFormData({
        name: "",
        description: "",
        goal: "",
        activity: "",
        gender: "",
        age: "",
        price: "",
        image: null,
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
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Goal</label>
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Activity Level</label>
            <input
              type="text"
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
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

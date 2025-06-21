import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

interface FormData {
  text: string;
  author: string;
  image: File | null;
}

export default function CreateQuote() {
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState<FormData>({
    text: "",
    author: "",
    image: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    payload.append("text", formData.text);
    payload.append("author", formData.author);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:8080/api/quote", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ No Content-Type here because we're using FormData
        },
        body: payload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create quote");
      }

      setSuccess("Quote created successfully!");
      setFormData({ text: "", author: "", image: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-6">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black">Quote Text</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              rows={3}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full p-2 border rounded-lg text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg"
          >
            Create Quote
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

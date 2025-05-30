"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import "../../../app/globals.css";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchWithAuth } from "utils/api";
interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  weight: string;
  height: string;
  fitnessGoals: string;
  specialization: string;
  experienceYears: string;
  bio: string;
}

interface RegisterFormProps {}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [formType, setFormType] = useState<"client" | "trainer" | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    weight: "",
    height: "",
    fitnessGoals: "",
    specialization: "",
    experienceYears: "",
    bio: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Prepare data based on form type
    const role = formType === "client" ? "client" : "trainer";
    const data: Record<string, any> = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role,
      ...(formType === "client"
        ? {
            dateOfBirth: formData.dateOfBirth || null,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            height: formData.height ? parseFloat(formData.height) : null,
            fitnessGoals: formData.fitnessGoals || null,
          }
        : {
            specialization: formData.specialization || null,
            experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
            bio: formData.bio || null,
          }),
    };

    // Basic validation
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      setError("Email, password, first name, and last name are required.");
      return;
    }

    try {
      const response = await fetchWithAuth("http://localhost:8080/api/auth/admin/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setSuccess("Registration successful!");
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        weight: "",
        height: "",
        fitnessGoals: "",
        specialization: "",
        experienceYears: "",
        bio: "",
      });
      setFormType(null); // Reset to show buttons
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderForm = () => {
    if (formType === "client") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="off"
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="off"
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-black">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-black">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-black">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-black">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={handleInputChange}
              step="0.1"
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-black">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              id="height"
              value={formData.height}
              onChange={handleInputChange}
              step="0.1"
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="fitnessGoals" className="block text-sm font-medium text-black">
              Fitness Goals
            </label>
            <textarea
              name="fitnessGoals"
              id="fitnessGoals"
              value={formData.fitnessGoals}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#EE7838] px-4 py-2 text-sm font-medium text-black"
            >
              Register Client
            </button>
            <button
              type="button"
              onClick={() => setFormType(null)}
              className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    } else if (formType === "trainer") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="off"
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="off"
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-black">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-black">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-black">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              id="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="experienceYears" className="block text-sm font-medium text-black">
              Years of Experience
            </label>
            <input
              type="number"
              name="experienceYears"
              id="experienceYears"
              value={formData.experienceYears}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-black">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm text-black"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#EE7838] px-4 py-2 text-sm font-medium text-black"
            >
              Register Trainer
            </button>
            <button
              type="button"
              onClick={() => setFormType(null)}
              className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    }
    return null;
  };

  return (
     <DashboardLayout>
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#e5e5e5] border border-black rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">Register</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
        {!formType ? (
          <div className="space-y-4">
            <button
              onClick={() => setFormType("client")}
              className="w-full bg-white; rounded-[8px] border  border-black px-4 py-2 text-sm font-bold text-black "
            >
              Register as Client
            </button>
            <button
              onClick={() => setFormType("trainer")}
              className="w-full rounded-[8px] border border-black px-4 py-2 text-sm font-bold text-black"
            >
              Register as Trainer
            </button>
          </div>
        ) : (
          renderForm()
        )}
      </div>
    </div>
      </DashboardLayout>
  );
};

export default RegisterForm;
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../../app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface User {
  id: string;
  email: string;
  role: "client" | "trainer" | "admin";
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response" ,response);
      // Store tokens and user info in localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role);  // Store the user role

      setSuccess("Login successful! Redirecting...");
      setFormData({ email: "", password: "" });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "An error occurred";
      console.error("Login error details:", err.response?.data);  // Log full error response for debugging
      setError(errorMessage);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <section className="bg-[#111]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-black rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    className="bg-[#111] border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    className="bg-[#111] border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  className="bg-[#111] py-[10px] px-[20px] rounded-[8px] font-bold mb-[50px] text-white"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Submit Login"}
                </button>
                {error && <p className="text-red-600 text-center text-base">{error}</p>}
                {success && <p className="text-green-600 text-center text-base">{success}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoginForm;

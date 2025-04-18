"use client";

import { useState, FormEvent } from "react";
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
        }
      );

      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess("Login successful! Redirecting...");
      setFormData({ email: "", password: "" });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      {/* <form classNameName="flex flex-col items-center" onSubmit={handleSubmit}>
      <div classNameName="flex flex-col w-1/3 mb-[20px]">
        <label classNameName="text-white">Email:</label>
        <input
          classNameName=""
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div classNameName="flex flex-col w-1/3 mb-[40px]">
        <label classNameName="text-white">Password:</label>
        <input
          classNameName="p-[6px] mt-[5px] border-2 border-[#6f6d6d] rounded-[8px] bg-transparent text-white"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button
        classNameName="bg-[#6f6d6d] py-[10px] px-[20px] rounded-[8px] font-bold mb-[50px] text-white"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Submit Login'}
      </button>
      {error && <p classNameName="text-red-600 text-center text-base">{error}</p>}
      {success && <p classNameName="text-green-600 text-center text-base">{success}</p>}
    </form> */}

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
                    Password
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
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="text-gray-500 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  className="bg-[#111] py-[10px] px-[20px] rounded-[8px] font-bold mb-[50px] text-white"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Submit Login"}
                </button>
                {error && (
                  <p className="text-red-600 text-center text-base">{error}</p>
                )}
                {success && (
                  <p className="text-green-600 text-center text-base">
                    {success}
                  </p>
                )}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p>
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
